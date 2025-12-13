import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context/AuthContext'

export default function Header({ onMenuToggle, showMenuButton = true }) {
  const {User} = AuthContext()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const handlelogout=()=>{
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#e50914] via-[#b00020] to-[#8b0018] shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuToggle}
              className="rounded-lg p-2 text-white transition-all hover:bg-white/20 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-2xl font-extrabold tracking-wide text-white transition-opacity hover:opacity-90"
          >
            IUTians Portal
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button 
            className="relative rounded-lg p-2 text-white transition-all hover:bg-white/20" 
            aria-label="Notifications"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-yellow-400"></span>
          </button>
          
          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 rounded-lg p-1 transition-all hover:bg-white/10"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">{User?.user_name || User?.user?.user_name}</p>
                <p className="text-xs text-white/80">IUT Student</p>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white/20 backdrop-blur-sm">
                <svg className="h-full w-full text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-2xl animate-[fade-up_200ms_ease-out]">
                <button
                  onClick={() => {
                    navigate('/profile')
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-t-xl px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-semibold">Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/settings')
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold">Settings</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/login')
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-b-xl border-t px-4 py-3 text-left text-[#b00020] transition-colors hover:bg-red-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span onClick={handlelogout} className="font-semibold">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
