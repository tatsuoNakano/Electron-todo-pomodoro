const todoInput = document.getElementById('new-todo-text');
const addButton = document.getElementById('add-todo-button');
const todoList = document.getElementById('todo-list');

let todos = [];

addButton.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (!text) return;

    const task = { title: text, completed: false };
    todos.push(task);

    const li = document.createElement('li');
    li.className = 'todo-item'; // スタイル追加

    // チェックボックスとラベルをまとめるラッパー
    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox'; // スタイル追加
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        li.classList.toggle('completed', task.completed);
    });

    const label = document.createElement('span');
    label.className = 'todo-text'; // スタイル追加
    label.textContent = task.title;

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(label);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete'; // スタイル追加
    deleteBtn.textContent = '🗑';
    deleteBtn.addEventListener('click', () => {
        const index = Array.from(todoList.children).indexOf(li);
        todos.splice(index, 1);
        todoList.removeChild(li);
    });

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);

    todoInput.value = '';
});
