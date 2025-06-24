// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// レンダラー（windowオブジェクト）上にsafeAPIというオブジェクトを公開
contextBridge.exposeInMainWorld('safeAPI', {
    notify: (title, message) => {
        ipcRenderer.send('notify-request', { title, message });
    }
});
