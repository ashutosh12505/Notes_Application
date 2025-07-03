import React from "react";
import "../styles/Note.css"
import "../styles/NoteStyles.css"

function Note({note, onDelete}){

    const dateObj = new Date(note.created_at);
    const formattedDate = dateObj.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return <div className="note-container" style={{ maxWidth: '90%', margin: '20px auto' }}>
        <p className="note-title">{note.title}</p>
        <p className="note-content">{note.content}</p>
        <p className="note-date">{formattedDate}</p>
        <button className="delete-button" onClick={()=>onDelete(note.id)}>Delete</button>
    </div>
}

export default Note;