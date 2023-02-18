import { CliOptions } from './CliOptions';
import * as assert from 'assert';
import { debounce } from '../lib/utils/tools';
import { TorrentScanner, TorrentScannerEntry } from '../lib';

const LopConsole = require('./LopConsole');
const logger = new LopConsole();


/**
 *
 */
export function cliScanFiles(options: CliOptions): Promise<any> {
    assert.ok(options.target, 'target must be specified');

    const logDebounced = debounce(function (str) {
        logger.logLOP(str);
    }, 1000);

    function _onProgress(entry: TorrentScannerEntry) {
        if (entry.isTorrent) {
            logger.log('Torrent file found:', entry.location);
        } else {
            // logger.logLOP(entry.location);
            logDebounced(entry.location);
        }
    }


    //
    const scanner = new TorrentScanner({
        target: options.target,
        workdir: options.tmp
    });

    // SCAN
    scanner.onEntry.subscribe(_onProgress);

    logger.startLOP('scanning');
    return scanner.run().then(() => {
        logger.stopLOP();
        logger.log('Scanned %s files, found %s torrent files', scanner.stats.files, scanner.stats.torrents);
    }).catch((e) => {
        logger.stopLOP();
        throw e;
    });
}
