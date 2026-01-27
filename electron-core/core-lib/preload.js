// preload.js
const {contextBridge, ipcRenderer} = require('electron/renderer');


/**
 * @return Promise<T>
 */
function callable(name) {
    return function () {
        const argsArray = Array.from(arguments);
        console.log('[callable] <\t', name, argsArray);
        return Promise.resolve()
            .then(() => ipcRenderer.invoke.apply(ipcRenderer, [name, ...argsArray]))
            .then((result) => {
                console.log('[callable] >>\t', name, result);

                return result;
            }).catch(e => {
                console.error(e);
                throw e;
            });
    }
}

/**
 * @return {()=>void} unsubscribe function
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

/**
 * @return {()=>void} unsubscribe function
 */
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
    openDevTools: callable('app:devtools'),

    // ui4
    getConfig: callable('app:get-config'),
    setConfig: callable('app:set-config'),
    // getDefaultLocations: callable('app:get-default-locations'),
    getSystemExcluded: callable('app:get-system-excluded'),

    selectFolder: callable('app:select-folder'),

    scanStart: callable('scan:start'),
    onScanEntry: event('scan:entry'),
    onScanStats: event('scan:stats'),
    onScanFinished: eventOnce('scan:finished'),
    scanStop: callable('scan:stop'),

    getUserMappings: callable('export:get-user-decision'),
    setUserMappings: callable('export:set-user-decision'),

    exportGetParameters: callable('export:get-parameters'),
    exportSetParameters: callable('export:set-parameters'),
    exportStart: callable('export:push'),
    onExportLog: event('export:log'),
});
