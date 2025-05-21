import {TorrentScanner} from 'tlookup';

/**
 * @param options
 */
export function handleScan(options) {
    console.log('[handleScan]', options);
}

/**
 * @param {object} options
 * @param {string[]} options.targets
 * @returns {Promise<void>}
 */
export function scanFolder(options) {
    const scanner = new TorrentScanner({
        target: options.targets || [],
    });


    function _onProgress(entry) {
        if (entry.isTorrent) {
            console.log('Torrent file found:', entry.location);
        } else {
            // logger.logLOP(entry.location);
            console.log('progress:', entry.location);
        }
    }

// SCAN
    scanner.onEntry.subscribe(_onProgress);

    return scanner.run().then(() => {
        console.log('Scanned %s files, found %s torrent files', scanner.stats.files, scanner.stats.torrents);
    }).catch((e) => {
        throw e;
    });
}
