// todo.js
window.addEventListener('DOMContentLoaded', () => {
    const todoInput    = document.getElementById('new-todo-text');
    const addButton    = document.getElementById('add-todo-button');
    const exportBtn    = document.getElementById('export-markdown');
    const todoList     = document.getElementById('todo-list');

    // 1) localStorage からロード
    let todos = [];
    try {
        todos = JSON.parse(localStorage.getItem('todos')) || [];
    } catch (e) {
        console.error('Failed to parse todos from localStorage:', e);
        todos = [];
    }

    // 2) 既存タスクを描画
    todos.forEach(task => renderTask(task));

    // 3) SortableJS でドラッグ＆ドロップを有効化
    Sortable.create(todoList, {
        animation: 150,
        onEnd: () => {
            const newOrder = [];
            todoList.querySelectorAll('li').forEach(li => {
                const id = li.dataset.id;
                const task = todos.find(t => t.id === id);
                if (task) newOrder.push(task);
            });
            todos = newOrder;
            persist();
        }
    });

    // 4) タスク追加
    addButton.addEventListener('click', () => {
        const title = todoInput.value.trim();
        if (!title) return;
        const task = { id: Date.now().toString(), title, completed: false };
        todos.push(task);
        persist();
        renderTask(task);
        todoInput.value = '';
    });

    todoInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') addButton.click();
    });

    // 5) Markdownエクスポート機能
    exportBtn.addEventListener('click', async () => {
        const lines = todos.map(t => {
            const box = t.completed ? '[x]' : '[ ]';
            return `- ${box} ${t.title}`;
        });
        const markdown = `# ToDoリスト\n\n${lines.join('\n')}\n`;
        try {
            const filePath = await window.fileAPI.saveMarkdown(markdown);
            if (filePath) alert(`保存しました:\n${filePath}`);
        } catch (e) {
            console.error('Markdown保存エラー:', e);
            alert('Markdownの保存に失敗しました');
        }
    });

    // タスク要素を生成してDOMに追加
    function renderTask(task) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = task.id;
        if (task.completed) li.classList.add('completed');

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

        const del = document.createElement('button');
        del.className = 'btn-delete';
        del.textContent = '🗑';
        del.addEventListener('click', () => {
            const idx = todos.findIndex(t => t.id === task.id);
            if (idx > -1) {
                todos.splice(idx, 1);
                persist();
                li.remove();
            }
        });

        li.append(content, del);
        todoList.appendChild(li);
    }

    // localStorage に保存
    function persist() {
        try {
            localStorage.setItem('todos', JSON.stringify(todos));
        } catch (e) {
            console.error('Failed to save todos to localStorage:', e);
        }
    }
});
