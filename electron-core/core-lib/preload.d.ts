export interface IElectronAPI {
    scan: (opts: { targets: string | string[] }) => Promise<void>,
    stopScan: () => void,
    selectFolder: () => Promise<string | string[] | null>,
    onScanProgress: MyEventBinding<string>,
    onScanStatus: MyEventBinding<boolean>,
    onScanFound: MyEventBinding<string>,
    openDevTools: () => void,
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
