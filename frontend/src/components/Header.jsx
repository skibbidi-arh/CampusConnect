import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context/AuthContext'
import { useEffect } from 'react';

export default function Header({ onMenuToggle, showMenuButton = true, handlelogout, onProfileClick }) {
  const {User} = AuthContext()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false)
      }
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileMenu, showNotifications])

  return (
    <nav className="sticky top-0 z-50 border-b border-red-800/20 bg-gradient-to-r from-[#e50914] via-[#b00020] to-[#8b0018] shadow-lg backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="rounded-lg p-2 text-white/90 transition-all hover:bg-white/10 hover:text-white active:scale-95 lg:hidden"
                aria-label="Toggle sidebar"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 transition-opacity hover:opacity-90"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all group-hover:bg-white/20">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                IUTians Portal
              </span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="notifications-container relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg p-2 text-white/90 transition-all hover:bg-white/10 hover:text-white active:scale-95" 
                aria-label="Notifications"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400"></span>
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="mt-3 text-sm text-gray-500">No new notifications</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="profile-menu-container relative">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-tight text-white">
                    {User?.user_name || User?.user?.user_name || 'User'}
                  </p>
                  <p className="text-xs text-white/70">Student</p>
                </div>
                
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="group relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:border-white/40 hover:scale-105 active:scale-95 sm:h-10 sm:w-10"
                  aria-label="User menu"
                >
                  {!User?.image ? (
                    <svg className="h-full w-full p-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  ) : (
                    <img src={User?.image} alt="Profile" className="h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 rounded-full bg-white/0 transition-colors group-hover:bg-white/10" />
                </button>
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
                  <div className="border-b border-gray-100 px-4 py-3 sm:hidden">
                    <p className="text-sm font-semibold text-gray-900">
                      {User?.user_name || User?.user?.user_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        if (onProfileClick) {
                          onProfileClick()
                        } else {
                          navigate('/profile')
                        }
                        setShowProfileMenu(false)
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">My Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/settings')
                        setShowProfileMenu(false)
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">Settings</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => {
                        handlelogout?.()
                        navigate('/login')
                        setShowProfileMenu(false)
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}