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

    cbFileFound: (filepath?: string, stats?: Stats) => Promise<any>;

    cbFolderFound?: (filepath?: string, stats?: Stats) => Promise<any>;
    cbOtherFound?: (filepath?: string, stats?: Stats) => Promise<any>;
    cbError?: (e?: Error, filepath?: string) => Promise<any>;
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
        this.jobWorker = new QueueWorker(this.scanFolder.bind(this));

        this._options = {
            cbError: FileScanner.cbErrorDefault,
            cbFileFound: FileScanner.cbNoOperation,
            cbFolderFound: FileScanner.cbNoOperation,
            cbOtherFound: FileScanner.cbOtherFound,
            ...(options || {}),
        };


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
     * @param filepath
     * @private
     */
    isExcluded(filepath: string) {
        // let locationComponents = filepath.split(path.sep);

        const excluded = !this._exclude.every(rule => !matchCustom(filepath, rule));
        if (excluded) {
            console.debug('Excluded:', filepath);
        }
        return excluded;
    }


    /**
     * @description It a job=)
     * @param filepath
     */
    protected async scanFolder(filepath: string): Promise<any> {
        // fix windows drive root
        if (filepath.match(/^\w{1}:\\?$/)) {
            // location is a pure drive letter: "C:" o "C:\"
            filepath = filepath.substr(0, 2) + '/';
        }
        return Promise.resolve()
            .then(() => {
                return this._scanFolder(filepath);
            })
            .catch(this._options.cbError.bind(this));
    }

    /**
     * @param {string} filepath
     */
    protected async _scanFolder(filepath: string): Promise<any> {
        // TODO: verbose log
        const folderEntries = await readdir(filepath);
        // console.log('_scanFolder: "%s"', filepath, folderEntries);

        for (const fileOrFolder of folderEntries) {
            // get absolute path
            const childLocation = path.join(filepath, fileOrFolder);
            if (this.isExcluded(childLocation)) {
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
     *
     */
    static cbErrorDefault(err: ErrnoException): Promise<any> {
        console.warn('FileScanner:', err.message);
        return Promise.resolve();
    }

    /**
     */
    static cbNoOperation(file: string, stats: Stats): Promise<any> {
        return Promise.resolve();
    }


    /**
     */
    static cbOtherFound(file: string, stats: Stats): Promise<any> {
        console.log('FileScanner: Skip unknown entry type:', file);
        console.debug(stats);
        return Promise.resolve();
    }


} //- FileScanner
