/**
 *
 */
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

export interface TorrentMapping {
    torrent: string; // torrent location
    saveTo: string; // absolute file location
    saveToOptions?: string[]; // another options (any path which has at least one file from the torrent)
}