// ==========================================================
// app.js — main entry point: wires modules together,
// handles events, calls into state.js and ui.js
// ==========================================================

import { addTodo, toggleTodo, deleteTodo, setFilter } from './state.js';
import { renderTodos } from './ui.js';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const listEl = document.querySelector('#todo-list');
const filterButtons = document.querySelectorAll('.filters button');

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

// Event delegation: ONE listener on the parent handles all
// current AND future checkbox/delete clicks
listEl.addEventListener('click', (e) => {
    if (e.target.matches("input[type='checkbox']")) {
        toggleTodo(Number(e.target.dataset.id));
        renderTodos();
    }
    if (e.target.matches('button[data-delete]')) {
        deleteTodo(Number(e.target.dataset.delete));
        renderTodos();
    }
});

filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
        filterButtons.forEach((b) => b.classList.toggle('active', b === btn));
        renderTodos();
    });
});

document.addEventListener('DOMContentLoaded', renderTodos);
