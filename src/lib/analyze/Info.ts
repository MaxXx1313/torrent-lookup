import { DEFAULT_WORKDIR_LOCATION, FN_MAPS_FILE } from "../const";

import * as fs from 'fs';
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

export interface Stat {
    maps: number;
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

        this.options = Object.assign({}, {
            tmp: DEFAULT_WORKDIR_LOCATION
        }, options);
    }

    /**
     *
     */
    getInfo(): Promise<Stat> {
        const mapsFileName = path.join(this.options.tmp, FN_MAPS_FILE);

        return this.loadResultFile(mapsFileName)
            .then(mapData => {
                return {
                    maps: mapData.length
                };
            });
    }

    /**
     *
     */
    protected loadResultFile(location: string): Promise<TorrentMapping[]> {
        return readFile(location).then(data=>JSON.parse(data));
    }

} // -