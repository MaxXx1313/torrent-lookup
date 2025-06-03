import {Analyzer, TorrentScanner} from 'tlookup';
import {dialog} from 'electron';

const reportDebounceTime = 300;

export class Scanner {

    scanner = new TorrentScanner();

    _myBridge;
    _decision;

    _status = 'idle';

    /**
     * @param myBridge
     */
    constructor(myBridge) {
        this._myBridge = myBridge;

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

        let _lastReportTime = 0;

        function _onProgress(entry) {
            if (entry.isTorrent) {
                myBridge.send('scan:found', entry.location);
            } else {

                // debounce logic
                const now = Date.now();
                if (now - _lastReportTime < reportDebounceTime) {
                    return;
                }
                _lastReportTime = now;

                myBridge.send('scan:progress', entry.location);
            }
        }


        this._myBridge.on('app:ready', () => {
            this._myBridge.send('scan:status', this._status);
            if (this._decision) {
                this._myBridge.send('analyze:decision', this._decision);
            }
        });
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
    async startScan(options) {
        if (this.scanner.isRunning()) {
            console.log('[scan] already started');
            return;
        }

        await this.scanner.terminate();
        this.scanner.addTarget(options.targets || []);
        this._decision = null;

        console.log('[scan] started', options.targets);
        this._setStatus('scan');
        return this.scanner.run().then(() => {
            console.log('Scanned %s files, found %s torrent files', this.scanner.stats.files, this.scanner.stats.torrents);
        }).then(() => {
            this._setStatus('analyze');
            const analyzer = new Analyzer();
            return analyzer.analyze().then(() => {
                this._decision = analyzer.getDecision();
                this._myBridge.send('analyze:decision', this._decision);
                return this._decision;
            });
        }).catch((e) => {
            throw e;
        }).finally(() => {
            this._setStatus('idle');
        });
    }

    _setStatus(status) {
        this._status = status;
        this._myBridge.send('scan:status', this._status);
    }

}


