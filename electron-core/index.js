// main.js

// Modules to control application life and create native browser window
import {app, BrowserWindow, ipcMain} from 'electron';
import * as path from 'node:path';
import {scanLogic} from './core-lib/scan.js';
import {appLogic} from "./core-lib/app.js";


console.log('[Store]', app.getPath('userData'));

const isDevMode = process.argv.includes('--dev');
if (isDevMode) {
    console.log('[App] Starting in develop mode');
}

/////////////////////////////
const __dirname = path.dirname(import.meta.url);

let _mainWindow = null;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 732,
        webPreferences: {
            preload: path.join(__dirname, 'core-lib/preload.js'),
        },
    });

    // and load the index.html of the app.
    if (isDevMode) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.setMenu(null);
        mainWindow.loadFile('app/index.html');
    }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    _mainWindow = mainWindow;

    mainWindow.on('closed', function () {
        _mainWindow = null;
    });
}// attach scanner logic
// const scanner = new Scanner(myBridge);


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    ipcMain.on('app:devtools', () => {
        if (_mainWindow) {
            _mainWindow.webContents.openDevTools();
        }
    });

    appLogic(ipcMain);
    scanLogic(ipcMain, _mainWindow);


    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    app.quit();
    // }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
