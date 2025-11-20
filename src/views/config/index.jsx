import React, { useState, useEffect, useMemo } from 'react'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'
import SearchableDropdown from '../../components/SearchableDropdown'

const Config = () => {
  // State for media data and selections
  const [mediaData, setMediaData] = useState([]) // Store all media types from API
  const [selectedMediaType, setSelectedMediaType] = useState('') // Store selected media type
  const [selectedModel, setSelectedModel] = useState('') // Store selected model for the media type

  // State for organization selection
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [configMode, setConfigMode] = useState('all') // 'all' or 'specific'

  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  // Memoize the selected media item to avoid repeated find operations
  const selectedMediaItem = useMemo(() => {
    return mediaData.find((item) => item.media === selectedMediaType)
  }, [mediaData, selectedMediaType])

  useEffect(() => {
    fetchMediaModels()
    fetchOrganizations()
  }, [])

  useEffect(() => {
    if (configMode === 'specific' && selectedOrganization) {
      fetchOrganizationConfig()
    } else if (configMode === 'all') {
      fetchGlobalConfig()
    }
  }, [selectedOrganization, configMode])

  const fetchOrganizations = async () => {
    try {
      const response = await apiCall('get', config.GET_ORG_NAME)
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setOrganizations(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to fetch organizations',
        duration: 3000,
      })
    }
  }

  const fetchGlobalConfig = async () => {
    showSpinner()
    try {
      // Add your API call here to fetch global config for all organizations
      // const response = await apiCall('get', config.GET_GLOBAL_CONFIG)
      // if (response?.data?.data) {
      //   setImageGeneration(response.data.data.imageModel || '')
      //   setVideoGeneration(response.data.data.videoModel || '')
      //   setVoice(response.data.data.audioModel || '')
      // }
      hideSpinner()
    } catch (error) {
      console.error('Error fetching global config:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to fetch global configuration',
        duration: 3000,
      })
      hideSpinner()
    }
  }

  const fetchOrganizationConfig = async () => {
    showSpinner()
    try {
      // Add your API call here to fetch organization-specific config
      // const response = await apiCall('get', `${config.GET_ORG_CONFIG}/${selectedOrganization}`)
      // if (response?.data?.data) {
      //   setImageGeneration(response.data.data.imageModel || '')
      //   setVideoGeneration(response.data.data.videoModel || '')
      //   setVoice(response.data.data.audioModel || '')
      // }
      hideSpinner()
    } catch (error) {
      console.error('Error fetching organization config:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description:
          error?.message || 'Failed to fetch organization configuration',
        duration: 3000,
      })
      hideSpinner()
    }
  }

  const fetchMediaModels = async () => {
    showSpinner()
    try {
      // Fetch all media models without filtering
      const response = await apiCall('get', config.GET_MEDIA_MODELS)

      // Extract media data from the response structure: response.data.data
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setMediaData(response.data.data)
      }

      hideSpinner()
    } catch (error) {
      console.error('Error fetching media models:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to fetch media models',
        duration: 3000,
      })
      hideSpinner()
    }
  }

  const handleSaveConfiguration = async (e) => {
    e.preventDefault()

    if (configMode === 'specific' && !selectedOrganization) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select an organization',
        duration: 3000,
      })
      return
    }

    if (!selectedMediaType || !selectedModel) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select both media type and model',
        duration: 3000,
      })
      return
    }

    showSpinner()
    try {
      // Build payload based on selected model
      const payload = {
        media: selectedMediaType,
      }

      // Find the selected model details
      const mediaItem = mediaData.find(
        (item) => item.media === selectedMediaType
      )
      if (mediaItem) {
        const modelDetails = mediaItem.models.find(
          (model) => model.value === selectedModel
        )
        if (modelDetails) {
          payload.modelLabel = modelDetails.label // Use value instead of label
        }
      }

      // For specific organization, add orgName
      if (configMode === 'specific') {
        const selectedOrg = organizations.find(
          (org) =>
            org._id === selectedOrganization ||
            org.orgName === selectedOrganization
        )
        if (selectedOrg) {
          payload.orgName = selectedOrg.orgName
        }
      }

      // Call API
      const response = await apiCall('post', config.ENABLE_MODEL_BULK, payload)

      if (response.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description:
            configMode === 'all'
              ? 'Global configuration saved successfully'
              : 'Organization configuration saved successfully',
          duration: 3000,
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to save configuration',
          duration: 3000,
        })
      }

      hideSpinner()
    } catch (error) {
      console.error('Error saving configuration:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to save configuration',
        duration: 3000,
      })
      hideSpinner()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Organization Configuration
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Configure media generation models for specific organizations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        {/* Configuration Form */}
        <div className="w-full">
          <div className="border border-gray-200 bg-white p-6">
            <form onSubmit={handleSaveConfiguration}>
              {/* Configuration Mode Selection */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Configuration Scope
                </h3>
                <div className="flex gap-6">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="configMode"
                      value="all"
                      checked={configMode === 'all'}
                      onChange={(e) => {
                        setConfigMode(e.target.value)
                        setSelectedOrganization('')
                        setSelectedMediaType('')
                        setSelectedModel('')
                      }}
                      className="h-4 w-4 text-indigo focus:ring-indigo"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      All Organizations (Global Default)
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="configMode"
                      value="specific"
                      checked={configMode === 'specific'}
                      onChange={(e) => {
                        setConfigMode(e.target.value)
                        setSelectedMediaType('')
                        setSelectedModel('')
                      }}
                      className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Specific Organization
                    </span>
                  </label>
                </div>
                <p className="mt-3 text-xs text-gray-600">
                  {configMode === 'all'
                    ? 'These settings will apply to all organizations as the default configuration'
                    : 'Configure models for a specific organization (overrides global defaults)'}
                </p>
              </div>

              {/* Organization Selection Section - Only show when specific mode is selected */}
              {configMode === 'specific' && (
                <div className="border-indigo-200 bg-indigo-50 mb-8 rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Select Organization
                  </h3>
                  <div className="space-y-2">
                    <label
                      htmlFor="organization"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Organization
                    </label>
                    <SearchableDropdown
                      options={
                        Array.isArray(organizations)
                          ? organizations.map((org) => ({
                              value: org._id || org.orgName,
                              label: org.orgName || 'Unknown Organization',
                            }))
                          : []
                      }
                      value={selectedOrganization}
                      onChange={(value) => {
                        setSelectedOrganization(value)
                        // Reset form when organization changes
                        setSelectedMediaType('')
                        setSelectedModel('')
                      }}
                      placeholder="Search or select an organization"
                    />
                    {!selectedOrganization && (
                      <p className="mt-2 text-xs text-gray-600">
                        Please select an organization to configure media
                        generation models
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Media Configuration - Show for global mode OR when organization is selected in specific mode */}
              {(configMode === 'all' ||
                (configMode === 'specific' && selectedOrganization)) && (
                <div className="space-y-6">
                  {/* Media Type Selection */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="mediaType"
                        className="block text-base font-semibold text-gray-900"
                      >
                        Media Type
                      </label>
                      <p className="mt-1 text-sm text-gray-600">
                        Select the type of media generation
                      </p>
                    </div>
                    <SearchableDropdown
                      options={
                        Array.isArray(mediaData)
                          ? mediaData.map((item) => ({
                              value: item.media,
                              label: item.media,
                            }))
                          : []
                      }
                      value={selectedMediaType}
                      onChange={(value) => {
                        setSelectedMediaType(value)
                        setSelectedModel('') // Reset model when media type changes
                      }}
                      placeholder="Select media type"
                      className="w-80"
                    />
                  </div>

                  {/* Model Selection - Only show when media type is selected */}
                  {selectedMediaType && selectedMediaItem && (
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <label
                          htmlFor="model"
                          className="block text-base font-semibold text-gray-900"
                        >
                          {selectedMediaItem.mediaName
                            ? selectedMediaItem.mediaName
                                .charAt(0)
                                .toUpperCase() +
                              selectedMediaItem.mediaName.slice(1)
                            : 'Model'}
                        </label>
                        <p className="mt-1 text-sm text-gray-600">
                          Select the AI model for{' '}
                          {selectedMediaItem.mediaName || selectedMediaType}
                        </p>
                      </div>
                      <SearchableDropdown
                        options={
                          Array.isArray(selectedMediaItem.models)
                            ? selectedMediaItem.models.map((model) => ({
                                value: model.value,
                                label: model.label,
                              }))
                            : []
                        }
                        value={selectedModel}
                        onChange={(value) => setSelectedModel(value)}
                        placeholder="Select a model"
                        className="w-80"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button - Show for global mode OR when organization is selected in specific mode */}
              {(configMode === 'all' ||
                (configMode === 'specific' && selectedOrganization)) && (
                <div className="flex justify-end gap-3  pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrganization('')
                      setSelectedMediaType('')
                      setSelectedModel('')
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-indigo hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                  >
                    {configMode === 'all'
                      ? 'Save Global Configuration'
                      : 'Save Configuration'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Config
