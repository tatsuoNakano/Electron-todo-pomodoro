// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fileAPI', {
    saveMarkdown: (markdown) => ipcRenderer.invoke('save-markdown', markdown)
});
