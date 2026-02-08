import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import DropZone from 'components/dropzone/DropZone'

const EditStardomEventModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  eventData,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (eventData && isOpen) {
      setTitle(eventData.title || '')
      setDescription(eventData.description || '')
      setImagePreview(eventData.logoImage?.url || null)
      setImage(null)
      setErrors({})
    }
  }, [eventData, isOpen])

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
    setImagePreview(eventData?.logoImage?.url || null)
  }

  const validate = () => {
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const formData = new FormData()
    formData.append('replaceEventId', eventData._id)
    formData.append(
      'events',
      JSON.stringify([{ title: title.trim(), description: description.trim() }])
    )
    if (image) {
      formData.append('logoImages', image)
    }

    onSubmit(formData)
  }

  const handleClose = () => {
    setErrors({})
    setTitle('')
    setDescription('')
    setImage(null)
    setImagePreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-[500px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Edit Stardom Event
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
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
              }}
              placeholder="Event title"
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white ${
                errors.title
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-navy-600'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            />
          </div>

          {/* Logo Image Upload */}
          <DropZone
            label="Logo Image"
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            placeholder="Click to upload logo image"
            height="h-40"
            objectFit="object-contain"
            error={errors.image}
          />
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
                Updating...
              </>
            ) : (
              'Update Event'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditStardomEventModal
