// preload.js
const { contextBridge } = require('electron');
const Store = require('electron-store');

// 保存先ファイル名は todo-data.json
const store = new Store({ name: 'todo-data' });

contextBridge.exposeInMainWorld('todoAPI', {
    // 初回起動時は空配列を返す
    getTodos: () => store.get('todos', []),
    // 配列をそのまま書き込む
    saveTodos: (todos) => store.set('todos', todos)
});
