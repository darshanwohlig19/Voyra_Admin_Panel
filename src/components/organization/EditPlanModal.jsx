import React, { useState, useEffect } from 'react'

const EditPlanModal = ({ isOpen, onClose, organization, onSave }) => {
  const [selectedPlan, setSelectedPlan] = useState('')

  // Plan options - you can fetch these from API if needed
  const planOptions = [
    { value: 'free', label: 'Free' },
    { value: 'basic', label: 'Basic' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' },
  ]

  useEffect(() => {
    if (organization?.planId) {
      setSelectedPlan(organization.planId)
    }
  }, [organization])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      organizationId: organization._id,
      plan: selectedPlan,
    })
  }

  const handleClose = () => {
    setSelectedPlan('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Plan</h2>
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

        {/* Organization Info */}
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Organization</p>
          <p className="text-base font-semibold text-gray-900">
            {organization?.username || organization?.email || 'N/A'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="plan"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Plan
            </label>
            <select
              id="plan"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="focus:border-indigo-500 focus:ring-indigo-500 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2"
              required
            >
              <option value="">Select a plan</option>
              {planOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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

export default EditPlanModal
