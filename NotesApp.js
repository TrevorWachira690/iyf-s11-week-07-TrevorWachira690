function saveNote() {
    const noteInput = document.getElementById('noteInput');
    const savedNotes = document.getElementById('savedNotes');
    const noteText = noteInput.value.trim();

    if (noteText === '') {
        return;
    }

    const noteElement = document.createElement('p');
    noteElement.textContent = noteText;
    savedNotes.appendChild(noteElement);

    const notes = Array.from(savedNotes.children).map((p) => p.textContent);
    localStorage.setItem('notes', JSON.stringify(notes));

    noteInput.value = '';
}

function loadNotes() {
    const savedNotes = document.getElementById('savedNotes');
    const stored = localStorage.getItem('notes');

    if (stored) {
        const notes = JSON.parse(stored);
        notes.forEach((text) => {
            const noteElement = document.createElement('p');
            noteElement.textContent = text;
            savedNotes.appendChild(noteElement);
        });
    }
}

window.addEventListener('DOMContentLoaded', loadNotes);
