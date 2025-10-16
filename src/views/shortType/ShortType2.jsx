import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiChevronDown } from 'react-icons/fi'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'

const ShortType = () => {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedType, setSelectedType] = useState('select')
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
  })

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(acceptedFiles)
    console.log('Uploaded files:', acceptedFiles)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate that a page type is selected
    if (selectedType === 'select') {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please select a page type',
        duration: 3000,
      })
      return
    }

    // Validate that an image is uploaded
    if (uploadedFiles.length === 0) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please upload an image',
        duration: 3000,
      })
      return
    }

    showSpinner()
    try {
      // Create FormData object
      const submitData = new FormData()

      // Add the image file with the key "imageKey"
      submitData.append('imageKey', uploadedFiles[0])

      // Create metadata object and add it as a JSON string
      const metadata = {
        title: formData.title,
        subtitle: formData.subtitle,
        items: [], // Add items array as required by API
      }
      submitData.append('metadata', JSON.stringify(metadata))

      // Add type separately if needed
      submitData.append('type', selectedType)

      // Make API call
      const response = await apiCall(
        'post',
        config.ADD_SHORT_TYPE,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Short type added successfully!',
          duration: 3000,
        })
        // Reset form
        setFormData({
          title: '',
          subtitle: '',
        })
        setUploadedFiles([])
        setSelectedType('select')
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to add short type. Please try again.',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'An error occurred. Please try again.',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  // Get image preview URL
  const getImagePreview = (file) => {
    return URL.createObjectURL(file)
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    noClick: true,
    noKeyboard: true,
  })

  return (
    <div className="mt-5 h-full w-full px-4">
      <div className="flex h-full w-full flex-col gap-6">
        {/* Header Section */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Short Type</h1>
            {selectedType !== 'select' && (
              <span className="text-2xl font-bold text-gray-800">
                :{' '}
                {selectedType === 'on-model'
                  ? 'On-Model'
                  : 'Creative & Editorial'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-[180px]">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-[10px] border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-0"
              >
                <option value="select">Select Page</option>
                <option value="on-model">On-Model</option>
                <option value="creative-editorial">Creative & Editorial</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <FiChevronDown className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[1200px] rounded-[20px] border border-gray-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dropzone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Upload Image
              </label>
              <div
                {...getRootProps()}
                className={`relative flex h-[400px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
                  isDragActive
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />

                {uploadedFiles.length > 0 ? (
                  // Show uploaded image
                  <div className="h-full w-full p-4">
                    <div className="relative flex h-full w-full items-center justify-center">
                      <img
                        src={getImagePreview(uploadedFiles[0])}
                        alt={uploadedFiles[0].name}
                        className="max-h-full max-w-full rounded-lg object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  // Show upload prompt
                  <div className="flex flex-col items-center gap-4 p-20">
                    {/* Upload Icon */}
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-purple-100">
                      <FiUpload className="text-[28px] text-purple-600" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-lg font-semibold text-gray-800">
                        Drop file or Browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Format: JPG, JPEG, PNG, WebP
                      </p>
                    </div>

                    {/* Browse Button */}
                    <button
                      type="button"
                      onClick={open}
                      className="mt-2 flex h-12 items-center gap-2 rounded-lg bg-[#5B58EB] px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4A47D1] active:bg-[#3936B7]"
                    >
                      <FiUpload />
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title"
                  className="w-full rounded-[10px] border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-0"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Enter subtitle"
                  className="w-full rounded-[10px] border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="h-12 rounded-lg bg-[#5B58EB] px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4A47D1] active:bg-[#3936B7]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ShortType
