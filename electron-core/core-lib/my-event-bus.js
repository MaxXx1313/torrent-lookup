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
        this.ipcMain.handle(eventName, function (event) {
            const argsArray = Array.from(arguments).slice(1);
            console.log('[invoke] \t', eventName, argsArray);
            return Promise.resolve()
                .then(() => callback.apply(null, argsArray))
                .then((result) => {
                    console.log('[result] \t', eventName, result);
                    return result;
                })
                .catch((e) => {
                    console.log('[error] \t', e);
                    throw e;
                });
        });
    }

    emit(eventName, payload) {
        console.log('[emit] \t', eventName, payload);

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