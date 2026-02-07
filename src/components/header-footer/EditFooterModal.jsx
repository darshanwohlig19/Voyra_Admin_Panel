import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import DropZone from 'components/dropzone/DropZone'

const EditFooterModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  footerData,
}) => {
  const [formData, setFormData] = useState({
    leftTagline: '',
    rightTagline: '',
  })
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (footerData && isOpen) {
      setFormData({
        leftTagline: footerData.leftTagline || '',
        rightTagline: footerData.rightTagline || '',
      })
      setLogoPreview(footerData.logo?.url || null)
      setLogo(null)
      setErrors({})
    }
  }, [footerData, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleLogoChange = (file) => {
    setLogo(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result)
    }
    reader.readAsDataURL(file)
    if (errors.logo) {
      setErrors((prev) => ({ ...prev, logo: '' }))
    }
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoPreview(footerData?.logo?.url || null)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.leftTagline.trim()) {
      newErrors.leftTagline = 'Left tagline is required'
    }
    if (!formData.rightTagline.trim()) {
      newErrors.rightTagline = 'Right tagline is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const submitData = new FormData()
    submitData.append('leftTagline', formData.leftTagline)
    submitData.append('rightTagline', formData.rightTagline)
    if (logo) {
      submitData.append('logo', logo)
    }
    onSubmit(submitData)
  }

  const handleClose = () => {
    setErrors({})
    setFormData({ leftTagline: '', rightTagline: '' })
    setLogo(null)
    setLogoPreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-[550px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Edit Footer
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
          {/* Logo Upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Footer Logo
            </label>
            <DropZone
              imagePreview={logoPreview}
              onImageChange={handleLogoChange}
              onRemoveImage={removeLogo}
              placeholder="Click to upload logo"
              hint="PNG, JPG, WEBP, SVG up to 10MB"
              height="h-40"
              objectFit="object-contain"
              error={errors.logo}
            />
          </div>

          {/* Left Tagline */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Left Tagline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="leftTagline"
              value={formData.leftTagline}
              onChange={handleChange}
              placeholder="e.g., Crafted with heart, designed with soul."
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.leftTagline ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.leftTagline && (
              <p className="mt-1 text-sm text-red-500">{errors.leftTagline}</p>
            )}
          </div>

          {/* Right Tagline */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Right Tagline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="rightTagline"
              value={formData.rightTagline}
              onChange={handleChange}
              placeholder="e.g., Since 2020, Creating Timeless Moments."
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.rightTagline ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.rightTagline && (
              <p className="mt-1 text-sm text-red-500">{errors.rightTagline}</p>
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
              'Update Footer'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditFooterModal
