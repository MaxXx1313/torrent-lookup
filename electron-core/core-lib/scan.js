import {TorrentScanner} from 'tlookup';
import {dialog} from 'electron';

const reportDebounceTime = 300;

export class Scanner {

    scanner = new TorrentScanner();


    /**
     * @param myBridge
     */
    constructor(myBridge) {

        myBridge.on('scan:start', (data) => {
            return this.startScan(data);
        });
        myBridge.on('scan:stop', (data) => {
            return this.stopScan(data);
        });
        myBridge.handle('scan:select-folder', (data) => {
            return this.selectFolder();
        });


        this.scanner.onEntry.subscribe(_onProgress);

        let _lastReport = 0;

        function _onProgress(entry) {
            if (entry.isTorrent) {
                myBridge.send('scan:found', entry.location);
            } else {

                // debounce logic
                const now = Date.now();
                if (now - _lastReport < reportDebounceTime) {
                    return;
                }
                _lastReport = now;

                myBridge.send('scan:progress', entry.location);
            }
        }
    }

    /**
     *
     */
    windowCreated() {

    }

    /**
     *
     */
    stopScan() {
        this.scanner.terminate();
    }

    /**
     *
     */
    async selectFolder() {
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


    /**
     * @param {object} options
     * @param {string[]} options.targets
     * @returns {Promise<void>}
     */
    startScan(options) {
        this.scanner.addTarget(options.targets || []);

        console.log('[scan] started', options.targets);
        return this.scanner.run().then(() => {
            console.log('Scanned %s files, found %s torrent files', this.scanner.stats.files, this.scanner.stats.torrents);
        }).catch((e) => {
            throw e;
        });
    }

}


