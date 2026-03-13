/**
 *
 */
export interface ITorrentClient {

    ping(): Promise<boolean>;

    /**
     * @param {string} filename  absolute location of torrent file
     * @param {string} downloadDir   absolute location of download folder (without target filename)
     * @param {string[]} filesWanted   relative path to files from 'downloadDir', which should be marked as files to download
     */
    push(filename: string, downloadDir: string, filesWanted: string[]): Promise<PushResult>;

    /**
     * @return true if the torrent client is available (still might be not configured properly)
     */
    // isInstalled(): Promise<boolean>;
}

export interface PushResult {
    id: string | number;
    isNew: boolean;
}
