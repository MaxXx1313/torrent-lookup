import { DEFAULT_WORKDIR_LOCATION, FILE_DATA, FILE_TORRENTS, FILES_MAPS } from "../const.js";

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { promiseByLine } from '../utils/line-by-line.js';
import { bencodeReadSync } from '../utils/bencode/bencode.js';
import { FileMatcher } from '../utils/FileMatcher.js';
import { PathUtils } from '../utils/path-utils.js';


/**
 * Info about a single file inside a torrent file
 * @private
 */
interface TorrentFileInfo {

    /**
     *
     */
    torrentContentHash: string;

    /**
     * Torrent file location
     */
    torrentFileLocation: string;

    /**
     * file name + extension inside torrent file
     */
    tFilename: string; // file name + extension

    /**
     * Folder path inside torrent file
     */
    tFolder: string[];

    /**
     * file size (also from torrent file)
     */
    tSize: number; // file size

    // TODO: add sha to handle duplicates
    // TODO: split into two interfaces: one is data read from torrent, the other is a mapping
    /**
     * List of possible matches.
     * > basepath - Absolute path to base dir
     * > filepath - relative path of torrent file
     * (i.e. 'pathMatch' + 'tFolder' + 'tFilename' is an absolute path to a file).
     * We match file by name + size
     */
    pathMatch: Array<{ basepath: string, filepath: string }>;
}


/**
 *
 */
export interface TorrentMapping {
    torrentContentHash: string;
    torrentLocation: string; // torrent location
    torrentsDuplicatedLocation: string[];

    /**
     * highest score option from {@link saveToOptions}
     */
    saveTo: TorrentMappingSaveLocation; // absolute file location
    saveToOptions: TorrentMappingSaveLocation[]; // another options (any path which has at least one file from the torrent)
}


/**
 *
 */
export interface TorrentMappingSaveLocation {
    saveTo: string; // absolute file location

    /**
     * custom score. The highter - the more likelythe path is correct
     * Min: 0
     * Max: filesWanted.length + filesUnwanted.length
     */
    score: number;

    /**
     * Relative path of files to be downloaded
     * ({@link TorrentFileInfo.tFolder} + {@link TorrentFileInfo.tFilename})
     */
    filesWanted: string[];
    filesUnwanted: string[];
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
    public _hashByFileSize: { [fileAndSize: string]: TorrentFileInfo[] } = {};

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
        await this._matchFilesFromDataFile(dataFileName);
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
        const files: TorrentFileInfo[] = [];
        if (!data.info.files) {
            // single file
            files.push({
                torrentFileLocation: filepath,
                torrentContentHash: data.content_hash,
                pathMatch: [],

                tFilename: data.info.name,
                tFolder: [],
                tSize: data.info.length,
            });
        } else {
            // multiple files
            const baseDir = data.info.name;

            for (const fileData of data.info.files) {
                fileData.path.unshift(baseDir);
                const filename = fileData.path.pop();
                const filedir = fileData.path.slice();
                files.push({
                    torrentFileLocation: filepath,
                    torrentContentHash: data.content_hash,
                    pathMatch: [],

                    tFilename: filename,
                    tFolder: filedir,
                    tSize: fileData.length,
                });
            }

        }

