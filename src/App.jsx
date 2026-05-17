import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Toast from './components/Toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="noise-overlay"></div>
        <div className="mesh-gradient"></div>
        <div className="grid-pattern"></div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <Toast />
      </Router>
    </ErrorBoundary>
  )
}

export default App
