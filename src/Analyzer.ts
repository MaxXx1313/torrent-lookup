import { DEFAULT_WORKDIR_LOCATION, FN_DATA_FILE, FN_MAPS_FILE, FN_TORRENTS_FILE } from "./lib/const";

import * as fs from 'fs';
import * as path from 'path';
import { Subject } from "rxjs";
import { TorrentData } from "bencode";
import { writeFile } from "./lib/utils/fsPromise";

const LineByLineReader = require('line-by-line');
const bencode = require('bencode');


/**
 * custom format
 * @private
 */
interface TorrentProcessingInfo {
    base: string; // file name + extension
    dir: string; // folder
    length: number; // file size
    torrent: string; // torrent location

    match: string[]; // path, which match this file by name(?)
}


/**
 *
 */
export interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
    // TODO:
    // mapping: Array<>; // set of renamed/moved files
}


/**
 *
 */
export interface AnalyzerOptions {
    /**
     * Folder for storing temp results
     */
    workdir?: string;
}

/**
 1. load and hash torrents data
 2. read line by line datafile
 3. match data with hashed torrent data
 4. rehash by torent location
 5. make a choice from matched results
 6. save result

 * @emit Analyzer#opStatus    - when status changes

 */
export class Analyzer {

    public readonly opStatus: Subject<string> = new Subject();

    options: AnalyzerOptions;

    /**
     *  key is a "filename+':'+size" =)
     *  value is Array<TorrentProcessingInfo>
     *  Note: one file can present in different torrens.
     *  Moreover it can be in one torrent file several times!
     */
    _hash: { [location: string]: TorrentProcessingInfo[] } = {};


    /**
     *  key is torrent file location
     *  value is TorrentInfo
     */
    _mapping: { [location: string]: TorrentProcessingInfo[] } = {};


    /**
     * Analyze result
     */
    _decision: TorrentMapping[];


    /**
     *
     */
    stats = {
        files: 0, // not a torrent file
        torrents: 0,
        maps: 0,
    };


    /**
     *
     */
    private _lastFile: string;


    /**
     * @param options
     */
    constructor(options: AnalyzerOptions) {

        this.options = Object.assign({}, {
            workdir: DEFAULT_WORKDIR_LOCATION
        }, options);
    }

    /**
     *
     */
    analyze(): Promise<any> {
        const torrentsFileName = path.join(this.options.workdir, FN_TORRENTS_FILE);
        const dataFileName = path.join(this.options.workdir, FN_DATA_FILE);
        const mapsFileName = path.join(this.options.workdir, FN_MAPS_FILE);

        return this.loadTorrentFiles(torrentsFileName)
            .then(this.matchFiles.bind(this, dataFileName))
            .then(this._regroupHash.bind(this))
            .then(this._makeDecision.bind(this))
            .then(this.saveTo.bind(this, mapsFileName));
    }

    /**
     *
     */
    protected loadTorrentFiles(location: string): Promise<void> {
        this.opStatus.next('Hashing data');

        return promiseByLine(location, (line: string) => {
            const dataArr = this._loadTorrentFileSync(line);
            for (let i = dataArr.length - 1; i >= 0; i--) {
                this._addToHash(dataArr[i]);
            }
            return Promise.resolve();
        }).then(() => {
            this.stats.torrents = Object.keys(this._hash).length;
            this.opStatus.next('Loaded ' + this.stats.torrents + ' torrent files');
        });

    }


    /**
     *
     */
    protected matchFiles(dFile): Promise<void> {
        this.opStatus.next('Matching files');

        this._lastFile = null;

        return promiseByLine(dFile, (fileInfo) => {

            // parse filepath and size
            const [pathRelative, size] = fileInfo.match(/(.*):([-\d]+)$/) || [null, null];
            if (!pathRelative && !size) {
                return null;
            }

            // get absolute location
            const pathAbsolute = this.pushRelative(pathRelative);

            //
            this._matchFile(pathAbsolute, parseInt(size));

            this.stats.files++;
        }).then(() => {
            this.opStatus.next('Loaded ' + this.stats.files + ' regular files');
        });
    }

    /**
     * @param {string} location
     * @param {number} size
     *
     * Matching is quite challenged task
     *  1. try to match exact file + size
     //*  2. try to match exact filename
     */
    _matchFile(location: string, size: number) {

        const pathInfo = path.parse(location);

        // 1. match exact file + size
        const key = pathInfo.base + ':' + size;
        // console.log(key);
        if (this._hash[key]) {

            const matchTorrentInfo = this._hash[key];
            matchTorrentInfo.forEach(item => {

                // TODO: 'no-relocate-inside-torrent' option
                // 2. match path
                let savedTo = this.__getBasePath(pathInfo.dir, item.dir);
                if (savedTo) {
                    // matched!
                    item.match = item.match || [];
                    item.match.push(savedTo);
                }
            });
        }
    }

