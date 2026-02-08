import React, { useState } from 'react'
import { X, Upload } from 'lucide-react'
import ModalPortal from 'components/modal/ModalPortal'

const AddTestimonialModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    designation: '',
    rating: '',
    reviewCount: '',
    testimonialText: '',
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const remainingSlots = 3 - images.length
      const filesToAdd = files.slice(0, remainingSlots)

      if (filesToAdd.length > 0) {
        setImages((prev) => [...prev, ...filesToAdd])

        filesToAdd.forEach((file) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setImagePreviews((prev) => [...prev, reader.result])
          }
          reader.readAsDataURL(file)
        })

        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: '' }))
        }
      }
    }
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required'
    }
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required'
    }
    if (!formData.rating) {
      newErrors.rating = 'Rating is required'
    } else if (
      isNaN(formData.rating) ||
      formData.rating < 0 ||
      formData.rating > 5
    ) {
      newErrors.rating = 'Rating must be between 0 and 5'
    }
    if (!formData.reviewCount.trim()) {
      newErrors.reviewCount = 'Review count is required'
    }
    if (!formData.testimonialText.trim()) {
      newErrors.testimonialText = 'Testimonial text is required'
    }
    if (images.length === 0) {
      newErrors.images = 'At least one image is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const submitData = new FormData()
    submitData.append('clientName', formData.clientName)
    submitData.append('designation', formData.designation)
    submitData.append('rating', formData.rating)
    submitData.append('reviewCount', formData.reviewCount)
    submitData.append('testimonialText', formData.testimonialText)
    images.forEach((image) => {
      submitData.append('images', image)
    })

    onSubmit(submitData)
  }

  const resetForm = () => {
    setFormData({
      clientName: '',
      designation: '',
      rating: '',
      reviewCount: '',
      testimonialText: '',
    })
    setImages([])
    setImagePreviews([])
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative max-h-[90vh] w-[700px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
            <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
              Add New Testimonial
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              onClick={handleClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-4 p-6">
            {/* Client Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                  errors.clientName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g., Marketing Lead"
                className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                  errors.designation ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.designation && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.designation}
                </p>
              )}
            </div>

            {/* Rating and Review Count */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="e.g., 4.8"
                  step="0.1"
                  min="0"
                  max="5"
                  className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                    errors.rating ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Review Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reviewCount"
                  value={formData.reviewCount}
                  onChange={handleChange}
                  placeholder="e.g., 20+ Reviews"
                  className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                    errors.reviewCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.reviewCount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.reviewCount}
                  </p>
                )}
              </div>
            </div>

            {/* Testimonial Text */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Testimonial Text <span className="text-red-500">*</span>
              </label>
              <textarea
                name="testimonialText"
                value={formData.testimonialText}
                onChange={handleChange}
                placeholder="Enter the testimonial review text"
                rows={4}
                className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                  errors.testimonialText ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.testimonialText && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.testimonialText}
                </p>
              )}
            </div>

            {/* Images Upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Images <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({imagePreviews.length}/3)
                </span>
              </label>
              {imagePreviews.length < 3 && (
                <label
                  className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-gray-50 dark:hover:bg-navy-700 ${
                    errors.images
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-navy-600'
                  }`}
                >
                  <Upload className="mb-2 h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload images
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    PNG, JPG, WEBP up to 10MB each (Max 3)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.images && (
                <p className="mt-1 text-sm text-red-500">{errors.images}</p>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-navy-600 dark:bg-navy-700">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-navy-600 dark:text-gray-300 dark:hover:bg-navy-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="border-t-transparent h-4 w-4 animate-spin rounded-full border-2 border-white" />
                  Creating...
                </>
              ) : (
                'Create Testimonial'
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default AddTestimonialModal
