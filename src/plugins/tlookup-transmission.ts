import { clone, request } from "../lib/utils/tools";
import { ITorrentClient, PushResult } from "../lib/push/ITorrentClient";
import { UrlWithStringQuery } from 'url';


import assert from 'node:assert';
import url from 'node:url';


const CSRF_HEADER = 'x-transmission-session-id';
const UNWANTED_THRESHOLD = 98;

const ENDPOINT_DEFAULT = 'http://admin:admin@localhost:9091';


/**
 *
 */
interface TransmissionAdapterConfig {
    endpoint?: string;
}

// interface TransmissionTorrentOptions {
//   'filename': string;
//   'download-dir': string;
//   'files': string;
//   "files-wanted": string;
//   "files-unwanted": string;
// }


// https://trac.transmissionbt.com/browser/trunk/extras/rpc-spec.txt
export class TlookupTransmission implements ITorrentClient {

    private _config: TransmissionAdapterConfig;
    private _csrf: string = null;


    private _endpointParsed: UrlWithStringQuery;

    /**
     *
     */
    constructor(config?: TransmissionAdapterConfig) {

        this._config = {
            endpoint: ENDPOINT_DEFAULT,
            ...(config || {}),
        };

        //
        this._endpointParsed = url.parse(this._config.endpoint);
    }

    // "content-type":"application/json; charset=UTF-8"
    static getContentType(contentTypeHeaderValue: string) {
        return (("" + contentTypeHeaderValue).match(/(.*?)(;|$)/) || [])[1] || null;
    }

    //
    static getCharset(contentTypeHeaderValue: string) {
        return (("" + contentTypeHeaderValue).match(/charset=(.*?)(;|$)/) || [])[1] || null;
    }


    /**
     * @implements ITorrentClient
     */
    // isInstalled(): Promise<boolean> {
    //     TODO: implement isInstalled
    //     child_process.execFile(file[, args][, options][, callback])
    // }

    /**
     * @implements ITorrentClient
     */
    async push(torrentFile: string, downloadDir: string): Promise<PushResult> {
        const addResult = await this.torrentAdd(torrentFile, downloadDir, {paused: false});
        console.log('torrentAdd', addResult);
        if (!addResult.isNew) {
            await this.torrentSetLocation(addResult.id, downloadDir);
        }

        await this._setWantedByPercentage(addResult.id, UNWANTED_THRESHOLD);
        return addResult as PushResult;
    }

    /**
     * Add or Update torrent
     *
     * @param {string} filename - filename or URL of the .torrent file
     * @param {string} downloadDir - path to download the torrent to
     * @param {object} [opts] any extra options according to the specificaion
     *
     * @return {{id:number, name:string, hashString:string, isNew:boolean}}
     *
     * @more: https://trac.transmissionbt.com/browser/trunk/extras/rpc-spec.txt#L356
     */
    torrentAdd(filename: string, downloadDir: string, opts = {}): Promise<{
        id: number,
        name: string,
        hashString: string,
        isNew: boolean
    }> {
        opts['filename'] = filename;
        opts['download-dir'] = downloadDir;

        return this.rpcRequest('torrent-add', opts)
            .then((res) => {
                let result = res.body.arguments['torrent-added'] || res.body.arguments['torrent-duplicate'];
                if (result) {
                    result.isNew = !!res.body.arguments['torrent-added'];
                    return result;
                } else {
                    throw new Error('Me: unexpected response');
                }
            });
    }

    // HOTFIX: update torrent location (for existed torrents)
    // https://trac.transmissionbt.com/browser/trunk/extras/rpc-spec.txt#L406
    torrentSetLocation(id: number, downloadDir: string, opts = {}): Promise<any> {
        opts['ids'] = [id];
        opts['location'] = downloadDir;
        opts['move'] = false;
        return this.rpcRequest('torrent-set-location', opts);
    }


    /**
     * Get torrent info by id
     * @param {Array<number>} id
     * @param {Array<string>} fields
     * @param {object} [opts]
     *
     * @more https://trac.transmissionbt.com/browser/trunk/extras/rpc-spec.txt#L127
     */
    torrentGet(id: number, fields: string[], opts?): Promise<any> {
        opts = opts || {};

        opts.ids = [id];
        opts.fields = fields;
        assert.ok(opts.fields);

        return this.rpcRequest('torrent-get', opts)
            .then((res) => {
                // console.log(res.body.arguments.torrents[0].files);
                // console.log(res.body.arguments.torrents[0].fileStats);
                // console.log(res.body.arguments.torrents[0].wanted);
                return res.body.arguments.torrents;
            });
    }

    /**
     * @param {Array<number>} id
     * @param {object} opts
     */
    torrentSet(id: number, opts) {
        opts.ids = [id];
        return this.rpcRequest('torrent-set', opts)
            .then((res) => {
                return res.body.arguments; // basically, it's empty
            });
    }

    /**
     *
     */
    _rpcResponse(res) {
        if (res.body && res.body.result) {
            if (res.body.result !== "success") {
                throw new Error(res.body.result || 'Transmission reports an error');
            }
        }
        return res;
    }

    /**
     *
     */
    _rpcResponseJson(res) {
        let ct = TlookupTransmission.getContentType(res.headers["content-type"]);

        if (ct == "application/json") {
            res.body = JSON.parse(res.body); // throws error
        }
        return res;
    }

    /**
     *
     */
    _collectCsrf(res) {
        if (res.headers[CSRF_HEADER]) {
            this._csrf = res.headers[CSRF_HEADER];
        }
        return res;
    }

    /**
     * Mark files inside torrent file to download
     */
    protected _setWantedByPercentage(torrentId: number, percentage: number = UNWANTED_THRESHOLD): Promise<any> {

        // set
        return this.torrentGet(torrentId, ['files'])
            .then(result => result[0])
            .then(torrentInfo => {
                for (const file of torrentInfo.files) {
                    file._percentage = 100 * file.bytesCompleted / file.length;
                    file._wanted = file._percentage >= percentage;
                }

                const wantedFilesData = torrentInfo.files.reduce(function (result, item, index) {
                    if (item._wanted === false) {
                        result.unwanted.push(index);
                    } else {
                        result.wanted.push(index);
                    }
                    return result;
                }, {wanted: [], unwanted: []});


                return this.torrentSet(torrentId, {
                    "files-wanted": wantedFilesData.wanted,
                    "files-unwanted": wantedFilesData.unwanted
                });
            });


    }

    /**
     *
     */
    protected rpcRequest(method, data): Promise<any> {
        let self = this;

        let opts = clone(this._endpointParsed);

        let payload = {
            method: method,
            arguments: data
        };

        opts.method = "POST";
        opts.path = "/transmission/rpc";

        //
        function _makeRequest() {
            opts.headers = opts.headers || {};
            opts.headers[CSRF_HEADER] = self._csrf;

            console.log('[DEBUG] (transmission) request:', payload.method/*, opts*/);
            // console.log(opts); console.log(payload);

            return request(opts, JSON.stringify(payload))
                .then(self._collectCsrf.bind(self))
                .then(self._rpcResponseJson.bind(self))
                .then(self._rpcResponse.bind(self))
                .then((res: any) => {
                    // console.log(res.body);
                    console.log('[DEBUG] (transmission) response:', res.body);
                    return res;
                });
        }

        return _makeRequest()
            .catch((res) => {
                // CSRF Protection
                if (res.statusCode === 409) {
                    self._collectCsrf(res);
                    return _makeRequest();
                } else {
                    throw res;
                }
            }).then(res => {
                return res;
            });
    }

}// -Transmission class






