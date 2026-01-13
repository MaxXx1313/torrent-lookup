// preload.js
const {contextBridge, ipcRenderer} = require('electron/renderer');

/**
 * return unsubscribe function.
 * This is
 */
function bindToEvent(eventName) {
    return (callback) => {
        const _cb = (_event, value) => callback(value)
        ipcRenderer.on(eventName, _cb);

        return () => ipcRenderer.off(eventName, _cb);
    }
}

function callable(name) {
    return function () {
        const argsArray = Array.from(arguments);
        console.log('[callable] <\t', name, argsArray);
        return Promise.resolve()
            .then(() => ipcRenderer.invoke.apply(ipcRenderer, [name, ...argsArray]))
            .then((result) => {
                console.log('[callable] >>\t', name, result);

                return result;
            });
    }
}

contextBridge.exposeInMainWorld('electronAPI', {
    openDevTools: (callback) => ipcRenderer.send('app:devtools'),
    appReady: () => ipcRenderer.send('app:ready'),

    scan: (targets) => ipcRenderer.send('scan:start', targets),
    stopScan: () => ipcRenderer.send('scan:stop'),
    onStatus: bindToEvent('scan:status'),
    onScanProgress: bindToEvent('scan:progress'),
    onScanFound: bindToEvent('scan:found'),

    onAnalyzeResults: bindToEvent('analyze:decision'),

    // ui4
    getConfig: callable('app:get-config'),
    setConfig: callable('app:set-config'),

    selectFolder: callable('app:select-folder'),
});
