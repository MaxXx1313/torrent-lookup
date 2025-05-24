// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const {scanFolder, selectFolder, Scanner} = require('./core-lib/scan');
const fs = require('node:fs');


const myBridge = {
    send: (topic, message) => {
        console.log('[send]\t', topic, message);
        if (_mainWindow) {
            _mainWindow.webContents.send(topic, message);
        } else {
            // no active window
        }
    },
    on: (topic, handler) => {
        console.log('[on]\t', topic);
        ipcMain.on(topic, (event, data) => {
            return handler(data);
        });
    },
    handle: (topic, handler) => {
        console.log('[handle]\t', topic);
        ipcMain.handle(topic, (event, data) => {
            return handler(data);
        });
    },
};

const scanner = new Scanner(myBridge);


/**
 *
 * @param target
 * @param {'windowCreated' | 'windowDestroyed'} event
 * @param data
 */
function triggerLifecycleEvent(target, event, data) {
    if (typeof target['event'] === 'function') {
        target['event'](data);
    }
}

/////////////////////////////

let _mainWindow = null;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'core-lib/preload.js'),
        },
    });

    // and load the index.html of the app.
    // mainWindow.loadFile('app/index.html');
    mainWindow.loadURL('http://localhost:5173');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    _mainWindow = mainWindow;
    triggerLifecycleEvent(scanner, 'windowCreated', mainWindow);

    mainWindow.on('closed', function () {
        triggerLifecycleEvent(scanner, 'windowDestroyed', mainWindow);
        _mainWindow = null;
    });
}


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
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
