document.getElementById('scan').addEventListener('click', () => {

    // use the exposed API in the renderer
    window.electronAPI.scan({targets: '/Users/maksim/Games'});
});


window.electronAPI.onScanFound(entry => {
    const node = document.createElement('li');
    node.innerText = entry;
    document.getElementById('results').appendChild(node);
});
