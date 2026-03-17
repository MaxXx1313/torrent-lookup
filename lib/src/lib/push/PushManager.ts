import { DEFAULT_WORKDIR_LOCATION, FILES_MAPS } from "../const.js";
import { Subject } from "rxjs";

import * as fs from 'node:fs';
import * as path from 'node:path';
import { ITorrentClient } from "./ITorrentClient.js";
import { TlookupTransmission } from "../../plugins/tlookup-transmission.js";
import { TorrentMapping } from "../analyze/Analyzer";


/**
 *
 */
export interface PusherOptions {
    client: string;
    workdir?: string;
    clientOptions?: ClientOptions;
}

/**
 *
 */
export interface PusherStatus {
    total: number;
    completed: number;
    percentage: number;
    currentTarget: string | null,
}

// TODO: not finished yet
export type ClientOptions = { [key: string]: string | number | boolean }

// TODO: get client options method

/**
 *
 */
export class PushManager {

    public readonly opStatus$: Subject<string> = new Subject();
    public readonly opError$: Subject<string> = new Subject();
    public readonly status$: Subject<PusherStatus> = new Subject();

    public options: PusherOptions;
    public client: ITorrentClient;

    private _terminate = false;

    /**
     *
     */
    constructor(options?: PusherOptions) {
        this.options = {
            workdir: DEFAULT_WORKDIR_LOCATION,
            ...options,
        };
        console.log('[Push] use workdir:', this.options.workdir);

        if (options?.client) {
            this.setClient(options.client, options.clientOptions);
        }
    }

    /**
     * Client must implement IPushProvider
     */
    static getClient(clientAlias: string, clientOptions?: ClientOptions): ITorrentClient {
        // TODO: autodetect client
        if (!clientAlias) {
            throw new Error('Client not set');
        }
        switch (clientAlias) {
            case 't':
            case 'transmission':
                return new TlookupTransmission(clientOptions);

            default:
                throw new Error('Unknown client: ' + clientAlias);
        }
    }

    setClient(clientAlias: string, clientOptions?: ClientOptions) {
        this.client = PushManager.getClient(clientAlias, clientOptions);
    }

    /**
     *
     */
    ping(): Promise<boolean> {
        return this.client.ping();
    }

    /**
     *
     */
    terminate(): Promise<boolean> {
        this._terminate = true;
        return Promise.resolve(true);
    }

    /**
     *
     */
    pushAll(): Promise<any> {
        return this.pushMapping(this.loadMapping());
    }

    /**
     *
     */
    pushMapping(matchArr: TorrentMapping[]): Promise<any> {
        return this._pushAll(matchArr);
    }

    /**
     * @private
     */
    protected loadMapping(): TorrentMapping[] {
        const mapsFileName = path.join(this.options.workdir, FILES_MAPS);
        console.log('[Push] loadMapping from', mapsFileName);
        return JSON.parse(fs.readFileSync(mapsFileName, {encoding: 'utf-8'}).toString());
    }

    /**
     * @private
     */
    private async _pushAll(matchArr: TorrentMapping[]): Promise<any> {
        this.status$.next({
            total: matchArr.length,
            completed: 0,
            percentage: 0,
            currentTarget: null,
        });

        for (let i = 0; i < matchArr.length; i++) {
            const torrentMapping = matchArr[i];

            if (this._terminate) {
                console.log('[Push] terminated');
                return;
                ///////
            }

            if (!torrentMapping.saveTo) {
                console.log('[Push] skip (no saveTo):', torrentMapping.torrentLocation);
                continue;
            }
            this.status$.next({
                total: matchArr.length,
                completed: i,
                percentage: Math.round(i / matchArr.length * 100),
                currentTarget: torrentMapping.torrentLocation,
            });
            await this._pushOne(torrentMapping.torrentLocation, torrentMapping.saveTo.saveTo, torrentMapping.saveTo.filesWanted);

            this.status$.next({
                total: matchArr.length,
                completed: i + 1,
                percentage: Math.round((i + 1) / matchArr.length * 100),
                currentTarget: torrentMapping.torrentLocation,
            });
        }
    }

    /**
     *
     */
    private _pushOne(location: string, saveTo: string, filesWanted: string[]): Promise<void> {
        this.opStatus$.next(`Exporting "${location}" to "${saveTo}" (${filesWanted.length} files)`);
        return this.client.push(location, saveTo, filesWanted)
            .then(result => {
                this.opStatus$.next('  Torrent ' + (result.isNew ? 'added' : 'exists') + ': ' + result.id + ':\t' + location);
            }).catch(e => {
                this.opError$.next('  Error: ' + (e?.message || 'Unknown'));
            })
    }

} // -


