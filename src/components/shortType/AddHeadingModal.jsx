import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Plus, Edit } from 'lucide-react'

const AddHeadingModal = ({
  isOpen,
  onClose,
  onSubmit,
  existingData = null,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
  })

  // Populate form with existing data or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      if (existingData) {
        setFormData({
          title: existingData.title || '',
          subtitle: existingData.subtitle || '',
        })
      } else {
        setFormData({ title: '', subtitle: '' })
      }
    }
  }, [isOpen, existingData])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={handleOverlayClick}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-xl sm:w-[1000px] sm:max-w-[95vw]"
        role="document"
      >
        {/* Header */}
        <div className="flex-shrink-0 rounded-t-3xl border-b border-gray-300 bg-white px-8 py-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo">
                {existingData ? (
                  <Edit className="text-white" size={18} />
                ) : (
                  <Plus className="text-white" size={18} />
                )}
              </div>
              <div>
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {existingData ? 'Edit Page Heading' : 'Add Page Heading'}
                </h2>
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  {existingData
                    ? 'Update your page title and subtitle'
                    : 'Create a headline and subtitle for your shot types page'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              title="Close modal"
            >
              <FaTimes
                size={14}
                className="text-gray-500 group-hover:text-gray-700"
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white p-6">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Page Heading Configuration */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-bold text-gray-800">
                  Page Heading Details
                </h3>
              </div>
              <p className="mb-6 text-sm text-gray-600">
                🏷️ Configure the main heading that will appear at the top of
                your shot types page
              </p>

              <div className="space-y-6">
                {/* Title Field */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    Main Title
                    <span className="text-xs text-red-500">*Required</span>
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., Professional Photography Services, Shot Type Gallery, Product Photography"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base transition-colors focus:border-gray-500 focus:outline-none"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    💡 This will be displayed as the main headline on your page
                  </p>
                </div>

                {/* Subtitle Field */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    Subtitle/Description
                    <span className="text-xs text-red-500">*Required</span>
                  </div>
                  <textarea
                    value={formData.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="e.g., Explore our comprehensive range of photography styles and shot types to find the perfect match for your project needs."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-base transition-colors focus:border-gray-500 focus:outline-none"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    📝 Provide a brief description that explains what visitors
                    will find on this page
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between rounded-b-3xl border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">
            💡 Both title and subtitle are required to create an effective page
            heading
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-lg bg-indigo px-8 py-3 font-medium text-white transition-colors hover:bg-gray-700"
            >
              {existingData ? 'Update Heading' : 'Save Heading'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddHeadingModal
