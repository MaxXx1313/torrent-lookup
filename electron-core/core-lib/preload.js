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
const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    scan: (targets) => ipcRenderer.send('scan:start', targets),
    onScanProgress: (callback) => ipcRenderer.on('scan:progress', (_event, value) => callback(value)),
    onScanFound: (callback) => ipcRenderer.on('scan:found', (_event, value) => callback(value)),
});
