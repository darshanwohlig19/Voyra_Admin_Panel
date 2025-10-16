import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'

const ShortType2 = () => {
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  // Shared form data for title and subtitle
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
  })

  // On-Model state
  const [onModelFiles, setOnModelFiles] = useState([])

  // Creative state
  const [creativeFiles, setCreativeFiles] = useState([])

  // On-Model Dropzone configuration
  const onDropOnModel = useCallback((acceptedFiles) => {
    setOnModelFiles(acceptedFiles)
    console.log('On-Model files:', acceptedFiles)
  }, [])

  // Creative Dropzone configuration
  const onDropCreative = useCallback((acceptedFiles) => {
    setCreativeFiles(acceptedFiles)
    console.log('Creative files:', acceptedFiles)
  }, [])

  const getImagePreview = (file) => {
    return URL.createObjectURL(file)
  }

  const {
    getRootProps: getRootPropsOnModel,
    getInputProps: getInputPropsOnModel,
    isDragActive: isDragActiveOnModel,
    open: openOnModel,
  } = useDropzone({
    onDrop: onDropOnModel,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    noClick: true,
    noKeyboard: true,
  })

  const {
    getRootProps: getRootPropsCreative,
    getInputProps: getInputPropsCreative,
    isDragActive: isDragActiveCreative,
    open: openCreative,
  } = useDropzone({
    onDrop: onDropCreative,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    noClick: true,
    noKeyboard: true,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate that at least one image is uploaded
    if (onModelFiles.length === 0 && creativeFiles.length === 0) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please upload at least one image',
        duration: 3000,
      })
      return
    }

    showSpinner()
    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('subtitle', formData.subtitle)

      if (onModelFiles.length > 0) {
        submitData.append('onModel', onModelFiles[0])
      }

      if (creativeFiles.length > 0) {
        submitData.append('creative', creativeFiles[0])
      }

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
        setFormData({ title: '', subtitle: '' })
        setOnModelFiles([])
        setCreativeFiles([])
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

  return (
    <div className="mt-5 h-full w-full px-4">
      <div className="flex h-full w-full flex-col gap-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Single Form Container */}
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              {/* Title Input */}
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

              {/* Subtitle Input */}
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

              {/* Two Image Upload Sections in Row */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* On-Model Image Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    On-Model Image
                  </label>
                  <div
                    {...getRootPropsOnModel()}
                    className={`relative flex h-[300px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
                      isDragActiveOnModel
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <input {...getInputPropsOnModel()} />

                    {onModelFiles.length > 0 ? (
                      <div className="h-full w-full p-4">
                        <div className="relative flex h-full w-full items-center justify-center">
                          <img
                            src={getImagePreview(onModelFiles[0])}
                            alt={onModelFiles[0].name}
                            className="max-h-full max-w-full rounded-lg object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-6">
                        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-purple-100">
                          <FiUpload className="text-[24px] text-purple-600" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-base font-semibold text-gray-800">
                            Drop file or Browse
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, WebP
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={openOnModel}
                          className="flex h-10 items-center gap-2 rounded-lg bg-[#5B58EB] px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4A47D1] active:bg-[#3936B7]"
                        >
                          <FiUpload />
                          Browse
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Creative & Editorial Image Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Creative & Editorial Image
                  </label>
                  <div
                    {...getRootPropsCreative()}
                    className={`relative flex h-[300px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
                      isDragActiveCreative
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <input {...getInputPropsCreative()} />

                    {creativeFiles.length > 0 ? (
                      <div className="h-full w-full p-4">
                        <div className="relative flex h-full w-full items-center justify-center">
                          <img
                            src={getImagePreview(creativeFiles[0])}
                            alt={creativeFiles[0].name}
                            className="max-h-full max-w-full rounded-lg object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-6">
                        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-purple-100">
                          <FiUpload className="text-[24px] text-purple-600" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-base font-semibold text-gray-800">
                            Drop file or Browse
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, WebP
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={openCreative}
                          className="flex h-10 items-center gap-2 rounded-lg bg-[#5B58EB] px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4A47D1] active:bg-[#3936B7]"
                        >
                          <FiUpload />
                          Browse
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="h-12 rounded-lg bg-[#5B58EB] px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4A47D1] active:bg-[#3936B7]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ShortType2
