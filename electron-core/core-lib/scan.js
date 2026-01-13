import {TorrentScanner} from "tlookup";

export function scanLogic(ipcMain, mainWindow) {

    const scanner = new TorrentScanner();

    scanner.onEntry.subscribe((entry) => {
        // ipcMain.emit('scan:entry', entry.location);
        mainWindow.webContents.send('scan:entry', entry.location);
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

        scanner.run();
    });

    /**
     * Stop scanning process
     */
    ipcMain.handle('scan:stop', async () => {
        await scanner.terminate();
    });

}