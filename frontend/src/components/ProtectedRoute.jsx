import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import api from "../api"
import { useEffect, useState } from "react"

function ProtectedRoute({children}){
    const [IsAuthorized, setIsAuthorized] = useState(null);

    useEffect(()=>{
        auth().catch(()=>setIsAuthorized(false))
    }, [])

    const refreshToken = async () =>{
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            // send a request with the refresh token to try and get a new access token
            const res = await api.post("api/token/refresh/", {refresh: refreshToken})

            if(res.status===200){

                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            }else{
                setIsAuthorized(false)
            }

        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () =>{

        const token = localStorage.getItem(ACCESS_TOKEN)

        if(!token){
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now()/1000

        if(now>tokenExpiration){
            await refreshToken()
        }else{
            setIsAuthorized(true)
        }

    }

    if(IsAuthorized === null)
        return(<div>Loading...</div>)

    return IsAuthorized ? children : <Navigate to="/login"/>
}

export default ProtectedRoute