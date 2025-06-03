// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

///
const {contextBridge, ipcRenderer} = require('electron/renderer');

/**
 * return unsubscribe function
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
    onScanStatus: bindToEvent('scan:status'),
    onScanProgress: bindToEvent('scan:progress'),
    onScanFound: bindToEvent('scan:found'),

    onAnalyzeResults: bindToEvent('analyze:decision'),
});
