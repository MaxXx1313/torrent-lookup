import {TorrentScanner} from "tlookup";

export function scanLogic(ipcMain) {

    const scanner = new TorrentScanner();

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

}