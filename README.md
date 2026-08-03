# Week 07: Browser Storage & Code Quality

## Author
- **Name:** Trevor Wachira
- **GitHub:** [@TrevorWachira690](https://github.com/TrevorWachira690)
- **Date:** 08/02/2026

## Project Description
Practice files covering browser storage (localStorage/sessionStorage), state management, clean code, modular structure, debugging, and unit testing. The to-do list was refactored from a single monolithic file into ES modules (`storage.js`, `state.js`, `ui.js`, `utils.js`, `app.js`) for better separation of concerns.

## Technologies Used
- HTML, CSS, JavaScript
- Web Storage API (localStorage, sessionStorage)
- ES Modules (import/export)
- ESLint + Prettier
- Vitest
- Chrome DevTools, Git, GitHub

## Features
- **UpdatedToDoList.html/js** - Persistent to-do list with localStorage, filter preference saved, and empty-state handling
- **js/modular-todo/** - Same to-do list split into modules: `storage.js`, `state.js`, `ui.js`, `utils.js`, `app.js`
- **NotesApp.html/js** - Simple notes app with localStorage persistence
- **Debugging.html/js** - Console methods demo + fixed `calculateOrderTotal` with documented bugs
- **session-form.html** - Form auto-save using sessionStorage (draft cleared on tab close)
- **shopping-cart.html** - Shopping cart with centralized state, quantity controls, and localStorage persistence
- **JsBestPractices.js** - localStorage helper functions and JSON serialization examples
- **daily-challenges/** - Theme persistence, recent searches, form autosave, refactor challenge, and code review

## How to Run
1. Clone the repository
2. Open any `.html` file directly in your browser — no build step needed
3. **Exception:** files using ES modules (`UpdatedToDoList.html` loading `js/app.js`, `modular-todo/index.html`) must be served over `http://` (e.g. VS Code Live Server), not `file://`
4. `npm test` runs Vitest unit tests
5. `npm run lint` / `npm run lint:fix` runs ESLint
6. `npm run format` runs Prettier

## Lessons Learned
localStorage persists until manually cleared; sessionStorage clears on tab close. Both store strings only, so objects need `JSON.stringify`/`JSON.parse`. Centralizing state into one object with dedicated update functions prevents data from scattering across variables. The observer pattern lets multiple UI parts react to the same state changes. Splitting the to-do app into modules made the codebase easier to navigate once storage, state, and DOM logic were separated. ESLint + Prettier + Vitest were added to enforce consistent style and prevent regressions.

## Challenges Faced
1. **Off-by-One and Typo Bugs** - `calculateOrderTotal` had `i <= items.length` and `item.quanity`, both of which fail silently instead of crashing loudly.
2. **ES Modules Needing a Server** - Browsers block `import`/`export` over `file://`; a local dev server is required for modular files.
3. **Duplicate Implementations** - Multiple todo and form-autosave implementations existed across the repo; consolidating into canonical versions reduced confusion.
