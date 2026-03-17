import {Analyzer, PushManager, SCAN_EXCLUDE_DEFAULT, TorrentScanner} from "tlookup";
import Store from "electron-store";
import {app} from "electron";
import * as path from "node:path";

/**
 * @param {MyEventBus} ipcMain
 */
export function scanLogic(ipcMain) {

    const store = new Store();

    const STORE_ROOT = app.getPath('userData');
    const WORKDIR = path.join(STORE_ROOT, 'scan-data');

    const SCAN_CONFIG_KEY = 'scan-config';

    /////////////////
    // Scan config
    ipcMain.handle('app:get-scan-config', async () => {
        try {
            return store.get(SCAN_CONFIG_KEY);
        } catch (e) {
            console.warn(e);
            return null;
        }
    });

    ipcMain.handle('app:set-scan-config', async (config) => {
        const configToSave = {
            targets: config?.targets || [],
            exclude: config?.exclude || [],
            followSymlinks: !!config?.followSymlinks,
        };
        return store.set(SCAN_CONFIG_KEY, configToSave);
    });


    ipcMain.handle('app:get-system-excluded', async () => {
        return SCAN_EXCLUDE_DEFAULT;
    });

    // TODO: add method to verify exclusion and targets
    // TODO: (lib) add way to track single target progress

    /////////////////
    // Scan logic
    const MAP_CONFIG_KEY = 'mapping-config';

    /**
     * @type {TorrentScanner | null}
     */
    let scanner;


    const analyzer = new Analyzer({
        workdir: WORKDIR,
    });

    /**
     * @type {TorrentMapping[] | null}
     * @private
     */
    let _mappingCache = null;

    /**
     *
     */
    ipcMain.handle('scan:is-active', async () => {
        return !!scanner;
    });


    /**
     * Start scanning process
     */
    ipcMain.handle('scan:start', async (config) => {
        const targets = config?.targets || [];
        const exclude = config?.exclude || [];
        const followSymLinks = !!config?.followSymlinks;

        if (scanner) {
            throw new Error('Scanning already started');
        }

        scanner = new TorrentScanner({
            workdir: WORKDIR,
            exclude,
            skipSystemExclude: false,
            followSymLinks,
            // maxFps: 100,
        });

        scanner.onEntry.subscribe((entry) => {
            ipcMain.emit('scan:entry', entry.location);
            ipcMain.emit('scan:stats', scanner.stats);
        });

        return scanner.run(targets)
            .then(() => analyzer.analyze())
            .then(mappings => {
                _mappingCache = mappings;
                return store.set(MAP_CONFIG_KEY, mappings);
            })
            .finally(() => {
                scanner = null;
                ipcMain.emit('scan:finished');
            });
    });

    /**
     * Stop scanning process
     */
    ipcMain.handle('scan:stop', async () => {
        if (scanner) {
            await scanner.terminate();
            scanner = null;
        }
    });

    /////////////////
    // Results logic
    /**
     *
     */
    ipcMain.handle('export:get-mapping', async () => {
        return _getMappingData();
    });

    function _getMappingData() {
        if (_mappingCache === null) {
            _mappingCache = store.get(MAP_CONFIG_KEY);
        }
        return _mappingCache;
    }

    /**
     *
     */
    ipcMain.handle('export:set-mapping', async (mappings) => {
        _mappingCache = mappings;
        return store.set(MAP_CONFIG_KEY, mappings);
    });


    /////////////////
    // Export config logic

    const EXPORT_CONFIG_PREFIX = 'export-';
    /**
     *
     */
    ipcMain.handle('export:get-clients', async () => {
        return ['transmission'];
    });

    /**
     *
     */
    ipcMain.handle('export:get-parameters', async (client) => {
        if (!client) {
            throw new Error('Client not passed');
        }
        const clientLc = client.toLowerCase();

        return store.get(EXPORT_CONFIG_PREFIX + clientLc) || _getDefaultParameters(client);
    });

    /**
     *
     */
    ipcMain.handle('export:set-parameters', async (client, options) => {
        if (!client) {
            throw new Error('Client not passed');
        }
        const clientLc = client.toLowerCase();

        return store.set(EXPORT_CONFIG_PREFIX + clientLc, options);
    });

    /**
     *
     */
    ipcMain.handle('export:verify-parameters', async (client, options) => {
        if (!client) {
            throw new Error('Client not passed');
        }
        let pushManagerVerify = new PushManager({
            workdir: WORKDIR,
        });
        const transmissionOptions = {
            endpoint: `http://${options.username}:${options.password}@localhost:${options.port}`,
        }

        pushManagerVerify.setClient(client, transmissionOptions);

        return pushManagerVerify.ping();
    });


    /////////////////
    // Export logic

    /**
     * @type {PushManager | null}
     */
    let pushManager;
    let _exportLogs = [];
    let _exportIsFinished = false;

    /**
     *
     */
    ipcMain.handle('export:reset', async (config) => {
        if (pushManager) {
            await pushManager.terminate();
            pushManager = null;
        }
        _exportLogs = [];
        _exportIsFinished = false;
    });

    /**
     *
     */
    ipcMain.handle('export:start', async (client, options) => {

        if (pushManager) {
            console.log('export already started');
            if (_exportIsFinished) {
                ipcMain.emit('export:finished');
            }
            return;
            ///////
        }
        _exportIsFinished = false;
        pushManager = new PushManager({
            workdir: WORKDIR,
        });
        const transmissionOptions = {
            endpoint: `http://${options.username}:${options.password}@localhost:${options.port}`,
        }

        pushManager.setClient(client, transmissionOptions);

        pushManager.opStatus$.subscribe((msg) => {
            const logData = {level: 'log', message: msg, ts: Date.now()};
            _exportLogs.push(logData);
            ipcMain.emit('export:log', logData);
        });
        pushManager.opError$.subscribe((msg) => {
            const logData = {level: 'error', message: msg, ts: Date.now()};
            _exportLogs.push(logData);
            ipcMain.emit('export:log', logData);
        });

        pushManager.status$.subscribe((status) => {
            ipcMain.emit('export:progress', status);
        });


        const mappingsActive = (_getMappingData() || []).filter(m => !!m.saveTo && !m.isDisabled);
        if (!mappingsActive?.length) {
            return Promise.reject('Nothing to push');
        }


        await pushManager.pushMapping(mappingsActive);

        // on complete
        const logData = {level: 'log', message: 'Finished', ts: Date.now()};
        _exportLogs.push(logData);
        ipcMain.emit('export:log', logData);

        ipcMain.emit('export:finished');
        _exportIsFinished = true;

    });

    ipcMain.handle('export:get-logs', async () => {
        return _exportLogs;
    });
}

/**
 * @param {string} client
 * @private
 */
function _getDefaultParameters(client) {

    switch (client) {
        case 'transmission':
            return {
                username: 'admin',
                password: 'admin',
                port: 9091,
            };
        case 'json':
            return {
                exportPath: '~',
            };
        default:
            return {};
    }
}