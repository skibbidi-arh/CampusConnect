import { X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddDonorModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#e50914]">Add New Donor Details</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          const bloodGroup = formData.get('bloodGroup')
          const mobile = formData.get('mobile')
          const lastDonation = formData.get('lastDonation')
          const location = formData.get('location')
          
          if (!bloodGroup || bloodGroup === '--- Select Group ---') {
            toast.error('Please select a blood group')
            return
          }
          if (!mobile || mobile.length < 10) {
            toast.error('Please enter a valid mobile number')
            return
          }
          if (!lastDonation) {
            toast.error('Please select last donation date')
            return
          }
          if (!location || !location.trim()) {
            toast.error('Please enter your location')
            return
          }
          
          const toastId = toast.loading('Saving donor details...')
          setTimeout(() => {
            toast.success('Donor added successfully!', { id: toastId })
            onClose()
          }, 1000)
        }}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Blood Group
            </label>
            <select name="bloodGroup" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20">
              <option>--- Select Group ---</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="e.g. 1234567890"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Last Donation Date
            </label>
            <input
              type="date"
              name="lastDonation"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="City, Area"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border-2 border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-gradient-to-r from-[#e50914] to-[#b00020] py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              Save Donor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
