import { DEFAULT_WORKDIR_LOCATION, FILE_DATA, FILE_TORRENTS, FILES_MAPS } from "../const.js";

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { promiseByLine } from '../utils/line-by-line.js';
import { bencodeReadSync } from '../utils/bencode/bencode.js';
import { FileMatcher } from '../utils/FileMatcher.js';
import { extractBasePath } from '../utils/path-utils.js';


/**
 * custom format
 * @private
 */
interface TorrentFileInfo {
    /**
     * file name + extension inside torrent file
     */
    name: string; // file name + extension

    /**
     * Folder path inside torrent file
     */
    dir: string;

    /**
     * file size (also from torrent file)
     */
    length: number; // file size

    /**
     * List of possible matches. Absolute path to base dir
     * (i.e. 'match' + 'dir' + 'base' is an absolute path to a file).
     * We match file by name + size
     */
    match: string[];

    /**
     * Torrent file location
     */
    torrentFileLocation: string;
}


/**
 *
 */
export interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
    saveToOptions?: string[]; // another options (any path which has at least one file from the torrent)
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
 */
export class Analyzer {

    public options: AnalyzerOptions;

    /**
     *  key is a "filename:size"
     *  value is Array<TorrentFileInfo>
     *  Note:
     *  - one 'key' can present in different torrents.
     *  - one 'key' can be in one torrent file several times.
     *  @private
     */
    public _hash: { [location: string]: TorrentFileInfo[] } = {};

    /**
     * Analyze result
     * @private
     */
    public _decision: TorrentMapping[];
    /**
     *
     */
    public stats = {
        files: 0, // regular files amount
        torrents: 0, // torrent files amount
        maps: 0, // amount of found matches
    };
    /**
     *  'key' is torrent file location
     *  value is TorrentInfo[]
     *  @private
     */
    private _mapping: { [location: string]: TorrentFileInfo[] } = {};

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
    async analyze(): Promise<TorrentMapping[]> {
        console.log('[Analyzer] use workdir:', this.options.workdir);
        const torrentsFileName = path.join(this.options.workdir, FILE_TORRENTS);
        const dataFileName = path.join(this.options.workdir, FILE_DATA);
        const mapsFileName = path.join(this.options.workdir, FILES_MAPS);

        await this._loadTorrentFilesFromFile(torrentsFileName);
        await this._matchFilesFromFile(dataFileName);
        await this._makeDecision();
        await this._saveDecisionTo(mapsFileName);
        return this._decision;
    }

    /**s
     * @return {TorrentFileInfo}
     * https://nodejs.org/dist/latest-v7.x/docs/api/path.html#path_path_parse_path
     */
    public async __loadTorrentFile(filepath: string): Promise<void> {
        const data = bencodeReadSync(filepath);

        // console.log(data.info.files);
        let files: TorrentFileInfo[];
        if (!data.info.files) {
            // single file
            files = [{
                name: data.info.name,
                dir: '',
                length: data.info.length,

                torrentFileLocation: filepath,
                match: [],
            }];
        } else {
            // multiple files
            const baseDir = data.info.name;

            // TODO: need to validate this
            files = data.info.files.map((fileData) => {

                fileData.path.unshift(baseDir);
                const filename = fileData.path.pop();
                const filedir = fileData.path.join('/');
                return {
                    name: filename,
                    dir: filedir,
                    length: fileData.length,

                    torrentFileLocation: filepath,
                    match: [],
                }
            });
        }

        // add to hash
        for (const file of files) {
            const key = _hashId(file.name, file.length);
            if (!this._hash[key]) {
                this._hash[key] = [];
            }
            this._hash[key].push(file);
        }
    }

