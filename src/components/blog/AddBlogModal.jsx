import React, { useState } from 'react'
import { X } from 'lucide-react'
import DropZone from 'components/dropzone/DropZone'

const AddBlogModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    blogTitle: '',
    blogDescription: '',
    blogDate: '',
    altText: '',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (file) => {
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

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
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
    if (!image) {
      newErrors.image = 'Image is required'
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
    submitData.append('image', image)

    onSubmit(submitData)
  }

  const resetForm = () => {
    setFormData({
      blogTitle: '',
      blogDescription: '',
      blogDate: '',
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
      <div className="relative max-h-[90vh] w-[700px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Add New Blog
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

          {/* Image Upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image <span className="text-red-500">*</span>
            </label>
            <DropZone
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
              error={errors.image}
            />
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
              'Create Blog'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddBlogModal
