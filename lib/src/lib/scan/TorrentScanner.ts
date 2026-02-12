import * as fs from 'node:fs';
import * as fsPromise from 'node:fs/promises';
import * as path from 'node:path';
import {
    DEFAULT_WORKDIR_LOCATION,
    FILE_DATA,
    FILE_TORRENTS,
    SCAN_EXCLUDE_DEFAULT,
    TORRENT_EXTENSION
} from "../const.js";
import { Subject } from "rxjs";
import { FileMatcher } from '../utils/FileMatcher.js';
import { MyGlob } from "../utils/myglob";
import { QueueWorker } from "./QueueWorker";
import { timeoutPromise } from "../utils/tools";


export interface TorrentScannerOptions {
    /**
     * Target folder(s) to scan
     */
    target?: string[];

    /**
     * Folder for storing results
     */
    workdir?: string;

    /**
     * @see FileScannerOption.exclude
     */
    exclude?: string[];

    /**
     * When true - predefined exclude patters is not used
     */
    skipSystemExclude?: boolean;

    /**
     * Maximum files per second.
     * 0 - no limit
     *
     * @default 0
     */
    maxFps?: number;

    /**
     * TODO: Not tested!
     * @default false
     */
    followSymLinks?: boolean;

    /**
     * Progress report function
     */
    onEntry?: (entry: TorrentScannerEntry) => void;
}

/**
 *
 */
export interface TorrentScannerEntry {
    location: string;
    isTorrent?: boolean // for file only
}

/**
 *
 */
export interface TorrentScannerStats {
    /**
     * Arbitrary (not a torrent) files found
     */
    files: number;

    /**
     * Torrent files found
     */
    torrents: number;

    filesPerSecond: number;
}

/**
 * 1. use Scanner to scan files and folders
 *   1.1 check is that file is a torrent file
 *     1.1.1 write torrent file into one list
 *     1.1.2 write ordinary file into another list(with file size)
 */
export class TorrentScanner {

    public readonly onEntry: Subject<TorrentScannerEntry> = new Subject();

    public options: TorrentScannerOptions;
    public stats: TorrentScannerStats;

    private _dataFileStream: fs.WriteStream;
    private _torrFileStream: fs.WriteStream;

    private _fpsLastEnforce?: number | null;
    private _fpsFilesCount = 0;

    private readonly _scanner: QueueWorker<string>;

    /**
     * @param {TorrentScannerOptions} options
     */
    constructor(options: TorrentScannerOptions) {
        this._scanner = new QueueWorker(this._scanFolder.bind(this), {stopOnError: true});

        this.options = {
            workdir: options?.workdir || DEFAULT_WORKDIR_LOCATION,
            followSymLinks: !!options?.followSymLinks,
            target: [],
            exclude: SCAN_EXCLUDE_DEFAULT,
            skipSystemExclude: !!options?.skipSystemExclude,
            maxFps: Math.max((options?.maxFps || 0), 0),
        }
        if (options?.target) {
            this.addTarget(options.target)
        }
        if (options?.skipSystemExclude) {
            this.options.exclude = [];
        }
        if (options?.exclude) {
            this.addExclusion(options.exclude)
        }
        if (options?.onEntry) {
            this.onEntry.subscribe(options.onEntry);
        }
    }

    /**
     * Add one or multiple targets
     * @param target
     */
    addTarget(target: string | string[]) {
        const targets = Array.isArray(target) ? target : [target];
        this.options.target.push(...targets);
    }

    clearTargets() {
        this.options.target = [];
    }

    /**
     * Add one or multiple exclusions
     * @param target
     */
    addExclusion(target: string | string[]) {
        const targets = Array.isArray(target) ? target : [target];
        this.options.exclude.push(...targets);
    }

    clearExclusion() {
        this.options.exclude = this.options.skipSystemExclude ? [] : SCAN_EXCLUDE_DEFAULT;
    }

    /**
     *
     */
    run(): Promise<any> {
        if (this._scanner.isRunning()) {
            return Promise.reject('Already started');
        }
        // SCAN
        this._scanner.addJobs(this.options.target);

        //
        this._resetStats();
        return Promise.resolve()
            .then(() => this._beforeScan())
            .then(() => {
                this._fpsLastEnforce = Date.now();
                this._fpsFilesCount = 0;
                return this._scanner.run();
            })
            .finally(() => {
                return this._afterScan()
            });
    }

    /**
     *
     */
    async terminate() {
        return this._scanner.terminate();
    }

    /**
     *
     */
    isRunning() {
        return this._scanner.isRunning();
    }

    /**
     * @return {boolean}
     */
    isTorrentFile(location: string, stats?: fs.Stats) {
        return path.extname(location) === TORRENT_EXTENSION;
    }

    /**
     * @param filepath
     * @private
     */
    isExcluded(filepath: string) {
        const excluded = !this.options.exclude.every(rule => !MyGlob.match(filepath, rule));
        if (excluded) {
            console.debug('Excluded:', filepath);
        }
        return excluded;
    }

    /**
     * Perform operations before scan
     */
    protected _beforeScan(): void {
        console.log('[Scanner] use workdir:', this.options.workdir);
        fs.mkdirSync(this.options.workdir, {recursive: true});

        const dataFileName = path.join(this.options.workdir, FILE_DATA);
        const torrFileName = path.join(this.options.workdir, FILE_TORRENTS);

        // this._lastFile = null;
        this._dataFileStream = fs.createWriteStream(dataFileName);
        this._torrFileStream = fs.createWriteStream(torrFileName);
    }

    /**
     * Perform operations after scan
     */
    protected _afterScan(): Promise<any> {
        return Promise.all([
            new Promise((resolve) => {
                this._dataFileStream.end(resolve);
            }),
            new Promise((resolve) => {
                this._torrFileStream.end(resolve);
            }),
        ]);
    }

    /**
     * @param {string} filepath
     */
    protected async _scanFolder(filepath: string): Promise<any> {
        // TODO: verbose log
        const folderEntries = await fsPromise.readdir(path.resolve(filepath));
        // console.log('_scanFolder: "%s"', filepath, folderEntries);

        for (const fileOrFolder of folderEntries) {
            // get absolute path
            const childLocation = path.join(filepath, fileOrFolder);
            if (this.isExcluded(childLocation)) {
                continue;
            }


            // get stats
            const stats = await fsPromise.lstat(childLocation);
            if (!stats) {
                continue;
            }

            if (stats.isSymbolicLink()) {
                if (!this.options.followSymLinks) {
                    // skip symbolic link
                    continue;
                }
            }

            if (stats.isDirectory()) {
                this.addTarget(childLocation);
            } else if (stats.isFile()) {
                await this._onFile(childLocation, stats);
            } else {
                console.debug('FileScanner: Skip unknown entry type:', childLocation);
            }

        }
    }

    /**
     * @param {string} filepath
     * @param {fs.Stats} stats
     */
    protected async _onFile(filepath: string, stats: fs.Stats): Promise<any> {
        filepath = path.resolve(filepath); // make path absolute;
        const isTorrent = this.isTorrentFile(filepath, stats);

        this.onEntry.next({
            isTorrent,
            location: filepath,
        });

        if (isTorrent) {
            this.stats.torrents++;

            // write to torrent list
            await new Promise<void>((resolve, reject) => {
                this._torrFileStream.write(filepath + '\n', (err) => {
                    err ? reject(err) : resolve();
                });
            });
        } else {
            this.stats.files++;

            const fileInfoStr = FileMatcher.combineFileInfo({location: filepath, size: stats.size});
            await new Promise<void>((resolve, reject) => {
                this._dataFileStream.write(fileInfoStr + '\n', (err) => {
                    err ? reject(err) : resolve();
                });
            });
        }

        // calculate fps
        const now = Date.now();
        const timePassedMs = now - this._fpsLastEnforce;
        this._fpsFilesCount++;
        this.stats.filesPerSecond = Math.round(this._fpsFilesCount * 1000 / timePassedMs);

        if (this.options.maxFps <= 0) {
            if (this._fpsFilesCount >= this.options.maxFps) {
                // fps limit reached. check the time taken
                this._fpsLastEnforce = now;
                this._fpsFilesCount = 0;

                const extraDelay = 1000 - timePassedMs;
                if (extraDelay > 0) {
                    return timeoutPromise(extraDelay);
                }
            }
        }

        return Promise.resolve();
    }

    /**
     *
     */
    protected _resetStats() {
        this.stats = {
            files: 0,
            torrents: 0,
            filesPerSecond: 0,
        };
    }

} // TorrentScanner
