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

    const navigate = useNavigate();
    const pageName = method==="login" ? "Login" : "Register"

    const handleSubmit = async (e) =>{
        setLoading(true);
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
            alert(error)
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