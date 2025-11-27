import React, { useState, useEffect } from 'react'

const EditDomainBlockModal = ({ isOpen, onClose, onSave, domainBlock }) => {
  const [isCreditBlocked, setIsCreditBlocked] = useState(true)

  useEffect(() => {
    if (isOpen && domainBlock) {
      // Pre-populate with existing values
      setIsCreditBlocked(domainBlock.isCreditBlocked || false)
    }
  }, [isOpen, domainBlock])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      domain: domainBlock.domain,
      isCreditBlocked,
    })
  }

  const handleClose = () => {
    setIsCreditBlocked(true)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Domain Credit Block
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Domain Info */}
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Domain</p>
          <p className="text-base font-semibold text-gray-900">
            {domainBlock?.domain || 'N/A'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Credit Block Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="isCreditBlocked"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit Block
                </label>
                <p className="text-xs text-gray-500">
                  Enable credit blocking for this domain
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isCreditBlocked}
                onClick={() => setIsCreditBlocked(!isCreditBlocked)}
                className={`focus:ring-indigo-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isCreditBlocked ? 'bg-indigo' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isCreditBlocked ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="hover:bg-indigo-700 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDomainBlockModal
