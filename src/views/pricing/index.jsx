import React, { useEffect, useMemo, useState } from 'react'
// import {
//   getPricingPlans,
//   createPricingPlan,
//   updatePricingPlan,
//   deletePricingPlan,
// } from '../../api/pricing'
import { FaEye, FaTrash, FaBan, FaEdit, FaSearch } from 'react-icons/fa' // FontAwesome icons

import {
  HiCurrencyDollar,
  HiPlus,
  HiPencil,
  HiTrash,
  HiCheck,
  HiX,
  HiInformationCircle,
  HiStar,
  HiCog,
  HiEye,
  HiChevronDown,
  HiMenu,
  HiCheckCircle,
  HiRefresh,
} from 'react-icons/hi'
import { useToaster } from '../../common/Toaster'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import ConfirmationModal from '../../components/modal/ConfirmationModal'

const defaultPlan = {
  planCategory: 'subscription',
  name: '',
  description: '',
  amount: '',
  actualAmount: '',
  creditsIncluded: '',
  planType: 'monthly',
  currency: 'INR',
  featuresText: '',
  isActive: true,
  isPopular: false,
  isTestMode: false,
}

const Pricing = () => {
  const { addToast } = useToaster()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [form, setForm] = useState(defaultPlan)
  const [subTab, setSubTab] = useState('subscription')
  const [billingCycles, setBillingCycles] = useState([])
  const [planCategories, setPlanCategories] = useState([])
  const { apiCall } = ApiCaller()

  const getCurrentCategory = () => {
    return subTab === 'subscription' ? 'Subscription' : 'Top-up'
  }

  const fetchPlans = async (planCategory) => {
    try {
      setLoading(true)
      const url = planCategory
        ? `${config.GET_SUBSCRIPTION_PLANS}?planCategory=${planCategory}`
        : config.GET_SUBSCRIPTION_PLANS
      const response = await apiCall('get', url)

      if (response.status === 200 && response.data.data) {
        const transformedPlans = response.data.data.map((plan) => ({
          _id: plan._id,
          planCategory: plan.basicInfo.planCategory.toLowerCase(),
          name: plan.basicInfo.name,
          description: plan.basicInfo.description,
          amount: plan.pricingDetails.salePrice,
          actualAmount: plan.pricingDetails.originalPrice,
          creditsIncluded: plan.pricingDetails.creditsIncluded,
          planType: plan.pricingDetails.billingCycle.name.toLowerCase(),
          currency: 'INR',
          features: plan.planFeatures,
          isActive: plan.status === 'Inactive',
          isPopular: plan.planSettings.popularPlan,
          isTestMode: false,
          tier: plan.basicInfo.tier,
        }))
        setPlans(transformedPlans)
        setError(null)
      }
    } catch (error) {
      setError('Failed to load plans')
      console.error('Error fetching plans:', error)
      addToast({
        type: 'error',
        title: 'Failed to Load Plans',
        description: 'Unable to load pricing plans. Please try again.',
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriptionFields = async () => {
    try {
      const response = await apiCall('get', config.GET_SUBSCRIPTION_FIELDS)

      if (response.status === 200 && response.data) {
        const responseData = response.data
        if (responseData?.type?.status_code === 200 && responseData?.data) {
          const data = responseData.data
          if (data.billingCycles) {
            setBillingCycles(data.billingCycles)
          }
          if (data.planCategories) {
            setPlanCategories(data.planCategories)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription fields:', error)
    }
  }

  useEffect(() => {
    fetchPlans('Subscription') // Fetch subscription plans initially (matching default subTab)
    fetchSubscriptionFields()
  }, [])

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan)
      setForm({
        planCategory: plan.planCategory || 'subscription',
        name: plan.name || '',
        description: plan.description || '',
        amount: plan.amount ?? '',
        actualAmount: plan.actualAmount ?? '',
        creditsIncluded: plan.creditsIncluded ?? plan.credits ?? '',
        planType: plan.planType || 'monthly',
        currency: plan.currency || 'INR',
        featuresText: (plan.features || []).join('\n'),
        isActive: plan.isActive ?? true,
        isPopular: plan.isPopular ?? false,
        isTestMode: plan.isTestMode ?? false,
      })
    } else {
      setEditingPlan(null)
      setForm({
        ...defaultPlan,
        planCategory: subTab, // Set planCategory based on current tab
      })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Transform form data to match API structure
    const payload = {
      basicInfo: {
        name: form.name,
        description: form.description,
        planCategory:
          form.planCategory === 'subscription' ? 'Subscription' : 'Top-up',
      },
      pricingDetails: {
        billingCycle: {
          name:
            form.planType === 'monthly'
              ? 'Monthly'
              : form.planType === 'yearly'
              ? 'Yearly'
              : 'OneTime',
          description:
            form.planType === 'monthly'
              ? 'Billed every month'
              : form.planType === 'yearly'
              ? 'Billed annually'
              : 'One-time payment',
        },
        salePrice: Number(form.amount) || 0,
        originalPrice: form.actualAmount
          ? Number(form.actualAmount)
          : Number(form.amount) || 0,
        creditsIncluded: Number(form.creditsIncluded) || 0,
      },
      planFeatures: form.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      planSettings: {
        popularPlan: form.isPopular,
      },
    }

    try {
      setLoading(true)

      if (editingPlan?._id) {
        // Update existing plan
        const response = await apiCall(
          'put',
          `${config.UPDATE_SUBSCRIPTION_PLAN}?subscriptionPlanId=${editingPlan._id}`,
          payload
        )

        if (response.status === 200) {
          addToast({
            type: 'success',
            title: 'Plan Updated',
            description: `Successfully updated "${form.name}"`,
            duration: 3000,
          })
          closeModal()
          fetchPlans(getCurrentCategory())
        } else {
          addToast({
            type: 'error',
            title: 'Update Failed',
            description:
              response?.data?.msg ||
              response?.data?.message ||
              'Failed to update plan',
            duration: 3000,
          })
        }
      } else {
        const response = await apiCall(
          'post',
          config.ADD_SUBSCRIPTION_PLAN,
          payload
        )

        if (response.status === 200 || response.status === 201) {
          addToast({
            type: 'success',
            title: 'Plan Created',
            description: `Successfully created "${form.name}"`,
            duration: 3000,
          })
          closeModal()
          fetchPlans(getCurrentCategory())
        } else {
          addToast({
            type: 'error',
            title: 'Create Failed',
            description:
              response?.data?.msg ||
              response?.data?.message ||
              'Failed to create plan',
            duration: 3000,
          })
        }
      }
    } catch (error) {
      console.error('Failed to save plan:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to save plan',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (planId) => {
    const planToDelete = plans.find((p) => p._id === planId)
    if (!planToDelete) return

    setConfirmModal({
      isOpen: true,
      title: 'Delete Plan?',
      message: `Are you sure you want to delete "${planToDelete.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      colorScheme: 'red',
      icon: 'delete',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        try {
          setLoading(true)
          const response = await apiCall(
            'delete',
            `${config.DELETE_SUBSCRIPTION_PLAN}?subscriptionPlanId=${planId}`
          )

          if (response.status === 200 || response.status === 204) {
            addToast({
              type: 'success',
              title: 'Success',
              description: `Plan "${planToDelete.name}" deleted successfully`,
              duration: 3000,
            })
            fetchPlans(getCurrentCategory())
          } else {
            addToast({
              type: 'error',
              title: 'Error',
              description:
                response?.data?.msg ||
                response?.data?.message ||
                'Failed to delete plan',
              duration: 3000,
            })
          }
        } catch (error) {
          console.error('Error deleting plan:', error)
          addToast({
            type: 'error',
            title: 'Error',
            description: error?.message || 'Failed to delete plan',
            duration: 3000,
          })
        } finally {
          setLoading(false)
        }
      },
    })
  }

  // Since we're using API filtering, we don't need local filtering
  const handleActiveChange = async (plan) => {
    try {
      setLoading(true)
      const response = await apiCall(
        'put',
        `${config.UPDATE_SUBSCRIPTION_STATUS}?subscriptionPlanId=${plan._id}`
      )

      if (response.status === 200) {
        addToast({
          type: 'success',
          title: 'Status Updated',
          description: `You have successfully ${
            plan.isActive ? 'unhidden' : 'hidden'
          } the pricing for "${plan.name}"`,
          duration: 3000,
        })
        fetchPlans(getCurrentCategory())
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to update plan status',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error updating plan status:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to update plan status',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPlans = plans

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: '',
    colorScheme: 'red',
    icon: 'delete',
  })

  const handlePopularChange = (checked) => {
    // If unchecking, just do it
    if (!checked) {
      setForm((prev) => ({ ...prev, isPopular: false }))
      return
    }

    // If checking, check if another plan in the same category is already popular
    const currentCategory = form.planCategory
    const existingPopularPlan = plans.find(
      (p) =>
        p.planCategory === currentCategory &&
        p.isPopular &&
        p._id !== editingPlan?._id
    )

    if (existingPopularPlan) {
      setConfirmModal({
        isOpen: true,
        title: 'Change Most Popular Plan?',
        message: `The plan "${existingPopularPlan.name}" is currently marked as Most Popular. Setting this plan as popular will remove the tag from "${existingPopularPlan.name}". Do you want to proceed?`,
        confirmText: 'Yes, Proceed',
        colorScheme: 'blue',
        icon: 'warning',
        onConfirm: () => {
          setForm((prev) => ({ ...prev, isPopular: true }))
          setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        },
      })
    } else {
      setForm((prev) => ({ ...prev, isPopular: true }))
    }
  }

  return (
    <div className="min-h-screen rounded-xl bg-white p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage subscription and top-up plans
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
          >
            + Add Plan
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 inline-flex w-full rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            className={`group relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              subTab === 'subscription'
                ? 'bg-indigo text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => {
              setSubTab('subscription')
              fetchPlans('Subscription')
            }}
          >
            <HiCurrencyDollar className="h-4 w-4" />
            <span>Subscriptions</span>
          </button>

          <button
            className={`group relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              subTab === 'topup'
                ? 'bg-indigo text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => {
              setSubTab('topup')
              fetchPlans('Top-up')
            }}
          >
            <HiPlus className="h-4 w-4" />
            <span>Top-ups</span>
          </button>
        </div>

        {/* {loading && (
          <div className="text-center">
            <div className="border-t-transparent border-gunmetalGray inline-block h-8 w-8 animate-spin rounded-full border-4"></div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )} */}

        {filteredPlans.length === 0 && !loading ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <HiCurrencyDollar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">
              No plans found
            </p>
            <p className="text-xs text-gray-500">
              Create your first{' '}
              {subTab === 'subscription' ? 'subscription' : 'top-up'} plan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onEdit={() => openModal(plan)}
                onDelete={() => handleDelete(plan._id)}
                onActiveChange={() => handleActiveChange(plan)}
              />
            ))}
          </div>
        )}

        {modalOpen && (
          <PlanModal
            form={form}
            onClose={closeModal}
            onChange={handleChange}
            onPopularChange={handlePopularChange}
            onSubmit={handleSubmit}
            loading={loading}
            isEditing={!!editingPlan}
            billingCycles={billingCycles}
          />
        )}

        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onClose={() =>
            setConfirmModal((prev) => ({ ...prev, isOpen: false }))
          }
          confirmText={confirmModal.confirmText || 'Delete'}
          cancelText="Cancel"
          confirmColorScheme={confirmModal.colorScheme || 'red'}
          icon={confirmModal.icon || 'delete'}
        />
      </div>
    </div>
  )
}

const PlanCard = ({ plan, onEdit, onDelete, onActiveChange }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleToggle = () => {
    if (onActiveChange) {
      onActiveChange()
    }
  }

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-2xl border-2 p-6 shadow-md transition-all duration-300 ${
          plan.isPopular
            ? 'border-indigo bg-indigo'
            : 'border-gray-200 bg-white'
        } ${isHovered ? 'scale-[1.02] border-gray-300 shadow-xl' : ''}`}
      >
        {/* Action Buttons - Show on Hover */}
        <div
          className={`absolute right-4 top-4 flex gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* <button
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 shadow-sm transition-all hover:scale-110 hover:bg-gray-200"
            title="Edit"
          >
            <HiPencil className="h-3.5 w-3.5 text-gray-700" />
          </button> */}
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow-md"
            onClick={onEdit}
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          {/* 
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 shadow-sm transition-all hover:scale-110 hover:bg-red-100"
            title="Delete"
          >
            <HiTrash className="h-3.5 w-3.5 text-red-600" />
          </button> */}
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow-md"
            onClick={onDelete}
            title="Delete"
          >
            <FaTrash size={14} />
          </button>

          <button
            onClick={handleToggle}
            className={`relative inline-flex h-8 w-14 items-center rounded-full shadow-sm transition-all ${
              plan.isActive
                ? plan.isPopular
                  ? 'bg-green-500'
                  : 'bg-green-500'
                : 'bg-gray-300'
            } hover:scale-105`}
            title={plan.isActive ? 'Inactive' : 'Active'}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                plan.isActive ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Most Popular Badge */}
        {plan.isPopular && (
          <div className="mb-4">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              Most Popular
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl font-bold ${
                plan.isPopular ? 'text-white' : 'text-gray-900'
              }`}
            >
              ₹{plan.amount.toLocaleString('en-IN')}
            </span>
            <span
              className={`text-sm font-medium ${
                plan.isPopular ? 'text-white/80' : 'text-gray-500'
              }`}
            >
              /
              {plan.planType === 'monthly'
                ? 'month'
                : plan.planType === 'yearly'
                ? 'year'
                : 'one-time'}
            </span>
          </div>
          {plan.actualAmount && plan.actualAmount > plan.amount && (
            <span
              className={`text-sm line-through ${
                plan.isPopular ? 'text-white/60' : 'text-gray-400'
              }`}
            >
              ₹{plan.actualAmount.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Plan Name */}
        <h3
          className={`mb-3 text-xl font-bold ${
            plan.isPopular ? 'text-white' : 'text-gray-900'
          }`}
        >
          {plan.name}
        </h3>

        {/* Credits */}
        <div className="mb-4">
          <p
            className={`text-lg font-bold ${
              plan.isPopular ? 'text-white' : 'text-gray-900'
            }`}
          >
            {(plan.creditsIncluded ?? plan.credits ?? 0).toLocaleString(
              'en-IN'
            )}{' '}
            Credits
          </p>
        </div>

        {/* Description */}
        {plan.description && (
          <p
            className={`mb-6 text-sm leading-relaxed ${
              plan.isPopular ? 'text-white/90' : 'text-gray-600'
            }`}
          >
            {plan.description}
          </p>
        )}

        {/* Divider */}
        <div
          className={`my-4 border-t ${
            plan.isPopular ? 'border-white/20' : 'border-gray-200'
          }`}
        ></div>

        {/* Features - Flex grow to fill space */}
        <div className="flex-grow">
          <ul className="space-y-2.5">
            {(plan.features || []).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                    plan.isPopular ? 'bg-white/20' : 'bg-green-100'
                  }`}
                >
                  <HiCheck
                    className={`h-3 w-3 ${
                      plan.isPopular ? 'text-white' : 'text-green-600'
                    }`}
                  />
                </div>
                <span
                  className={`text-sm leading-relaxed ${
                    plan.isPopular ? 'text-white/90' : 'text-gray-700'
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Test Mode Badge - Pushed to bottom */}
        {plan.isTestMode && (
          <div
            className={`mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${
              plan.isPopular ? 'bg-white/20' : 'bg-blue-50'
            }`}
          >
            <HiInformationCircle
              className={`h-3.5 w-3.5 ${
                plan.isPopular ? 'text-white' : 'text-blue-600'
              }`}
            />
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${
                plan.isPopular ? 'text-white' : 'text-blue-700'
              }`}
            >
              Test Mode
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// New FeaturesInput Component with Add/Remove functionality
const FeaturesInput = ({ value, onChange }) => {
  const [features, setFeatures] = useState(() => {
    const parsed = value.split('\n').filter((f) => f.trim())
    return parsed.length > 0 ? parsed : ['']
  })
  const [draggedIndex, setDraggedIndex] = useState(null)

  // Sync features back to parent as newline-separated string
  const syncToParent = (newFeatures) => {
    onChange(newFeatures.filter((f) => f.trim()).join('\n'))
  }

  const handleFeatureChange = (index, newValue) => {
    const newFeatures = [...features]
    newFeatures[index] = newValue
    setFeatures(newFeatures)
    syncToParent(newFeatures)
  }

  const addFeature = () => {
    const newFeatures = [...features, '']
    setFeatures(newFeatures)
    // Focus the new input after a small delay
    setTimeout(() => {
      const inputs = document.querySelectorAll('[data-feature-input]')
      if (inputs[features.length]) {
        inputs[features.length].focus()
      }
    }, 50)
  }

  const removeFeature = (index) => {
    if (features.length === 1) {
      setFeatures([''])
      syncToParent([''])
      return
    }
    const newFeatures = features.filter((_, i) => i !== index)
    setFeatures(newFeatures)
    syncToParent(newFeatures)
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeature()
    }
    if (
      e.key === 'Backspace' &&
      features[index] === '' &&
      features.length > 1
    ) {
      e.preventDefault()
      removeFeature(index)
      // Focus previous input
      setTimeout(() => {
        const inputs = document.querySelectorAll('[data-feature-input]')
        if (inputs[index - 1]) {
          inputs[index - 1].focus()
        }
      }, 50)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }

  const handleDrop = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newFeatures = [...features]
    const [removed] = newFeatures.splice(draggedIndex, 1)
    newFeatures.splice(index, 0, removed)
    setFeatures(newFeatures)
    syncToParent(newFeatures)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const isLastItem = (index) => index === features.length - 1

  return (
    <div className="space-y-3">
      {/* Feature Items */}
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group flex items-center gap-2 transition-all ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            {/* Drag Handle */}
            <div className="flex h-10 w-8 cursor-grab items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing">
              <HiMenu className="h-4 w-4" />
            </div>

            {/* Feature Number */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-black">
              {index + 1}
            </div>

            {/* Input Field */}
            <div className="relative flex-1">
              <input
                data-feature-input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder={`Feature ${index + 1} (e.g., Unlimited storage)`}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
              />
              {feature && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <HiCheck className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>

            {/* Add Button - Only show on last item */}
            {isLastItem(index) ? (
              <button
                type="button"
                onClick={addFeature}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-all hover:border-indigo hover:bg-gray-100 hover:text-indigo"
                title="Add feature"
              >
                <HiPlus className="h-5 w-5" />
              </button>
            ) : (
              <div className="w-10 flex-shrink-0"></div>
            )}

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className={`border-transparent flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-2 text-gray-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 ${
                features.length === 1 && !feature
                  ? 'cursor-not-allowed opacity-30'
                  : ''
              }`}
              disabled={features.length === 1 && !feature}
              title="Remove feature"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
        <HiInformationCircle className="h-4 w-4 text-gray-400" />
        <p className="text-xs text-gray-500">
          Click{' '}
          <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300 text-[10px]">
            +
          </span>{' '}
          to add,
          <kbd className="ml-1 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold">
            Enter
          </kbd>{' '}
          for quick add,
          <kbd className="ml-1 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold">
            Backspace
          </kbd>{' '}
          on empty to remove.
        </p>
      </div>
    </div>
  )
}

const PlanModal = ({
  form,
  onClose,
  onChange,
  onPopularChange,
  onSubmit,
  loading,
  isEditing,
  billingCycles,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div
        className="relative flex w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ maxHeight: 'calc(100vh - 40px)' }}
      >
        {/* Header */}
        <div className="relative flex-shrink-0 overflow-hidden px-8 py-6">
          {/* Decorative Elements */}
          <div className="bg-indigo-500/20 absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo ring-1 ring-white/20 backdrop-blur-sm">
                <HiCurrencyDollar className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {isEditing ? 'Edit Pricing Plan' : 'Create New Plan'}
                </h2>
                <p className="mt-1 text-sm text-gray-700">
                  {isEditing
                    ? 'Update your plan details and settings'
                    : 'Set up a new subscription or top-up plan'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="transition-allhover:rotate-90 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400 ring-1 ring-white/20 backdrop-blur-sm"
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area - Two Column Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Form (Scrollable) */}
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            <form onSubmit={onSubmit} className="space-y-8 p-8">
              {/* Section 1: Basic Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-black">
                    <HiInformationCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Basic Information
                    </h3>
                    <p className="text-xs text-gray-500">
                      Define the core details of your pricing plan
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Plan Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      Plan Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      required
                      className="focus:ring-indigo-500/10 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-indigo focus:outline-none focus:ring-1"
                      placeholder="e.g., Professional, Enterprise, Starter"
                    />
                  </div>

                  {/* Category - IMPROVED with checkmark indicator */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      Plan Category
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all ${
                          form.planCategory === 'subscription'
                            ? 'border border-indigo ring-1 '
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="planCategory"
                          value="subscription"
                          checked={form.planCategory === 'subscription'}
                          onChange={onChange}
                          className="sr-only"
                        />
                        {form.planCategory === 'subscription' && (
                          <div className="bg-indigo-500 absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm">
                            <HiCheck className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <HiRefresh className="h-4 w-4" />
                        <span className="text-sm font-semibold">
                          Subscription
                        </span>
                      </label>
                      <label
                        className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all ${
                          form.planCategory === 'topup'
                            ? 'border-indigo ring-1'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="planCategory"
                          value="topup"
                          checked={form.planCategory === 'topup'}
                          onChange={onChange}
                          className="sr-only"
                        />
                        {form.planCategory === 'topup' && (
                          <div className="bg-indigo-500 absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm">
                            <HiCheck className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <HiPlus className="h-4 w-4" />
                        <span className="text-sm font-semibold">Top-up</span>
                      </label>
                    </div>
                  </div>

                  {/* Description - Full Width */}
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={onChange}
                      rows={2}
                      className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-indigo focus:outline-none focus:ring-1 "
                      placeholder="Describe what this plan offers to your customers..."
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing Details */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-black">
                    <HiCurrencyDollar className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Pricing Details
                    </h3>
                    <p className="text-xs text-gray-500">
                      Set the price, credits, and billing cycle
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Billing Cycle - Dropdown */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      Billing Cycle
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="planType"
                        value={form.planType}
                        onChange={onChange}
                        className="focus:ring-indigo-500/10 w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-900 transition-all focus:border-indigo focus:outline-none focus:ring-1"
                      >
                        {billingCycles.length > 0 ? (
                          billingCycles.map((cycle) => (
                            <option
                              key={cycle.name.toLowerCase()}
                              value={cycle.name.toLowerCase()}
                            >
                              {cycle.name} - {cycle.description}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="monthly">
                              Monthly - Billed every month
                            </option>
                            <option value="yearly">
                              Yearly - Billed annually
                            </option>
                            <option value="onetime">
                              One-time - Single payment
                            </option>
                          </>
                        )}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <HiChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Select how often users will be billed
                    </p>
                  </div>

                  {/* Sale Price */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      Sale Price
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                        ₹
                      </span>
                      <input
                        name="amount"
                        type="number"
                        value={form.amount}
                        onChange={onChange}
                        required
                        min={0}
                        className="focus:ring-indigo-500/10 w-full rounded-xl border-2 border-gray-200 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-indigo focus:outline-none focus:ring-1"
                        placeholder="999"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      The price users will pay
                    </p>
                  </div>

                  {/* Original Price */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      Original Price
                      <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        Optional
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                        ₹
                      </span>
                      <input
                        name="actualAmount"
                        type="number"
                        value={form.actualAmount}
                        onChange={onChange}
                        min={0}
                        className="focus:ring-indigo-500/10 w-full rounded-xl border-2 border-gray-200 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-indigo focus:outline-none focus:ring-1"
                        placeholder="1999"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Show as strikethrough for discount
                    </p>
                  </div>

                  {/* Credits */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      Credits Included
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="creditsIncluded"
                        type="number"
                        value={form.creditsIncluded}
                        onChange={onChange}
                        required
                        min={0}
                        className="focus:ring-indigo-500/10 w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-20 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-indigo focus:outline-none focus:ring-1"
                        placeholder="1000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                        credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Features - Updated with FeaturesInput component */}
              <div className="relative space-y-5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-black">
                      <HiCheckCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Plan Features
                      </h3>
                      <p className="text-xs text-gray-500">
                        List the features included in this plan
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-black">
                    {
                      form.featuresText.split('\n').filter((f) => f.trim())
                        .length
                    }{' '}
                    features
                  </span>
                </div>

                <div className="mb-8">
                  <FeaturesInput
                    value={form.featuresText}
                    onChange={(newValue) =>
                      onChange({
                        target: { name: 'featuresText', value: newValue },
                      })
                    }
                  />
                </div>
              </div>

              {/* Section 4: Settings */}
              <div className="relative space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-200 text-black">
                    <HiCog className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Plan Settings
                    </h3>
                    <p className="text-xs text-gray-500">
                      Configure visibility and special flags
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {/* Popular Toggle */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
                      form.isPopular
                        ? 'border-indigo bg-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        form.isPopular ? 'bg-gray-200' : 'bg-gray-100'
                      }`}
                    >
                      <HiStar
                        className={`h-5 w-5 ${
                          form.isPopular ? 'text-black' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-gray-900">Popular</span>
                        <div
                          className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                            form.isPopular ? 'bg-indigo' : 'bg-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="isPopular"
                            checked={form.isPopular}
                            onChange={(e) => onPopularChange(e.target.checked)}
                            className="sr-only"
                          />
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                              form.isPopular
                                ? 'translate-x-5'
                                : 'translate-x-0.5'
                            }`}
                          />
                        </div>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        Highlight plan
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side - Live Preview (Fixed) */}
          <div className="hidden w-[340px] flex-shrink-0 border-l border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 lg:block">
            <div className="custom-scrollbar sticky top-0 h-full overflow-y-auto p-6">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                  <HiEye className="h-4 w-4 text-gray-600" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  Live Preview
                </span>
              </div>

              {/* Plan Card Preview */}
              <div
                className={`overflow-hidden rounded-2xl border-2 p-5 shadow-xl transition-all ${
                  form.isPopular
                    ? 'border-indigo bg-indigo'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {form.isPopular && (
                  <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                )}

                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-3xl font-bold ${
                        form.isPopular ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      ₹{Number(form.amount || 0).toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        form.isPopular ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      /
                      {form.planType === 'monthly'
                        ? 'mo'
                        : form.planType === 'yearly'
                        ? 'yr'
                        : 'once'}
                    </span>
                  </div>
                  {form.actualAmount &&
                    Number(form.actualAmount) > Number(form.amount) && (
                      <span
                        className={`text-xs line-through ${
                          form.isPopular ? 'text-white/50' : 'text-gray-400'
                        }`}
                      >
                        ₹{Number(form.actualAmount).toLocaleString('en-IN')}
                      </span>
                    )}
                </div>

                <h4
                  className={`mb-2 text-lg font-bold ${
                    form.isPopular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {form.name || 'Plan Name'}
                </h4>

                <p
                  className={`mb-3 text-sm font-semibold ${
                    form.isPopular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {Number(form.creditsIncluded || 0).toLocaleString('en-IN')}{' '}
                  Credits
                </p>

                {form.description && (
                  <p
                    className={`mb-4 text-xs leading-relaxed ${
                      form.isPopular ? 'text-white/80' : 'text-gray-600'
                    }`}
                  >
                    {form.description.slice(0, 80)}
                    {form.description.length > 80 ? '...' : ''}
                  </p>
                )}

                <div
                  className={`my-4 border-t ${
                    form.isPopular ? 'border-white/20' : 'border-gray-200'
                  }`}
                ></div>

                {form.featuresText && (
                  <ul className="space-y-2">
                    {form.featuresText
                      .split('\n')
                      .filter((f) => f.trim())
                      .slice(0, 5)
                      .map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div
                            className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                              form.isPopular ? 'bg-white/20' : 'bg-green-100'
                            }`}
                          >
                            <HiCheck
                              className={`h-2.5 w-2.5 ${
                                form.isPopular ? 'text-white' : 'text-green-600'
                              }`}
                            />
                          </div>
                          <span
                            className={`text-xs leading-tight ${
                              form.isPopular ? 'text-white/80' : 'text-gray-600'
                            }`}
                          >
                            {feature.trim().slice(0, 35)}
                            {feature.trim().length > 35 ? '...' : ''}
                          </span>
                        </li>
                      ))}
                    {form.featuresText.split('\n').filter((f) => f.trim())
                      .length > 5 && (
                      <li
                        className={`pl-6 text-[10px] ${
                          form.isPopular ? 'text-white/60' : 'text-gray-400'
                        }`}
                      >
                        +
                        {form.featuresText.split('\n').filter((f) => f.trim())
                          .length - 5}{' '}
                        more features
                      </li>
                    )}
                  </ul>
                )}

                {form.isTestMode && (
                  <div
                    className={`mt-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 ${
                      form.isPopular ? 'bg-white/20' : 'bg-blue-50'
                    }`}
                  >
                    <HiInformationCircle
                      className={`h-3 w-3 ${
                        form.isPopular ? 'text-white' : 'text-blue-600'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        form.isPopular ? 'text-white' : 'text-blue-600'
                      }`}
                    >
                      Test Mode
                    </span>
                  </div>
                )}
              </div>

              {/* Status Cards */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
                    <span className="text-xs font-medium text-gray-600">
                      Status
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      form.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {form.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
                    <span className="text-xs font-medium text-gray-600">
                      Category
                    </span>
                  </div>
                  <span className="rounded-full bg-indigo px-2.5 py-1 text-[10px] font-bold text-white">
                    {form.planCategory === 'subscription'
                      ? 'Subscription'
                      : 'Top-up'}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
                    <span className="text-xs font-medium text-gray-600">
                      Billing
                    </span>
                  </div>
                  <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold capitalize text-purple-700">
                    {form.planType === 'onetime' ? 'One-time' : form.planType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <HiInformationCircle className="h-4 w-4" />
              <span>
                {isEditing
                  ? 'Changes will be reflected immediately'
                  : 'Plan will be active immediately after creation'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                onClick={onSubmit}
                className="flex items-center gap-2 rounded-xl bg-indigo px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-gray-800 hover:to-gray-700 hover:shadow-xl disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>{isEditing ? 'Save Changes' : 'Create Plan'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
.custom-scrollbar::-webkit-scrollbar {
width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
background: #cbd5e1;
border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
background: #94a3b8;
}
`}</style>
    </div>
  )
}

export default Pricing
