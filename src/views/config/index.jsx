import React, { useState, useEffect } from 'react'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'
import SearchableDropdown from '../../components/SearchableDropdown'

const Config = () => {
  const [configData, setConfigData] = useState([])
  const [imageGeneration, setImageGeneration] = useState('')
  const [videoGeneration, setVideoGeneration] = useState('')
  const [voice, setVoice] = useState('')
  const [character, setCharacter] = useState('')

  // State for dropdown options
  const [imageOptions, setImageOptions] = useState([])
  const [videoOptions, setVideoOptions] = useState([])
  const [voiceOptions, setVoiceOptions] = useState([])

  // State for organization selection
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [configMode, setConfigMode] = useState('all') // 'all' or 'specific'

  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

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

  const fetchConfigData = async () => {
    showSpinner()
    try {
      // Add your API call here
      // const response = await apiCall('get', config.GET_CONFIG)

      hideSpinner()
    } catch (error) {
      console.error('Error fetching config data:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to fetch configuration',
        duration: 3000,
      })
      hideSpinner()
    }
  }

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
      // Fetch all media models in parallel
      const [imageResponse, videoResponse, voiceResponse] = await Promise.all([
        apiCall('get', `${config.GET_MEDIA_MODELS}?media=image`),
        apiCall('get', `${config.GET_MEDIA_MODELS}?media=video`),
        apiCall('get', `${config.GET_MEDIA_MODELS}?media=audio`),
      ])

      // Extract models from the response structure: response.data.data.models
      if (
        imageResponse?.data?.data?.models &&
        Array.isArray(imageResponse.data.data.models)
      ) {
        setImageOptions(imageResponse.data.data.models)
      }

      if (
        videoResponse?.data?.data?.models &&
        Array.isArray(videoResponse.data.data.models)
      ) {
        setVideoOptions(videoResponse.data.data.models)
      }

      if (
        voiceResponse?.data?.data?.models &&
        Array.isArray(voiceResponse.data.data.models)
      ) {
        setVoiceOptions(voiceResponse.data.data.models)
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

    showSpinner()
    try {
      // Build payload based on selected models
      const payload = {}

      // Add ImageModel if selected
      if (imageGeneration) {
        const selectedImageOption = imageOptions.find(
          (opt) => opt.value === imageGeneration
        )
        if (selectedImageOption) {
          payload.ImageModel = [{ modelLabel: selectedImageOption.label }]
        }
      }

      // Add VideoModel if selected
      if (videoGeneration) {
        const selectedVideoOption = videoOptions.find(
          (opt) => opt.value === videoGeneration
        )
        if (selectedVideoOption) {
          payload.VideoModel = [{ modelLabel: selectedVideoOption.label }]
        }
      }

      // Add AudioModel if selected
      if (voice) {
        const selectedVoiceOption = voiceOptions.find(
          (opt) => opt.value === voice
        )
        if (selectedVoiceOption) {
          payload.AudioModel = [{ modelLabel: selectedVoiceOption.label }]
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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Configuration Form */}
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
                        setImageGeneration('')
                        setVideoGeneration('')
                        setVoice('')
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
                        setImageGeneration('')
                        setVideoGeneration('')
                        setVoice('')
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
                        setImageGeneration('')
                        setVideoGeneration('')
                        setVoice('')
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
                  {/* Image Generation Section */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="imageGeneration"
                        className="block text-base font-semibold text-gray-900"
                      >
                        Image Generation
                      </label>
                      <p className="mt-1 text-sm text-gray-600">
                        Select the AI model for generating images
                      </p>
                    </div>
                    <SearchableDropdown
                      options={
                        Array.isArray(imageOptions)
                          ? imageOptions.map((option) => ({
                              value: option.value,
                              label: option.label,
                            }))
                          : []
                      }
                      value={imageGeneration}
                      onChange={(value) => setImageGeneration(value)}
                      placeholder="Select an image model"
                      className="w-80"
                    />
                  </div>

                  {/* Video Generation Section */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="videoGeneration"
                        className="block text-base font-semibold text-gray-900"
                      >
                        Video Generation
                      </label>
                      <p className="mt-1 text-sm text-gray-600">
                        Select the AI model for generating videos
                      </p>
                    </div>
                    <SearchableDropdown
                      options={
                        Array.isArray(videoOptions)
                          ? videoOptions.map((option) => ({
                              value: option.value,
                              label: option.label,
                            }))
                          : []
                      }
                      value={videoGeneration}
                      onChange={(value) => setVideoGeneration(value)}
                      placeholder="Select a video model"
                      className="w-80"
                    />
                  </div>

                  {/* Audio Section */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="voice"
                        className="block text-base font-semibold text-gray-900"
                      >
                        Audio Generation
                      </label>
                      <p className="mt-1 text-sm text-gray-600">
                        Select the AI model for generating audio
                      </p>
                    </div>
                    <SearchableDropdown
                      options={
                        Array.isArray(voiceOptions)
                          ? voiceOptions.map((option) => ({
                              value: option.value,
                              label: option.label,
                            }))
                          : []
                      }
                      value={voice}
                      onChange={(value) => setVoice(value)}
                      placeholder="Select an audio model"
                      className="w-80"
                    />
                  </div>

                  {/* Character Section */}
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
                      setImageGeneration('')
                      setVideoGeneration('')
                      setVoice('')
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
