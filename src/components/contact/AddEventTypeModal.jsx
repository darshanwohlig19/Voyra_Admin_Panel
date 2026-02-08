import React, { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import ModalPortal from 'components/modal/ModalPortal'

const AddEventTypeModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [eventTypes, setEventTypes] = useState([{ name: '' }])
  const [errors, setErrors] = useState({})

  const handleChange = (index, field, value) => {
    const updated = [...eventTypes]
    updated[index][field] = value
    setEventTypes(updated)
    if (errors[`${index}-${field}`]) {
      setErrors((prev) => ({ ...prev, [`${index}-${field}`]: '' }))
    }
  }

  const removeEventTypeRow = (index) => {
    if (eventTypes.length > 1) {
      setEventTypes(eventTypes.filter((_, i) => i !== index))
    }
  }

  const validate = () => {
    const newErrors = {}
    eventTypes.forEach((eventType, index) => {
      if (!eventType.name.trim()) {
        newErrors[`${index}-name`] = 'Event type name is required'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const formattedEventTypes = eventTypes.map((eventType) => ({
      name: eventType.name.trim(),
    }))
    onSubmit({ eventTypes: formattedEventTypes })
  }

  const handleClose = () => {
    setEventTypes([{ name: '' }])
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
              Add Event Type
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
            {eventTypes.map((eventType, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-navy-600"
              >
                <div className="flex-1 space-y-3">
                  {/* Event Type Name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Event Type Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={eventType.name}
                      onChange={(e) =>
                        handleChange(index, 'name', e.target.value)
                      }
                      placeholder="e.g., Wedding"
                      className={`w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                        errors[`${index}-name`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors[`${index}-name`] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[`${index}-name`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                {eventTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEventTypeRow(index)}
                    className="mt-6 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
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
                'Add Event Type'
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default AddEventTypeModal
