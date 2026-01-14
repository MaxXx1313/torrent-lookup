import {Analyzer, Info, TorrentScanner} from "tlookup";

export function scanLogic(ipcMain, mainWindow) {

    let _mappings = [];

    const scanner = new TorrentScanner();
    const analyzer = new Analyzer();
    const info = new Info();

    // load mappings
    info.getMapping().then(m => {
        _mappings = m || [];
    });

    scanner.onEntry.subscribe((entry) => {
        // ipcMain.emit('scan:entry', entry.location);
        mainWindow.webContents.send('scan:entry', entry.location);
        mainWindow.webContents.send('scan:stats', scanner.stats);
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

}