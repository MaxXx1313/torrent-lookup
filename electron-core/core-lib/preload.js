// preload.js
const {contextBridge, ipcRenderer} = require('electron/renderer');

// this script runs on web environmnt

let _callId = 0;
/**
 * Callable is used to run an action and return a result.
 * @return Promise<T>
 */
function callable(name) {
    return function () {
        const uid = _callId++;
        const argsArray = Array.from(arguments);
        console.log(`[invoke-${uid}] \t`, name, argsArray);
        return Promise.resolve()
            .then(() => ipcRenderer.invoke.apply(ipcRenderer, [name, ...argsArray]))
            .then((result) => {
                console.log(`[result-${uid}] \t`, name, result);

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
            console.log('[event] >>\t', eventName, value);
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
            console.log('[event] >>\t', eventName, value);
            callback(value);
        }
        ipcRenderer.once(eventName, _cb);

        return () => ipcRenderer.off(eventName, _cb);
    }
}

contextBridge.exposeInMainWorld('electronAPI', {
    openDevTools: callable('app:devtools'),

    // ui4
    getCurrentPage: callable('app:get-current-page'),
    setCurrentPage: callable('app:set-current-page'),
    getConfig: callable('app:get-scan-config'),
    setConfig: callable('app:set-scan-config'),
    getDefaultLocations: callable('app:get-default-locations'),
    getSystemExcluded: callable('app:get-system-excluded'),
    selectFolders: callable('app:select-folders'),

    resetSession: callable('session:reset'),

    // scanner
    scanStart: callable('scan:start'),
    onScanEntry: event('scan:entry'),
    onScanStats: event('scan:stats'),
    onScanFinished: eventOnce('scan:finished'),
    scanStop: callable('scan:stop'),

    getMappings: callable('export:get-mapping'),
    setMappings: callable('export:set-mapping'),

    exportGetClients: callable('export:get-clients'),
    exportGetParameters: callable('export:get-parameters'),
    exportSetParameters: callable('export:set-parameters'),
    exportVerifyParameters: callable('export:verify-parameters'),
    exportStart: callable('export:start'),
    onExportLog: event('export:log'),
    exportGetLogs: callable('export:get-logs'),
    onExportProgress: event('export:progress'),
    // onExportProgress: event('export:push-progress'), // TODO: incomplete
});
