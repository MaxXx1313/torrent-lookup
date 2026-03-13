/**
 * events:
 *   scan:get-config
 *   scan:set-config
 */
export interface ScanConfiguration {
    targets?: string[];
    exclude?: string[];
    followSymlinks?: boolean;
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

/**
 *
 */
export interface TorrentMapping {
    torrentContentHash: string;
    torrentLocation: string; // torrent location
    // location of duplicates. Also contains original location
    torrentAlternateLocations: string[];

    /**
     * highest score option from {@link saveToOptions}
     */
    saveTo: TorrentMappingSaveLocation; // absolute file location
    saveToOptions: TorrentMappingSaveLocation[]; // another options (any path which has at least one file from the torrent)

    isDisabled?: boolean;
}


/**
 *
 */
export interface TorrentMappingSaveLocation {
    saveTo: string; // absolute file location

    /**
     * custom score. The highter - the more likelythe path is correct
     * Min: 0
     * Max: filesWanted.length + filesUnwanted.length
     */
    score: number;

    /**
     * Relative path of files to be downloaded
     * ({@link TorrentFileInfo.tFolder} + {@link TorrentFileInfo.tFilename})
     */
    filesWanted: string[];
    filesUnwanted: string[];
}

export type ExportClient = 'transmission' | string;

// export options can vary based on client
export interface ExportOptions {
    username: string;
    password: string;
    port: number;
    startPaused?: boolean;

    [key: string]: string | number | boolean | undefined;
}


export interface LogMessage {
    level: 'log' | 'error';
    message: string;
}

export interface ExportStats {
    total: number;
    completed: number;
    percentage: number;
    currentTarget: string;
}