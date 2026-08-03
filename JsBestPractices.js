localStorage.setItem('Username', 'Trevor');
const username = localStorage.getItem('Username');
console.log(username); // Output: Trevor

const User= {
  name: 'Trevor',
  age: 94,
  hobbies: ['Coding', 'Gaming']
};

localStorage.setItem('User', JSON.stringify(User));
const retrieved = JSON.parse(localStorage.getItem('User'));
console.log(retrieved);

// Create reusable helpers
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

// Usage
saveToStorage('settings', { theme: 'dark', fontSize: 16 });
const settings = getFromStorage('settings', { theme: 'light', fontSize: 14 });