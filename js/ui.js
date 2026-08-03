import { getFilteredTodos, state } from './state.js';
import { formatDate } from './utils.js';

const listEl = document.querySelector('#todo-list');
const itemsLeft = document.querySelector('#items-left');

export function renderTodos() {
    const todos = getFilteredTodos();

    if (todos.length === 0) {
        listEl.innerHTML =
            '<li class="empty-state">No tasks yet — add one above!</li>';
    } else {
        listEl.innerHTML = todos
            .map(
                (todo) => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <span class="checkbox">${todo.completed ? '✓' : ''}</span>
        <span class="todo-text">${todo.text}</span>
        <small>${formatDate(todo.createdAt)}</small>
        <button class="delete-btn" data-delete="${todo.id}">✕</button>
      </li>
    `
            )
            .join('');
    }

    updateStats();
}

function updateStats() {
    const remaining = state.todos.filter((t) => !t.completed).length;
    itemsLeft.textContent = `${remaining} item${remaining === 1 ? '' : 's'} left`;
}
