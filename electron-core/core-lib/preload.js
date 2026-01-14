// preload.js
const {contextBridge, ipcRenderer} = require('electron/renderer');


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

/**
 * return unsubscribe function.
 * This is
 */
function event(eventName) {
    return (callback) => {
        const _cb = (_event, value) => {
            console.log('[event] >\t', eventName, value);
            callback(value);
        }
        ipcRenderer.on(eventName, _cb);

        return () => ipcRenderer.off(eventName, _cb);
    }
}

function eventOnce(eventName) {
    return (callback) => {
        const _cb = (_event, value) => {
            console.log('[event] >\t', eventName, value);
            callback(value);
        }
        ipcRenderer.once(eventName, _cb);

        return () => ipcRenderer.off(eventName, _cb);
    }
}

contextBridge.exposeInMainWorld('electronAPI', {
    openDevTools: (callback) => ipcRenderer.send('app:devtools'),
    appReady: () => ipcRenderer.send('app:ready'),

    // ui4
    getConfig: callable('app:get-config'),
    setConfig: callable('app:set-config'),
    getSystemExcluded: callable('app:get-system-excluded'),

    selectFolder: callable('app:select-folder'),

    scanStart: callable('scan:start'),
    onScanEntry: event('scan:entry'),
    onScanStats: event('scan:stats'),
    onScanFinished: eventOnce('scan:finished'),
    scanStop: callable('scan:stop'),
    scanGetResults: callable('scan:get-results'),
});
