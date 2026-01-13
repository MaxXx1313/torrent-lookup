interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
}


export interface AppConfiguration {
    targets?: string[];
    exclude?: string[];
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
}