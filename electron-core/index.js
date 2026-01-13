// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const {Scanner, scanLogic} = require('./core-lib/scan');
const {appLogic} = require("./core-lib/app");



console.log('[Store]', app.getPath('userData'));
// const myBridge = {
//     /**
//      * Send message to UI
//      */
//     send: (topic, message) => {
//         console.log('[send]\t', topic, message);
//         if (_mainWindow) {
//             _mainWindow.webContents.send(topic, message);
//         } else {
//             // no active window
//             console.debug('[send]\t(no active window)', topic, message);
//         }
//     },
//     /**
//      * Receive message from UI
//      */
//     on: (topic, handler) => {
//         ipcMain.on(topic, (event, data) => {
//             console.log('[on]\t', topic);
//             return handler(data);
//         });
//     },
//     /**
//      * UI calls method and provide a result
//      */
//     handle: (topic, handler) => {
//         ipcMain.handle(topic, (event, data) => {
//             console.log('[handle]\t', topic);
//             return handler(data);
//         });
//     },
// };

// attach scanner logic
// const scanner = new Scanner(myBridge);


/////////////////////////////

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
    // mainWindow.loadFile('app/index.html');
    mainWindow.loadURL('http://localhost:5173');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    _mainWindow = mainWindow;

    mainWindow.on('closed', function () {
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

    appLogic(ipcMain);
    scanLogic(ipcMain);


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
