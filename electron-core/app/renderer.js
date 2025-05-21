import {scanFolder} from '../core-lib/scan';

document.getElementById('scan').addEventListener('click', ()=>{

    // use the exposed API in the renderer
    window.electronAPI.scan('/Users/maksim/Games');
});
