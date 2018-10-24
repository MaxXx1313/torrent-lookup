import { DEFAULT_WORKDIR_LOCATION, FN_MAPS_FILE } from "./lib/const";
import { Subject } from "rxjs";
import { ITorrentClient } from "./lib/push/TorrentClientAdapter";
import { TorrentMapping } from "./Analyzer";

import * as fs from 'fs';
import * as path from 'path';
import { chainPromise } from "./lib/utils/tools";


const Transmission = require('./lib/push/Transmission').Transmission;


/**
 *
 */
export interface PusherOptions {
    client: string;
    workdir?: string;
    option?: any[];
}

/**
 *
 */
export class Pusher {


    public readonly opStatus: Subject<string> = new Subject();

    options: PusherOptions;
    client: ITorrentClient;

    /**
     *
     */
    constructor(options: PusherOptions) {
        // super();


        this.options = Object.assign({}, {
            workdir: DEFAULT_WORKDIR_LOCATION
        }, options);

        this.client = Pusher.getClient(options);
    }

    /**
     * Client must implement IPushProvider
     */
    static getClient(options: PusherOptions): ITorrentClient {
        // TODO: autodetect client
        if (!options.client) {
            throw new Error('Client not set');
        }
        switch (options.client) {
            case 't':
            case 'transmission':
                // TODO: options!!!
                return new Transmission('http://localhost:9091'/*options.url*/);

            default:
                throw new Error('Unknown client: ' + options.client);
        }
    }

    /**
     *
     */
    pushAll(): Promise<any> {
        return this._pushAll( this.loadMapping() );
    }

    /**
     *
     */
    push(location: string, saveTo: string): Promise<any> {
        return this.client.push(location, saveTo)
            .then(result => {
                this.opStatus.next('Torrent ' + (result.isNew ? 'added' : 'exists') + ': ' + result.id + ':\t' + location);
            });
    }

    /**
     *
     */
    protected _pushAll(matchArr: TorrentMapping[]): Promise<any> {
        return chainPromise(matchArr, {drop: true}, (match) => {
            return this.push(match.torrent, match.saveTo);
        });
    }

    /**
     *
     */
    protected loadMapping(): TorrentMapping[] {
        const mapsFileName = path.join(this.options.workdir, FN_MAPS_FILE);
        return JSON.parse(fs.readFileSync(mapsFileName) as any as string);
    }

} // -

