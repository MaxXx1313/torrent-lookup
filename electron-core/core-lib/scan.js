import {Analyzer, Info, PushManager, TorrentScanner} from "tlookup";

export function scanLogic(ipcMain, mainWindow) {

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
        mainWindow.webContents.send('scan:entry', entry.location);
        mainWindow.webContents.send('scan:stats', scanner.stats);
    });

    pushManager.opStatus$.subscribe((msg) => {
        mainWindow.webContents.send('export:log', msg);
    });

    /**
     * Start scanning process
     */
    ipcMain.handle('scan:start', async (event, config) => {
        const targets = config?.targets || [];
        const exclude = config?.exclude || [];

        await scanner.terminate();

        scanner.clearTargets();
        scanner.clearExclusion();

        scanner.addTarget(targets);
        scanner.addExclusion(exclude);

        scanner.run()
            .then(() => analyzer.analyze())
            .then(mappings => {
                _mappings = mappings;
            })
            .finally(() => {
                mainWindow.webContents.send('scan:finished');
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
    ipcMain.handle('export:set-user-decision', async (event, mappings) => {
        _mappings = mappings || [];
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
        await pushManager.pushCustomMatch(mappingsActive);
    });

}