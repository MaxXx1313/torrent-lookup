/**
 * events:
 *   scan:get-config
 *   scan:set-config
 */
export interface ScanConfiguration {
    targets?: string[];
    exclude?: string[];
}

/**
 * @deprecated use ScanConfiguration
 */
export interface AppConfiguration {

}

/**
 *
 */
export interface TorrentScannerStats {
    /**
     * Arbitrary (not a torrent) files found
     */
    files: number;

    /**
     * Torrent files found
     */
    torrents: number;


    filesPerSecond: number;
}

export interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
    saveToOptions?: string[]; // another options (any path which has at least one file from the torrent)
    isDisabled?: boolean;
}

export interface TransmissionOptions {
    username: string;
    password: string;
    port: number;
}