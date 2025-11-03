import React, { useState, useEffect } from 'react'
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa'

const AddProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  editData = null,
  addToast,
}) => {
  const [serviceType, setServiceType] = useState('')
  const [metadataFields, setMetadataFields] = useState([])
  const [newFieldName, setNewFieldName] = useState('')

  // Populate form when editing
  useEffect(() => {
    if (isOpen && editData) {
      setServiceType(editData.name || '')

      // Convert schema to metadata fields format
      if (editData.schema && editData.schema[editData.name]) {
        const schemaData = editData.schema[editData.name]
        const fields = Object.entries(schemaData).map(([key, value]) => ({
          id: Date.now() + Math.random(),
          key: key,
          type: 'array',
          value: Array.isArray(value) ? value : [value],
        }))
        setMetadataFields(fields)
      }
    } else if (isOpen && !editData) {
      // Reset form for add mode
      setServiceType('')
      setMetadataFields([])
      setNewFieldName('')
    }
  }, [isOpen, editData])

  if (!isOpen) return null

  const addMetadataField = () => {
    // Validate Project Name is filled
    if (!serviceType.trim()) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: 'Please enter a Project Name first',
          duration: 3000,
        })
      } else {
        alert('Please enter a Project Name first')
      }
      return
    }

    // Validate Category name is filled
    if (!newFieldName.trim()) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: 'Please enter a Category name',
          duration: 3000,
        })
      } else {
        alert('Please enter a Category name')
      }
      return
    }

    const newField = {
      id: Date.now(),
      key: newFieldName.trim(),
      type: 'array',
      value: [''], // Start with 1 empty value
    }

    setMetadataFields([...metadataFields, newField])
    setNewFieldName('')
  }

  const removeMetadataField = (fieldId) => {
    setMetadataFields(metadataFields.filter((field) => field.id !== fieldId))
  }

  const addArrayValue = (fieldId) => {
    setMetadataFields(
      metadataFields.map((field) =>
        field.id === fieldId ? { ...field, value: [...field.value, ''] } : field
      )
    )
  }

  const updateArrayValue = (fieldId, index, value) => {
    setMetadataFields(
      metadataFields.map((field) => {
        if (field.id === fieldId) {
          const newValue = [...field.value]
          newValue[index] = value
          return { ...field, value: newValue }
        }
        return field
      })
    )
  }

  const removeArrayValue = (fieldId, index) => {
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

  const handleSubmit = () => {
    // Trim and validate service type
    const trimmedServiceType = serviceType.trim()

    if (!trimmedServiceType) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: 'Please enter a Project Name',
          duration: 3000,
        })
      } else {
        alert('Please enter a project name')
      }
      return
    }

    if (metadataFields.length === 0) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: 'Please add at least one category field',
          duration: 3000,
        })
      } else {
        alert('Please add at least one category field')
      }
      return
    }

    // Build metadata object from fields
    const metaData = {}
    metadataFields.forEach((field) => {
      // Filter out empty strings from array
      const filteredValues = field.value.filter((v) => v.trim() !== '')

      // If only one value, send as string; otherwise send as array
      if (filteredValues.length === 1) {
        metaData[field.key] = filteredValues[0]
      } else if (filteredValues.length > 1) {
        metaData[field.key] = filteredValues
      }
      // If no values, don't add the field
    })

    // Validate that we have at least one field with values
    if (Object.keys(metaData).length === 0) {
      if (addToast) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: 'Please add at least one sub category value',
          duration: 3000,
        })
      } else {
        alert('Please add at least one sub category value')
      }
      return
    }

    console.log('Submitting project with data:', {
      serviceType: trimmedServiceType,
      metaData,
    })

    // Call onSubmit with trimmed serviceType and metaData
    onSubmit({ serviceType: trimmedServiceType, metaData })

    // Reset form
    setServiceType('')
    setMetadataFields([])
    setNewFieldName('')
  }

  const handleCancel = () => {
    setServiceType('')
    setMetadataFields([])
    setNewFieldName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[100vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editData ? 'Edit Project' : 'Add New Project'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service Type and Field Input Row */}
          <div className="mb-6 grid grid-cols-12 gap-3">
            {/* Service Type Name */}
            <div className="col-span-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="e.g., jewelry, medical, electronics"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Field Input */}
            <div className="col-span-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Field name (e.g., category, medicines)"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addMetadataField()
                  }
                }}
              />
            </div>

            {/* Add Field Button */}
            <div className="col-span-2 flex items-end">
              <button
                onClick={addMetadataField}
                className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <FaPlus size={12} />
                Add
              </button>
            </div>
          </div>

          {/* Divider */}
          {metadataFields.length > 0 && (
            <div className="-mx-6 my-6 border-t border-gray-200"></div>
          )}

          {/* Display Metadata Fields */}
          {metadataFields.length > 0 && (
            <div className="space-y-3">
              {metadataFields.map((field) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  {/* Array Values - Display with Category in first row only */}
                  <div className="space-y-3">
                    {/* Add Subcategory Button at Top */}
                    {field.value.length > 0 && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => addArrayValue(field.id)}
                          className="flex h-[42px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                          title="Add subcategory"
                        >
                          <FaPlus size={12} />
                          Add Subcategory
                        </button>
                      </div>
                    )}

                    {/* Column Headers */}
                    {field.value.length > 0 && (
                      <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                        <div className="text-xs font-semibold text-gray-600">
                          Category <span className="text-red-500">*</span>
                        </div>
                        <div className="text-xs font-semibold text-gray-600">
                          Subcategory <span className="text-red-500">*</span>
                        </div>
                        <div className="w-[38px]"></div>
                      </div>
                    )}

                    {/* Rows */}
                    {field.value.map((val, index) => (
                      <div
                        key={index}
                        className={`grid gap-3 ${
                          index === 0
                            ? 'grid-cols-[1fr_1fr_auto]'
                            : 'grid-cols-[1fr_auto]'
                        }`}
                      >
                        {/* First Row - Category and Subcategory */}
                        {index === 0 ? (
                          <>
                            {/* Category Input - Only in first row */}
                            <input
                              type="text"
                              value={field.key}
                              onChange={(e) => {
                                // Update the category name for this field
                                setMetadataFields(
                                  metadataFields.map((f) =>
                                    f.id === field.id
                                      ? { ...f, key: e.target.value }
                                      : f
                                  )
                                )
                              }}
                              placeholder="Enter category name"
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />

                            {/* Subcategory Input */}
                            <input
                              type="text"
                              value={val}
                              onChange={(e) =>
                                updateArrayValue(
                                  field.id,
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter subcategory value`}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />

                            {/* Delete Button */}
                            <button
                              onClick={() => removeArrayValue(field.id, index)}
                              className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                              title="Remove subcategory"
                            >
                              <FaTrash size={12} />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Additional Rows - Subcategory only */}
                            <input
                              type="text"
                              value={val}
                              onChange={(e) =>
                                updateArrayValue(
                                  field.id,
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter subcategory value`}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />

                            {/* Delete Button - Only button on additional rows */}
                            <button
                              onClick={() => removeArrayValue(field.id, index)}
                              className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                              title="Remove subcategory"
                            >
                              <FaTrash size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {metadataFields.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 text-center">
              <p className="text-sm text-gray-500">
                No metadata fields added yet. Add fields using the form above.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {editData ? 'Update Project' : 'Add Project'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddProjectModal
