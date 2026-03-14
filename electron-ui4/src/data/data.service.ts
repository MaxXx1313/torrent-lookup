import { Observable, shareReplay } from 'rxjs';
import type { ScanConfiguration, TorrentMapping, TorrentScannerStats, TransmissionOptions } from "@/data/types.ts";
import type { MyEvent } from "../../../electron-core/core-lib/preload";
import type { ExportClient, ExportStats, LogMessage } from "../../../electron-core/core-lib/types.ts";


export const DATA_SERVICE_KEY = Symbol();

/**
 *
 */
export class DataService {

    readonly scanEntry$ = _observableFromElectron<string>(window.electronAPI.onScanEntry);
    readonly scanStats$ = _observableFromElectron<TorrentScannerStats>(window.electronAPI.onScanStats);
    readonly scanFinished$ = _observableFromElectron<void>(window.electronAPI.onScanFinished);
    readonly exportLogs$ = _observableFromElectron<LogMessage>(window.electronAPI.onExportLog);
    readonly onExportProgress$ = _observableFromElectron<ExportStats>(window.electronAPI.onExportProgress);

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

    resetSession() {
        return window.electronAPI.resetSession();
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


    exportGetClients(): Promise<ExportClient[]> {
        return window.electronAPI.exportGetClients();
    }

    exportGetParameters(client: ExportClient): Promise<TransmissionOptions> {
        return window.electronAPI.exportGetParameters(client);
    }

    exportSetParameters(client: ExportClient, options: TransmissionOptions): Promise<void> {
        return window.electronAPI.exportSetParameters(client, options);
    }

    exportVerifyParameters(client: ExportClient, options: TransmissionOptions): Promise<boolean> {
        return window.electronAPI.exportVerifyParameters(client, options)
            .catch(e => false);
    }

    exportStart(client: ExportClient, options: TransmissionOptions): Promise<void> {
        return window.electronAPI.exportStart(client, options);
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