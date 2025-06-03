import { DEFAULT_WORKDIR_LOCATION, FILEN_MAPS } from "../const.js";
import { Subject } from "rxjs";
import { TorrentMapping } from "../analyze/Analyzer.js";

import * as fs from 'node:fs';
import * as  path from 'node:path';
import { ITorrentClient } from "./ITorrentClient.js";
import { TlookupTransmission } from "../../plugins/tlookup-transmission.js";


/**
 *
 */
export interface PusherOptions {
    client: string;
    workdir?: string;
    option?: object;
}

/**
 *
 */
export class PushManager {

    public readonly opStatus: Subject<string> = new Subject();

    public options: PusherOptions;
    public client: ITorrentClient;

    /**
     *
     */
    constructor(options: PusherOptions) {

        this.options = {
            workdir: DEFAULT_WORKDIR_LOCATION,
            ...options,
        };

        this.client = PushManager.getClient(options);
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
                return new TlookupTransmission(options.option);

            default:
                throw new Error('Unknown client: ' + options.client);
        }
    }

    /**
     *
     */
    pushAll(): Promise<any> {
        return this._pushAll(this.loadMapping());
    }

    /**
     *
     */
    push(location: string, saveTo: string): Promise<void> {
        return this.client.push(location, saveTo)
            .then(result => {
                this.opStatus.next('Torrent ' + (result.isNew ? 'added' : 'exists') + ': ' + result.id + ':\t' + location);
            });
    }

    /**
     * @private
     */
    public async _pushAll(matchArr: TorrentMapping[]): Promise<any> {
        for (const torrentMapping of matchArr) {
            await this.push(torrentMapping.torrent, torrentMapping.saveTo);
        }
    }

    /**
     * @private
     */
    protected loadMapping(): TorrentMapping[] {
        console.log('[Push] use workdir:', this.options.workdir);
        const mapsFileName = path.join(this.options.workdir, FILEN_MAPS);
        return JSON.parse(fs.readFileSync(mapsFileName, {encoding: 'utf-8'}).toString());
    }

} // -