    /**
     * @private
     *
     * Matching is quite challenged task.
     * So far we do simple step:
     *  1. try to match exact file + size
     *  TODO: 2. try to match exact filename with no size
     */
    public __matchFile(fileLocation: string, size: number) {

        const pathInfo = path.parse(fileLocation);
        const fileName = pathInfo.base;
        const fileDir = pathInfo.dir;

        // 1. match exact file + size
        const key = _hashId(fileName, size);
        if (this._hash[key]) {
            const matchTorrentInfo = this._hash[key];

            for (const tInfo of matchTorrentInfo) {
                // Check if fileLocation has the base folder same as torrent inner path.
                // Also, torrent inner path can be empty.

                // Note: some torrent parts can be relocated in different folder. We don't support it yet
                // TODO: 'allow-relocate-inside-torrent' option
                const savedTo = extractBasePath(fileDir, tInfo.dir);
                // console.log(' matched', fileDir, item.dir, savedTo);
                if (savedTo) {
                    // location found
                    tInfo.match = tInfo.match || [];
                    tInfo.match.push(savedTo);
                } else {
                    // file path is not match torrent
                }
            }
        }
    }

    /**
     *
     */
    public getDecision() {
        return this._decision;
    }

    /**
     * Analyze everything that is loaded and matched.
     * This calculates the decision where to keep torrent file data based on score value.
     * Score is calculated as an amount of files within same folder,
     * i.e. detect the folder where the most of the files downloaded (TBD: take into account filesize)
     */
    public _makeDecision(): void {
        console.log('[Analyzer] Analyzing');

        // group by torrent location
        this._mapping = {};
        for (const key in this._hash) {
            for (const torrentInfo of this._hash[key]) {
                const tPath = torrentInfo.torrentFileLocation;
                this._mapping[tPath] = this._mapping[tPath] || [];
                this._mapping[tPath].push(torrentInfo);
            }
        }
        this._hash = null; // free some memory

        //
        let mapping: TorrentMapping[] = [];
        for (const tPath in this._mapping) {

            /*
              Here we calculate score based on how many files from the torrent are kept in the same location
              This step is needed because torrent can be downloaded in many places
                or we can find a piece of data in the other location
             */
            // key is absolute path, value is a score
            const scoreHash: { [path: string]: number } = {};

            for (const torrentInfo of this._mapping[tPath]) {
                if (!torrentInfo.match) {
                    // nothing found for this torrent file
                    return;
                }

                // collect scores.
                // for a single-file torrent this actually not make an impact.
                // for multi-files torrent: calculate how any files withing same folder. Pick greatest.
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

            // get all possible options
            // It's any path which has at least one file from torrent
            const options = Object.keys(scoreHash)
                .sort((a, b) => scoreHash[b] - scoreHash[a]);

            //
            if (saveTo) {
                mapping.push({
                    torrent: tPath,
                    saveTo: saveTo,
                    saveToOptions: options,
                });
            }
        }

        this._decision = mapping;

        this.stats.maps = this._decision.length;
        console.log(`[Analyzer] Found ${this.stats.maps} matches`);
    }

    /**
     *
     */
    protected _loadTorrentFilesFromFile(dataFileLocation: string): Promise<void> {
        console.log('[Analyzer] Loading files');

        return promiseByLine(dataFileLocation, (line: string) => {
            return this.__loadTorrentFile(line)
                .catch(e => {
                    console.error('[Analyzer] Unable to load torrent file:', line);
                    console.error(e);
                });
        }).then(() => {
            this.stats.torrents = Object.keys(this._hash).length;
            console.log(`[Analyzer] Loaded ${this.stats.torrents} torrent files`);
        });

    }

    /**
     *
     */
    protected _matchFilesFromFile(dataFile: string): Promise<void> {
        console.log('[Analyzer] Matching files');

        return promiseByLine(dataFile, (fileInfoString) => {

            const fileInfo = FileMatcher.explodeFileInfo(fileInfoString)
            if (!fileInfo) {
                console.log('[Analyzer] Internal error: unable to parse info:', fileInfoString);
                return null;
            }

            //
            this.__matchFile(fileInfo.location, fileInfo.size);

            this.stats.files++;
        }).then(() => {
            console.log(`[Analyzer] Loaded ${this.stats.files} regular files`);
        });
    }

    /**
     */
    protected async _saveDecisionTo(mappingFileLocation: string): Promise<any> {
        console.log('[Analyzer] Saving result');

        const data = this._decision;
        await fs.writeFile(mappingFileLocation, JSON.stringify(data));
        console.log('[Analyzer] Result is saved:', mappingFileLocation);
    }
}


/**
 *
 */
function _hashId(strPath: string, length: number) {
    return strPath + ':' + length;
}
