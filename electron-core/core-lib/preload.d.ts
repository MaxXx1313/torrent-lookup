import { AppConfiguration, TorrentMapping, TorrentScannerStats, TransmissionOptions } from "./types";

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}

export interface IElectronAPI {
    openDevTools: () => void;
    // appReady: () => void;

    // ui4
    getConfig: MyCallable<AppConfiguration>;
    setConfig: MyCallable<AppConfiguration>;
    getSystemExcluded: MyCallable<void, string[]>;
    selectFolder: MyCallable<void, string[] | null>;

    scanStart: (opts: { targets: string[], exclude?: string[] }) => MyCallable;
    onScanEntry: MyEvent<string>;
    onScanStats: MyEvent<TorrentScannerStats>;
    onScanFinished: MyEventOnce<void>;
    scanStop: MyCallable<void>;

    setUserMappings: MyCallable<TorrentMapping[], void>;
    getUserMappings: MyCallable<void, TorrentMapping[]>;

    exportGetParameters: MyCallable<void, TransmissionOptions>;
    exportSetParameters: MyCallable<TransmissionOptions, void>;
    exportStart: MyCallable<void>;
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

/**
 *
 */
type MyCallable<T = void, R = void> = (arg1: T) => Promise<R>;




