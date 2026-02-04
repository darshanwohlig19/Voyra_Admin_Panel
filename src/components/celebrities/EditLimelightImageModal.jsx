import React, { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

const EditLimelightImageModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  imageData,
}) => {
  const [altText, setAltText] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (imageData && isOpen) {
      setAltText(imageData.altText || '')
      setImagePreview(imageData.url || null)
      setImage(null)
      setErrors({})
    }
  }, [imageData, isOpen])

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
    setImagePreview(imageData?.url || null)
  }

  const validate = () => {
    const newErrors = {}
    if (!image && !imagePreview) {
      newErrors.image = 'Image is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const formData = new FormData()
    formData.append('replaceImageId', imageData._id)
    formData.append(
      'altTexts',
      JSON.stringify([altText || imageData.altText || ''])
    )
    if (image) {
      formData.append('images', image)
    }

    onSubmit(formData)
  }

  const handleClose = () => {
    setErrors({})
    setImage(null)
    setAltText('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-[500px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Edit Limelight Image
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
          {/* Alt Text */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Image alt text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image
            </label>
            {!imagePreview ? (
              <label
                className={`flex h-56 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-gray-50 dark:hover:bg-navy-700 ${
                  errors.image
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-navy-600'
                }`}
              >
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
              <div className="group relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-56 w-full rounded-lg object-cover"
                />
                {/* Hover overlay with change button */}
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <label className="cursor-pointer rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {/* Remove button */}
                {image && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity duration-200 hover:bg-red-600 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
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
                Updating...
              </>
            ) : (
              'Update Image'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLimelightImageModal
