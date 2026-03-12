import { Observable, shareReplay } from 'rxjs';
import type { ScanConfiguration, TorrentMapping, TorrentScannerStats, TransmissionOptions } from "@/data/types.ts";
import type { MyEvent } from "../../../electron-core/core-lib/preload";


export const DATA_SERVICE_KEY = Symbol();

/**
 *
 */
export class DataService {

    readonly scanEntry$ = _observableFromElectron<string>(window.electronAPI.onScanEntry);
    readonly scanStats$ = _observableFromElectron<TorrentScannerStats>(window.electronAPI.onScanStats);
    readonly scanFinished$ = _observableFromElectron<void>(window.electronAPI.onScanFinished);
    readonly exportLogs$ = _observableFromElectron<string>(window.electronAPI.onExportLog);

    constructor() {

    }


    // ui4
    getConfig() {
        return window.electronAPI.getConfig();
    }

    setConfig(config: ScanConfiguration) {
        return window.electronAPI.setConfig(config);
    }

    getSystemExcluded() {
        return window.electronAPI.getSystemExcluded();
    }

    selectFolder() {
        return window.electronAPI.selectFolders();
    }
    getDefaultLocations() {
        return window.electronAPI.getDefaultLocations();
    }


    //
    startScan(config: ScanConfiguration) {
        window.electronAPI.scanStart(config);
    }

    stopScan() {
        return window.electronAPI.scanStop();
    }

    getUserMappings(): Promise<TorrentMapping[]> {
        return window.electronAPI.getMappings();
    }

    saveUserMappings(m: TorrentMapping[]) {
        return window.electronAPI.setMappings(m);
    }


    exportGetParameters(): Promise<TransmissionOptions> {
        return window.electronAPI.exportGetParameters();
    }

    exportSetParameters(options: TransmissionOptions): Promise<void> {
        return window.electronAPI.exportSetParameters(options);
    }

    exportStart(): Promise<void> {
        return window.electronAPI.exportStart();
    }

}

////
function _observableFromElectron<T>(electronMethod: MyEvent<T>): Observable<T> {
    return new Observable<T>(subject => {
        const releaseFn = electronMethod(entry => {
            subject.next(entry);
        });
        return releaseFn;
    }).pipe(shareReplay({refCount: true, bufferSize: 1}));
}