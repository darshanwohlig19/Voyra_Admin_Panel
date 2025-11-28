import React, { useState, useEffect } from 'react'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'

const EditPlanModal = ({ isOpen, onClose, organization, onSave }) => {
  const [selectedPlan, setSelectedPlan] = useState('trial')
  const [orgName, setOrgName] = useState('')
  const [credits, setCredits] = useState('')
  const [planOptions, setPlanOptions] = useState([])
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      showSpinner()
      try {
        const response = await apiCall(
          'get',
          `${config.GET_ALL_PLANS_DROPDOWN}?orgId=${organization._id}`
        )
        if (response.status === 200 && response.data.data?.plans) {
          setPlanOptions(response.data.data.plans)
        }
      } catch (error) {
        console.error('Error fetching plans:', error)
      } finally {
        hideSpinner()
      }
    }

    if (isOpen && organization?._id) {
      fetchPlans()
    }
  }, [isOpen, organization])

  // Fetch credits when plan is selected
  useEffect(() => {
    const fetchCredits = async () => {
      if (!organization?._id || !selectedPlan) return

      try {
        const response = await apiCall(
          'get',
          `${config.GET_ALL_PLANS_DROPDOWN}?orgId=${organization._id}&planId=${selectedPlan}`
        )
        if (
          response.status === 200 &&
          response.data.data?.credits !== undefined
        ) {
          setCredits(response.data.data.credits)
        }
      } catch (error) {
        console.error('Error fetching credits:', error)
      }
    }

    fetchCredits()
  }, [selectedPlan])

  useEffect(() => {
    if (organization) {
      // Set plan
      if (organization?.planId) {
        setSelectedPlan(organization.planId)
      } else {
        setSelectedPlan('trial')
      }

      // Set organization name
      setOrgName(organization?.organizationName || organization?.orgName || '')
    }
  }, [organization])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      organizationId: organization._id,
      orgName,
      plan: selectedPlan,
      credits,
    })
  }

  const handleClose = () => {
    setSelectedPlan('trial')
    setOrgName('')
    setCredits('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Organization
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

        {/* Organization Info */}
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Organization</p>
          <p className="text-base font-semibold text-gray-900">
            {organization?.organizationName ||
              organization?.username ||
              organization?.email ||
              'N/A'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Organization Name */}
          <div className="mb-6">
            <label
              htmlFor="orgName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Organization Name
            </label>
            <input
              type="text"
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter organization name"
              className="focus:border-indigo-500 focus:ring-indigo-500 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2"
              required
            />
          </div>

          {/* Plan Dropdown */}
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
              {planOptions.map((option) => (
                <option key={option.planId} value={option.planId}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Credits Input */}
          <div className="mb-6">
            <label
              htmlFor="credits"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Credits
            </label>
            <input
              type="number"
              id="credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="Enter credits"
              className="focus:border-indigo-500 focus:ring-indigo-500 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all [appearance:textfield] focus:outline-none focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              min="0"
            />
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
