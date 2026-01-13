import { AppConfiguration } from "./types";

export interface IElectronAPI {
    openDevTools: () => void;
    appReady: () => void;

    stopScan: () => void;
    onScanProgress: MyEventBinding<string>;
    onStatus: MyEventBinding<'idle' | 'scan' | 'analyze' | 'export'>;
    onScanFound: MyEventBinding<string>;

    onAnalyzeResults: MyEventBinding<TorrentMapping[]>;

    // ui4
    getConfig: MyCallable<AppConfiguration>;
    setConfig: MyCallable<AppConfiguration>;
    getSystemExcluded: MyCallable<string[]>;
    selectFolder: () => Promise<string[] | null>;

    scan: (opts: { targets: string[], exclude?: string }) => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}


/**
 * return unsubscribe function
 */
type MyEventBinding<T> = (callback: (arg: T) => void) => () => void;

interface MyCallable {
    <O>(): Promise<O>;

    <T1, O>(arg1: T1): Promise<O>;

    <T1, T2, O>(arg1: T1, arg2: T2): Promise<O>;
}

interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
}