        // add to hash
        for (const file of files) {
            const key = FileMatcher._hashId(file.tFilename, file.tSize);
            if (!this._hashByFileSize[key]) {
                this._hashByFileSize[key] = [];
            }
            this._hashByFileSize[key].push(file);
        }
    }

    /**
     * @internal
     *
     * Matching is quite challenged task.
     * So far we do simple step:
     *  1. try to match exact file + size
     *  TODO: 2. try to match exact filename with no size for sibling files
     */
    public __matchFile(fileLocation: string, size: number) {

        const pathInfo = path.parse(fileLocation);
        const fileName = pathInfo.base;
        const fileDir = pathInfo.dir;

        // 1. match exact file + size
        const key = FileMatcher._hashId(fileName, size);

        const torrentsHavingTheFile = this._hashByFileSize[key];
        if (!torrentsHavingTheFile) {
            // no such file in hash
            return
        }

        for (const tInfo of torrentsHavingTheFile) {
            // Check if fileLocation has the base folder same as torrent inner path.
            // Note: torrent inner path can be empty.
            // Note: some torrent parts can be relocated in different folder. We don't support it yet

            const savedTo = PathUtils.extractBasePath(fileDir, tInfo.tFolder.join(path.sep));
            // console.log(' matched', fileDir, item.dir, savedTo);
            if (savedTo) {
                // location found
                tInfo.pathMatch = tInfo.pathMatch || [];
                tInfo.pathMatch.push({basepath: savedTo, filepath: tInfo.tFolder + path.sep + tInfo.tFilename});
            } else {
                // file path is not match torrent
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

        // regroup by torrent location
        const _hashByTorrentFile: { [torrentLocation: string]: TorrentFileInfo[] } = {}; // torrentLocation => TorrentMapping[]
        for (const key in this._hashByFileSize) {
            for (const torrentInfo of this._hashByFileSize[key]) {
                const tPath = torrentInfo.torrentFileLocation;
                _hashByTorrentFile[tPath] = _hashByTorrentFile[tPath] || [];
                _hashByTorrentFile[tPath].push(torrentInfo);
            }
        }
        this._hashByFileSize = null; // free some memory

        // combine info into mapping
        const mappingArr: TorrentMapping[] = [];
        for (const torrentLocation in _hashByTorrentFile) {
            const mapping = _extractMappingInfo(_hashByTorrentFile[torrentLocation]);
            if (mapping) {
                mappingArr.push(mapping);
            }
        }

        // detect duplicates
        const _mappingHashByTorrentHash: { [hash: string]: TorrentMapping } = {}; // torrentLocation => TorrentMapping[]
        for (const mapping of mappingArr) {
            if (_mappingHashByTorrentHash[mapping.torrentContentHash]) {
                // duplication found
                _mappingHashByTorrentHash[mapping.torrentContentHash].torrentsDuplicatedLocation.push(mapping.torrentLocation);
            } else {
                _mappingHashByTorrentHash[mapping.torrentContentHash] = mapping;
            }
        }
        this._decision = Object.values(_mappingHashByTorrentHash);

        this.stats.maps = this._decision.length;
        console.log(`[Analyzer] Found ${this.stats.maps} matches`);
    }

    /**
     *
     */
    protected _loadTorrentFilesFromFile(dataFileLocation: string): Promise<void> {
        console.log('[Analyzer] Loading files');

        this._hashByFileSize = {};
        return promiseByLine(dataFileLocation, (line: string) => {
            return this.__loadTorrentFile(line)
                .catch(e => {
                    console.error('[Analyzer] Unable to load torrent file:', line);
                    console.error(e);
                });
        }).then(() => {
            this.stats.torrents = Object.keys(this._hashByFileSize).length;
            console.log(`[Analyzer] Loaded ${this.stats.torrents} torrent files`);
        });

    }

    /**
     *
     */
    protected _matchFilesFromDataFile(dataFile: string): Promise<void> {
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
function _extractMappingInfo(tFileInfoArr: TorrentFileInfo[]): TorrentMapping {

    if (!tFileInfoArr.length) {
        return null;
    }
    const torrentLocation = tFileInfoArr[0].torrentFileLocation;
    const torrentContentHash = tFileInfoArr[0].torrentContentHash;

    /*
      Here we calculate score based on how many files from the torrent are kept in the same location
      This step is needed because torrent can be downloaded in many places
        or we can find a piece of data in the other location.

      "_scoreHash" key is absolute path, value is a score
     */
    const _scoreHash: { [downloadPath: string]: number } = {};

    for (const torrentInfo of tFileInfoArr) {

        if (!torrentInfo.pathMatch.length) {
            // nothing found for this torrent file
            continue;
        }

        if (torrentInfo.torrentFileLocation !== torrentLocation) {
            console.warn('Skipping unexpected data: having different torrentLocation');
            continue;
        }
        if (torrentInfo.torrentContentHash !== torrentContentHash) {
            console.warn('Skipping unexpected data: having different torrentContentHash');
            continue;
        }

        // collect scores.
        for (const matchPath of torrentInfo.pathMatch) {
            _scoreHash[matchPath.basepath] = (_scoreHash[matchPath.basepath] || 0) + 1;
        }
    }

    // collect save options
    const saveOptions: TorrentMappingSaveLocation[] = [];
    for (const downloadPath in _scoreHash) {
        saveOptions.push({
            saveTo: downloadPath,
            score: _scoreHash[downloadPath],
            filesWanted: [],
            filesUnwanted: [],
        });
    }

    // collect files info
    for (const torrentInfo of tFileInfoArr) {
        const tFilePath = torrentInfo.tFolder + path.sep + torrentInfo.tFilename;

        // detect if the file is wanted
        for (const sOpt of saveOptions) {
            const isOptionMatch = !!torrentInfo.pathMatch.find(pm => pm.basepath === sOpt.saveTo);
            if (isOptionMatch) {
                sOpt.filesWanted.push(tFilePath);
            } else {
                sOpt.filesUnwanted.push(tFilePath);
            }
        }
    }

    // choose max score
    let maxScore = -1;
    let saveTo: TorrentMappingSaveLocation | undefined;
    for (const sOpt of saveOptions) {
        if (maxScore < sOpt.score) {
            maxScore = sOpt.score;
            saveTo = sOpt;
        }
    }

    const mapping: TorrentMapping = {
        torrentLocation: torrentLocation,
        torrentContentHash: torrentContentHash,
        torrentsDuplicatedLocation: [], // torrent duplicates managed later
        saveTo: saveTo,
        saveToOptions: saveOptions,

    };
    return mapping;
}
