import { Observable, shareReplay } from 'rxjs';
import type { AppConfiguration, TorrentScannerStats } from "@/data/types.ts";


export interface ScanOptions {
    targets: string[];
}


export const DATA_SERVICE_KEY = Symbol();

/**
 *
 */
export class DataService {

    readonly scanEntry$ = _observableFromElectron<string>(window.electronAPI.onScanEntry);
    readonly scanStats$ = _observableFromElectron<TorrentScannerStats>(window.electronAPI.onScanStats);

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

////
type MyEvent<T> = (callback: (arg: T) => void) => () => void;

function _observableFromElectron<T>(electronMethod: MyEvent<T>): Observable<T> {
    return new Observable<T>(subject => {
        const releaseFn = electronMethod(entry => {
            subject.next(entry);
        });
        return releaseFn;
    }).pipe(shareReplay({refCount: true, bufferSize: 1}));
}