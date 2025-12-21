import React from 'react'
import {
  HiCurrencyDollar,
  HiPlus,
  HiCheck,
  HiX,
  HiInformationCircle,
  HiCheckCircle,
  HiStar,
  HiCog,
  HiEye,
  HiChevronDown,
  HiMenu,
  HiRefresh,
  HiTrash,
} from 'react-icons/hi'

// FeaturesInput Component
const FeaturesInput = ({ value, onChange }) => {
  const [features, setFeatures] = React.useState(() => {
    const parsed = value.split('\n').filter((f) => f.trim())
    return parsed.length > 0 ? parsed : ['']
  })
  const [draggedIndex, setDraggedIndex] = React.useState(null)

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

              {/* Section 3: Features */}
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

export default PlanModal
