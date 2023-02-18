import { DEFAULT_WORKDIR_LOCATION, FN_MAPS_FILE } from "../const";

import * as path from 'path';
import { readFile } from "../utils/fsPromise";
import { TorrentMapping } from "./Analyzer";



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
        const mapsFileName = path.join(this.options.tmp, FN_MAPS_FILE);
        return this.loadResultFile(mapsFileName);
    }

    /**
     *
     */
    protected loadResultFile(location: string): Promise<TorrentMapping[]> {
        return readFile(location).then(data => JSON.parse(data));
    }

} // -
