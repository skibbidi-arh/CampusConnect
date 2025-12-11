import { useState } from 'react'
import { Users, Droplet, Phone, MapPin, Clock } from 'lucide-react'
import AddDonorModal from './modals/AddDonorModal'
import RequestBloodModal from './modals/RequestBloodModal'

export default function BloodBank() {
  const [showDonorModal, setShowDonorModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)

  const donors = [
    {
      id: 1,
      name: 'Ahmed Rahman',
      bloodGroup: 'A+',
      lastDonation: '2024-09-15',
      location: 'Campus Dorm A',
      mobile: '+880 1711-123456',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Fatima Khan',
      bloodGroup: 'O+',
      lastDonation: '2024-10-20',
      location: 'Campus Dorm B',
      mobile: '+880 1712-234567',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Sakib Hasan',
      bloodGroup: 'B+',
      lastDonation: '2024-11-05',
      location: 'Off Campus',
      mobile: '+880 1713-345678',
      status: 'Recently Donated'
    },
    {
      id: 4,
      name: 'Nusrat Jahan',
      bloodGroup: 'AB+',
      lastDonation: '2024-08-30',
      location: 'Campus Dorm C',
      mobile: '+880 1714-456789',
      status: 'Available'
    }
  ]

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Blood Donation Portal</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDonorModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e50914] to-[#b00020] px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              <Users className="h-5 w-5" />
              Be a Donor
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#e50914] bg-white px-6 py-3 font-semibold text-[#e50914] transition hover:bg-[#e50914] hover:text-white"
            >
              <Droplet className="h-5 w-5" />
              Request Blood
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e50914] to-[#b00020] text-white">
                  <span className="text-2xl font-bold">{donor.bloodGroup}</span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    donor.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {donor.status}
                </span>
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-800">{donor.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{donor.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{donor.mobile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last: {donor.lastDonation}</span>
                </div>
              </div>
              {donor.status === 'Available' && (
                <button className="mt-4 w-full rounded-full bg-gradient-to-r from-[#e50914] to-[#b00020] py-2 text-sm font-semibold text-white transition hover:shadow-lg">
                  Contact Donor
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 p-8 text-center shadow-lg">
          <Droplet className="mx-auto mb-4 h-12 w-12 text-[#e50914]" />
          <h3 className="mb-2 text-xl font-bold text-gray-800">Click the "Be a Donor" tab to open the registration form.</h3>
          <p className="text-gray-600">Help save lives by registering as a blood donor today.</p>
        </div>
      </div>

      <AddDonorModal 
        isOpen={showDonorModal} 
        onClose={() => setShowDonorModal(false)} 
      />
      <RequestBloodModal 
        isOpen={showRequestModal} 
        onClose={() => setShowRequestModal(false)} 
      />
    </>
  )
}
