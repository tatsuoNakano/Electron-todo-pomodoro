// todo.js
window.addEventListener('DOMContentLoaded', () => {
    const todoInput  = document.getElementById('new-todo-text');
    const addButton  = document.getElementById('add-todo-button');
    const todoList   = document.getElementById('todo-list');

    // ─── 1) localStorage からロード ───────────────────────
    let todos = [];
    try {
        todos = JSON.parse(localStorage.getItem('todos')) || [];
    } catch (e) {
        console.error('Failed to parse todos from localStorage:', e);
        todos = [];
    }

    // ─── 2) 既存タスクを描画 ─────────────────────────────
    todos.forEach(task => renderTask(task));

    // ─── 3) タスク追加イベント ───────────────────────────
    addButton.addEventListener('click', () => {
        const title = todoInput.value.trim();
        if (!title) return;

        const task = { title, completed: false };
        todos.push(task);
        persist();
        renderTask(task);
        todoInput.value = '';
    });

    // Enter でも追加
    todoInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') addButton.click();
    });

    // ─── 共通：localStorageへ書き込み ─────────────────────
    function persist() {
        try {
            localStorage.setItem('todos', JSON.stringify(todos));
        } catch (e) {
            console.error('Failed to save todos to localStorage:', e);
        }
    }

    // ─── タスク要素を生成しDOMに追加 ────────────────────
    function renderTask(task) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (task.completed) li.classList.add('completed');

        // チェック＋ラベル
        const content = document.createElement('div');
        content.className = 'todo-content';

        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.className = 'checkbox';
        chk.checked = task.completed;
        chk.addEventListener('change', () => {
            task.completed = chk.checked;
            li.classList.toggle('completed', task.completed);
            persist();
        });

        const label = document.createElement('span');
        label.className = 'todo-text';
        label.textContent = task.title;

        content.append(chk, label);

        // 削除ボタン
        const del = document.createElement('button');
        del.className = 'btn-delete';
        del.textContent = '🗑';
        del.addEventListener('click', () => {
            const idx = todos.indexOf(task);
            if (idx > -1) {
                todos.splice(idx, 1);
                persist();
                li.remove();
            }
        });

        li.append(content, del);
        todoList.appendChild(li);
    }
});
