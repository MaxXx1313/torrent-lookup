import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import { DEFAULT_WORKDIR_LOCATION, FN_DATA_FILE, FN_MAPS_FILE, FN_TORRENTS_FILE, TORRENT_EXTENSION } from "../const";
import { pesistFolderSync } from "../utils/fsPromise";
import { Stats, WriteStream } from "fs";
import { FileScanner } from "./FileScanner";
import { Observable, Subject } from "rxjs";


export interface TorrentScannerOptions {
    /**
     * Target folder to scan
     */
    target?: string;

    /**
     * Folder for storing temp results
     */
    workdir?: string;
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
 *   1.1 chech is that file is a torrent file
 *     1.1.1 write torrent file into one list
 *     1.1.2 write ordinary file into another list(with file size)
 *
 * @emit TorrentScanner#torrentfile    - when torrent file is found
 */
export class TorrentScanner {

    public readonly onEntry: Subject<TorrentScannerEntry> = new Subject();

    options: TorrentScannerOptions;

    stats: TorrentScannerStats;

    private scanner: FileScanner;

    private _dataFileStream: WriteStream;
    private _torrFileStream: WriteStream;

    private _lastFile: string;

    /**
     *
     * @param {TorrentScannerOptions} options
     */
    constructor(options: TorrentScannerOptions) {

        this.options = Object.assign({}, {
            workdir: DEFAULT_WORKDIR_LOCATION
        }, options);


        this.scanner = new FileScanner({
            cbFileFound: this._onFile.bind(this),
            cbFolderFound: this._onFolder.bind(this),
        });

        if (this.options.target) {
            this.addTarget(this.options.target);
        }
        this.resetStats();
    }

    /**
     * Add one or multiple targets
     * @param target
     */
    addTarget(target: string | string[]) {
        this.scanner.addTarget(target);
    }

    /**
     *
     */
    run(): Promise<any> {
        // SCAN
        return Promise.resolve()
            .then(()=>this._beforeScan())
            .then(()=>this.scanner.run())
            .then(()=>this._afterScan());
    }

    /**
     * Perform operations before scan
     */
    protected _beforeScan(): void {
        pesistFolderSync(this.options.workdir);

        const dataFileName = path.join(this.options.workdir, FN_DATA_FILE);
        const torrFileName = path.join(this.options.workdir, FN_TORRENTS_FILE);

        this.resetStats();
        this._lastFile = null;
        this._dataFileStream = fs.createWriteStream(dataFileName);
        this._torrFileStream = fs.createWriteStream(torrFileName);
    }

    /**
     * Perform operations after scan
     */
    protected _afterScan(): Promise<any> {
        return Promise.all([
            new Promise((resolve) => { this._dataFileStream.end(resolve); }),
            new Promise((resolve) => { this._torrFileStream.end(resolve); }),
        ]);
    }


    /**
     * @param {string} location
     * @param {fs.Stats} stats
     */
    protected _onFile(location: string, stats: Stats): Promise<any> {
        return new Promise((resolve, reject) => {
            location = path.resolve(location); // make path absolute;
            const isTorrent = this.isTorrentFile(location, stats);

            this.onEntry.next({
                type: "file",
                isTorrent,
                location
            });

            if (isTorrent) {
                this.stats.torrents++;

                // write to torrent list
                this._torrFileStream.write(location + '\n', (err) => {
                    err ? reject(err) : resolve();
                });
            } else {
                this.stats.files++;

                // get relative location
                const locRelative = this.shiftRelative(location);
                this._dataFileStream.write(locRelative + ':' + stats.size + '\n', (err) => {
                    err ? reject(err) : resolve();
                });
            }
        });
    }

    /**
     * @param {string} location
     * @param {fs.Stats} stats
     */
    protected _onFolder(location: string, stats: Stats): Promise<any> {
        this.onEntry.next({
            type: "folder",
            location
        });

        return Promise.resolve();
    }


    /**
     * Get file location  and return relative path from previous file.
     * Also set internal relative path to a new one
     */
    private shiftRelative(location) {
        var locRelative;
        if (this._lastFile) {
            locRelative = path.relative(this._lastFile + '/..', location);
        } else {
            locRelative = location;
        }
        this._lastFile = location;
        return locRelative;
    }


    /**
     *
     */
    protected resetStats() {
        this.stats = {
            files: 0, // without torrent files
            torrents: 0
        };
    }

    /**
     * @return {boolean}
     */
    protected isTorrentFile(location, stats) {
        return (location.match(/(\.\w+)$/) || [])[1] == TORRENT_EXTENSION;
    }

} // TorrentScanner