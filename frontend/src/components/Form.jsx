import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

function Form({route, method}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate();
    const pageName = method==="login" ? "Login" : "Register"

    const handleSubmit = async (e) =>{
        setLoading(true);
        setError(""); // Clear previous errors
        e.preventDefault();

        try {
            const res = await api.post(route, {username, password})

            if(method==="login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            }else{
                navigate("/login")
            }
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 401) {
                    setError("Invalid username or password. Please try again.")
                } else if (error.response.status === 400) {
                    // Handle validation errors from backend
                    const errorData = error.response.data;
                    if (errorData.username) {
                        setError(errorData.username[0] || "Username error")
                    } else if (errorData.password) {
                        setError(errorData.password[0] || "Password error")
                    } else if (errorData.non_field_errors) {
                        setError(errorData.non_field_errors[0] || "Invalid credentials")
                    } else {
                        setError("Invalid input. Please check your credentials.")
                    }
                } else {
                    setError(`Error: ${error.response.status} - ${error.response.statusText}`)
                }
            } else if (error.request) {
                // Request was made but no response received
                setError("Network error. Please check if the server is running.")
            } else {
                // Something else happened
                setError("An unexpected error occurred. Please try again.")
            }
        } finally{
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{pageName}</h1>
        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            placeholder="Username"
        />
        <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
        />
        {loading && <LoadingIndicator/>}
        {error && <div className="error-message" style={{ 
            color: 'red', 
            marginTop: '1em', 
            marginBottom: '1em',
            padding: '0.5em',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            border: '1px solid #f44336'
        }}>{error}</div>}
        <button className="form-button" type="submit">
            {pageName}
        </button>
        {method === "login" ? (
            <div style={{ marginTop: '1em' }}>
                <Link to="/register">New user? Click here to register</Link>
            </div>
        ) : method === "register" ? (
            <div style={{ marginTop: '1em' }}>
                <Link to="/login">Already registered? Click here to log in</Link>
            </div>
        ) : null}
    </form>
}

export default Form