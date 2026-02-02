import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const EditSectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  sectionData,
}) => {
  const [formData, setFormData] = useState({
    sectionTitle: '',
    sectionDescription: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (sectionData && isOpen) {
      setFormData({
        sectionTitle: sectionData.sectionTitle || '',
        sectionDescription: sectionData.sectionDescription || '',
      })
      setErrors({})
    }
  }, [sectionData, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.sectionTitle.trim()) {
      newErrors.sectionTitle = 'Section title is required'
    }
    if (!formData.sectionDescription.trim()) {
      newErrors.sectionDescription = 'Section description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit(formData)
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[500px] rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-navy-600">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Edit Section
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
          {/* Section Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Section Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sectionTitle"
              value={formData.sectionTitle}
              onChange={handleChange}
              placeholder="e.g., Stay in the Loop"
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.sectionTitle ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.sectionTitle && (
              <p className="mt-1 text-sm text-red-500">{errors.sectionTitle}</p>
            )}
          </div>

          {/* Section Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Section Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="sectionDescription"
              value={formData.sectionDescription}
              onChange={handleChange}
              placeholder="Enter section description"
              rows={3}
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.sectionDescription ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.sectionDescription && (
              <p className="mt-1 text-sm text-red-500">
                {errors.sectionDescription}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-navy-600 dark:bg-navy-700">
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
              'Update Section'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditSectionModal
