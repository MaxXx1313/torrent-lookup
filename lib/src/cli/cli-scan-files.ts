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
        maxFps: options.fps,
        onEntry: (entry: TorrentScannerEntry) => {
            if (entry.isTorrent) {
                logger.log('Torrent file found:', entry.location);
            } else {
                const fpsPrefix = scanner.stats.filesPerSecond >= 0 ? `(${scanner.stats.filesPerSecond} f/s) ` : '';
                logger.logLOP(fpsPrefix + entry.location);
                // logger.log(`(${scanner.stats.filesPerSecond} f/s) ` + entry.location);
            }
        },
    });

    // SCAN
    logger.startLOP();
    return scanner.run(options.target).then(() => {
        logger.stopLOP();
        logger.log('Scanned %s files, found %s torrent files', scanner.stats.files, scanner.stats.torrents);
    }).catch((e) => {
        logger.stopLOP();
        throw e;
    });
}
