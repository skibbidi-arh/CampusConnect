import { useState } from 'react'
import Header from '../../components/Header'
import GoBackButton from '../../components/GoBackButton'
import EmergencyContacts from './components/EmergencyContacts'
import BloodBank from './components/BloodBank'
import BloodRequests from './components/BloodRequests'
import Footer from '../../components/Footer'

export default function MedicalSupport() {
  const [activeTab, setActiveTab] = useState('emergency')

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navbar */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
        {/* Go Back Button */}
        <GoBackButton />

        {/* Header Section */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e50914] via-[#b00020] to-[#8b0018] p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:20px_20px]" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">
                Campus Blood Support
              </h1>
            </div>
            <p className="text-lg text-white/90 ml-[68px]">
              Emergency contacts and blood donation services
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('emergency')}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold shadow-md transition-all hover:shadow-lg active:scale-95 ${
                activeTab === 'emergency'
                  ? 'bg-gradient-to-r from-[#e50914] to-[#b00020] text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Emergency Contacts
            </button>
            <button
              onClick={() => setActiveTab('blood')}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold shadow-md transition-all hover:shadow-lg active:scale-95 ${
                activeTab === 'blood'
                  ? 'bg-gradient-to-r from-[#e50914] to-[#b00020] text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Blood Bank
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold shadow-md transition-all hover:shadow-lg active:scale-95 ${
                activeTab === 'alerts'
                  ? 'bg-gradient-to-r from-[#e50914] to-[#b00020] text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              View Blood Requests
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'emergency' && <EmergencyContacts />}
          {activeTab === 'blood' && <BloodBank />}
          {activeTab === 'alerts' && <BloodRequests />}
        </div>
      </main>

      <Footer />
    </div>
  )
}
