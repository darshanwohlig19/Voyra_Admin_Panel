import React, { useState, useEffect } from 'react'
import { MdClose } from 'react-icons/md'

/**
 * EditTitleSubtitleModal Component
 * Modal for editing global title and subtitle for all shot type cards
 */
const EditTitleSubtitleModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentTitle = '',
  currentSubtitle = '',
}) => {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle)
      setSubtitle(currentSubtitle)
    }
  }, [isOpen, currentTitle, currentSubtitle])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please provide a title')
      return
    }

    onSubmit({
      title: title.trim(),
      subtitle: subtitle.trim(),
    })
  }

  const handleClose = () => {
    setTitle(currentTitle)
    setSubtitle(currentSubtitle)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Edit Title & Subtitle
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                This will apply to all shot type cards
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
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-5">
              {/* Title Input */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Choose Your Primary Shot Type"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Subtitle Input */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subtitle
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g., Select the type of photography style that best matches your vision"
                  rows="3"
                  className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
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
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTitleSubtitleModal
