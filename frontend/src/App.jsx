import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Placeholder routes for dashboard features */}
        <Route path="/calendar" element={<Dashboard />} />
        <Route path="/medical" element={<Dashboard />} />
        <Route path="/chatbot" element={<Dashboard />} />
        <Route path="/lost-found" element={<Dashboard />} />
        <Route path="/feedback" element={<Dashboard />} />
        <Route path="/marketplace" element={<Dashboard />} />
        <Route path="/accommodation" element={<Dashboard />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
