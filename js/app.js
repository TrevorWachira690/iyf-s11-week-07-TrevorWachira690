import {
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
    state,
} from './state.js';
import { renderTodos } from './ui.js';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const listEl = document.querySelector('#todo-list');
const filters = document.querySelectorAll('.filter');
const clearCompletedBtn = document.querySelector('#clear-completed');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
        return;
    }
    addTodo(text);
    input.value = '';
    renderTodos();
});

listEl.addEventListener('click', (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) {
        return;
    }

    const id = Number(li.dataset.id);

    if (e.target.classList.contains('delete-btn')) {
        deleteTodo(id);
        renderTodos();
    } else if (!e.target.classList.contains('todo-edit-input')) {
        toggleTodo(id);
        renderTodos();
    }
});

filters.forEach((btn) => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
        filters.forEach((b) => b.classList.toggle('active', b === btn));
        renderTodos();
    });
});

clearCompletedBtn.addEventListener('click', () => {
    clearCompleted();
    renderTodos();
});

document.addEventListener('DOMContentLoaded', () => {
    renderTodos();

    filters.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.filter === state.filter);
    });
});
