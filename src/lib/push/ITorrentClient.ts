/**
 *
 */
export interface ITorrentClient {

    /**
     * @param {string} filename  absolute location of torrent file
     * @param downloadDir   absolute location of download folder (without target filename)
     */
    push(filename: string, downloadDir: string): Promise<PushResult>;

    /**
     * @return true if the torrent client is available (still might be not configured properly)
     */
    // isInstalled(): Promise<boolean>;
}

export interface PushResult {
    id: string;
    isNew: boolean;
}