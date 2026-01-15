
document.getElementById('reload').addEventListener('click', () => {
    location.reload();
});
document.getElementById('devtools').addEventListener('click', () => {
    window.electronAPI.openDevTools();
});

