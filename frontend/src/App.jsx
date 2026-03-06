import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MedicalSupport from './pages/MedicalSupport/index'
import LostFound from './pages/LostFound/index'
import RoommateWanted from './pages/RoommateWanted/index'
import Navbar from './pages/Anonymous/components/Navbar'
import SubmitFeedback from './pages/Anonymous/pages/SubmitFeedback'
import CategoryFeedback from './pages/Anonymous/pages/CategoryFeedback'
import Home from './pages/Anonymous/pages/Home'

// Marketplace
import MarketplaceFeed from './pages/Marketplace/index'
import CreateMarketplacePost from './pages/Marketplace/CreatePost'
import MyMarketplacePosts from './pages/Marketplace/MyPosts'
import MarketplaceItemDetails from './pages/Marketplace/ItemDetails'

// 1. FIXED Layout component with a container
const AnonymousLayout = () => (
  <Outlet />
);

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Dashboard />} />
        <Route path="/medical" element={<Dashboard />} />
        <Route path="/medical-support" element={<MedicalSupport />} />
        <Route path="/chatbot" element={<Dashboard />} />
        <Route path="/lost-found" element={<LostFound />} />
        <Route path="/feedback" element={<Dashboard />} />

        {/* Marketplace Routes */}
        <Route path="/marketplace" element={<MarketplaceFeed />} />
        <Route path="/marketplace/create" element={<CreateMarketplacePost />} />
        <Route path="/marketplace/my-posts" element={<MyMarketplacePosts />} />
        <Route path="/marketplace/:id" element={<MarketplaceItemDetails />} />

        <Route path="/accommodation" element={<RoommateWanted />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />

        {/* 2. Routes WITH Navbar */}
        <Route element={<AnonymousLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/submit" element={<SubmitFeedback />} />
          <Route path="/category/:category" element={<CategoryFeedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App