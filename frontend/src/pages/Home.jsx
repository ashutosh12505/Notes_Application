import { useState, useEffect } from "react"
import api from "../api"
import Note from "../components/Note";
import { useNavigate } from "react-router-dom";

function Home(){

    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        getNotes();
    }, [])

    const getNotes = ()=>{
        api.get("/api/notes/")
        .then((res) => res.data)
        .then((data) => {
            // Sort notes by created_at in descending order (newest first)
            const sortedNotes = data.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            setNotes(sortedNotes);
            console.log(sortedNotes);
        })
        .catch((err) => {
            if (err.response) {
                setError(`Error loading notes: ${err.response.status} - ${err.response.statusText}`);
            } else if (err.request) {
                setError("Network error. Please check if the server is running.");
            } else {
                setError("An unexpected error occurred while loading notes.");
            }
        });
    };

    const deleteNote = (id)=>{
        setError("");
        setSuccessMessage("");
        api.delete(`/api/notes/delete/${id}/`)
        .then((res)=>{
            if(res.status===204) {
                setSuccessMessage("Note deleted successfully");
                getNotes();
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setError("Failed to delete the note");
            }
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 404) {
                    setError("Note not found. It may have already been deleted.");
                } else {
                    setError(`Error deleting note: ${error.response.status} - ${error.response.statusText}`);
                }
            } else if (error.request) {
                setError("Network error. Please check if the server is running.");
            } else {
                setError("An unexpected error occurred while deleting the note.");
            }
        });
    };

    const createNote = (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);
        
        api.post("/api/notes/", {content, title})
        .then((res) => {
            if(res.status===201) {
                setSuccessMessage("Note created successfully!");
                getNotes();
                setTitle("");
                setContent("");
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setError("Failed to create note");
            }
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 400) {
                    const errorData = error.response.data;
                    if (errorData.title) {
                        setError(`Title error: ${Array.isArray(errorData.title) ? errorData.title[0] : errorData.title}`);
                    } else if (errorData.content) {
                        setError(`Content error: ${Array.isArray(errorData.content) ? errorData.content[0] : errorData.content}`);
                    } else {
                        setError("Invalid input. Please check your note data.");
                    }
                } else if (error.response.status === 401) {
                    setError("Authentication failed. Please log in again.");
                    setTimeout(() => {
                        localStorage.clear();
                        navigate("/login");
                    }, 2000);
                } else {
                    setError(`Error creating note: ${error.response.status} - ${error.response.statusText}`);
                }
            } else if (error.request) {
                setError("Network error. Please check if the server is running.");
            } else {
                setError("An unexpected error occurred while creating the note.");
            }
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return(<div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        {/* Form at the top */}
        <h2 style={{ textAlign: 'center', marginBottom: '1em' }}>
            {notes.length === 0 ? 'Create your first note' : 'Create a new note'}
        </h2>
        <form onSubmit={createNote} style={{ fontFamily: 'Arial, sans-serif', marginBottom: '2em' }}>
            <label htmlFor="title">Title: </label>
            <br/>
            <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            />

            <label htmlFor="content">Content: </label>
            <br/>
            <textarea 
                name="content" 
                id="content" 
                required 
                value={content}
                onChange={(e)=>setContent(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px', boxSizing: 'border-box' }}
            ></textarea>
            <br/>
            
            {/* Success message */}
            {successMessage && (
                <div style={{ 
                    color: 'green', 
                    marginBottom: '1em',
                    padding: '0.5em',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '4px',
                    border: '1px solid #4caf50'
                }}>
                    {successMessage}
                </div>
            )}
            
            {/* Error message */}
            {error && (
                <div style={{ 
                    color: 'red', 
                    marginBottom: '1em',
                    padding: '0.5em',
                    backgroundColor: '#ffebee',
                    borderRadius: '4px',
                    border: '1px solid #f44336'
                }}>
                    {error}
                </div>
            )}
            
            <input 
                type="submit" 
                value={loading ? "Creating..." : "Submit"}
                disabled={loading}
                style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
            />
            <button 
                type="button" 
                onClick={handleLogout} 
                style={{
                    marginTop: '10px', 
                    marginLeft: '10px', 
                    background: '#f44336', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '10px 20px', 
                    cursor: 'pointer'
                }}
            >
                Logout
            </button>
        </form>

        {/* Notes displayed below the form */}
        <div>
            {notes.length > 0 && (
                <h2 style={{ textAlign: 'center', marginBottom: '1em', marginTop: '2em' }}>Your Notes</h2>
            )}
            {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id}/>)}
        </div>
    </div>)
}

export default Home