import Store from 'electron-store';
import {dialog} from "electron";
import {SCAN_EXCLUDE_DEFAULT} from "tlookup";

export function appLogic(ipcMain) {

    const store = new Store();


    /**
     * Read app config
     */
    ipcMain.handle('app:get-config', async () => {
        try {
            return store.get('config');
        } catch (e) {
            console.warn(e);
            return {};
        }
    });

    ipcMain.handle('app:get-system-excluded', async () => {
        return SCAN_EXCLUDE_DEFAULT;
    });

    /**
     * Write app config
     */
    ipcMain.handle('app:set-config', async (event, config) => {
        const targets = config?.targets || [];
        const exclude = config?.exclude || [];
        return store.set('config', {targets, exclude});
    });


    ipcMain.handle('app:select-folder', (event) => {
        return selectFolder();
    });

    ipcMain.handle('app:get-default-locations', (event) => {
        return getDefaultLocations();
    });

}


/**
 *
 */
async function selectFolder() {
    console.log('[app] selectFolder');
    const results = await dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections', 'dontAddToRecent'],
    });
    console.debug('[app] selectFolder results', results);
    if (results.canceled) {
        return null;
    } else {
        return results.filePaths || null;
    }
}


/**
 *
 */
async function getDefaultLocations() {
    console.log('[app] getDefaultLocations');
    let results = [];
    // TODO: enumerate all drives
    switch (process.platform) {
        case "linux":
            results = ['~'];
            break;
        case "win32":
            results = ['~'];
            break;
        case "darwin":
            results = ['~'];
            break;
        default:
            return Promise.reject('Platform not supported')
    }
    //
    console.debug('[app] getDefaultLocations results', results);
    return results;
}