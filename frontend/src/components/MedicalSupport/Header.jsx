import { AlertCircle } from 'lucide-react'

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 bg-[#e50914] shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Campus Blood Support</h1>
          <div className="flex items-center gap-4">
            <button className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30">
              <AlertCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('emergency')}
            className={`whitespace-nowrap rounded-full px-6 py-2 font-semibold transition ${
              activeTab === 'emergency'
                ? 'bg-white text-[#e50914]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Emergency Contacts
          </button>
          <button
            onClick={() => setActiveTab('blood')}
            className={`whitespace-nowrap rounded-full px-6 py-2 font-semibold transition ${
              activeTab === 'blood'
                ? 'bg-white text-[#e50914]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Blood Bank
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`whitespace-nowrap rounded-full px-6 py-2 font-semibold transition ${
              activeTab === 'alerts'
                ? 'bg-white text-[#e50914]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            View Blood Requests
          </button>
        </div>
      </div>
    </header>
  )
}
