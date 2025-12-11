import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Dashboard() {

  const features = [
    {
      id: 1,
      title: 'Unified Event Calendar',
      description: 'Master view of campus events, club activities, and reminders',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: '/calendar',
      color: 'from-[#e50914] to-[#b00020]'
    },
    {
      id: 2,
      title: 'Blood Support',
      description: 'Channel for blood donation requests',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      link: '/medical-support',
      color: 'from-[#b00020] to-[#8b0018]'
    },
    {
      id: 3,
      title: 'AI Chatbot',
      description: 'Your intelligent student assistant for campus queries',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      link: '/chatbot',
      color: 'from-[#e50914] via-[#b00020] to-[#8b0018]'
    },
    {
      id: 4,
      title: 'Digital Lost & Found',
      description: 'Post and view lost items across campus',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      link: '/lost-found',
      color: 'from-[#8b0018] to-[#b00020]'
    },
    {
      id: 5,
      title: 'Anonymous Feedback',
      description: 'Secure grievance and suggestion submission box',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      link: '/feedback',
      color: 'from-[#b00020] to-[#e50914]'
    },
    {
      id: 6,
      title: 'Marketplace for IUTians',
      description: 'Local marketplace for buying and selling',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      link: '/marketplace',
      color: 'from-[#e50914] to-[#8b0018]'
    },
    {
      id: 7,
      title: 'Flat/Roommate Finder',
      description: 'Accommodation listings for non-residential students',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      link: '/accommodation',
      color: 'from-[#8b0018] via-[#b00020] to-[#e50914]'
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navbar */}
      <Header showMenuButton={false} />

      {/* Main Content */}
      <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e50914] via-[#b00020] to-[#8b0018] p-8 text-white shadow-2xl animate-[fade-up_700ms_ease-out_both]">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:20px_20px]" aria-hidden="true" />
            <div className="relative z-10">
              <h2 className="mb-2 text-3xl font-extrabold tracking-wide md:text-4xl">
                Welcome Back! 👋
              </h2>
              <p className="text-lg text-white/90">
                Your personalized IUTians portal dashboard
              </p>
            </div>
          </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <a
                key={feature.id}
                href={feature.link}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-[pop-in_550ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card Background Pattern */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background-image:radial-gradient(rgba(229,9,20,0.1)_1px,transparent_1px)] [background-size:20px_20px]" aria-hidden="true" />
                
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} aria-hidden="true" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="mb-2 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-[#b00020]">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                  
                  {/* Arrow Icon */}
                  <div className="mt-4 flex items-center text-[#b00020] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                    <span className="mr-2 text-sm font-semibold">Explore</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

        {/* Quick Stats Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Upcoming Events</p>
                  <p className="mt-1 text-3xl font-bold text-[#b00020]">12</p>
                </div>
                <div className="rounded-full bg-gradient-to-br from-[#e50914] to-[#b00020] p-3 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Active Listings</p>
                  <p className="mt-1 text-3xl font-bold text-[#b00020]">28</p>
                </div>
                <div className="rounded-full bg-gradient-to-br from-[#b00020] to-[#8b0018] p-3 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Notifications</p>
                  <p className="mt-1 text-3xl font-bold text-[#b00020]">5</p>
                </div>
                <div className="rounded-full bg-gradient-to-br from-[#e50914] via-[#b00020] to-[#8b0018] p-3 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
      </main>

      {/* Footer */}
      <Footer />

      <style>{`
        @keyframes pop-in { 
          0% { opacity: 0; transform: scale(0.92);} 
          100% { opacity: 1; transform: scale(1);} 
        }
        @keyframes fade-up { 
          0% { opacity: 0; transform: translateY(12px);} 
          100% { opacity: 1; transform: translateY(0);} 
        }
      `}</style>
    </div>
  )
}
    