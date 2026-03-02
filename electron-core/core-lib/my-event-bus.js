/**
 *
 */
export class MyEventBus {
    /**
     * @type {IpcMain}
     */
    ipcMain

    /**
     * @type {BrowserWindow[]}
     */
    _windows

    /**
     * @param {IpcMain} ipcMain
     */
    constructor(ipcMain) {
        this.ipcMain = ipcMain;
        this._windows = [];
    }

    handle(eventName, callback) {
        this.ipcMain.handle(eventName, (event, arg1, arg2) => {
            console.log('[callable] <\t', eventName, arg1, arg2);
            return Promise.resolve()
                .then(() => callback(arg1, arg2));
        });
    }

    emit(eventName, payload) {
        console.log('[emit] >>\t', eventName, payload);

        for (const contentWindow of this._windows) {
            contentWindow.webContents.send(eventName, payload);
        }
    }


    _addWindow(contentWindow) {
        this._windows.push(contentWindow);
    }

    _removeWindow(contentWindow) {
        this._windows = this._windows.filter(w => w !== contentWindow);
    }
}