import React, { useState, useEffect, useRef } from 'react'
import { X, Upload, RefreshCw } from 'lucide-react'

const EditTestimonialModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDeleteImage,
  loading,
  testimonialData,
}) => {
  const [formData, setFormData] = useState({
    clientName: '',
    designation: '',
    rating: '',
    reviewCount: '',
    testimonialText: '',
  })
  const [newImages, setNewImages] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [errors, setErrors] = useState({})
  const [replacingImageIndex, setReplacingImageIndex] = useState(null)
  const replaceInputRef = useRef(null)

  useEffect(() => {
    if (testimonialData && isOpen) {
      setFormData({
        clientName: testimonialData.clientName || '',
        designation: testimonialData.designation || '',
        rating: testimonialData.rating || '',
        reviewCount: testimonialData.reviewCount || '',
        testimonialText: testimonialData.testimonialText || '',
      })
      setExistingImages(testimonialData.images || [])
      setNewImages([])
      setNewImagePreviews([])
      setErrors({})
      setReplacingImageIndex(null)
    }
  }, [testimonialData, isOpen])

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
      const totalImages = existingImages.length + newImages.length
      const remainingSlots = 3 - totalImages
      const filesToAdd = files.slice(0, remainingSlots)

      if (filesToAdd.length > 0) {
        setNewImages((prev) => [...prev, ...filesToAdd])

        filesToAdd.forEach((file) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setNewImagePreviews((prev) => [...prev, reader.result])
          }
          reader.readAsDataURL(file)
        })

        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: '' }))
        }
      }
    }
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleReplaceClick = (index) => {
    setReplacingImageIndex(index)
    replaceInputRef.current?.click()
  }

  const handleReplaceImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file || replacingImageIndex === null) return

    const imageToReplace = existingImages[replacingImageIndex]

    // Delete old image first
    if (onDeleteImage && imageToReplace?.fileId) {
      const success = await onDeleteImage(
        testimonialData._id,
        imageToReplace.fileId
      )
      if (success) {
        // Remove from existing images
        setExistingImages((prev) =>
          prev.filter((_, i) => i !== replacingImageIndex)
        )

        // Add new image to upload queue
        setNewImages((prev) => [...prev, file])
        const reader = new FileReader()
        reader.onloadend = () => {
          setNewImagePreviews((prev) => [...prev, reader.result])
        }
        reader.readAsDataURL(file)
      }
    }

    setReplacingImageIndex(null)
    e.target.value = '' // Reset input
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
    newImages.forEach((image) => {
      submitData.append('images', image)
    })

    onSubmit(testimonialData._id, submitData)
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-[600px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Edit Testimonial
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
              <p className="mt-1 text-sm text-red-500">{errors.designation}</p>
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Images
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({existingImages.length + newImagePreviews.length}/3)
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((image, index) => (
                  <div key={image._id || index} className="group relative">
                    <img
                      src={image.url}
                      alt={image.altText || `Image ${index + 1}`}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleReplaceClick(index)}
                      className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                      title="Replace image"
                    >
                      <RefreshCw className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Hidden input for replacing images */}
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                onChange={handleReplaceImage}
                className="hidden"
              />
            </div>
          )}

          {/* New Images Upload */}
          {existingImages.length + newImagePreviews.length < 3 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Add New Images
              </label>
              <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700">
                <Upload className="mb-1 h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Click to upload more images (Max 3)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* New Image Previews */}
          {newImagePreviews.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Images
              </label>
              <div className="flex flex-wrap gap-3">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="border-t-transparent h-4 w-4 animate-spin rounded-full border-2 border-white" />
                Updating...
              </>
            ) : (
              'Update Testimonial'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditTestimonialModal
