import React, { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

const EditBlogModal = ({ isOpen, onClose, onSubmit, loading, blogData }) => {
  const [formData, setFormData] = useState({
    blogTitle: '',
    blogDescription: '',
    blogDate: '',
    altText: '',
    isActive: true,
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (blogData && isOpen) {
      setFormData({
        blogTitle: blogData.title || '',
        blogDescription: blogData.description || '',
        blogDate: blogData.date ? blogData.date.split('T')[0] : '',
        altText: blogData.image?.altText || '',
        isActive: blogData.isActive !== undefined ? blogData.isActive : true,
      })
      setImagePreview(blogData.image?.url || null)
      setImage(null)
      setErrors({})
    }
  }, [blogData, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
    setImagePreview(blogData?.image?.url || null)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.blogTitle.trim()) {
      newErrors.blogTitle = 'Blog title is required'
    }
    if (!formData.blogDescription.trim()) {
      newErrors.blogDescription = 'Blog description is required'
    }
    if (!formData.blogDate) {
      newErrors.blogDate = 'Blog date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const submitData = new FormData()
    submitData.append('blogTitle', formData.blogTitle)
    submitData.append('blogDescription', formData.blogDescription)
    submitData.append('blogDate', formData.blogDate)
    submitData.append('altText', formData.altText || formData.blogTitle)
    submitData.append('isActive', formData.isActive)
    if (image) {
      submitData.append('image', image)
    }

    onSubmit(blogData._id, submitData)
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
            Edit Blog
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
          {/* Blog Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="blogTitle"
              value={formData.blogTitle}
              onChange={handleChange}
              placeholder="e.g., The Countdown Begins"
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.blogTitle ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.blogTitle && (
              <p className="mt-1 text-sm text-red-500">{errors.blogTitle}</p>
            )}
          </div>

          {/* Blog Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Blog Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="blogDescription"
              value={formData.blogDescription}
              onChange={handleChange}
              placeholder="Enter blog description"
              rows={3}
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.blogDescription ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.blogDescription && (
              <p className="mt-1 text-sm text-red-500">
                {errors.blogDescription}
              </p>
            )}
          </div>

          {/* Blog Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Blog Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="blogDate"
              value={formData.blogDate}
              onChange={handleChange}
              style={{ colorScheme: 'light dark' }}
              className={`w-full cursor-pointer rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert ${
                errors.blogDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.blogDate && (
              <p className="mt-1 text-sm text-red-500">{errors.blogDate}</p>
            )}
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

          {/* Is Active */}

          {/* Image Upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image
            </label>
            {!imagePreview ? (
              <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700">
                <Upload className="mb-2 h-10 w-10 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Click to upload image
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
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-56 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
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
              'Update Blog'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditBlogModal
