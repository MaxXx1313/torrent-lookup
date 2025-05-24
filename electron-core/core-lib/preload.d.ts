export interface IElectronAPI {
    scan: (opts: { targets: string | string[] }) => Promise<void>,
    selectFolder: () => Promise<string | string[] | null>,
    onScanProgress: (callback: (filepath: string) => void) => void,
    onScanFound: (callback: (filepath: string) => void) => void,
    openDevTools: () => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
