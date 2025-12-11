import { useState } from 'react'
import toast from 'react-hot-toast'

export default function PostItemForm({ onSubmit }) {
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    phoneNumber: '',
    facebookId: '',
    image: ''
  })

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData(prev => ({ ...prev, image: reader.result }))
        setErrors(prev => ({ ...prev, image: '' }))
      }
      reader.readAsDataURL(file)
    } else {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file' }))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Posting your item...')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onSubmit(formData)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        date: '',
        location: '',
        phoneNumber: '',
        facebookId: '',
        image: ''
      })
      setImagePreview(null)
      
      toast.success('Lost item posted successfully!', { id: toastId })
    } catch (error) {
      toast.error('Failed to post item. Please try again.', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg animate-[slide-in_700ms_ease-out_both]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Report Lost Item</h2>
        <p className="mt-1 text-sm text-gray-600">Fill in the details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Item Photo <span className="text-gray-500"></span>
          </label>
          <div
            className={`relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
              dragActive 
                ? 'border-[#b00020] bg-red-50' 
                : errors.image 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-[#b00020]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              aria-label="Upload image"
            />
            
            {imagePreview ? (
              <div className="relative h-48">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                  <p className="font-semibold text-white">Click to change</p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
                <svg className={`mb-3 h-12 w-12 ${errors.image ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-1 text-sm font-semibold text-gray-700">
                  Drop image here or click to upload
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
          {errors.image && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.image}
            </p>
          )}
        </div>

        {/* Item Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#b00020] ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#b00020]'
            }`}
            placeholder="e.g., Black Leather Wallet"
          />
          {errors.name && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>



        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full resize-none rounded-xl border-2 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#b00020] ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#b00020]'
            }`}
            placeholder="Provide details about the item..."
          />
          {errors.description && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-semibold text-gray-700">
            Date Lost <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#b00020] ${
              errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#b00020]'
            }`}
          />
          {errors.date && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.date}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-semibold text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#b00020] ${
              errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#b00020]'
            }`}
            placeholder="e.g., Library 2nd Floor, Near Cafeteria"
          />
          {errors.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.location}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="mb-2 block text-sm font-semibold text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#b00020] ${
              errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#b00020]'
            }`}
            placeholder="e.g., 01712345678"
          />
          {errors.phoneNumber && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Facebook ID */}
        <div>
          <label htmlFor="facebookId" className="mb-2 block text-sm font-semibold text-gray-700">
            Facebook ID <span className="text-gray-500"></span>
          </label>
          <input
            type="text"
            id="facebookId"
            name="facebookId"
            value={formData.facebookId}
            onChange={handleChange}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#b00020] focus:border-[#b00020]"
            placeholder="e.g., facebook.com/yourprofile or your.name"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-[#e50914] to-[#b00020] px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Posting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Post Item</span>
            </div>
          )}
        </button>
      </form>
    </div>
  )
}
