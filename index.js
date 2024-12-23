class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.currentId = null;
        this.init();
    }

    init() {
        this.addNoteBtn = document.getElementById('addNote');
        this.noteInput = document.getElementById('noteInput');
        this.colorSelect = document.getElementById('noteColor');
        this.notesContainer = document.getElementById('notesContainer');

        this.addNoteBtn.addEventListener('click', () => this.handleAddNote());
        this.renderNotes();
    }

    handleAddNote() {
        const text = this.noteInput.value.trim();
        if (!text) return;

        if (this.currentId !== null) {
            // Edit existing note
            this.editNote(this.currentId, text, this.colorSelect.value);
            this.addNoteBtn.textContent = 'Add Note';
        } else {
            // Add new note
            this.addNote(text, this.colorSelect.value);
        }

        this.noteInput.value = '';
        this.colorSelect.value = '#ffffff';
        this.currentId = null;
    }

    addNote(text, color) {
        const note = {
            id: Date.now(),
            text,
            color,
            date: new Date().toLocaleString()
        };

        this.notes.push(note);
        this.saveNotes();
        this.renderNotes();
    }

    editNote(id, newText, newColor) {
        const note = this.notes.find(note => note.id === id);
        if (note) {
            note.text = newText;
            note.color = newColor;
            note.date = new Date().toLocaleString() + ' (edited)';
            this.saveNotes();
            this.renderNotes();
        }
    }

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
        this.renderNotes();
    }

    createNoteElement(note) {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = note.color;

        noteElement.innerHTML = `
            <div class="note-text">${note.text}</div>
            <div class="note-date">${note.date}</div>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        noteElement.querySelector('.delete-btn').addEventListener('click', () => {
            this.deleteNote(note.id);
        });

        noteElement.querySelector('.edit-btn').addEventListener('click', () => {
            this.noteInput.value = note.text;
            this.colorSelect.value = note.color;
            this.currentId = note.id;
            this.addNoteBtn.textContent = 'Save Edit';
            this.noteInput.focus();
        });

        return noteElement;
    }

    renderNotes() {
        this.notesContainer.innerHTML = '';
        this.notes.forEach(note => {
            this.notesContainer.appendChild(this.createNoteElement(note));
        });
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }
}

// Initialize the app
new NotesApp();