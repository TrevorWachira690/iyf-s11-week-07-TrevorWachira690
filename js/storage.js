const STORAGE_PREFIX = 'todoapp_';

export function save(key, data) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

export function load(key, defaultValue = null) {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
}

export function remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
}
