import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiX } from 'react-icons/fi'
import { FaPlus, FaTrash, FaCheckCircle, FaImage } from 'react-icons/fa'
import { MdPhotoCamera, MdClose } from 'react-icons/md'

const AddShortTypeModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [items, setItems] = useState([
    { name: '', typesubtitle: '', image: '', file: null, imageUrl: null },
  ])

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '')
      setSubtitle(editData.subtitle || '')
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
      setTitle('')
      setSubtitle('')
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

  const addNewItem = () => {
    setItems([
      ...items,
      { name: '', typesubtitle: '', image: '', file: null, imageUrl: null },
    ])
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
    if (!title.trim()) {
      alert('Please provide a title')
      return
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].name.trim()) {
        alert(`Please provide a name for item ${i + 1}`)
        return
      }
    }

    // Prepare data for submission
    const submitData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
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
    setTitle('')
    setSubtitle('')
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
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editData ? 'Edit Shot Type' : 'Add New Shot Type'}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
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
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto bg-white">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title and Subtitle Section */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Choose Your Primary Shot Type"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g., Select the type of photography style that best matches your vision"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Shot Type Items Section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Shot Type Options
                    </h3>
                  </div>
                  {!editData && (
                    <button
                      type="button"
                      onClick={addNewItem}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg"
                    >
                      <FaPlus />
                      Add Option
                    </button>
                  )}
                </div>

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
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
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
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onImageChange(index, acceptedFiles[0])
      }
    },
    [index, onImageChange]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
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
    <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
            {index + 1}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            Option {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
            title="Remove"
          >
            <FaTrash className="text-xs" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
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
            Description
          </label>
          <input
            type="text"
            value={item.typesubtitle || ''}
            onChange={(e) => onSubtitleChange(index, e.target.value)}
            placeholder="e.g., Professional Still-life Photography"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Image Upload
          </label>
          <div
            {...getRootProps()}
            className={`relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all ${
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
                <p className="mt-2 text-xs text-gray-400">
                  PNG, JPG, WebP (Max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddShortTypeModal
