/* ================================================================
   TO-DO LIST APP — localStorage edition
   ================================================================
   Big-picture design: we keep ONE array called "todos" as the
   single source of truth. Every time it changes (add, toggle,
   delete, edit, clear), we call renderTodos() to rebuild the
   visible list from scratch, based on that array. We also save
   to localStorage so data survives refreshes.
   ================================================================ */

const STORAGE_KEY = 'todos';
const FILTER_KEY = 'todoFilter';

// --- Storage helpers ---
function getFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Load / Save todos ---
function loadTodos() {
  return getFromStorage(STORAGE_KEY, []);
}

function saveTodos(todos) {
  saveToStorage(STORAGE_KEY, todos);
}

// --- Load / Save filter preference ---
function loadFilter() {
  return getFromStorage(FILTER_KEY, 'all');
}

function saveFilter(filter) {
  saveToStorage(FILTER_KEY, filter);
}

// --- State ---
let todos = loadTodos();
let currentFilter = loadFilter();

// --- DOM Elements (grab everything once, up front) ---
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const filters = document.querySelectorAll('.filter');
const clearCompletedBtn = document.getElementById('clear-completed');

// --- Todo object factory ---
function createTodoObject(text) {
  return {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

// --- DOM creation ---
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (todo.completed ? ' completed' : '');
  li.dataset.id = todo.id;

  const checkbox = document.createElement('span');
  checkbox.className = 'checkbox';
  checkbox.textContent = todo.completed ? '✓' : '';

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = todo.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '✕';
  deleteBtn.type = 'button';

  li.append(checkbox, text, deleteBtn);
  return li;
}

// --- Rendering ---
function renderTodos() {
  todoList.innerHTML = '';

  const visibleTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (visibleTodos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = currentFilter === 'all' ? 'No tasks yet — add one above!' : `No ${currentFilter} tasks.`;
    todoList.appendChild(empty);
  } else {
    visibleTodos.forEach((todo) => {
      todoList.appendChild(createTodoElement(todo));
    });
  }

  updateStats();
}

function updateStats() {
  const remaining = todos.filter((t) => !t.completed).length;
  itemsLeft.textContent = `${remaining} item${remaining === 1 ? '' : 's'} left`;
}

// --- Actions ---
function addTodo(text) {
  const newTodo = createTodoObject(text);
  todos.push(newTodo);
  saveTodos(todos);
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

function editTodo(id, newText) {
  const trimmed = newText.trim();
  if (trimmed === '') {
    deleteTodo(id);
    return;
  }
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.text = trimmed;
    saveTodos(todos);
    renderTodos();
  }
}

function filterTodos(filter) {
  currentFilter = filter;
  saveFilter(filter);

  filters.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos(todos);
  renderTodos();
}

// --- Event Listeners ---
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const text = input.value.trim();
  if (text === '') return;

  addTodo(text);
  input.value = '';
  input.focus();
});

todoList.addEventListener('click', function (event) {
  const li = event.target.closest('.todo-item');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (event.target.classList.contains('delete-btn')) {
    deleteTodo(id);
  } else if (!event.target.classList.contains('todo-edit-input')) {
    toggleTodo(id);
  }
});

todoList.addEventListener('dblclick', function (event) {
  const textSpan = event.target.closest('.todo-text');
  if (!textSpan) return;

  const li = textSpan.closest('.todo-item');
  const id = Number(li.dataset.id);
  const currentText = textSpan.textContent;

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'todo-edit-input';
  editInput.value = currentText;

  li.replaceChild(editInput, textSpan);
  editInput.focus();
  editInput.select();

  function finishEdit() {
    editTodo(id, editInput.value);
  }

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      finishEdit();
    } else if (e.key === 'Escape') {
      renderTodos();
    }
  });

  editInput.addEventListener('blur', finishEdit);
});

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterTodos(btn.dataset.filter);
  });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();

  // Restore saved filter preference
  filters.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
});
