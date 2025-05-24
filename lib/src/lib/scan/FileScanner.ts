import * as fs from 'node:fs/promises';
import { Stats } from 'node:fs';
import * as path from 'node:path';
import { QueueWorker } from "./QueueWorker.js";
import { matchCustom } from "../utils/myglob.js";
import * as os from 'node:os';
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
    followLinks?: boolean;

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
    protected _exclude = [];
    protected _options: FileScannerOption;

    /**
     *
     * @param options
     */
    constructor(options: FileScannerOption) {
        this.jobWorker = new QueueWorker(this.scanFolder.bind(this), {stopOnError: true});

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

        this._exclude = this._exclude.map(_normalizePath);
    }


    /**
     * Add one or multiple targets
     */
    addTarget(target: string | string[], opts?: { prepend?: boolean }) {
        const targets = Array.isArray(target) ? target : [target];
        const filteredTargets = targets.filter(loc => !this.isExcluded(loc));

        this.jobWorker.addJobs(filteredTargets, opts?.prepend || false);
    }

    /**
     * start scanning process
     */
    run(): Promise<void> {
        return this.jobWorker.run();
    }

    /**
     *
     */
    terminate() {
        return this.jobWorker.terminate();
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
        return this._scanFolder(_normalizePath(filepath))
            .catch(this._options.cbError.bind(this));
    }

    /**
     * @param {string} filepath
     */
    protected async _scanFolder(filepath: string): Promise<any> {
        // TODO: verbose log
        const folderEntries = await fs.readdir(path.resolve(filepath));
        // console.log('_scanFolder: "%s"', filepath, folderEntries);

        for (const fileOrFolder of folderEntries) {
            // get absolute path
            const childLocation = path.join(filepath, fileOrFolder);
            if (this.isExcluded(childLocation)) {
                continue;
            }


            // get stats
            const stats = await fs.lstat(childLocation);
            if (!stats) {
                continue;
            }

            if (stats.isSymbolicLink()) {
                if (!this._options.followLinks) {
                    // skip symbolic link
                    continue;
                }
            }

            if (stats.isDirectory()) {
                // addTarget() will validate entry with isExcluded() one more time. We don't need it here
                await this._options.cbFolderFound(childLocation, stats);
                this.addTarget(childLocation);
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


/**
 * @param filepath
 * @protected
 */
function _normalizePath(filepath: string) {
    // fix windows drive root
    if (filepath.match(/^\w{1}:\\?$/)) {
        // location is a pure drive letter: "C:" o "C:\"
        filepath = filepath.substring(0, 2) + '/';
    }

    // fix home path
    if (filepath.match(/^\~(?:[\/\\]|$)/)) {
        // location starting from '~'
        filepath = os.homedir() + filepath.substring(1);
    }
    return filepath;
}
