const { ipcRenderer } = require('electron');

ipcRenderer.on('about', () => {
    alert("yayview v1.0");
});

ipcRenderer.on('filter', (_, filter) => {
    alert(filter);
});
