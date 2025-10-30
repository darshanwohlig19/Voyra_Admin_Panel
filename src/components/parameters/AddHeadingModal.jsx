import React, { useState, useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import { useToaster } from '../../common/Toaster'

const AddHeadingModal = ({
  isOpen,
  onClose,
  onSubmit,
  existingData = null,
}) => {
  const [title, setTitle] = useState('')
  const { addToast } = useToaster()

  // Populate form when editing or reset when adding
  useEffect(() => {
    if (isOpen) {
      if (existingData && existingData.title) {
        setTitle(existingData.title)
      } else {
        setTitle('')
      }
    }
  }, [isOpen, existingData])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!title.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please enter a title',
        duration: 3000,
      })
      return
    }

    // Submit data
    onSubmit({ title: title.trim() })
    setTitle('')
  }

  const handleClose = () => {
    setTitle('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {existingData ? 'Edit Heading' : 'Add Heading'}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {existingData
                  ? 'Update the heading title'
                  : 'Set the heading title for this page'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="bg-white p-6">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., On-Model Parameters"
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
            >
              {existingData ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddHeadingModal
