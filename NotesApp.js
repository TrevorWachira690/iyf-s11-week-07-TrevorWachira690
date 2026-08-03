function saveNote() {
  const noteInput = document.getElementById('noteInput');
  const savedNotes = document.getElementById('savedNotes');

  const note = noteInput.value;
  if (note.trim() !== '') {
    const noteElement = document.createElement('p');
    noteElement.textContent = note;
    savedNotes.appendChild(noteElement);

    // Save to localStorage
    const notesArray = Array.from(savedNotes.children).map(p => p.textContent);
    localStorage.setItem('savedNotes', JSON.stringify(notesArray));

    noteInput.value = '';
  }
}

// Load saved notes when page opens
function loadNotes() {
  const savedNotes = document.getElementById('savedNotes');
  const stored = localStorage.getItem('savedNotes');

  if (stored) {
    const notesArray = JSON.parse(stored);
    notesArray.forEach(noteText => {
      const noteElement = document.createElement('p');
      noteElement.textContent = noteText;
      savedNotes.appendChild(noteElement);
    });
  }
}

// Run loadNotes when the page is ready
window.onload = loadNotes;