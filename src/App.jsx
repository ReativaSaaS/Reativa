import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Toast from './components/Toast'

function App() {
  return (
    <Router>
      <div className="noise-overlay"></div>
      <div className="mesh-gradient"></div>
      <div className="grid-pattern"></div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Toast />
    </Router>
  )
}

export default App
