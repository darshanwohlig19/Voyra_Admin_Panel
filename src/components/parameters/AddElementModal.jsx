import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdClose } from 'react-icons/md'
import { FiUpload } from 'react-icons/fi'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-[900px] max-w-[95vw] flex-col rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {editData ? 'Edit Element' : 'Add New Element'}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {editData
                  ? 'Update element details'
                  : 'Add a new element with image'}
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
        <div className="flex-1 overflow-y-auto bg-white p-8">
          <form onSubmit={handleSubmit}>
            {/* Element Name Input */}
            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-gray-700">
                Element Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={elementName}
                onChange={(e) => setElementName(e.target.value)}
                placeholder="e.g., Full Body Shot"
                className="block w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-gray-700">
                Prompt <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={elementPrompt}
                onChange={(e) => setElementPrompt(e.target.value)}
                placeholder="e.g., Full Body Shot"
                className="block w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-base font-semibold text-gray-700">
                Image Upload
              </label>
              <div
                {...getRootProps()}
                className={`relative flex h-96 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                    : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <input {...getInputProps()} />

                {imagePreview ? (
                  <div className="group/img relative h-full w-full">
                    <img
                      src={imagePreview}
                      alt={elementName}
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
                          setSelectedImage(null)
                          setImagePreview(null)
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
                      {isDragActive
                        ? 'Drop image here'
                        : 'Drag & drop your image'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      or click to browse
                    </p>
                    <p className="mt-2 text-xs text-gray-400">PNG, JPG, WebP</p>
                  </div>
                )}
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
              {editData ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddElementModal
