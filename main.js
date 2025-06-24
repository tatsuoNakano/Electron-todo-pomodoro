if (process.env.NODE_ENV === 'development') {
    try {
        require('electron-reload')(__dirname);
    } catch (e) {
        console.log('electron-reload は開発専用です');
    }
}
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('notify-request', (_event, arg) => {
    const { title, message } = arg;
    new Notification({ title, body: message }).show();
});

