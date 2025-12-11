import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Header from '../../components/MedicalSupport/Header'
import EmergencyContacts from './components/EmergencyContacts'
import BloodBank from './components/BloodBank'
import BloodRequests from './components/BloodRequests'
import Footer from '../../components/Footer'

export default function MedicalSupport() {
  const [activeTab, setActiveTab] = useState('emergency')

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Medical Alerts Banner */}
      <div className="bg-gradient-to-r from-red-100 to-pink-100 border-l-4 border-[#e50914] px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#e50914]" />
            <div>
              <h3 className="font-bold text-[#b00020]">Important Notice</h3>
              <p className="text-sm text-gray-700">
                Blood donation camp scheduled for December 15, 2025. Register now to participate. Urgent need for O+ and AB- blood groups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'emergency' && <EmergencyContacts />}
        {activeTab === 'blood' && <BloodBank />}
        {activeTab === 'alerts' && <BloodRequests />}
      </main>

      <Footer />
    </div>
  )
}
