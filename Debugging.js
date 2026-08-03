// ==========================================================
// Task 14.3 — Debugging Skills
// ==========================================================

// ----------------------------------------------------------
// Exercise 1: Console Methods (all runnable in any browser console)
// ----------------------------------------------------------

console.log('Basic message');
console.log('%cImportant!', 'color: red; font-size: 20px;');
console.warn('This might be a problem');
console.error('This is definitely wrong');

const users = [
    { name: 'Amina', age: 22 },
    { name: 'Brian', age: 27 },
];
console.table(users);

console.group('User Processing');
console.log('Step 1');
console.log('Step 2');
console.groupEnd();

async function fetchUsers() {
    return new Promise((resolve) => setTimeout(resolve, 300));
}

async function timingDemo() {
    console.time('fetchUsers');
    await fetchUsers();
    console.timeEnd('fetchUsers'); // "fetchUsers: ~300ms"
}
timingDemo();

const x = 5;
console.assert(x > 0, 'x should be positive');

console.trace('How did we get here?');

// ----------------------------------------------------------
// Exercise 3: Debug This Code
// ----------------------------------------------------------
//
// ORIGINAL BUGGY VERSION (left here as a comment for reference):
//
// function calculateOrderTotal(items) {
//     let total = 0;
//     for (let i = 0; i <= items.length; i++) {     // BUG 1: <= goes out of bounds
//         const item = items[i];
//         total += item.price * item.quanity;        // BUG 2: typo "quanity"
//     }
//     if (total > 100) {
//         total = total * 0.9;
//     }
//     return total;
// }
//
// BUGS FOUND:
//   1. `i <= items.length` runs ONE index too far — on the last loop,
//      items[items.length] is undefined, so item.price crashes
//      ("Cannot read properties of undefined").
//   2. `item.quanity` is a typo — the real property is `quantity`.
//      This would produce NaN instead of crashing, which is even
//      sneakier to catch without a debugger or console.log.

function calculateOrderTotal(items) {
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        // FIX: < instead of <=
        const item = items[i];
        total += item.price * item.quantity; // FIX: correct spelling
    }

    if (total > 100) {
        total = total * 0.9; // 10% discount
    }

    return total;
}

const order = [
    { name: 'Book', price: 15, quantity: 2 },
    { name: 'Pen', price: 3, quantity: 5 },
    { name: 'Notebook', price: 8, quantity: 3 },
];

console.log(calculateOrderTotal(order));
// Expected: 69 before discount, 62.1 after discount (total > 100 is false here,
// so no discount applies — 15*2 + 3*5 + 8*3 = 30 + 15 + 24 = 69)
