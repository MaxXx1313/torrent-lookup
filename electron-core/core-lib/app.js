import Store from 'electron-store';
import {dialog} from "electron";
import {SCAN_EXCLUDE_DEFAULT} from "tlookup";
import * as child from 'node:child_process';

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
    // TODO: enumerate all drives?
    switch (process.platform) {
        case "linux":
            results = ['~'];
            break;
        case "win32":
            results = listDrivesWindows()
                .then(drives => {
                    const noSystem = drives.filter(d => d !== 'C:\\');
                    const extra = [
                        '~',
                    ];
                    return [
                        ...noSystem,
                        ...extra,
                    ];
                });
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


/**
 * @return {Promise<string[]>}
 */
export function listDrivesWindows() {
    return new Promise((resolve, reject) => {
        const list = child.spawn('cmd');
        let output = '';

        list.stdout.on('data', (data) => {
            output += String(data);
        });

        list.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        list.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Child process exited with code ${code}`));
            }
            // Process the output to extract drive letters (e.g., ["C:", "D:"])
            const drives = output
                .split(/[\r\n]/)
                .map(e => e.trim())
                .filter(e => e.match(/^[A-Z]:$/i)) // Basic filtering for drive letters
                .map(d => d + '\\');

            resolve(drives);
        });

        // Command to list logical drive names
        list.stdin.write('wmic logicaldisk get name\n');
        list.stdin.end();
    });
}