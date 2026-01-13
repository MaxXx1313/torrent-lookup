import { Observable, shareReplay } from 'rxjs';
import type { AppConfiguration } from "@/data/types.ts";


export interface ScanOptions {
    targets: string[];
}


export const DATA_SERVICE_KEY = Symbol();

/**
 *
 */
export class DataService {


    readonly scanEntry$ = new Observable<string>(subject => {
        const releaseFn = window.electronAPI.onScanEntry(entry => {
            subject.next(entry);
        });
        return releaseFn;
    }).pipe(shareReplay({refCount: true, bufferSize: 1}));

    constructor() {

    }


    // ui4
    getConfig() {
        return window.electronAPI.getConfig();
    }

    setConfig(config: AppConfiguration) {
        return window.electronAPI.setConfig(config);
    }

    getSystemExcluded() {
        return window.electronAPI.getSystemExcluded();
    }

    selectFolder() {
        return window.electronAPI.selectFolder();
    }

    startScan(config: AppConfiguration) {
        window.electronAPI.startScan({targets: config.targets, exclude: config.exclude});
    }

    stopScan() {
        return window.electronAPI.stopScan();
    }

}

export interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
}
