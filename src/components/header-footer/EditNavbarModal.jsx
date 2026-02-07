import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import DropZone from 'components/dropzone/DropZone'

const EditNavbarModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  navbarData,
}) => {
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (navbarData && isOpen) {
      setLogoPreview(navbarData.logo?.url || null)
      setLogo(null)
      setErrors({})
    }
  }, [navbarData, isOpen])

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
    setLogoPreview(navbarData?.logo?.url || null)
  }

  const handleSubmit = () => {
    if (!logo) {
      setErrors({ logo: 'Please select a new logo' })
      return
    }

    const submitData = new FormData()
    submitData.append('logo', logo)
    onSubmit(submitData)
  }

  const handleClose = () => {
    setErrors({})
    setLogo(null)
    setLogoPreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-[500px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Edit Navbar Logo
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Logo <span className="text-red-500">*</span>
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
              'Update Logo'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditNavbarModal
