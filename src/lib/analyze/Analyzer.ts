import { DEFAULT_WORKDIR_LOCATION, FN_DATA_FILE, FN_MAPS_FILE, FN_TORRENTS_FILE } from "../const";

import * as path from 'path';
import { Subject } from "rxjs";
import { promiseByLine } from '../utils/line-by-line';
import { bencodeReadSync } from '../utils/bencode/bencode';
import { FileMatcher } from '../utils/FileMatcher';
import { extractBasePath } from '../utils/tools';



/**
 * custom format
 * @private
 */
interface TorrentProcessingInfo {
    base: string; // file name + extension
    dir: string; // folder, relative to torrent download location
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
 4. rehash by torrent location
 5. make a decision from matched results
 6. save result

 * @emit Analyzer#opStatus - when status changes

 */
export class Analyzer {

    public readonly opStatus: Subject<string> = new Subject();

    public options: AnalyzerOptions;

    /**
     *  key is a "filename:size"
     *  value is Array<TorrentProcessingInfo>
     *  Note:
     *  - one 'key' can present in different torrents.
     *  - one 'key' can be in one torrent file several times.
     *  @private
     */
    public _hash: { [location: string]: TorrentProcessingInfo[] } = {};

    /**
     * Analyze result
     * @private
     */
    public _decision: TorrentMapping[];

    /**
     *  'key' is torrent file location
     *  value is TorrentInfo[]
     *  @private
     */
    private _mapping: { [location: string]: TorrentProcessingInfo[] } = {};

    /**
     *
     */
    public stats = {
        files: 0, // not a torrent file
        torrents: 0,
        maps: 0,
    };


    /**
     * @param options
     */
    constructor(options?: AnalyzerOptions) {
        this.options = {
            workdir: DEFAULT_WORKDIR_LOCATION,
            ...(options || {}),
        };
    }

    /**
     * Main flow
     */
    analyze(): Promise<any> {
        const torrentsFileName = path.join(this.options.workdir, FN_TORRENTS_FILE);
        const dataFileName = path.join(this.options.workdir, FN_DATA_FILE);
        const mapsFileName = path.join(this.options.workdir, FN_MAPS_FILE);

        return this.loadTorrentFilesFromFile(torrentsFileName)
            .then(this.matchFilesFromFile.bind(this, dataFileName))
            .then(this.analyzeCacheData.bind(this))
            .then(this.saveDecisionTo.bind(this, mapsFileName));
    }

    /**
     *
     */
    public loadTorrentFilesFromFile(dataFileLocation: string): Promise<void> {
        this.opStatus.next('Loading files');

        return promiseByLine(dataFileLocation, (line: string) => {
            this.loadTorrentFileSync(line);
            return Promise.resolve();
        }).then(() => {
            this.stats.torrents = Object.keys(this._hash).length;
            this.opStatus.next('Loaded ' + this.stats.torrents + ' torrent files');
        });

    }

    /**s
     * @return {TorrentProcessingInfo}
     * https://nodejs.org/dist/latest-v7.x/docs/api/path.html#path_path_parse_path
     */
    public loadTorrentFileSync(location): void {
        const data = bencodeReadSync(location);

        const encoding = data.encoding || 'UTF-8';

        // console.log(data.info.files);
        let files: TorrentProcessingInfo[];
        if (!data.info.files) {
            // single file
            files = [{
                base: (data.info.name as any).toString(encoding),
                dir: '',
                length: data.info.length,
                torrent: location,
                match: [],
            }];
        } else {
            // multiple files
            const name = (data.info.name as any).toString(encoding);

            files = data.info.files.map(function (fileData) {
                fileData.path.unshift(name);
                return {
                    base: (fileData.path.pop() as any).toString(encoding),
                    dir: fileData.path.join('/'),

                    length: fileData.length,
                    torrent: location,
                    match: [],
                }
            });
        }

        //
        for (const file of files) {
            this._addToHash(file);
        }
    }


