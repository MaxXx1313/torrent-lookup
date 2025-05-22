// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const { scanFolder} = require('./core-lib/scan');


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
    mainWindow.loadFile('app/index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    _mainWindow = mainWindow;
}

/**
 * @param {function} factoryFn
 * @private
 */
function _myHandler(factoryFn) {
    return (event, data) => {
        console.log(event, data);
        if (_mainWindow) {
            return factoryFn(_mainWindow, data);
        } else {
            console.warn('No active windows');
        }
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();


    ipcMain.on('app:devtools', _myHandler((mainWnd)=>{
        mainWnd.webContents.openDevTools();
    }));
    ipcMain.on('scan:start', _myHandler(scanFolder));

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
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
