import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaTimes } from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi'
import { Plus, Edit } from 'lucide-react'
import { useToaster } from '../../common/Toaster'

const AddElementModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [elementName, setElementName] = useState('')
  const [elementPrompt, setElementPrompt] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const { addToast } = useToaster()

  // Populate form when editing or reset when adding
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setElementName(editData.name || '')
        setElementPrompt(editData.prompt || '')

        setImagePreview(editData.image || null)
        setSelectedImage(null) // Will be set only if user uploads new image
      } else {
        setElementName('')
        setElementPrompt('')
        setSelectedImage(null)
        setImagePreview(null)
      }
    }
  }, [isOpen, editData])

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }, [])

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

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!elementName.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please enter an element name',
        duration: 3000,
      })
      return
    }

    // Submit data
    onSubmit({
      name: elementName.trim(),
      prompt: elementPrompt,
      image: selectedImage, // New file (if uploaded)
      existingImage: imagePreview, // Existing image URL (for edit mode)
    })

    // Reset form
    setElementName('')
    setElementPrompt('')
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleClose = () => {
    setElementName('')
    setElementPrompt('')

    setSelectedImage(null)
    setImagePreview(null)
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
                  {editData ? 'Edit Element' : 'Add New Element'}
                </h2>
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  {editData
                    ? 'Update element details and image'
                    : 'Create a new element with name, prompt, and image'}
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
            {/* Step 1: Element Configuration */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-sm font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-bold text-gray-800">
                  Element Details
                </h3>
              </div>
              <p className="mb-6 text-sm text-gray-600">
                🧩 Configure the element name and prompt that will be used for
                this parameter
              </p>

              <div className="space-y-6">
                {/* Element Name Input */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    Element Name
                    <span className="text-xs text-red-500">*Required</span>
                  </div>
                  <input
                    type="text"
                    value={elementName}
                    onChange={(e) => setElementName(e.target.value)}
                    placeholder="e.g., Full Body Shot, Close-up Portrait, Wide Angle"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base transition-colors focus:border-gray-500 focus:outline-none"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    💡 Choose a clear, descriptive name for this element
                  </p>
                </div>

                {/* Element Prompt Input */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    Element Prompt
                    <span className="text-xs text-red-500">*Required</span>
                  </div>
                  <textarea
                    value={elementPrompt}
                    onChange={(e) => setElementPrompt(e.target.value)}
                    placeholder="e.g., A professional full body shot showcasing the entire outfit or product in frame"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-base transition-colors focus:border-gray-500 focus:outline-none"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    📝 Provide detailed instructions for how this element should
                    be used
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Image Upload */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-sm font-bold text-white">
                  2
                </span>
                <h3 className="text-lg font-bold text-gray-800">
                  Element Image
                </h3>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                📸 Upload an image that represents this element (optional but
                recommended)
              </p>

              <div
                {...getRootProps()}
                className={`relative flex min-h-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                    : imagePreview
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <input {...getInputProps()} />

                {imagePreview ? (
                  <div className="group/img relative h-full min-h-[320px] w-full">
                    <img
                      src={imagePreview}
                      alt={elementName || 'Element image'}
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
                          setSelectedImage(null)
                          setImagePreview(null)
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
                        : '📸 Upload Element Image'}
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
              {!imagePreview && (
                <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  💡{' '}
                  <span>
                    Choose an image that clearly represents this element type
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between rounded-b-3xl border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">
            💡 Element name and prompt are required, image is optional but
            recommended
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
              className="flex items-center gap-2 rounded-lg bg-indigo px-8 py-3 font-medium text-white transition-colors hover:bg-gray-700"
            >
              {editData ? 'Update Element' : 'Save Element'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddElementModal
