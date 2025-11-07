import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

// Get API URL from environment variable (set at build time)
const API_URL = import.meta.env.VITE_API_URL

// Log for debugging (remove in production)
if (!API_URL) {
    console.error("VITE_API_URL is not set! API calls will fail.")
}

const api = axios.create({
    baseURL: API_URL,
    timeout: 60000, // 60 seconds timeout for Render free tier cold starts
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

// Add response interceptor for better error logging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log detailed error information
        if (error.request && !error.response) {
            console.error('Network Error Details:', {
                url: error.config?.url,
                baseURL: error.config?.baseURL,
                method: error.config?.method,
                message: error.message,
                code: error.code
            })
        }
        return Promise.reject(error)
    }
)

export default api