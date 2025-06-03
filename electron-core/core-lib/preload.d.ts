export interface IElectronAPI {
    scan: (opts: { targets: string | string[] }) => Promise<void>,
    stopScan: () => void,
    selectFolder: () => Promise<string | string[] | null>,
    onScanProgress: MyEventBinding<string>,
    onScanStatus: MyEventBinding<'idle' | 'scan' | 'analyze' | 'export'>,
    onScanFound: MyEventBinding<string>,
    openDevTools: () => void,

    onAnalyzeResults: MyEventBinding<TorrentMapping[]>,
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


interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
}
