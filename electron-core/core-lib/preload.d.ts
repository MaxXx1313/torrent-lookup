import { AppConfiguration, TorrentScannerStats } from "./types";

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

    startScan: (opts: { targets: string[], exclude?: string }) => Promise<void>;
    onScanEntry: MyEvent<string>;
    onScanStats: MyEvent<TorrentScannerStats>;
    stopScan: () => void;

}


/**
 * return unsubscribe function
 */
type MyEvent<T> = (callback: (arg: T) => void) => () => void;

interface MyCallable {
    <O>(): Promise<O>;

    <T1, O>(arg1: T1): Promise<O>;

    <T1, T2, O>(arg1: T1, arg2: T2): Promise<O>;
}



