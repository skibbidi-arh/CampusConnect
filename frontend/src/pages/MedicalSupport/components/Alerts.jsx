import { useState } from 'react'
import { AlertCircle, Phone, MapPin, Calendar, Filter } from 'lucide-react'

export default function BloodRequests() {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all')
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false)

  // Sample blood requests data
  const bloodRequests = [
    {
      id: 1,
      bloodGroup: 'O-',
      requester: 'John Doe',
      contact: '+880 1234-567890',
      location: 'Dhaka Medical College Hospital',
      dueDate: '2025-12-11',
      isEmergency: true,
      timePosted: '5 minutes ago'
    },
    {
      id: 2,
      bloodGroup: 'A+',
      requester: 'Jane Smith',
      contact: '+880 1987-654321',
      location: 'Square Hospital, Dhaka',
      dueDate: '2025-12-13',
      isEmergency: false,
      timePosted: '1 hour ago'
    },
    {
      id: 3,
      bloodGroup: 'B+',
      requester: 'Mike Johnson',
      contact: '+880 1555-444333',
      location: 'United Hospital, Gulshan',
      dueDate: '2025-12-12',
      isEmergency: true,
      timePosted: '30 minutes ago'
    },
    {
      id: 4,
      bloodGroup: 'AB+',
      requester: 'Sarah Wilson',
      contact: '+880 1777-888999',
      location: 'Apollo Hospital, Bashundhara',
      dueDate: '2025-12-15',
      isEmergency: false,
      timePosted: '3 hours ago'
    },
    {
      id: 5,
      bloodGroup: 'O+',
      requester: 'David Brown',
      contact: '+880 1666-555444',
      location: 'Evercare Hospital, Dhaka',
      dueDate: '2025-12-11',
      isEmergency: true,
      timePosted: '15 minutes ago'
    }
  ]

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  // Filter blood requests
  const filteredRequests = bloodRequests.filter(request => {
    const matchesBloodGroup = selectedBloodGroup === 'all' || request.bloodGroup === selectedBloodGroup
    const matchesEmergency = !showEmergencyOnly || request.isEmergency
    return matchesBloodGroup && matchesEmergency
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Blood Requests</h2>
        <div className="text-sm text-gray-600">
          {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'} found
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Filter className="h-5 w-5" />
          <span>Filter Requests</span>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* Blood Group Filter */}
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Blood Group
            </label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
            >
              {bloodGroups.map(group => (
                <option key={group} value={group}>
                  {group === 'all' ? 'All Blood Groups' : group}
                </option>
              ))}
            </select>
          </div>

          {/* Emergency Filter */}
          <div className="flex items-center gap-3 sm:pt-6">
            <input
              type="checkbox"
              id="emergencyFilter"
              checked={showEmergencyOnly}
              onChange={(e) => setShowEmergencyOnly(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-[#e50914] focus:ring-2 focus:ring-[#e50914]/20"
            />
            <label htmlFor="emergencyFilter" className="cursor-pointer text-sm font-semibold text-gray-700">
              Emergency Only
            </label>
          </div>
        </div>
      </div>

      {/* Blood Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg text-gray-600">No blood requests found matching your filters.</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`rounded-2xl border-l-4 p-6 shadow-lg transition hover:shadow-xl ${
                request.isEmergency
                  ? 'border-[#e50914] bg-gradient-to-r from-red-50 to-pink-50'
                  : 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-block rounded-full bg-[#e50914] px-4 py-1 text-lg font-bold text-white">
                      {request.bloodGroup}
                    </span>
                    {request.isEmergency && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                        <AlertCircle className="h-3 w-3" />
                        EMERGENCY
                      </span>
                    )}
                  </div>
                  
                  <h3 className="mb-3 text-xl font-bold text-gray-800">{request.requester}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#e50914]" />
                      <span className="font-semibold">{request.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#e50914]" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#e50914]" />
                      <span>Needed by: {new Date(request.dueDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-xs text-gray-500">{request.timePosted}</p>
                </div>

                <button className="ml-4 rounded-full bg-gradient-to-r from-[#e50914] to-[#b00020] px-6 py-2 font-semibold text-white shadow-lg transition hover:shadow-xl">
                  Contact
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
