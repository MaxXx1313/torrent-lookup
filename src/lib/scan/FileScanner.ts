import * as fs from 'fs';
import { Stats } from 'fs';
import * as path from 'path';
import { readdir } from "../utils/fsPromise";
import { QueueWorker } from "./QueueWorker";
import { SCAN_EXCLUDE_DEFAULT } from "../const";
import { matchCustom } from "../utils/myglob";
import ErrnoException = NodeJS.ErrnoException;



/**
 *
 */
export interface FileScannerOption {

    /**
     * Patten for excluding files/folders from scan.
     * @type {Array<string>}Array of globs string
     * @see [Glob syntax](https://en.wikipedia.org/wiki/Glob_(programming)) for more details
     */
    exclude?: Array<string>;

    cbFileFound: (location?: string, stats?: Stats) => Promise<any>;

    cbFolderFound?: (location?: string, stats?: Stats) => Promise<any>;
    cbOtherFound?: (location?: string, stats?: Stats) => Promise<any>;
    cbError?: (e?: Error, location?: string) => Promise<any>;
}


/**
 * recursive scan folder content
 *
 * @example:
 *     function logFile(filename){
 *         console.log('File was found:', filename);
 *     }
 *     const scanner = new Scanner({cbFileFound: logFile});
 *     scanner.addTarget('/home/testuser');
 *     scanner.run();
 */
export class FileScanner {

    public readonly jobWorker: QueueWorker<string>;

    /**
     *
     */
    protected _exclude = SCAN_EXCLUDE_DEFAULT;
    protected _options: FileScannerOption;

    /**
     *
     * @param options
     */
    constructor(options: FileScannerOption) {
        // super();
        this.jobWorker = new QueueWorker(this.scanFolder.bind(this));

        this._options = Object.assign({}, {
            cbError: FileScanner.cbErrorDefault,
            cbFileFound: FileScanner.cbNoOperation,
            cbFolderFound: FileScanner.cbNoOperation,
            cbOtherFound: FileScanner.cbOtherFound,
        }, options);


        if (this._options.exclude) {
            this._exclude.push.apply(this._exclude, this._options.exclude);
        }
    }


    /**
     * Add one or multiple targets
     * @param {string|Array<string>} target
     */
    addTarget(target: string | string[]) {
        const targets = Array.isArray(target) ? target : [target];
        const filteredTargets = targets.filter(loc => !this.isExcluded(loc));

        this.jobWorker.addJobs(filteredTargets);
    }

    /**
     * start scanning process
     */
    run(): Promise<any> {
        return this.jobWorker.run();
    }


    /**
     * @param location
     * @private
     */
    isExcluded(location) {
        // let locationComponents = location.split(path.sep);

        const excluded = !this._exclude.every(rule => !matchCustom(location, rule));
        if (excluded) {
            console.log('Excluded:', location);
        }
        return excluded;
    }


    /**
     * @description It a job=)
     * @param location
     */
    protected async scanFolder(location: string): Promise<any> {
        //fix windows drive root
        if (location.match(/^\w{1}:\\?$/)) {
            // location is "C:" o "C:\"
            location = location.substr(0, 2) + '/';
        }
        return Promise.resolve()
            .then(() => {
                return this._scanFolder(location);
            })
            .catch(this._options.cbError.bind(this));
    }

    /**
     * @param {string} location
     */
    protected async _scanFolder(location: string): Promise<any> {
        let self = this;

        // TODO: verbose log
        // console.log('_scanFolder: "%s"', location);
        const folderEntries = await readdir(location);
        // console.log('_scanFolder: "%s"', location, folderEntries);

        for (let i = folderEntries.length - 1; i >= 0; i--) {
            // get absolute path
            const childLocation = path.join(location, folderEntries[i]);

            if (self.isExcluded(childLocation)) {
                continue;
            }

            // get stats
            const stats = fs.lstatSync(childLocation);
            if (!stats) {
                continue;
            }

            if (stats.isSymbolicLink()) {
                // skip symbolic link
                continue;
            }

            // console.log(self);

            if (stats.isDirectory()) {
                // addTarget() will validate entry with isExcluded() one more time. We don't need it here/already passed
                // this.addTarget(childLocation);
                this.jobWorker.addJob(childLocation, true);
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
    static cbErrorDefault(err: ErrnoException): Promise<any> {
        // skip no file and access warning
        // if (err.code != 'ENOENT') {
        console.warn('FileScanner:', err.message);
        // }
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
        console.warn('FileScanner: Skip unknown entry type:', file, stats);
        return Promise.resolve();
    }


} //- FileScanner
