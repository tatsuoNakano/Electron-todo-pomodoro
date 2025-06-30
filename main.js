// main.js
const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

if (process.env.NODE_ENV === 'development') {
    try {
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
        });
    } catch {}
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        backgroundColor: '#1a202c',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });
    mainWindow.loadFile('index.html');
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPCハンドラ：Markdown保存
ipcMain.handle('save-markdown', async (_event, markdown) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Markdownファイルとして保存',
        defaultPath: 'todo-list.md',
        filters: [{ name: 'Markdown', extensions: ['md'] }]
    });
    if (canceled || !filePath) return null;
    fs.writeFileSync(filePath, markdown, 'utf-8');
    return filePath;
});

// 通知リクエスト（既存コード）
ipcMain.on('notify-request', (_e, { title, message }) => {
    new Notification({ title, body: message }).show();
});
