import {Analyzer, Info, PushManager, TorrentScanner} from "tlookup";

/**
 * @param {MyEventBus} ipcMain
 */
export function scanLogic(ipcMain) {

    let _mappings = [];

    const scanner = new TorrentScanner();
    const analyzer = new Analyzer();
    const info = new Info();
    const pushManager = new PushManager();

    let _exportParameters = {
        username: 'admin',
        password: 'admin',
        port: 9091,
    }

    // load mappings
    info.getMapping().then(m => {
        _mappings = m || [];
    });

    scanner.onEntry.subscribe((entry) => {
        // ipcMain.emit('scan:entry', entry.location);
        ipcMain.emit('scan:entry', entry.location);
        ipcMain.emit('scan:stats', scanner.stats);
    });

    pushManager.opStatus$.subscribe((msg) => {
        ipcMain.emit('export:log', msg);
    });

    /**
     * Start scanning process
     */
    ipcMain.handle('scan:start', async (event, config) => {
        const targets = config?.targets || [];
        const exclude = config?.exclude || [];

        await scanner.terminate();

        scanner.clearExclusion();
        scanner.addExclusion(exclude);

        return scanner.run(targets)
            .then(() => analyzer.analyze())
            .then(mappings => {
                _mappings = mappings;
            })
            .finally(() => {
                ipcMain.emit('scan:finished');
            });
    });

    /**
     * Stop scanning process
     */
    ipcMain.handle('scan:stop', async () => {
        await scanner.terminate();
    });

    /**
     *
     */
    ipcMain.handle('export:get-user-decision', async () => {
        return _mappings || [];
    });

    /**
     *
     */
    ipcMain.handle('export:set-user-decision', async (event, mappings) => {
        _mappings = mappings || [];
    });


    /**
     *
     */
    ipcMain.handle('export:get-parameters', async () => {
        return _exportParameters;
    });

    /**
     *
     */
    ipcMain.handle('export:set-parameters', async (event, options) => {
        _exportParameters = options;
        const transmissionOptions = {
            endpoint: `http://${options.username}:${options.password}@localhost:${options.port}`,
        }
        pushManager.setClient('transmission', transmissionOptions);
    });
    /**
     *
     */
    ipcMain.handle('export:push', async () => {
        const mappingsActive = (_mappings || []).filter(m => !m.isDisabled);
        if (!mappingsActive?.length) {
            return Promise.reject('Nothing to push');
        }

        const total = mappingsActive.length;
        ipcMain.emit('export:push-progress', {total, completed: 0});
        for (let i = 0; i < mappingsActive.length; i++) {
            const torrentMapping = mappingsActive[i];
            await pushManager.push(torrentMapping.torrent, torrentMapping.saveTo);
            ipcMain.emit('export:push-progress', {total, completed: i + 1});
        }
    });

}