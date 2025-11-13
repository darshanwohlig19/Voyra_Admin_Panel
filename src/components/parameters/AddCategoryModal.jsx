import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Plus } from 'lucide-react'
import { useToaster } from '../../common/Toaster'

const AddCategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [categoryName, setCategoryName] = useState('')
  const { addToast } = useToaster()

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCategoryName('')
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!categoryName.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please enter a category name',
        duration: 3000,
      })
      return
    }

    // Submit data
    onSubmit({ categoryName: categoryName.trim() })
    setCategoryName('')
  }

  const handleClose = () => {
    setCategoryName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-xl sm:w-[1000px] sm:max-w-[95vw]"
        role="document"
      >
        {/* Header */}
        <div className="flex-shrink-0 rounded-t-3xl border-b border-gray-300 bg-white px-8 py-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10  items-center justify-center rounded-xl bg-indigo">
                <Plus className="text-white" size={18} />
              </div>
              <div>
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Add New Category
                </h2>
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  Create a new parameter category to organize your elements
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
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
            {/* Step 1: Category Configuration */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-bold text-gray-800">
                  Category Details
                </h3>
              </div>
              <p className="mb-6 text-sm text-gray-600">
                📁 Create a new category to group related parameter elements
                together
              </p>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  Category Name
                  <span className="text-xs text-red-500">*Required</span>
                </div>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Shot Angles, Lighting Styles, Model Poses, Product Features"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base transition-colors focus:border-gray-500 focus:outline-none"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  💡 Choose a clear, descriptive name that represents the type
                  of elements this category will contain
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between rounded-b-3xl border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">
            💡 Category name is required and should be descriptive and unique
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-lg bg-indigo px-8 py-3 font-medium text-white transition-colors hover:bg-indigo"
            >
              Create Category
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCategoryModal
