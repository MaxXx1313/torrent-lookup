document.getElementById('scan').addEventListener('click', () => {

    // use the exposed API in the renderer
    window.electronAPI.scan({targets: '/Users/maksim/Games'});
    document.getElementById('results').innerHTML = '';
});

document.getElementById('reload').addEventListener('click', () => {
    location.reload();
});
document.getElementById('devtools').addEventListener('click', () => {
    window.electronAPI.openDevTools();
});


window.electronAPI.onScanFound(entry => {
    const node = document.createElement('li');
    node.innerText = entry;
    document.getElementById('results').appendChild(node);
});
