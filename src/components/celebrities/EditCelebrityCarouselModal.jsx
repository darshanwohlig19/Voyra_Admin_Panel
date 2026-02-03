import React, { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

const EditCelebrityCarouselModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  data,
}) => {
  const [formData, setFormData] = useState({
    comment: '',
    author: '',
    location: '',
    altText: '',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        comment: data.comment || '',
        author: data.author || '',
        location: data.location || '',
        altText: data.image?.altText || '',
      })
      setImagePreview(data.image?.url || null)
      setImage(null)
    }
  }, [data, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: '' }))
      }
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(data?.image?.url || null)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required'
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const submitData = new FormData()
    submitData.append('comment', formData.comment)
    submitData.append('author', formData.author)
    submitData.append('location', formData.location)
    submitData.append('altText', formData.altText || 'Celebrity testimonial')
    if (image) {
      submitData.append('image', image)
    }

    onSubmit(data._id, submitData)
  }

  const resetForm = () => {
    setFormData({
      comment: '',
      author: '',
      location: '',
      altText: '',
    })
    setImage(null)
    setImagePreview(null)
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-[600px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Edit Celebrity Carousel Item
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
          {/* Comment */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Enter testimonial comment"
              rows={3}
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.comment ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-500">{errors.comment}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g., Event Host"
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-500">{errors.author}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Mumbai"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Alt Text
            </label>
            <input
              type="text"
              name="altText"
              value={formData.altText}
              onChange={handleChange}
              placeholder="Image alt text (optional)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image
            </label>
            {!imagePreview ? (
              <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700">
                <Upload className="mb-2 h-10 w-10 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Click to upload new image
                </span>
                <span className="mt-1 text-xs text-gray-400">
                  PNG, JPG, WEBP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="group relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-full rounded-lg object-cover"
                />
                {/* Hover Overlay with Change Image Button */}
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <label className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
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
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="border-t-transparent h-4 w-4 animate-spin rounded-full border-2 border-white" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditCelebrityCarouselModal
