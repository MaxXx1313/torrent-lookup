import { CliOptions } from './CliOptions.js';
import * as assert from 'assert';
import { debounce } from '../lib/utils/tools.js';
import { TorrentScanner, TorrentScannerEntry } from '../lib/scan/TorrentScanner.js';
import { ConsoleProgress } from './ConsoleProgress.js';


/**
 *
 */
export function cliScanFiles(options: CliOptions): Promise<any> {
    assert.ok(options.target, 'target must be specified');

    const logger = new ConsoleProgress();
    const logDebounced = debounce(function (str) {
        logger.logLOP(str);
    }, 1000);

    //
    const scanner = new TorrentScanner({
        workdir: options.tmp,
        target: options.target,
        maxFps: options.fps,
        onEntry: (entry: TorrentScannerEntry) => {
            if (entry.isTorrent) {
                logger.log('Torrent file found:', entry.location);
            } else {
                logger.logLOP(entry.location);
                // logDebounced(entry.location);
            }
        },
    });

    // SCAN
    logger.startLOP();
    return scanner.run().then(() => {
        logger.stopLOP();
        logger.log('Scanned %s files, found %s torrent files', scanner.stats.files, scanner.stats.torrents);
    }).catch((e) => {
        logger.stopLOP();
        throw e;
    });
}
