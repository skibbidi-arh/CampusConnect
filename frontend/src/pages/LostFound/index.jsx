import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GoBackButton from '../../components/GoBackButton'
import ItemCard from './components/ItemCard'
import PostItemForm from './components/PostItemForm'
import Loading from '../../components/Loading'
import { AuthContext } from '../../context/AuthContext'

export default function LostFound() {
  const { User } = AuthContext()
  const [activeTab, setActiveTab] = useState('all')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [isSelected,setIsSelected]=useState('')

  const handleContact=(itemId)=>{
    console.log(itemId)

  }

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('http://localhost:4000/api/lost-items/all')
      if (response.data.success) {
        setItems(response.data.items)
        console.log(response.data.items)
      }
    } catch (error) {
      toast.error('Failed to load lost items')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filterByDate = (items) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return items.filter(item => {
      const itemDate = new Date(item.createdAt || item.created_at)
      
      switch(dateFilter) {
        case 'today':
          return itemDate >= today
        case 'week':
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          return itemDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return itemDate >= monthAgo
        case 'older':
          const threeMonthsAgo = new Date(today)
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
          return itemDate < threeMonthsAgo
        default:
          return true
      }
    })
  }

  const filterBySearch = (items) => {
    if (!searchQuery.trim()) return items
    
    const query = searchQuery.toLowerCase()
    return items.filter(item => 
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    )
  }

  const applyFilters = (items) => {
    let filtered = items
    filtered = filterBySearch(filtered)
    filtered = filterByDate(filtered)
    return filtered
  }

  const globalLostItems = applyFilters(items.filter(item => !item.isFound))
  const myItems = items.filter(item => item.ownerId === User?.users_id)
  const myActiveItems = applyFilters(myItems.filter(item => !item.isFound))
  const myFoundItems = applyFilters(myItems.filter(item => item.isFound))

  const handleNewItem = async (formData) => {
    const token = sessionStorage.getItem('authToken')
    try {
      const response = await axios.post(
        'http://localhost:4000/api/lost-items/create',
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.data.success) {
        fetchItems()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating post')
    }
  }

  const handleMarkAsFound = async (itemId) => {
    const token = sessionStorage.getItem('authToken')
    try {
      const response = await axios.put(
        `http://localhost:4000/api/lost-found/found/${itemId}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.data.success) {
        toast.success('Item marked as found!')
        fetchItems()
      }
    } catch (error) {
      toast.error('Failed to update item status')
    }
  }

  const handleDeleteItem = async (itemId) => {
    const token = sessionStorage.getItem('authToken')
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/lost-items/delete/${itemId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.data.success) {
        toast.success('Item deleted successfully!')
        fetchItems()
      }
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setDateFilter('all')
  }

  const activeFiltersCount = (searchQuery ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header showMenuButton={false} />

      <main className="container mx-auto flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GoBackButton />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Digital Lost & Found</h1>
                <p className="mt-1 text-sm text-gray-600">Report and recover lost items on campus</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all ${activeTab === 'all' ? 'bg-gradient-to-r from-[#e50914] to-[#b00020] text-white shadow-lg' : 'bg-white text-gray-700 shadow-md hover:shadow-lg'}`}
                >
                  Lost Items ({globalLostItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('my-items')}
                  className={`flex-1 rounded-xl px-6 py-3 font-semibold transition-all ${activeTab === 'my-items' ? 'bg-gradient-to-r from-[#e50914] to-[#b00020] text-white shadow-lg' : 'bg-white text-gray-700 shadow-md hover:shadow-lg'}`}
                >
                  My Items ({myItems.length})
                </button>
              </div>

              <div className="mb-6 space-y-4 rounded-xl bg-white p-4 shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search items by name, description, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border-2 placeholder-black bg-gray-200 border-gray-200 px-4 py-2.5 pl-10 text-sm transition-colors focus:border-red-500 focus:outline-none"
                    />
                    <svg 
                      className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative inline-flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-red-500 hover:text-red-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>

                {showFilters && (
                  <div className="animate-[fade-in_200ms_ease-out] space-y-3 border-t border-gray-200 pt-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Date</label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                        <button
                          onClick={() => setDateFilter('all')}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${dateFilter === 'all' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          All Time
                        </button>
                        <button
                          onClick={() => setDateFilter('today')}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${dateFilter === 'today' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setDateFilter('week')}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${dateFilter === 'week' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          This Week
                        </button>
                        <button
                          onClick={() => setDateFilter('month')}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${dateFilter === 'month' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          This Month
                        </button>
                        <button
                          onClick={() => setDateFilter('older')}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${dateFilter === 'older' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          Older
                        </button>
                      </div>
                    </div>

                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              {isLoading ? (
                <Loading text="Loading items" />
              ) : (
                <div className="space-y-6">
                  {activeTab === 'all' && (
                    <>
                      {globalLostItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          {globalLostItems.map((item, index) => (
                            <ItemCard key={item.item_id} item={item} setIsSelected={setIsSelected} isSelected={item.item_id} index={index} onMarkAsFound={handleMarkAsFound} showMarkAsFound={false} isOwnItem={false} />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white py-12 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="mt-4 text-base font-medium text-gray-900">No items found</p>
                          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'my-items' && (
                    <div className="space-y-8">
                      {myActiveItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          {myActiveItems.map((item, index) => (
                            <ItemCard key={item.item_id} item={item} index={index} onDelete={handleDeleteItem} showMarkAsFound={true} isOwnItem={true} />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white py-12 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="mt-4 text-base font-medium text-gray-900">No active items</p>
                          <p className="mt-1 text-sm text-gray-500">Post a lost item to get started</p>
                        </div>
                      )}
                      {myFoundItems.length > 0 && (
                        <div className="border-t border-gray-200 pt-8">
                          <h3 className="mb-4 text-xl font-bold text-gray-800">Found History</h3>
                          <div className="grid grid-cols-1 gap-6 opacity-75 sm:grid-cols-2">
                            {myFoundItems.map((item, index) => (
                              <ItemCard key={item.item_id} item={item} index={index} showMarkAsFound={false} isHistory={true} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <PostItemForm onSubmit={handleNewItem} User={User} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}