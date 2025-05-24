import {TorrentScanner} from 'tlookup';
import {dialog} from 'electron';


/**
 * @param {object} mainContext
 * @param {object} options
 * @param {string[]} options.targets
 * @returns {Promise<void>}
 */
export function scanFolder(mainContext, options) {
    const scanner = new TorrentScanner({
        target: options.targets || [],
    });


    function _onProgress(entry) {
        if (entry.isTorrent) {
            console.log('scan:found', entry.location);
            mainContext.send('scan:found', entry.location);
        } else {
            // logger.logLOP(entry.location);
            console.log('scan:progress:', entry.location);
            mainContext.send('scan:progress', entry.location);
        }
    }

// SCAN
    scanner.onEntry.subscribe(_onProgress);

    console.log('[scan] started', options.targets);
    return scanner.run().then(() => {
        console.log('Scanned %s files, found %s torrent files', scanner.stats.files, scanner.stats.torrents);
    }).catch((e) => {
        throw e;
    });
}

/**
 *
 */
export async function selectFolder() {
    console.log('[scan] selectFolder');
    const results = await dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections', 'dontAddToRecent'],
    });
    console.debug('[scan] selectFolder results', results);
    if (results.canceled) {
        return null;
    } else {
        return results.filePaths || null;
    }
}

