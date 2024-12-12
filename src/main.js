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

// Registrar eventos globales de errores no capturados
process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Plantilla del menú
function createMenuTemplate() {
    return [
        {
            label: 'View',
            submenu: [
                { label: 'Native', click: () => mainWindow.webContents.send('filter', 'Native') },
                { label: 'AUR', click: () => mainWindow.webContents.send('filter', 'AUR') },
                { label: 'All', click: () => mainWindow.webContents.send('filter', 'All') },
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
