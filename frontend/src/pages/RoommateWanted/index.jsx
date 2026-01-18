import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GoBackButton from '../../components/GoBackButton'
import RoommateCard from './components/RoommateCard'
import PostRoommateForm from './components/PostRoommateForm'
import { AuthContext } from '../../context/AuthContext' // Corrected import
import axios from 'axios'

export default function RoommateWanted() {
  const { User, setUser } = AuthContext(); // Use the global Auth state

  const [showForm, setShowForm] = useState(false)
  const [showGenderModal, setShowGenderModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [listings, setListings] = useState([])
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  console.log(User)

  const fetchAllListings = async () => {
    try {
      setIsLoadingListings(true)
      const token = sessionStorage.getItem('authToken')
      const response = await axios.get('http://localhost:4000/api/bookRoom/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      if (response.data.success) {
        setListings(response.data.listings)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setIsLoadingListings(false)
    }
  }

  // Fetch listings when component mounts
  useEffect(() => {
    fetchAllListings()
  }, [])
  const handlePostAdClick = () => {
    console.log('This is before adding the gender here ok then ')
    console.log(User)
    if (!User?.gender) {
      setShowGenderModal(true)
    } else {
      setShowForm(true)
    }
  }

  // Handle gender update using the shared profile update logic
  const handleGenderUpdate = async (selectedGender) => {
    setIsUpdating(true);
    try {
      const token = sessionStorage.getItem('authToken');

      const res = await axios.put(
        `http://localhost:4000/api/auth/update-profile`,
        { gender: selectedGender },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));

        setShowGenderModal(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Could not update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddListing = async (newListingData) => {
    try {
      const token = sessionStorage.getItem('authToken');

      const res = await axios.post(
        'http://localhost:4000/api/bookRoom/create',
        newListingData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        fetchAllListings();
        setShowForm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Filter listings based on user gender and isGirlsOnly preference
  const filteredListings = listings.filter((listing) => {
    if (!User?.gender) return true

    // If user is Female, show all listings
    if (User.gender === 'Female') {
      return true
    }

    // If user is Male, only show listings where isGirlsOnly is false
    if (User.gender === 'Male') {
      return !listing.isGirlsOnly
    }

    return true
  })

  const sortedListings = [...filteredListings].sort((a, b) =>
    new Date(b.postedDate) - new Date(a.postedDate)
  )
  const handleCancelListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to remove this ad?")) return;

    try {
      const token = sessionStorage.getItem('authToken');
      const res = await axios.delete(`http://localhost:4000/api/bookRoom/delete/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        fetchAllListings();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Could not delete ad");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GoBackButton />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Roommate Wanted</h1>
                <p className="mt-1 text-sm text-gray-600">Find your perfect roommate or post your available room</p>
              </div>
            </div>

            <button
              onClick={handlePostAdClick}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b00020] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
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
              <p className="text-sm text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
            </div>
            {/* ... Other stats ... */}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {sortedListings.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900">No listings yet</h3>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedListings.map((listing) => (
                    <RoommateCard key={listing.id} listing={listing} onCancel={handleCancelListing} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- STEP 1: GENDER UPDATE MODAL --- */}
      {showGenderModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">One Last Thing!</h2>
              <p className="text-gray-500 mt-2">To post ads, please select your gender for roommate matching.</p>
            </div>

            <div className="space-y-3">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  disabled={isUpdating}
                  onClick={() => handleGenderUpdate(g)}
                  className="w-full py-4 px-6 text-left border-2 border-gray-100 rounded-2xl hover:border-[#e50914] hover:bg-red-50 transition-all font-semibold text-gray-700 flex justify-between items-center group"
                >
                  {g}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#e50914]">Select →</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowGenderModal(false)}
              className="mt-6 w-full text-gray-400 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 2: POSTING FORM MODAL --- */}
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