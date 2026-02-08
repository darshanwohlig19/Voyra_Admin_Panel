import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import ModalPortal from 'components/modal/ModalPortal'

const AddCountryModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [countries, setCountries] = useState([{ name: '', code: '' }])
  const [errors, setErrors] = useState({})

  const handleChange = (index, field, value) => {
    const updated = [...countries]
    updated[index][field] = value
    setCountries(updated)
    if (errors[`${index}-${field}`]) {
      setErrors((prev) => ({ ...prev, [`${index}-${field}`]: '' }))
    }
  }

  // const addCountryRow = () => {
  //   setCountries([...countries, { name: '', code: '' }])
  // }

  const removeCountryRow = (index) => {
    if (countries.length > 1) {
      setCountries(countries.filter((_, i) => i !== index))
    }
  }

  const validate = () => {
    const newErrors = {}
    countries.forEach((country, index) => {
      if (!country.name.trim()) {
        newErrors[`${index}-name`] = 'Country name is required'
      }
      if (!country.code.trim()) {
        newErrors[`${index}-code`] = 'Country code is required'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ countries })
  }

  const handleClose = () => {
    setCountries([{ name: '', code: '' }])
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
              Add Countries
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
            {countries.map((country, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-navy-600"
              >
                <div className="flex-1 space-y-3">
                  {/* Country Name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={country.name}
                      onChange={(e) =>
                        handleChange(index, 'name', e.target.value)
                      }
                      placeholder="e.g., United States"
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

                  {/* Country Code */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={country.code}
                      onChange={(e) =>
                        handleChange(
                          index,
                          'code',
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="e.g., US"
                      maxLength={3}
                      className={`w-full rounded-lg border px-4 py-2 uppercase text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white ${
                        errors[`${index}-code`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors[`${index}-code`] && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors[`${index}-code`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                {countries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCountryRow(index)}
                    className="mt-6 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}

            {/* Add More Button
          <button
            type="button"
            onClick={addCountryRow}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-500 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-navy-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-500"
          >
            <Plus className="h-5 w-5" />
            Add Another Country
          </button> */}
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
                'Add Countries'
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default AddCountryModal
