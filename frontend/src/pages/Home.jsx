import { useState, useEffect } from "react"
import api from "../api"
import Note from "../components/Note";
import { useNavigate } from "react-router-dom";

function Home(){

    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        getNotes();
    }, [])

    const getNotes = ()=>{
        api.get("/api/notes/")
        .then((res) => res.data)
        .then((data) => {setNotes(data); console.log(data)})
        .catch((err)=>alert(err));
    };

    const deleteNote = (id)=>{
        api.delete(`/api/notes/delete/${id}/`).then((res)=>{
            if(res.status===204)
                alert("Deleted successfully")
            else
                alert("Failed to delete the note")

            getNotes()
        }).catch((error) => alert(error))
    };

    const createNote = (e) => {
        e.preventDefault();
        api.post("/api/notes/", {content, title}).then((res) => {
            if(res.status===201)
                alert("Note created successfully")
            else
                alert("Failed to create note")

            getNotes();
            setTitle("");
            setContent("");
        }).catch((error) => alert(error))
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return(<div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div>
            {notes.length > 0 && (
                <h2 style={{ textAlign: 'center', marginBottom: '1em' }}>Notes</h2>
            )}
            {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id}/>)}
        </div>
        <h2 style={{ textAlign: 'center', marginTop: '2em' }}>
            {notes.length === 0 ? 'Create your first note' : 'Create a new note'}
        </h2>
        <form onSubmit={createNote} style={{ fontFamily: 'Arial, sans-serif' }}>
            <label htmlFor="title">Title: </label>
            <br/>
            <input type="text" id="title" name="title" required value={title}
                onChange={(e)=>setTitle(e.target.value)}/>

            <label htmlFor="content">Content: </label>
            <br/>
            <textarea name="content" id="content" required value={content}
                onChange={(e)=>setContent(e.target.value)}
            ></textarea>
            <br/>
            <input type="submit" value="Submit"/>
            <button type="button" onClick={handleLogout} style={{marginTop: '10px', marginLeft: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer'}}>Logout</button>
        </form>
    </div>)
}

export default Home