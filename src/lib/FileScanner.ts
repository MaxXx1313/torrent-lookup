import * as fs from 'fs';
import * as path from 'path';

import * as minimatch from 'minimatch';
import { readdir } from "./utils/fsPromise";
import { Stats } from "fs";
import { Observable } from "rxjs";
import { QueueWorker } from "./QueueWorker";


const SKIPS_DEFAULT = [
    '.*',
    'node_modules',
    '/etc',
];


/**
 *
 */
export interface FileScannerOption {

    /**
     * Patten for excluding files/folders from scan.
     * @type {Array<string>}Array of globs string
     * @see [Glob syntax](https://en.wikipedia.org/wiki/Glob_(programming)) for more details
     */
    skip?: Array<string>;

    cbFileFound: (location?: string, stats?: Stats)=>Promise<any>;

    cbFolderFound?: (location?: string, stats?: Stats)=>Promise<any>;
    cbOtherFound?: (location?: string, stats?: Stats)=>Promise<any>;
    cbError?: (e?: Error, location?: string,)=>Promise<any>;
}


/**
 *
 */
export interface ScanResult {
    path: string;
    stats: Stats;
}

/**
 * recursive scan folder content
 */
class FileScanner {

    /**
     *
     */
    protected _skip = SKIPS_DEFAULT;
    protected _options: FileScannerOption;

    protected jobWorker: QueueWorker<string>;


    /**
     *
     * @param options
     */
    constructor(options: FileScannerOption) {
        // super();

        this._options = options;

        Object.assign(this._options, {
            cbError: FileScanner.cbErrorDefault,
            cbFileFound: FileScanner.cbNoOperation,
            cbFolderFound: FileScanner.cbNoOperation,
            cbOtherFound: FileScanner.cbOtherFound,
        });


        if (this._options.skip) {
            this._skip.push.apply(this._skip, this._options.skip);
        }
    }

    /**
     * start scanning process
     * @param {string|Array<string>} target
     */
    scan(target: string|string[]): Observable<string> {
        if (!target) {
            console.log('location must be set');
            return;
        }
        const targets = Array.isArray(target) ? target : [target];
        const filteredTargets = targets.filter(loc => !this.isExcluded(loc));

        return new Observable(subject => {
            this.jobWorker = new QueueWorker(this._scanFolder);
            this.jobWorker.addJobs(filteredTargets);

            this.jobWorker.onJob.subscribe(job => { subject.next(job); });
            this.jobWorker.onStop.subscribe(() => { subject.complete(); });

            this.jobWorker.run();
        });
    }


    /**
     * @param location
     * @private
     */
    isExcluded(location) {
        // console.log('_isExcluded', location);
        let locationComponents = location.split(path.sep);

        for (let i = this._skip.length - 1; i >= 0; i--) {
            let skipRule = this._skip[i];

            let m = minimatch.match(locationComponents, skipRule) || [];
            // console.log('  minimatch', skipRule, m);
            if (m.length > 0) {
                return true;
            }
        }
        return false;
    }


    /**
     * @param location
     */
    protected addTarget(location) {
        this.jobWorker.addJob(location, !!'prepend');
    }

    /**
     * @param {string} location
     */
    protected async _scanFolder(location: string): Promise<any> {
        let self = this;

        const folderEntries = await readdir(location);

        for (var i = 0; i < folderEntries.length; i++) {

            // get absolute path
            const childLocation = path.join(location, folderEntries[i]);

            if (self.isExcluded(childLocation)) {
                continue;
            }

            // get stats
            let stats;
            try {
                stats = fs.lstatSync(childLocation);
            } catch (err) {
                // skip no file and access warning
                if (err.code != 'ENOENT') {
                    await this._options.cbError(err, childLocation);
                }
            }

            if (!stats) {
                continue;
            }

            if (stats.isSymbolicLink()) {
                // skip symbolic link
                continue;
            }

            // console.log(self);

            if (stats.isDirectory()) {
                this.addTarget(childLocation);
                await this._options.cbFolderFound(childLocation, stats);
            } else if (stats.isFile()) {
                await this._options.cbFileFound(childLocation, stats);
            } else {
                await this._options.cbOtherFound(childLocation, stats);
            }
        }
    }


    /**
     * @param {Error} err
     */
    static cbErrorDefault(err:Error): Promise<any> {
        console.warn(err);
        return Promise.resolve();
    }

    /**
     */
    static cbNoOperation(ile: string, stats: Stats): Promise<any> {
        return Promise.resolve();
    }


    /**
     */
    static cbOtherFound(file: string, stats: Stats): Promise<any> {
        console.warn('Skip unknown entry type:', file, stats);
        return Promise.resolve();
    }


} //- FileScanner
