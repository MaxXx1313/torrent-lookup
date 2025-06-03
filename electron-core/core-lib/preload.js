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

contextBridge.exposeInMainWorld('electronAPI', {
    openDevTools: (callback) => ipcRenderer.send('app:devtools'),
    appReady: () => ipcRenderer.send('app:ready'),

    selectFolder: () => ipcRenderer.invoke('scan:select-folder'),
    scan: (targets) => ipcRenderer.send('scan:start', targets),
    stopScan: () => ipcRenderer.send('scan:stop'),
    onStatus: bindToEvent('scan:status'),
    onScanProgress: bindToEvent('scan:progress'),
    onScanFound: bindToEvent('scan:found'),

    onAnalyzeResults: bindToEvent('analyze:decision'),
});
