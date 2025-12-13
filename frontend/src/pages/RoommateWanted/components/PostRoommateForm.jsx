import { useState } from 'react'

export default function PostRoommateForm({ onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [noRoommates, setNoRoommates] = useState(false)
  const [formData, setFormData] = useState({
    area: '',
    fullAddress: '',
    floor: '',
    currentStudents: 1,
    studentsInfo: [{ studentId: '', batch: '' }],
    rent: '',
    facilities: '',
    contactInfo: '',
    isGirlsOnly: false
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleStudentInfoChange = (index, field, value) => {
    const updatedStudents = [...formData.studentsInfo]
    updatedStudents[index][field] = value
    setFormData(prev => ({
      ...prev,
      studentsInfo: updatedStudents
    }))
  }

  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      studentsInfo: [...prev.studentsInfo, { studentId: '', batch: '' }],
      currentStudents: prev.currentStudents + 1
    }))
  }

  const removeStudent = (index) => {
    if (formData.studentsInfo.length > 1) {
      const updatedStudents = formData.studentsInfo.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        studentsInfo: updatedStudents,
        currentStudents: prev.currentStudents - 1
      }))
    }
  }

  const handleNoRoommatesToggle = () => {
    const newNoRoommates = !noRoommates
    setNoRoommates(newNoRoommates)
    
    if (newNoRoommates) {
      setFormData(prev => ({
        ...prev,
        currentStudents: 0,
        studentsInfo: []
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        currentStudents: 1,
        studentsInfo: [{ studentId: '', batch: '' }]
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required'
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = 'Full address is required'
    }

    if (!formData.floor.trim()) {
      newErrors.floor = 'Floor number is required'
    }

    if (!formData.rent || formData.rent <= 0) {
      newErrors.rent = 'Valid rent amount is required'
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required'
    } else if (!/^[0-9]{11}$/.test(formData.contactInfo.trim())) {
      newErrors.contactInfo = 'Contact must be a valid 11-digit phone number'
    }

    // Validate student info only if not "no roommates"
    if (!noRoommates) {
      const invalidStudents = formData.studentsInfo.some(
        student => !student.studentId.trim() || !student.batch.trim()
      )
      if (invalidStudents) {
        newErrors.studentsInfo = 'All student IDs and batches are required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSubmit(formData)
    setIsSubmitting(false)
    
    // Reset form
    setNoRoommates(false)
    setFormData({
      area: '',
      fullAddress: '',
      floor: '',
      currentStudents: 1,
      studentsInfo: [{ studentId: '', batch: '' }],
      rent: '',
      facilities: '',
      contactInfo: '',
      isGirlsOnly: false
    })
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Post Roommate Ad</h3>
        <button
          onClick={onCancel}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Location Section */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Area <span className="text-[#e50914]">*</span>
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g., Board Bazar, Rajendrapur"
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#e50914]/20 ${
              errors.area ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#e50914]'
            }`}
          />
          {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Full Address <span className="text-[#e50914]">*</span>
          </label>
          <textarea
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            placeholder="House/Flat number, Road, detailed location"
            rows="2"
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#e50914]/20 ${
              errors.fullAddress ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#e50914]'
            }`}
          />
          {errors.fullAddress && <p className="mt-1 text-xs text-red-600">{errors.fullAddress}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Floor Number <span className="text-[#e50914]">*</span>
          </label>
          <input
            type="text"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            placeholder="e.g., 2nd Floor, Ground Floor"
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#e50914]/20 ${
              errors.floor ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#e50914]'
            }`}
          />
          {errors.floor && <p className="mt-1 text-xs text-red-600">{errors.floor}</p>}
        </div>

        {/* Students Information */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Current Roommates Info {!noRoommates && <span className="text-[#e50914]">*</span>}
            </label>
            <button
              type="button"
              onClick={handleNoRoommatesToggle}
              className={`rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition-all ${
                noRoommates
                  ? 'border-[#e50914] bg-[#e50914] text-white'
                  : 'border-gray-300 text-gray-600 hover:border-[#e50914] hover:bg-[#e50914]/5'
              }`}
            >
              {noRoommates ? '✓ No roommates yet' : 'No roommates yet'}
            </button>
          </div>
          
          {!noRoommates && (
            <>
              <div className="space-y-3">
                {formData.studentsInfo.map((student, index) => (
                  <div
                    key={index}
                    className="rounded-lg border-2 border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">Student {index + 1}</span>
                      {formData.studentsInfo.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStudent(index)}
                          className="text-red-500 transition-colors hover:text-red-700"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={student.studentId}
                          onChange={(e) => handleStudentInfoChange(index, 'studentId', e.target.value)}
                          placeholder="Student ID"
                          className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={student.batch}
                          onChange={(e) => handleStudentInfoChange(index, 'batch', e.target.value)}
                          placeholder="Batch (e.g., 2020)"
                          className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.studentsInfo && <p className="mt-1 text-xs text-red-600">{errors.studentsInfo}</p>}
              
              <button
                type="button"
                onClick={addStudent}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:border-[#e50914] hover:bg-[#e50914]/5 hover:text-[#e50914]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Student
              </button>
            </>
          )}
        </div>

        {/* Rent */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Rent Amount (৳) <span className="text-[#e50914]">*</span>
          </label>
          <input
            type="number"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            placeholder="Enter monthly rent"
            min="0"
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#e50914]/20 ${
              errors.rent ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#e50914]'
            }`}
          />
          {errors.rent && <p className="mt-1 text-xs text-red-600">{errors.rent}</p>}
        </div>

        {/* Facilities */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Facilities <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <textarea
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            placeholder="e.g., WiFi, Washing Machine, Geyser, Meal Service, Parking"
            rows="3"
            className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
          />
          <p className="mt-1 text-xs text-gray-500">List available facilities separated by commas</p>
        </div>

        {/* Girls Only Checkbox */}
        <div>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isGirlsOnly: !prev.isGirlsOnly }))}
            className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
              formData.isGirlsOnly
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
              formData.isGirlsOnly
                ? 'border-pink-500 bg-pink-500'
                : 'border-gray-300'
            }`}>
              {formData.isGirlsOnly && (
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1 text-left">
              <span className={`text-sm font-semibold ${formData.isGirlsOnly ? 'text-pink-700' : 'text-gray-700'}`}>
                Girls Only
              </span>
              <p className="text-xs text-gray-500">This accommodation is for female students only</p>
            </div>
          </button>
        </div>

        {/* Contact Info */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Contact Number <span className="text-[#e50914]">*</span>
          </label>
          <input
            type="tel"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="01XXXXXXXXX (11 digits)"
            maxLength="11"
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#e50914]/20 ${
              errors.contactInfo ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#e50914]'
            }`}
          />
          {errors.contactInfo && <p className="mt-1 text-xs text-red-600">{errors.contactInfo}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#e50914] to-[#b00020] px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 active:translate-y-0 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Posting Ad...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Post Advertisement</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