    /**
     * Cut basepath from {@param location} if it's match {@param dir}
     * Otherwise return false
     * @private
     */
    __getBasePath(location: string, dir: string): string {
        // console.log('__matchPath', pathInfo, dir);
        if (dir == '') {
            return location;
        }
        if (location.endsWith('/' + dir)) {
            return location.substr(0, location.length - dir.length - 1);
        }
        return null;
    }


    /**
     * group by torrent location
     * @private
     */
    _regroupHash() {
        this.opStatus.next('Hashing results');

        this._mapping = {};
        Object.keys(this._hash).forEach(key => {

            this._hash[key].forEach(torrentInfo => {
                const torrent = torrentInfo.torrent;
                this._mapping[torrent] = this._mapping[torrent] || [];
                this._mapping[torrent].push(torrentInfo);
            });
        });
        this._hash = null; // free some memory
    }

    /**
     * @return {Array<TorrentMapping>}
     */
    _makeDecision(): void {
        this.opStatus.next('Analyzing');
        this._decision = Object.keys(this._mapping).map(torrent => {

            // key is path, value is a score
            const pathes: { [path: string]: number } = {};

            this._mapping[torrent].forEach(torrentInfo => {
                if (!torrentInfo.match) {
                    return;
                }

                // collect scores
                torrentInfo.match.forEach(path => {
                    pathes[path] = (pathes[path] || 0) + 1;
                });

            });

            // choose max
            let maxScore = -1;
            let saveTo;
            Object.keys(pathes).forEach(function (location) {
                if (maxScore < pathes[location]) {
                    maxScore = pathes[location];
                    saveTo = location;
                }
            });

            /**
             * @type {TorrentMapping}
             */
            return {
                torrent: torrent,
                saveTo: saveTo
            };

        }).filter(mapping => mapping.saveTo);

        this.stats.maps = this._decision.length;
        this.opStatus.next('Found ' + this.stats.maps + ' matches');
    }


    /**
     *
     */
    pushRelative(location) {
        let locAbsolute;
        if (this._lastFile) {
            locAbsolute = path.join(this._lastFile + '/..', location);
        } else {
            locAbsolute = location;
        }
        this._lastFile = locAbsolute;
        return locAbsolute;
    }


    /**
     * @param location
     */
    saveTo(location: string): Promise<any> {
        this.opStatus.next('Saving');

        const data = this._decision;
        return writeFile(location, JSON.stringify(data));
    }

    /**s
     * @return {TorrentProcessingInfo}
     */
    _loadTorrentFileSync(location): TorrentProcessingInfo[] {
        const content = fs.readFileSync(location);

        const data: TorrentData = bencode.decode(content/*, 'UTF-8'*/);
        return this._grabTorrentData(data, location);
    }

    /**
     * https://nodejs.org/dist/latest-v7.x/docs/api/path.html#path_path_parse_path
     */
    protected _grabTorrentData(data: TorrentData, location: string): TorrentProcessingInfo[] {
        delete data.info.pieces; // some binary data
        const encoding = data.encoding || 'UTF-8';

        // console.log(data.info.files);
        if (!data.info.files) {
            // single file
            return [{
                base: (data.info.name as any).toString(encoding), // we need 'as any' to ignore error for toString() arguments
                dir: '',
                length: data.info.length,
                torrent: location,
                match: []
            }];
        } else {
            // multiple files
            const name = (data.info.name as any).toString(encoding);

            return data.info.files.map(function (fileData) {
                fileData.path.unshift(name);
                return {
                    base: (fileData.path.pop() as any).toString(encoding),
                    dir: fileData.path.join('/'),

                    length: fileData.length,
                    torrent: location,
                    match: []
                }
            });
        }
    }

    /**
     * @param {TorrentProcessingInfo} torrentInfo
     */
    _addToHash(torrentInfo: TorrentProcessingInfo) {
        let key = torrentInfo.base + ':' + torrentInfo.length;
        if (!this._hash[key]) {
            this._hash[key] = [];
        }
        this._hash[key].push(torrentInfo);
    }


}


/**
 * @param {string} file
 * @param {function(file:string)=>Promise} processFn
 * @param {function(e:Error)=>any} errorFn
 */
function promiseByLine(file, processFn: (line: string) => Promise<void>, errorFn?: (e?: Error) => any) {

    return new Promise(function (resolve) {

        const lr = new LineByLineReader(file);

        lr.on('error', function (err) {
            console.error(err);
        });

        lr.on('line', function (line) {
            // pause emitting of lines...
            lr.pause();

            // ...do your asynchronous line processing..
            Promise.resolve()
                .then(() => processFn(line))
                .catch(e => {
                    if (errorFn) {
                        errorFn(e);
                    } else {
                        console.warn(e);
                    }
                    return e;
                })
                .then(function () {

                    // ...and continue emitting lines.
                    lr.resume();
                });
        });

        lr.on('end', function () {
            // All lines are read, file is closed now.
            resolve();
        });
    });

}


module.exports.Analyzer = Analyzer;
module.exports.Analyzer.promiseByLine = promiseByLine;