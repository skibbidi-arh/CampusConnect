import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GoBackButton from '../../components/GoBackButton'
import ItemCard from './components/ItemCard'
import PostItemForm from './components/PostItemForm'

export default function LostFound() {
  // Simulated current user ID (in real app, get from auth)
  const currentUserId = 'user@iut-dhaka.edu'
  
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'my-items'
  const [items, setItems] = useState([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400',
      name: 'Black Leather Wallet',
      description: 'Black leather wallet with multiple card slots. Contains student ID.',
      date: '2025-12-10',
      location: 'Library 2nd Floor',
      phoneNumber: '01712345678',
      facebookId: 'john.doe.iut',
      isFound: false,
      userId: 'abc123@iut-dhaka.edu',
      contactInfo: 'abc123@iut-dhaka.edu'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
      name: 'iPhone 13 Pro',
      description: 'Space gray iPhone 13 Pro with cracked screen protector. Navy blue case.',
      date: '2025-12-09',
      location: 'Cafeteria',
      phoneNumber: '01823456789',
      facebookId: '',
      isFound: false,
      userId: 'def456@iut-dhaka.edu',
      contactInfo: 'def456@iut-dhaka.edu'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=400',
      name: 'Student ID Card',
      description: 'IUT student ID card - Name partially visible',
      date: '2025-12-08',
      location: 'SAC Building',
      phoneNumber: '01934567890',
      facebookId: 'https://facebook.com/user.profile',
      isFound: false,
      userId: currentUserId,
      contactInfo: currentUserId
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1585076641399-5c06d1b3365f?w=400',
      name: 'Gray Backpack',
      description: 'North Face gray backpack with laptop compartment',
      date: '2025-12-07',
      location: 'Academic Building 1',
      phoneNumber: '01645678901',
      facebookId: 'backpack.owner',
      isFound: false,
      userId: 'jkl012@iut-dhaka.edu',
      contactInfo: 'jkl012@iut-dhaka.edu'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1574420829479-b00ba5f2c68f?w=400',
      name: 'Blue Water Bottle',
      description: 'Stainless steel blue water bottle with "IUT" sticker',
      date: '2025-12-06',
      location: 'Sports Complex',
      phoneNumber: '01756789012',
      facebookId: '',
      isFound: true,
      userId: currentUserId,
      contactInfo: currentUserId
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400',
      name: 'Calculator (Casio)',
      description: 'Casio scientific calculator fx-991EX',
      date: '2025-12-05',
      location: 'Exam Hall',
      phoneNumber: '01867890123',
      facebookId: 'calc.owner.iut',
      isFound: false,
      userId: currentUserId,
      contactInfo: currentUserId
    }
  ])

  // Filter items for global lost items list (not found yet)
  const globalLostItems = items.filter(item => !item.isFound)
  
  // Filter items posted by current user
  const myItems = items.filter(item => item.userId === currentUserId)
  const myActiveItems = myItems.filter(item => !item.isFound)
  const myFoundItems = myItems.filter(item => item.isFound)

  const handleNewItem = (newItem) => {
    const item = {
      id: items.length + 1,
      ...newItem,
      isFound: false,
      userId: currentUserId,
      contactInfo: currentUserId
    }
    setItems([item, ...items])
  }

  const handleMarkAsFound = (itemId) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isFound: true } : item
      )
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navbar */}
      <Header showMenuButton={false} />

      {/* Main Content */}
      <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GoBackButton />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Digital Lost & Found
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Report and recover lost items on campus
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Section - Main Content Area */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b00020] text-white shadow-lg'
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Lost Items ({globalLostItems.length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('my-items')}
                  className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all ${
                    activeTab === 'my-items'
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b00020] text-white shadow-lg'
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Items ({myItems.length})</span>
                  </div>
                </button>
              </div>

              {/* Global Lost Items List */}
              {activeTab === 'all' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">All Lost Items</h2>
                    <p className="text-sm text-gray-600 mt-1">Help others find their belongings</p>
                  </div>

                  {globalLostItems.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">All Clear!</h3>
                      <p className="text-gray-600">No lost items at the moment. Great news!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {globalLostItems.map((item, index) => (
                        <ItemCard 
                          key={item.id} 
                          item={item} 
                          index={index}
                          onMarkAsFound={handleMarkAsFound}
                          showMarkAsFound={false}
                          isOwnItem={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My Lost Items Section */}
              {activeTab === 'my-items' && (
                <div>
                  {/* Active Items */}
                  <div className="mb-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">My Active Lost Items</h2>
                      <p className="text-sm text-gray-600 mt-1">Items you reported that are still lost</p>
                    </div>

                    {myActiveItems.length === 0 ? (
                      <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                          <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Lost Items</h3>
                        <p className="text-gray-600">You haven't reported any lost items yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {myActiveItems.map((item, index) => (
                          <ItemCard 
                            key={item.id} 
                            item={item} 
                            index={index}
                            onMarkAsFound={handleMarkAsFound}
                            showMarkAsFound={true}
                            isOwnItem={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Found Items History */}
                  {myFoundItems.length > 0 && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Found Items History</h2>
                        <p className="text-sm text-gray-600 mt-1">Items you previously marked as found</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {myFoundItems.map((item, index) => (
                          <ItemCard 
                            key={item.id} 
                            item={item} 
                            index={index}
                            onMarkAsFound={handleMarkAsFound}
                            showMarkAsFound={false}
                            isHistory={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Section - Post Item Form */}
            <div className="lg:col-span-1">
              <PostItemForm onSubmit={handleNewItem} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
