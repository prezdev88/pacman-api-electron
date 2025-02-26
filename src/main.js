const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { executeBin, stopBin } = require('./exec-backend');

let mainWindow;

app.on('ready', () => {
    executeBin();

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    const menu = Menu.buildFromTemplate(createMenuTemplate());
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
    stopBin();

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function createMenuTemplate() {
    return [
        {
            label: 'View',
            submenu: [
                { label: 'Installed Packages', click: () => mainWindow.webContents.send('installed-apps') }
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
