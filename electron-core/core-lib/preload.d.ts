import { AppConfiguration, TorrentMapping, TorrentScannerStats, TransmissionOptions } from "./types";

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}

export interface IElectronAPI {
    openDevTools: () => void;
    appReady: () => void;

    // ui4
    getConfig: MyCallable<AppConfiguration>;
    setConfig: MyCallable<AppConfiguration>;
    getSystemExcluded: MyCallable<string[]>;
    selectFolder: () => Promise<string[] | null>;

    scanStart: (opts: { targets: string[], exclude?: string }) => Promise<void>;
    onScanEntry: MyEvent<string>;
    onScanStats: MyEvent<TorrentScannerStats>;
    onScanFinished: MyEventOnce<void>;
    scanStop: MyCallable<void>;

    setUserMappings: MyCallable<TorrentMapping[], void>;
    getUserMappings: MyCallable<TorrentMapping[]>;

    exportStart: MyCallable<TransmissionOptions, void>;
    onExportLog: MyEvent<string>;
}


/**
 * return unsubscribe function
 */
type MyEvent<T> = (callback: (arg: T) => void) => () => void;
/**
 * return unsubscribe function
 * Event happens just once
 */
type MyEventOnce<T> = (callback: (arg: T) => void) => () => void;

interface MyCallable {
    <O>(): Promise<O>;

    <T1, O>(arg1: T1): Promise<O>;

    <T1, T2, O>(arg1: T1, arg2: T2): Promise<O>;
}



