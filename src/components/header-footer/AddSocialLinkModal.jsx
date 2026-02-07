import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const iconOptions = [
  { value: 'FaInstagram', label: 'Instagram' },
  { value: 'FaPinterest', label: 'Pinterest' },
  { value: 'FaWhatsapp', label: 'WhatsApp' },
  { value: 'FaLinkedin', label: 'LinkedIn' },
  { value: 'FaFacebook', label: 'Facebook' },
  { value: 'FaTwitter', label: 'Twitter' },
  { value: 'FaYoutube', label: 'YouTube' },
]

const AddSocialLinkModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    iconName: '',
    link: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', iconName: '', link: '' })
      setErrors({})
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleIconSelect = (e) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      iconName: value,
      name: iconOptions.find((opt) => opt.value === value)?.label || '',
    }))
    if (errors.iconName) {
      setErrors((prev) => ({ ...prev, iconName: '' }))
    }
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Platform name is required'
    }
    if (!formData.iconName) {
      newErrors.iconName = 'Icon is required'
    }
    if (!formData.link.trim()) {
      newErrors.link = 'Link is required'
    } else if (!formData.link.match(/^https?:\/\/.+/)) {
      newErrors.link = 'Link must start with http:// or https://'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({
      name: formData.name,
      iconName: formData.iconName,
      link: formData.link,
    })
  }

  const handleClose = () => {
    setErrors({})
    setFormData({ name: '', iconName: '', link: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-[500px] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-navy-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-navy-600 dark:bg-navy-800">
          <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
            Add Social Link
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
          {/* Icon / Platform */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Platform <span className="text-red-500">*</span>
            </label>
            <select
              name="iconName"
              value={formData.iconName}
              onChange={handleIconSelect}
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.iconName ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a platform</option>
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.iconName && (
              <p className="mt-1 text-sm text-red-500">{errors.iconName}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Instagram"
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Link */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://instagram.com/yourpage"
              className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                errors.link ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.link && (
              <p className="mt-1 text-sm text-red-500">{errors.link}</p>
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
                Adding...
              </>
            ) : (
              'Add Social Link'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddSocialLinkModal
