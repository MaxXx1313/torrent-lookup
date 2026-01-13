import * as fs from 'node:fs';
import { Stats, WriteStream } from 'node:fs';
import * as path from 'node:path';
import {
    DEFAULT_WORKDIR_LOCATION,
    FILE_DATA,
    FILE_TORRENTS,
    SCAN_EXCLUDE_DEFAULT,
    TORRENT_EXTENSION
} from "../const.js";
import { FileScanner } from "./FileScanner.js";
import { Subject } from "rxjs";
import { FileMatcher } from '../utils/FileMatcher.js';


export interface TorrentScannerOptions {
    /**
     * Target folder to scan
     */
    target?: string[];

    /**
     * Folder for storing temp results
     */
    workdir?: string;

    /**
     * @see FileScannerOption.exclude
     */
    exclude?: string[];
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
 *
 */
export interface TorrentScannerEntry {
    type: 'file' | 'folder' | 'other';
    location: string;
    isTorrent?: boolean // for file only
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

    private scanner?: FileScanner | null;

    private _dataFileStream: WriteStream;
    private _torrFileStream: WriteStream;

    private _lastFileFoundTs?: number | null;


    /**
     * @param {TorrentScannerOptions} options
     */
    constructor(options: TorrentScannerOptions) {

        this.options = {
            workdir: options?.workdir || DEFAULT_WORKDIR_LOCATION,
            target: [],
            exclude: SCAN_EXCLUDE_DEFAULT,
        }
        if (options?.target) {
            this.addTarget(options.target)
        }
        if (options?.exclude) {
            this.addExclusion(options.exclude)
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
        this.options.exclude = SCAN_EXCLUDE_DEFAULT;
    }

    /**
     *
     */
    run(): Promise<any> {
        if (this.scanner) {
            return Promise.reject('Already started');
        }
        // SCAN
        this.scanner = new FileScanner({
            exclude: [
                ...(this.options.exclude || []),
            ],
            cbFileFound: this._onFile.bind(this),
        });
        this.scanner.addTarget(this.options.target);

        //
        this._resetStats();
        return Promise.resolve()
            .then(() => this._beforeScan())
            .then(() => {
                this._lastFileFoundTs = Date.now();
                return this.scanner.run();
            })
            .finally(() => {
                this.scanner = null;
                return this._afterScan()
            });
    }

    /**
     *
     */
    async terminate() {
        return this.scanner?.terminate();
    }

    /**
     *
     */
    isRunning() {
        return this.scanner?.isRunning() || false;
    }

    /**
     * @return {boolean}
     */
    isTorrentFile(location: string, stats?: Stats) {
        return path.extname(location) === TORRENT_EXTENSION;
        // return (location.match(/(\.\w+)$/) || [])[1] == TORRENT_EXTENSION;
    }

    /**
     * Perform operations before scan
     */
    protected _beforeScan(): void {
        fs.mkdirSync(this.options.workdir, {recursive: true});
        console.log('[Scanner] use workdir:', this.options.workdir);

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
     * @param {fs.Stats} stats
     */
    protected _onFile(filepath: string, stats: Stats): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            filepath = path.resolve(filepath); // make path absolute;
            const isTorrent = this.isTorrentFile(filepath, stats);

            // calculate stats
            const now = Date.now();
            const elapsed = now - this._lastFileFoundTs;
            this._lastFileFoundTs = now;
            this.stats.filesPerSecond = Math.round(1000 / elapsed);

            this.onEntry.next({
                type: "file",
                isTorrent,
                location: filepath,
            });

            if (isTorrent) {
                this.stats.torrents++;

                // write to torrent list
                this._torrFileStream.write(filepath + '\n', (err) => {
                    err ? reject(err) : resolve();
                });
            } else {
                this.stats.files++;

                // get relative location
                // const locRelative = this.shiftRelative(location);
                const fileInfoStr = FileMatcher.combineFileInfo({location: filepath, size: stats.size});
                this._dataFileStream.write(fileInfoStr + '\n', (err) => {
                    err ? reject(err) : resolve();
                });
            }
        });
    }

    /**
     *
     */
    protected _resetStats() {
        this.stats = {
            files: 0, // without torrent files
            torrents: 0,
            filesPerSecond: 0,
        };
    }

} // TorrentScanner