    /**
     *
     */
    public matchFilesFromFile(dataFile: string): Promise<void> {
        this.opStatus.next('Matching files');

        return promiseByLine(dataFile, (fileInfoString) => {

            const fileInfo = FileMatcher.explodeFileInfo(fileInfoString)
            if (!fileInfo) {
                return null;
            }

            //
            this.matchFile(fileInfo.location, fileInfo.size);

            this.stats.files++;
        }).then(() => {
            this.opStatus.next('Loaded ' + this.stats.files + ' regular files');
        });
    }

    /**
     * @param {string} location
     * @param {number} size
     * @private
     *
     * Matching is quite challenged task.
     * So far we do simple step:
     *  1. try to match exact file + size
     *  TODO: 2. try to match exact filename
     */
    public matchFile(location: string, size: number) {

        const pathInfo = path.parse(location);

        // 1. match exact file + size
        const key = pathInfo.base + ':' + size;
        if (this._hash[key]) {
            const matchTorrentInfo = this._hash[key];

            for (const item of matchTorrentInfo) {
                // TODO: 'no-relocate-inside-torrent' option
                // 2. match path
                const savedTo = extractBasePath(pathInfo.dir, item.dir);
                // console.log(' matched', pathInfo.dir, item.dir, savedTo);
                if (savedTo) {
                    // location found
                    item.match = item.match || [];
                    item.match.push(savedTo);
                }
            }
        }
    }

    /**
     * analyze everything that is loaded and matched.
     * This calculates the decision where to keep torrent file data
     */
    public analyzeCacheData(): void {
        this._regroupHash();
        this._hash = null; // free some memory
        this._makeDecision();
    }

    /**
     *
     */
    public getDecision() {
        return this._decision;
    }

    /**
     */
    saveDecisionTo(mappingFileLocation: string): Promise<any> {
        this.opStatus.next('Saving');

        const data = this._decision;
        // TODO
        // return writeFile(mappingFileLocation, JSON.stringify(data));
    }

    /**
     * group by torrent location
     * @private
     */
    private _regroupHash(): void {
        this.opStatus.next('Hashing results');

        this._mapping = {};
        Object.keys(this._hash).forEach(key => {
            this._hash[key].forEach(torrentInfo => {
                const torrent = torrentInfo.torrent;
                this._mapping[torrent] = this._mapping[torrent] || [];
                this._mapping[torrent].push(torrentInfo);
            });
        });
    }

    /**
     * @return {Array<TorrentMapping>}
     * @private
     */
    private _makeDecision(): void {
        this.opStatus.next('Analyzing');

        let mapping: TorrentMapping[] = [];
        for (const torrent in this._mapping) {

            /*
              Here we calculate score based on how many files from the torrent are kept in the same location
              This step si needed because torrent can be downloaded in many places
                or we can find a piece of data in the other location
             */
            // key is absolute path, value is a score
            const scoreHash: { [path: string]: number } = {};

            for (const torrentInfo of this._mapping[torrent]) {
                if (!torrentInfo.match) {
                    // nothing found for this torrent file
                    return;
                }
                // collect scores
                for (const matchPath of torrentInfo.match) {
                    scoreHash[matchPath] = (scoreHash[matchPath] || 0) + 1;
                }
            }

            // choose max
            let maxScore = -1;
            let saveTo: string | undefined;
            for (const h in scoreHash) {
                if (maxScore < scoreHash[h]) {
                    maxScore = scoreHash[h];
                    saveTo = h;
                }
            }

            //
            if (saveTo) {
                mapping.push({
                    torrent: torrent,
                    saveTo: saveTo,
                });
            }
        }

        this._decision = mapping;

        this.stats.maps = this._decision.length;
        this.opStatus.next('Found ' + this.stats.maps + ' matches');
    }



    /**
     */
    private _addToHash(torrentInfo: TorrentProcessingInfo) {
        const key = torrentInfo.base + ':' + torrentInfo.length;
        if (!this._hash[key]) {
            this._hash[key] = [];
        }
        this._hash[key].push(torrentInfo);
    }

}
