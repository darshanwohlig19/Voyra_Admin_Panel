import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import { FaTrash, FaTimes } from 'react-icons/fa'
import { Plus, Edit } from 'lucide-react'
import { useToaster } from '../../common/Toaster'

const AddShortTypeModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [items, setItems] = useState([
    { name: '', typesubtitle: '', image: '', file: null, imageUrl: null },
  ])
  const { addToast } = useToaster()

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      if (editData.items && editData.items.length > 0) {
        setItems(
          editData.items.map((item) => ({
            name: item.name || '',
            typesubtitle: item.typesubtitle || '',
            image: item.image || '',
            file: null,
            imageUrl: item.image || null,
          }))
        )
      }
    } else {
      // Reset for add mode
      setItems([
        { name: '', typesubtitle: '', image: '', file: null, imageUrl: null },
      ])
    }
  }, [editData, isOpen])

  const handleItemNameChange = (index, value) => {
    const updatedItems = [...items]
    updatedItems[index].name = value
    setItems(updatedItems)
  }

  const handleItemSubtitleChange = (index, value) => {
    const updatedItems = [...items]
    updatedItems[index].typesubtitle = value
    setItems(updatedItems)
  }

  const handleItemImageChange = (index, file) => {
    const updatedItems = [...items]
    updatedItems[index].file = file
    updatedItems[index].imageUrl = file ? URL.createObjectURL(file) : null
    setItems(updatedItems)
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index)
      setItems(updatedItems)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    for (let i = 0; i < items.length; i++) {
      // Check name
      if (!items[i].name.trim()) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: `Please provide a name for item ${i + 1}`,
          duration: 3000,
        })
        return
      }

      // Check description
      if (!items[i].typesubtitle?.trim()) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: `Please provide a description for item ${i + 1}`,
          duration: 3000,
        })
        return
      }

      // Check image (must have either new file or existing image)
      if (!items[i].file && !items[i].image) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: `Please upload an image for item ${i + 1}`,
          duration: 3000,
        })
        return
      }
    }

    // Prepare data for submission
    const submitData = {
      items: items.map((item) => ({
        name: item.name.trim(),
        typesubtitle: item.typesubtitle?.trim() || '',
        file: item.file,
        image: item.image, // For edit mode (existing image URL)
      })),
    }

    onSubmit(submitData)
  }

  const resetForm = () => {
    setItems([
      { name: '', typesubtitle: '', image: '', file: null, imageUrl: null },
    ])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

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
                  {editData ? 'Edit Shot Type Item' : 'Add New Shot Type'}
                </h2>
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  {editData
                    ? 'Update the shot type item details'
                    : 'Create shot type options with images and descriptions'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
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
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shot Type Configuration */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-bold text-gray-800">
                  Shot Type Items
                </h3>
                <span className="rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-700">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                📸 Add shot type options with images, names, and descriptions
              </p>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <ItemInput
                    key={index}
                    index={index}
                    item={item}
                    onNameChange={handleItemNameChange}
                    onSubtitleChange={handleItemSubtitleChange}
                    onImageChange={handleItemImageChange}
                    onRemove={removeItem}
                    canRemove={items.length > 1}
                  />
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between rounded-b-3xl border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">
            💡 All fields are required for each shot type item
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-lg bg-indigo px-8 py-3 font-medium text-white transition-colors hover:bg-indigo"
            >
              {editData ? 'Update Shot Type' : 'Create Shot Type'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Item Input Component
const ItemInput = ({
  index,
  item,
  onNameChange,
  onSubtitleChange,
  onImageChange,
  onRemove,
  canRemove,
}) => {
  const { addToast } = useToaster()

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onImageChange(index, acceptedFiles[0])
      }
    },
    [index, onImageChange]
  )

  const onDropRejected = useCallback(
    (rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        addToast({
          type: 'error',
          title: 'Invalid File Format',
          description: 'Only PNG, JPG, and WebP formats are allowed',
          duration: 3000,
        })
      }
    },
    [addToast]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    noClick: false,
    noKeyboard: true,
  })

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-base font-bold text-gray-800">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-sm text-white">
            {index + 1}
          </span>
          Shot Type Item
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-lg bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-600"
            title="Remove item"
          >
            <FaTrash size={12} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">
            Item Name
          </div>
          <input
            type="text"
            value={item.name}
            onChange={(e) => onNameChange(index, e.target.value)}
            placeholder="e.g., On-Model, Still Life, Lifestyle"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">
            Description
          </div>
          <input
            type="text"
            value={item.typesubtitle || ''}
            onChange={(e) => onSubtitleChange(index, e.target.value)}
            placeholder="e.g., Professional model photography with products"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            Image Upload
            <span className="text-xs text-red-500">*Required</span>
          </div>
          <div
            {...getRootProps()}
            className={`relative flex min-h-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                : item.imageUrl
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />

            {item.imageUrl ? (
              <div className="group/img relative h-full min-h-[280px] w-full">
                <img
                  src={item.imageUrl}
                  alt={item.name || 'Shot type image'}
                  className="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover/img:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      open()
                    }}
                    className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
                  >
                    📝 Change Image
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onImageChange(index, null)
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-xl"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <FiUpload className="h-8 w-8 text-blue-600" />
                </div>
                <p className="mb-2 text-lg font-semibold text-gray-900">
                  {isDragActive
                    ? '📸 Drop your image here'
                    : '📸 Upload Shot Type Image'}
                </p>
                <p className="mb-3 text-sm text-gray-600">
                  {isDragActive
                    ? 'Release to upload'
                    : 'Drag & drop your image or click to browse'}
                </p>
                <p className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                  Supports: PNG, JPG, WebP (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Upload helper text */}
          {!item.imageUrl && (
            <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              💡{' '}
              <span>
                Choose a clear, high-quality image that represents this shot
                type
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddShortTypeModal
