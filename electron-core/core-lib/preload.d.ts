import {
    ExportClient,
    ExportOptions,
    LogMessage,
    ScanConfiguration,
    TorrentMapping,
    TorrentScannerStats,
} from "./types";

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}

export interface IElectronAPI {
    openDevTools: () => void;
    // appReady: () => void;

    // ui4
    getConfig: MyCallable<void, ScanConfiguration>;
    setConfig: MyCallable<ScanConfiguration>;
    getDefaultLocations: MyCallable<void, string[]>;
    getSystemExcluded: MyCallable<void, string[]>;
    selectFolders: MyCallable<void, string[] | null>;

    scanStart: (opts: ScanConfiguration) => MyCallable;
    onScanEntry: MyEvent<string>;
    onScanStats: MyEvent<TorrentScannerStats>;
    onScanFinished: MyEventOnce<void>;
    scanStop: MyCallable;

    getMappings: MyCallable<void, TorrentMapping[]>;
    setMappings: MyCallable<TorrentMapping[], void>;

    exportGetClients: MyCallable<void, ExportClient[]>;
    exportGetParameters: MyCallable<ExportClient, ExportOptions>;
    exportSetParameters: MyCallable2<ExportClient, ExportOptions, void>;
    exportStart: MyCallable2<ExportClient, ExportOptions, void>;
    onExportLog: MyEvent<LogMessage>;
    onExportProgress: MyEvent<{ total: number, completed: number }>;
}


/**
 * return unsubscribe function
 */
export type MyEvent<T> = (callback: (arg: T) => void) => () => void;
/**
 * return unsubscribe function
 * Event happens just once
 */
export type MyEventOnce<T> = (callback: (arg: T) => void) => () => void;

/**
 *
 */
export type MyCallable<T = void, R = void> = (arg1: T) => Promise<R>;
export type MyCallable2<T1, T2, R = void> = (arg1: T1, arg2: T2) => Promise<R>;




