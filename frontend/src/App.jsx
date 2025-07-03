import react from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout(){
  localStorage.clear();
  return <Navigate to="/login"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}

function App() {
  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Home/> </ProtectedRoute>} />
          <Route path="/login" element={ <Login/> } />
          <Route path="/logout" element={ <Logout/> } />
          <Route path="/register" element={ <RegisterAndLogout/> } />
          <Route path="*" element={ <NotFound/> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App