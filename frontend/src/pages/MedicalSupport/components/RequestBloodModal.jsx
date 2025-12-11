import { X, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function RequestBloodModal({ isOpen, onClose }) {
  const [isEmergency, setIsEmergency] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#e50914]">Submit Blood Request</h3>
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
          const dueDate = formData.get('dueDate')
          const location = formData.get('location')
          
          if (!bloodGroup || bloodGroup === '--- Select Group ---') {
            toast.error('Please select a blood group')
            return
          }
          if (!mobile || mobile.length < 10) {
            toast.error('Please enter a valid mobile number')
            return
          }
          if (!dueDate) {
            toast.error('Please select blood due date')
            return
          }
          if (!location || !location.trim()) {
            toast.error('Please enter your location')
            return
          }
          
          const toastId = toast.loading('Submitting blood request...')
          setTimeout(() => {
            if (isEmergency) {
              toast.success('🚨 Emergency blood request submitted successfully!', { 
                id: toastId,
                duration: 5000,
              })
            } else {
              toast.success('Blood request submitted successfully!', { id: toastId })
            }
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
              Blood Due Date
            </label>
            <input
              type="date"
              name="dueDate"
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

          {/* Emergency Request Checkbox */}
          <div className={`rounded-lg border-2 p-4 transition ${
            isEmergency 
              ? 'border-[#e50914] bg-red-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="emergencyRequest"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-[#e50914] focus:ring-2 focus:ring-[#e50914]/20"
              />
              <div className="flex-1">
                <label 
                  htmlFor="emergencyRequest" 
                  className="cursor-pointer font-semibold text-gray-800 flex items-center gap-2"
                >
                  <AlertCircle className={`h-5 w-5 ${isEmergency ? 'text-[#e50914]' : 'text-gray-500'}`} />
                  Emergency Blood Request
                </label>
                <p className="mt-1 text-xs text-gray-600">
                  Check this if blood is required within the next hour
                </p>
              </div>
            </div>
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
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
