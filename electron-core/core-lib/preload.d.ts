import { ExportClient, ExportOptions, ScanConfiguration, TorrentMapping, TorrentScannerStats, } from "./types";

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

    scanStart: (opts: { targets: string[], exclude?: string[], followSymlinks?: boolean }) => MyCallable;
    onScanEntry: MyEvent<string>;
    onScanStats: MyEvent<TorrentScannerStats>;
    onScanFinished: MyEventOnce<void>;
    scanStop: MyCallable;

    getMappings: MyCallable<void, TorrentMapping[]>;
    setMappings: MyCallable<TorrentMapping[], void>;

    exportGetClients: MyCallable<void, ExportClient[]>;
    exportGetParameters: MyCallable<void, ExportOptions>;
    exportSetParameters: MyCallable<ExportOptions, void>;
    exportStart: MyCallable<void>;
    onExportLog: MyEvent<string>;
    onExportProgress: MyEvent<{ total: number, completed: number }>;
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




