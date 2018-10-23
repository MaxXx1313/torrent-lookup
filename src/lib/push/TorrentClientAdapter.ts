/**
 *
 */
export interface ITorrentClient {

    /**
     * @param {string} filename  absolute location of torrent file
     * @param downloadDir   absolute location of download folder (without target filename)
     */
    push(filename: string, downloadDir: string): Promise<PushResult>;
}

export interface PushResult {
    id: string;
    isNew: boolean;
}