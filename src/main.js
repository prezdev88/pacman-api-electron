const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const log = require('electron-log');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            contextIsolation: false,
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Crear menú
    const menu = Menu.buildFromTemplate(createMenuTemplate());
    Menu.setApplicationMenu(menu);
});

// Plantilla del menú
function createMenuTemplate() {
    return [
        {
            label: 'View',
            submenu: [
                { label: 'Native Packages', click: () => mainWindow.webContents.send('filter', 'Native') },
                { label: 'AUR Packages', click: () => mainWindow.webContents.send('filter', 'AUR') },
                { label: 'All Packages', click: () => mainWindow.webContents.send('filter', 'All') },
            ],
        },
        {
            label: 'Help',
            submenu: [
                { label: 'About', click: () => mainWindow.webContents.send('about') },
            ],
        },
    ];
}
