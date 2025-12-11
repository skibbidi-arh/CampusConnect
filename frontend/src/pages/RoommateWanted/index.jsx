import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GoBackButton from '../../components/GoBackButton'
import RoommateCard from './components/RoommateCard'
import PostRoommateForm from './components/PostRoommateForm'

export default function RoommateWanted() {
  // Simulated current user ID (in real app, get from auth)
  const currentUserId = 'user@iut-dhaka.edu'
  
  const [showForm, setShowForm] = useState(false)
  const [listings, setListings] = useState([
    {
      id: 1,
      area: 'Board Bazar',
      fullAddress: 'House 24, Road 3, Board Bazar, Gazipur',
      floor: '3rd Floor',
      currentStudents: 3,
      studentsInfo: [
        { studentId: 'IUT200101', batch: '2020' },
        { studentId: 'IUT200145', batch: '2020' },
        { studentId: 'IUT210089', batch: '2021' }
      ],
      rent: 8500,
      facilities: 'WiFi, Washing Machine, Geyser, Meal Service, Parking',
      contactInfo: '01712345678',
      postedBy: 'abc123@iut-dhaka.edu',
      postedDate: '2025-12-10',
      userName: 'Ahmed Rahman',
      isGirlsOnly: false
    },
    {
      id: 2,
      area: 'Rajendrapur',
      fullAddress: 'Flat 4B, Sunshine Apartment, Rajendrapur Main Road',
      floor: '4th Floor',
      currentStudents: 2,
      studentsInfo: [
        { studentId: 'IUT190234', batch: '2019' },
        { studentId: 'IUT200178', batch: '2020' }
      ],
      rent: 9000,
      facilities: 'WiFi, Generator, Geyser, Attached Bathroom',
      contactInfo: '01823456789',
      postedBy: 'def456@iut-dhaka.edu',
      postedDate: '2025-12-09',
      userName: 'Sakib Hasan',
      isGirlsOnly: false
    },
    {
      id: 3,
      area: 'Ershad Nagar',
      fullAddress: 'House 12/A, Lane 5, Ershad Nagar',
      floor: '2nd Floor',
      currentStudents: 0,
      studentsInfo: [],
      rent: 7000,
      facilities: 'WiFi, Washing Machine, Common Kitchen',
      contactInfo: '01934567890',
      postedBy: currentUserId,
      postedDate: '2025-12-08',
      userName: 'Aisha Rahman',
      isGirlsOnly: true
    },
    {
      id: 4,
      area: 'Tongi',
      fullAddress: 'House 45, Sector 7, Tongi',
      floor: '1st Floor',
      currentStudents: 2,
      studentsInfo: [
        { studentId: 'IUT200256', batch: '2020' },
        { studentId: 'IUT210134', batch: '2021' }
      ],
      rent: 8000,
      facilities: 'WiFi, Geyser, Balcony, Study Room',
      contactInfo: '01645678901',
      postedBy: 'jkl012@iut-dhaka.edu',
      postedDate: '2025-12-07',
      userName: 'Fahim Ahmed',
      isGirlsOnly: false
    },
    {
      id: 5,
      area: 'Board Bazar',
      fullAddress: 'House 67, Road 8, Board Bazar',
      floor: '2nd Floor',
      currentStudents: 0,
      studentsInfo: [],
      rent: 7500,
      facilities: '',
      contactInfo: '01756789012',
      postedBy: 'mno345@iut-dhaka.edu',
      postedDate: '2025-12-06',
      userName: 'Fatima Noor',
      isGirlsOnly: true
    },
    {
      id: 6,
      area: 'Rajendrapur',
      fullAddress: 'Flat 2A, Green Valley, Rajendrapur',
      floor: '2nd Floor',
      currentStudents: 1,
      studentsInfo: [
        { studentId: 'IUT190089', batch: '2019' }
      ],
      rent: 10000,
      facilities: 'WiFi, AC, Geyser, Generator, Washing Machine, Parking',
      contactInfo: '01867890123',
      postedBy: 'pqr678@iut-dhaka.edu',
      postedDate: '2025-12-05',
      userName: 'Rifat Mahmud',
      isGirlsOnly: false
    }
  ])

  const handleAddListing = (newListing) => {
    const listing = {
      ...newListing,
      id: Date.now(),
      postedBy: currentUserId,
      postedDate: new Date().toISOString().split('T')[0],
      userName: 'Current User' // In real app, get from user profile
    }
    setListings([listing, ...listings])
    setShowForm(false)
  }

  // Sort listings by date (newest first)
  const sortedListings = [...listings].sort((a, b) => 
    new Date(b.postedDate) - new Date(a.postedDate)
  )

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GoBackButton />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Roommate Wanted
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Find your perfect roommate or post your available room
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b00020] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showForm ? 'Cancel' : 'Post Ad'}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-[#e50914] to-[#b00020] p-3 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-[#b00020] to-[#8b0018] p-3 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Roommates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(listings.reduce((sum, l) => sum + l.currentStudents, 0) / listings.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-[#e50914] via-[#b00020] to-[#8b0018] p-3 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Rent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ৳{Math.round(listings.reduce((sum, l) => sum + l.rent, 0) / listings.length)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Listings Section */}
            <div className="lg:col-span-2">
              {sortedListings.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No listings yet</h3>
                  <p className="mt-2 text-gray-600">Be the first to post a roommate wanted ad!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Available Rooms ({sortedListings.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {sortedListings.map((listing) => (
                      <RoommateCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Tips</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e50914]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Always verify contact information before sharing personal details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e50914]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Visit the location in person before making any commitments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e50914]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Check student IDs to ensure they're current IUT students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e50914]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Discuss house rules and expectations clearly beforehand</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e50914]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Confirm all facilities listed are actually available</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 rounded-lg bg-gradient-to-br from-[#e50914]/10 to-[#b00020]/10 p-4">
                    <div className="flex items-start gap-3">
                      <svg className="h-6 w-6 flex-shrink-0 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-gray-900">Safety First</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          This platform is for IUT students only. Report any suspicious listings immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Post Roommate Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <PostRoommateForm 
              onSubmit={handleAddListing}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
