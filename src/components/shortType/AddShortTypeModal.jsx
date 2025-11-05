import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-[900px] max-w-[95vw] flex-col rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {editData ? 'Edit Shot Type' : 'Add New Shot Type'}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {editData
                  ? 'Update shot type configuration'
                  : 'Configure a new shot type option'}
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
        <div className="flex-1 overflow-y-auto bg-white">
          <form onSubmit={handleSubmit} className="p-5">
            <div className="space-y-5">
              {/* Shot Type Items Section */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    Shot Type Options
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Add individual shot type items with name, description and
                    image.
                  </p>
                </div>

                {/* Items List */}
                <div className="space-y-3">
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
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-shrink-0 items-center justify-end border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
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
              onClick={handleSubmit}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
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
    <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3">
      {canRemove && (
        <div className="mb-2 flex items-start justify-end">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
            title="Remove"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Name Input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => onNameChange(index, e.target.value)}
            placeholder="e.g., On-Model"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={item.typesubtitle || ''}
            onChange={(e) => onSubtitleChange(index, e.target.value)}
            placeholder="e.g., Professional Still-life Photography"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Image Upload <span className="text-red-500">*</span>
          </label>
          <div
            {...getRootProps()}
            className={`relative flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />

            {item.imageUrl ? (
              <div className="group/img relative h-full w-full">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/70 to-black/30 opacity-0 transition-opacity group-hover/img:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      open()
                    }}
                    className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-lg transition-all hover:bg-gray-100"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onImageChange(index, null)
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <FiUpload className="h-6 w-6 text-blue-600" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  {isDragActive ? 'Drop image here' : 'Drag & drop your image'}
                </p>
                <p className="mt-1 text-xs text-gray-500">or click to browse</p>
                <p className="mt-2 text-xs text-gray-400">PNG, JPG, WebP</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddShortTypeModal
