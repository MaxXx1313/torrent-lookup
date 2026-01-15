import { DEFAULT_WORKDIR_LOCATION, FILES_MAPS } from "../const.js";

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { TorrentMapping } from "./Analyzer.js";


/**
 *
 */
export interface InfoOptions {
    /**
     * Folder for storing temp results
     */
    tmp?: string;
}

/**
 *
 */
export class Info {

    options: InfoOptions;

    /**
     * @param options
     */
    constructor(options: InfoOptions) {

        this.options = {
            tmp: DEFAULT_WORKDIR_LOCATION,
            ...(options || {}),
        };
    }

    /**
     *
     */
    getMapping(): Promise<TorrentMapping[]> {
        const mapsFileName = path.join(this.options.tmp, FILES_MAPS);
        return this.loadResultFile(mapsFileName);
    }

    /**
     *
     */
    protected loadResultFile(location: string): Promise<TorrentMapping[]> {
        return fs.readFile(location, {encoding: 'utf-8'}).then(data => JSON.parse(data));
    }

} // -
