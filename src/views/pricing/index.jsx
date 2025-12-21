import React, { useEffect, useMemo, useState } from 'react'
import { FaEye, FaTrash, FaBan, FaEdit, FaSearch } from 'react-icons/fa'

import {
  HiCurrencyDollar,
  HiPlus,
  HiCheck,
  HiInformationCircle,
} from 'react-icons/hi'
import { useToaster } from '../../common/Toaster'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import AddPlanModal from '../../components/pricing/AddPlanModal'
import EditPlanModal from '../../components/pricing/EditPlanModal'

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

        {modalOpen && !editingPlan && (
          <AddPlanModal
            form={form}
            onClose={closeModal}
            onChange={handleChange}
            onPopularChange={handlePopularChange}
            onSubmit={handleSubmit}
            loading={loading}
            billingCycles={billingCycles}
          />
        )}

        {modalOpen && editingPlan && (
          <EditPlanModal
            form={form}
            onClose={closeModal}
            onChange={handleChange}
            onPopularChange={handlePopularChange}
            onSubmit={handleSubmit}
            loading={loading}
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

export default Pricing
