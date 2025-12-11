import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MedicalSupport from './pages/MedicalSupport/index'
import LostFound from './pages/LostFound/index'
import RoommateWanted from './pages/RoommateWanted'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#ef4444',
            },
          },
          loading: {
            iconTheme: {
              primary: '#e50914',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Placeholder routes for dashboard features */}
        <Route path="/calendar" element={<Dashboard />} />
        <Route path="/medical-support" element={<MedicalSupport />} />
        <Route path="/chatbot" element={<Dashboard />} />
        <Route path="/lost-found" element={<LostFound />} />
        <Route path="/feedback" element={<Dashboard />} />
        <Route path="/marketplace" element={<Dashboard />} />
        <Route path="/roommate-wanted" element={<RoommateWanted />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
