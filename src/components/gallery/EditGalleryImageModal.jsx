import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import DropZone from 'components/dropzone/DropZone'
import ModalPortal from 'components/modal/ModalPortal'

const EditGalleryImageModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  imageData,
}) => {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [altText, setAltText] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (imageData && isOpen) {
      setImagePreview(imageData.url || null)
      setAltText(imageData.altText || '')
      setImage(null)
      setErrors({})
    }
  }, [imageData, isOpen])

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
    setImagePreview(imageData?.url || null)
  }

  const handleAltTextChange = (e) => {
    setAltText(e.target.value)
    if (errors.altText) {
      setErrors((prev) => ({ ...prev, altText: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!imagePreview) {
      newErrors.image = 'Image is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const formData = new FormData()
    formData.append('replaceImageId', imageData._id)
    formData.append('altTexts', JSON.stringify([altText || 'Gallery image']))
    if (image) {
      formData.append('images', image)
    }

    onSubmit(imageData._id, formData)
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative max-h-[90vh] w-[500px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
            <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
              Edit Image
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

            {/* Alt Text */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alt Text
              </label>
              <input
                type="text"
                value={altText}
                onChange={handleAltTextChange}
                placeholder="Enter image alt text (optional)"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Descriptive text for accessibility and SEO
              </p>
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
                  Updating...
                </>
              ) : (
                'Update Image'
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default EditGalleryImageModal
