


/**
 *
 */
export abstract class TorrentClientAdapter {

  abstract push(filename, downloadDir): Promise<any>;


}