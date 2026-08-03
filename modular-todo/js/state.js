// ==========================================================
// state.js — application state and its update functions
// ==========================================================

import { save, load } from './storage.js';

const TODOS_KEY = 'todos';
const FILTER_KEY = 'filter';

export const state = {
    todos: load(TODOS_KEY, []),
    filter: load(FILTER_KEY, 'all'),
};

export function addTodo(text) {
    state.todos.push({
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
    });
    save(TODOS_KEY, state.todos);
}

export function toggleTodo(id) {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        save(TODOS_KEY, state.todos);
    }
}

export function deleteTodo(id) {
    state.todos = state.todos.filter((t) => t.id !== id);
    save(TODOS_KEY, state.todos);
}

export function setFilter(filter) {
    state.filter = filter;
    save(FILTER_KEY, filter);
}

export function getFilteredTodos() {
    if (state.filter === 'active') {
        return state.todos.filter((t) => !t.completed);
    }
    if (state.filter === 'completed') {
        return state.todos.filter((t) => t.completed);
    }
    return state.todos;
}
