// ==========================================================
// ui.js — all DOM manipulation lives here, nowhere else
// ==========================================================

import { getFilteredTodos } from './state.js';
import { formatDate } from './utils.js';

const listEl = document.querySelector('#todo-list');

export function renderTodos() {
    const todos = getFilteredTodos();

    if (todos.length === 0) {
        listEl.innerHTML = `<p class="empty-state">No tasks here.</p>`;
        return;
    }

    listEl.innerHTML = todos
        .map(
            (todo) => `
      <div class="todo ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''} />
        <span>${todo.text}</span>
        <small>${formatDate(todo.createdAt)}</small>
        <button data-delete="${todo.id}">Delete</button>
      </div>
    `
        )
        .join('');
}
