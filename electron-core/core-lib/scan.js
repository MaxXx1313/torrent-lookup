import {Analyzer, PushManager, SCAN_EXCLUDE_DEFAULT, TorrentScanner} from "tlookup";
import Store from "electron-store";
import {app} from "electron";
import * as path from "node:path";
import {timeoutPromise} from "tlookup/dist/lib/utils/tools";

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

    /**
     * @type {TorrentScanner | null}
     */
    let scanner;


    const analyzer = new Analyzer({
        workdir: WORKDIR,
    });

    /////////////////
    // Scan logic
    const MAP_CONFIG_KEY = 'mapping-config';

    /**
     * @type {TorrentMapping[] | null}
     * @private
     */
    let _mappingCache = null;
    /**
     * Start scanning process
     */
    ipcMain.handle('scan:start', async (event, config) => {
        const targets = config?.targets || [];
        const exclude = config?.exclude || [];
        const followSymLinks = !!config?.followSymlinks;

        if (scanner) {
            await scanner.terminate();
        }

        scanner = new TorrentScanner({
            workdir: WORKDIR,
            exclude,
            skipSystemExclude: false,
            followSymLinks,
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
                ipcMain.emit('scan:finished');
                scanner = null;
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
    // Analyze logic
    /**
     *
     */
    ipcMain.handle('export:get-mapping', async () => {
        if (_mappingCache === null) {
            _mappingCache = store.get(MAP_CONFIG_KEY);
        }
        return _mappingCache;
    });

    /**
     *
     */
    ipcMain.handle('export:set-mapping', async (mappings) => {
        _mappingCache = mappings;
        return store.set(MAP_CONFIG_KEY, mappings);
    });


    /////////////////
    // Export logic

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

        return store.get(EXPORT_CONFIG_PREFIX + clientLc);
        // TODO: _getDefaultParameters
    });

    /**
     *
     */
    ipcMain.handle('export:set-parameters', async (client, parameters) => {
        if (!client) {
            throw new Error('Client not passed');
        }
        const clientLc = client.toLowerCase();

        const transmissionOptions = {
            endpoint: `http://${options.username}:${options.password}@localhost:${options.port}`,
        }

        return store.set(EXPORT_CONFIG_PREFIX + clientLc, parameters);
    });


    /**
     * @type {PushManager | null}
     */
    let pushManager;
    /**
     *
     */
    ipcMain.handle('export:start', async (client, parameters) => {

        pushManager = new PushManager({
            workdir: WORKDIR,
        });
        pushManager.setClient(client, parameters);

        pushManager.opStatus$.subscribe((msg) => {
            ipcMain.emit('export:log', msg);
        });
        pushManager.opError$.subscribe((msg) => {
            ipcMain.emit('export:log', msg);
        });


        const mappingsActive = (_mappingCache || []).filter(m => !m.saveTo);
        if (!mappingsActive?.length) {
            return Promise.reject('Nothing to push');
        }

        //
        ipcMain.emit('export:progress', {total: mappingsActive.length, completed: 0});
        for (let i = 0; i < mappingsActive.length; i++) {
            const exportItem = mappingsActive[i];
            await pushManager.push(exportItem.torrentLocation, exportItem.saveTo.saveTo, exportItem.saveTo.filesWanted);
            ipcMain.emit('export:progress', {total: mappingsActive.length, completed: i + 1});
            await timeoutPromise(500); // add some delay to not overwhelm the client
        }
        ipcMain.emit('export:finished');

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