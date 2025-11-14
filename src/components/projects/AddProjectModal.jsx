import React, { useState, useEffect } from 'react'
import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa'
import { Edit, Plus } from 'lucide-react'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'

const AddProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  editData = null,
  addToast,
}) => {
  const { apiCall } = ApiCaller()
  const [serviceType, setServiceType] = useState('')
  const [metadataFields, setMetadataFields] = useState([])
  const [newFieldName, setNewFieldName] = useState('')
  const [isGender, setIsGender] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [isCategoriesCollapsed, setIsCategoriesCollapsed] = useState(false)
  const [collapsedCategories, setCollapsedCategories] = useState({})

  // Populate form when editing
  useEffect(() => {
    if (isOpen && editData) {
      setServiceType(editData.name || '')
      setIsGender(editData.isGender || false)

      // Convert schema to metadata fields format
      if (editData.schema && editData.schema[editData.name]) {
        const schemaData = editData.schema[editData.name]

        // Check if data is in new nested format
        if (schemaData.category && Array.isArray(schemaData.category)) {
          // New format: { category: [{ name: "Fashion", subcategory: [{ name: "Shoes", _id: "..." }] }] }
          const fields = schemaData.category.map((cat) => {
            const subcategoryValues = cat.subcategory
              ? cat.subcategory.map((sub) => {
                  // Preserve _id if it exists
                  if (typeof sub === 'object' && sub.name) {
                    return { name: sub.name, _id: sub._id }
                  }
                  return { name: sub }
                })
              : []

            return {
              id: Date.now() + Math.random(),
              key: cat.name,
              type: 'array',
              value:
                subcategoryValues.length > 0
                  ? subcategoryValues
                  : [{ name: '' }],
            }
          })
          setMetadataFields(fields)
        } else {
          // Old format: { "Fashion": ["Shoes", "Bags"] }
          const fields = Object.entries(schemaData).map(([key, value]) => ({
            id: Date.now() + Math.random(),
            key: key,
            type: 'array',
            value: Array.isArray(value)
              ? value.map((v) => ({ name: v }))
              : [{ name: value }],
          }))
          setMetadataFields(fields)
        }
      }
    } else if (isOpen && !editData) {
      // Reset form for add mode
      setServiceType('')
      setMetadataFields([])
      setNewFieldName('')
      setIsGender(false)
    }
  }, [isOpen, editData])

  if (!isOpen) return null

  const addMetadataField = () => {
    const newErrors = {}

    // Clear previous errors
    setErrors({})

    // Validate Project Name is filled
    if (!serviceType.trim()) {
      newErrors.serviceType = 'Please enter a Project Name first'
    }

    // Validate Category name is filled
    if (!newFieldName.trim()) {
      newErrors.newFieldName = 'Please enter a Category name'
    }

    // Check for duplicate category names
    const duplicateCategory = metadataFields.find(
      (field) => field.key.toLowerCase() === newFieldName.trim().toLowerCase()
    )
    if (duplicateCategory) {
      newErrors.newFieldName = 'This category name already exists'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newField = {
      id: Date.now(),
      key: newFieldName.trim(),
      type: 'array',
      value: [{ name: '' }], // Start with 1 empty value as object
    }

    setMetadataFields([...metadataFields, newField])
    setNewFieldName('')
    setErrors({})
  }

  const addArrayValue = (fieldId) => {
    setMetadataFields(
      metadataFields.map((field) =>
        field.id === fieldId
          ? { ...field, value: [...field.value, { name: '' }] }
          : field
      )
    )
  }

  const updateArrayValue = (fieldId, index, value) => {
    setMetadataFields(
      metadataFields.map((field) => {
        if (field.id === fieldId) {
          const newValue = [...field.value]
          // Update the name property while preserving _id if it exists
          newValue[index] = { ...newValue[index], name: value }
          return { ...field, value: newValue }
        }
        return field
      })
    )
  }

  const removeArrayValue = async (fieldId, index) => {
    const field = metadataFields.find((f) => f.id === fieldId)
    const subcategory = field?.value[index]

    // If in edit mode and subcategory has _id, call DELETE API
    if (editData && subcategory?._id && editData._id) {
      console.log('Deleting subcategory:', {
        projectId: editData._id,
        subcategoryId: subcategory._id,
        subcategoryName: subcategory.name,
      })

      setLoading(true)
      try {
        const response = await apiCall(
          'delete',
          `${config.DELETE_SERVICE_TYPE}/${editData._id}`,
          { elementId: subcategory._id }
        )

        if (response.status === 200 || response.status === 204) {
          if (addToast) {
            addToast({
              type: 'success',
              title: 'Success',
              description: 'Subcategory deleted successfully',
              duration: 3000,
            })
          }
        } else {
          if (addToast) {
            addToast({
              type: 'error',
              title: 'Error',
              description:
                response?.data?.msg || 'Failed to delete subcategory',
              duration: 3000,
            })
          }
          setLoading(false)
          return // Don't remove from UI if API call failed
        }
      } catch (error) {
        console.error('Error deleting subcategory:', error)
        if (addToast) {
          addToast({
            type: 'error',
            title: 'Error',
            description: 'Failed to delete subcategory',
            duration: 3000,
          })
        }
        setLoading(false)
        return // Don't remove from UI if API call failed
      } finally {
        setLoading(false)
      }
    }

    // Remove from local state
    setMetadataFields(
      metadataFields
        .map((field) => {
          if (field.id === fieldId) {
            const newValue = field.value.filter((_, i) => i !== index)
            // If this was the last value, we'll filter out the entire field below
            return { ...field, value: newValue }
          }
          return field
        })
        .filter((field) => field.value.length > 0) // Remove fields with no values
    )
  }

  const handleSubmit = async () => {
    const newErrors = {}
    const newFieldErrors = {}

    // Clear previous errors
    setErrors({})
    setFieldErrors({})

    // Trim and validate service type
    const trimmedServiceType = serviceType.trim()

    if (!trimmedServiceType) {
      newErrors.serviceType = 'Please enter a Project Name'
    }

    if (metadataFields.length === 0) {
      newErrors.metadataFields = 'Please add at least one category field'
    }

    // Validate each metadata field
    metadataFields.forEach((field) => {
      if (!field.key.trim()) {
        newFieldErrors[`${field.id}_category`] = 'Category name is required'
      }

      const validSubcategories = field.value.filter(
        (v) => v.name && v.name.trim() !== ''
      )
      if (validSubcategories.length === 0) {
        newFieldErrors[`${field.id}_subcategory`] =
          'At least one subcategory is required'
      }
    })

    // If there are errors, show them and return
    if (
      Object.keys(newErrors).length > 0 ||
      Object.keys(newFieldErrors).length > 0
    ) {
      setErrors(newErrors)
      setFieldErrors(newFieldErrors)
      return
    }

    setLoading(true)

    try {
      // Build metadata object in nested format
      const categories = []

      metadataFields.forEach((field) => {
        // Filter out empty strings from array (now working with objects)
        const filteredValues = field.value.filter(
          (v) => v.name && v.name.trim() !== ''
        )

        if (filteredValues.length > 0 && field.key.trim() !== '') {
          // Create subcategory array with name objects
          const subcategories = filteredValues.map((value) => ({
            name: value.name.trim(),
          }))

          // Add category with its subcategories
          categories.push({
            name: field.key.trim(),
            subcategory: subcategories,
          })
        }
      })

      // Create final metadata structure
      const metaData = {
        category: categories,
        isGender: isGender,
      }

      console.log('Submitting project with data:', {
        serviceType: trimmedServiceType,
        metaData,
      })

      // Call onSubmit with trimmed serviceType and metaData
      await onSubmit({ serviceType: trimmedServiceType, metaData })

      // Reset form
      setServiceType('')
      setMetadataFields([])
      setNewFieldName('')
      setIsGender(false)
      setErrors({})
      setFieldErrors({})
    } catch (error) {
      console.error('Error submitting project:', error)
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Submission Failed',
          description: 'An error occurred while saving the project',
          duration: 3000,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGenderToggle = () => {
    const newGenderState = !isGender
    setIsGender(newGenderState)

    if (addToast) {
      addToast({
        type: newGenderState ? 'success' : 'error',
        title: 'Gender Field',
        description: newGenderState
          ? 'Gender field has been enabled'
          : 'Gender field has been disabled',
        duration: 3000,
      })
    }
  }

  const toggleCategoryCollapse = (fieldId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  const handleCancel = () => {
    setServiceType('')
    setMetadataFields([])
    setNewFieldName('')
    setIsGender(false)
    setErrors({})
    setFieldErrors({})
    setLoading(false)
    setCollapsedCategories({})
    onClose()
  }

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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo">
                {editData ? (
                  <Edit className="text-white" size={18} />
                ) : (
                  <Plus className="text-white" size={18} />
                )}
              </div>
              <div>
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {editData ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  {editData
                    ? 'Update your project details'
                    : 'Set up your project in 3 simple steps'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
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
          {/* Step 1: Project Name */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-sm font-bold text-white">
                1
              </span>
              <h3 className="text-lg font-bold text-gray-800">Project Name</h3>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              💡 What type of business or project is this? (e.g., Jewellery ,
              Furniture, Pharma)
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => {
                    setServiceType(e.target.value)
                    if (errors.serviceType) {
                      setErrors((prev) => ({ ...prev, serviceType: '' }))
                    }
                  }}
                  placeholder="Enter your project name (e.g.,Jewellery , Furniture, Pharma)"
                  className={`w-full rounded-lg border px-4 py-3 text-base transition-colors focus:outline-none ${
                    errors.serviceType
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300 bg-white focus:border-gray-500'
                  }`}
                />
                {errors.serviceType && (
                  <p className="mt-2 text-sm text-red-600">
                    ⚠️ {errors.serviceType}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                <span className="text-sm font-medium text-gray-700">
                  Include Gender Field:
                </span>
                <button
                  type="button"
                  onClick={handleGenderToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isGender ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isGender ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${
                    isGender ? 'text-gray-600' : 'text-gray-500'
                  }`}
                >
                  {isGender ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Add Categories */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-sm font-bold text-white">
                2
              </span>
              <h3 className="text-lg font-bold text-gray-800">
                Add Categories
              </h3>
            </div>

            <p className="mb-4 text-sm text-gray-600">
              🏷️ Add main categories for your project (e.g., Earrings,
              Necklaces, Accessories)
            </p>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => {
                    setNewFieldName(e.target.value)
                    if (errors.newFieldName) {
                      setErrors((prev) => ({ ...prev, newFieldName: '' }))
                    }
                  }}
                  placeholder="Type category name (e.g., Earrings, Necklaces, Accessories)"
                  className={`w-full rounded-lg border px-4 py-3 text-base transition-colors focus:outline-none ${
                    errors.newFieldName
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300 bg-white focus:border-gray-500'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addMetadataField()
                    }
                  }}
                />
                {errors.newFieldName && (
                  <p className="mt-2 text-sm text-red-600">
                    ⚠️ {errors.newFieldName}
                  </p>
                )}
              </div>

              <button
                onClick={addMetadataField}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blueSecondary px-5 py-3 font-medium text-white transition-colors hover:bg-gray-700"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" size={14} />
                ) : (
                  <FaPlus size={14} />
                )}
                Add
              </button>
            </div>
          </div>

          {/* Show validation error for metadata fields */}
          {errors.metadataFields && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-600">
                ⚠️ {errors.metadataFields}
              </p>
            </div>
          )}

          {/* Step 3: Your Categories */}
          {metadataFields.length > 0 && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-sm font-bold text-white">
                  3
                </span>
                <h3 className="text-lg font-bold text-gray-800">
                  Your Categories
                </h3>
                <span className="rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-700">
                  {metadataFields.length}{' '}
                  {metadataFields.length === 1 ? 'category' : 'categories'}
                </span>
                <button
                  onClick={() =>
                    setIsCategoriesCollapsed(!isCategoriesCollapsed)
                  }
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-200"
                  title={
                    isCategoriesCollapsed
                      ? 'Expand categories'
                      : 'Collapse categories'
                  }
                >
                  {isCategoriesCollapsed ? (
                    <FaChevronDown className="text-gray-600" size={14} />
                  ) : (
                    <FaChevronUp className="text-gray-600" size={14} />
                  )}
                </button>
              </div>

              {!isCategoriesCollapsed && (
                <>
                  <p className="mb-4 text-sm text-gray-600">
                    📝 Add subcategories to organize your items better
                  </p>

                  <div className="space-y-4">
                    {metadataFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="flex items-center gap-2 text-base font-bold text-gray-800">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-sm text-white">
                              {index + 1}
                            </span>
                            {field.key || 'Category Name'}
                          </h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => addArrayValue(field.id)}
                              disabled={loading}
                              className="flex items-center gap-1 rounded-lg bg-indigo px-3 py-1 text-sm text-white transition-colors hover:bg-gray-700"
                            >
                              <FaPlus size={12} />
                              Add Item
                            </button>
                            <button
                              onClick={() => toggleCategoryCollapse(field.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                              title={
                                collapsedCategories[field.id]
                                  ? 'Expand category'
                                  : 'Collapse category'
                              }
                            >
                              {collapsedCategories[field.id] ? (
                                <FaChevronDown
                                  className="text-gray-600"
                                  size={14}
                                />
                              ) : (
                                <FaChevronUp
                                  className="text-gray-600"
                                  size={14}
                                />
                              )}
                            </button>
                          </div>
                        </div>

                        {!collapsedCategories[field.id] && (
                          <>
                            {/* Show field-level errors */}
                            {(fieldErrors[`${field.id}_category`] ||
                              fieldErrors[`${field.id}_subcategory`]) && (
                              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="text-sm font-medium text-red-600">
                                  ⚠️{' '}
                                  {fieldErrors[`${field.id}_category`] ||
                                    fieldErrors[`${field.id}_subcategory`]}
                                </p>
                              </div>
                            )}

                            <div className="space-y-4">
                              {/* Category Name Section */}
                              <div>
                                <div className="mb-2 text-sm font-medium text-gray-700">
                                  Category Name
                                </div>
                                <input
                                  type="text"
                                  value={field.key}
                                  onChange={(e) => {
                                    setMetadataFields(
                                      metadataFields.map((f) =>
                                        f.id === field.id
                                          ? { ...f, key: e.target.value }
                                          : f
                                      )
                                    )
                                    if (fieldErrors[`${field.id}_category`]) {
                                      setFieldErrors((prev) => ({
                                        ...prev,
                                        [`${field.id}_category`]: '',
                                      }))
                                    }
                                  }}
                                  placeholder="Enter category name"
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                                />
                              </div>

                              {/* Subcategory Items Section */}
                              <div>
                                <div className="mb-2 text-sm font-medium text-gray-700">
                                  Subcategory Items
                                </div>
                                <div className="space-y-2">
                                  {field.value.map((val, valIndex) => (
                                    <div
                                      key={valIndex}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="text"
                                        value={val.name || ''}
                                        onChange={(e) => {
                                          updateArrayValue(
                                            field.id,
                                            valIndex,
                                            e.target.value
                                          )
                                          if (
                                            fieldErrors[
                                              `${field.id}_subcategory`
                                            ]
                                          ) {
                                            setFieldErrors((prev) => ({
                                              ...prev,
                                              [`${field.id}_subcategory`]: '',
                                            }))
                                          }
                                        }}
                                        placeholder="Enter subcategory item"
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                                      />
                                      <button
                                        onClick={() =>
                                          removeArrayValue(field.id, valIndex)
                                        }
                                        disabled={loading}
                                        className="rounded-lg bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-600"
                                        title="Remove item"
                                      >
                                        <FaTrash size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {metadataFields.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="mb-2 text-base text-gray-600">
                👆 Add your first category above
              </p>
              <p className="text-sm text-gray-500">
                Categories help organize your project (like: Shirts, Pants,
                Accessories)
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between rounded-b-3xl border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">
            💡 Make sure to add at least one category with items
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-indigo px-8 py-3 font-medium text-white transition-colors hover:bg-gray-700"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" size={14} />
                  {editData ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>{editData ? 'Update Project' : 'Create Project'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProjectModal
