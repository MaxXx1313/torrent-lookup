import {TorrentScanner} from 'tlookup';


/**
 * @param {object} mainWindow
 * @param {object} options
 * @param {string[]} options.targets
 * @returns {Promise<void>}
 */
export function scanFolder(mainWindow, options) {
    const scanner = new TorrentScanner({
        target: options.targets || [],
    });


    function _onProgress(entry) {
        if (entry.isTorrent) {
            console.log('scan:found', entry.location);
            mainWindow.webContents.send('scan:found', entry.location);
        } else {
            // logger.logLOP(entry.location);
            console.log('scan:progress:', entry.location);
            mainWindow.webContents.send('scan:progress', entry.location);
        }
    }

// SCAN
    scanner.onEntry.subscribe(_onProgress);

    console.log('scan started', options.targets);
    return scanner.run().then(() => {
        console.log('Scanned %s files, found %s torrent files', scanner.stats.files, scanner.stats.torrents);
    }).catch((e) => {
        throw e;
    });
}
