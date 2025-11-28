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
  const [selectedSubModelType, setSelectedSubModelType] = useState('') // Store selected sub-model type (for script-to-video)
  const [selectedElementName, setSelectedElementName] = useState('') // Store selected element name (like "Character")
  const [selectedOperationType, setSelectedOperationType] = useState('') // Store selected operation type (like "create")
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

  // Check if selected media should show sub-model type dropdown
  // Show dropdown for all media types except those with only "default" subModelsName
  const shouldShowSubModelDropdown = useMemo(() => {
    if (!selectedMediaItem || !selectedMediaItem.subModels) {
      return false
    }
    // Check if all subModels have "default" as subModelsName
    const allDefault = selectedMediaItem.subModels.every(
      (sm) => sm.subModelsName === 'default'
    )
    // Show dropdown if NOT all are "default"
    return !allDefault
  }, [selectedMediaItem])

  // Check if we should show element dropdown
  const shouldShowElementDropdown = useMemo(() => {
    if (!selectedMediaItem || !selectedSubModelType) return false

    const subModelGroup = selectedMediaItem.subModels?.find(
      (sm) => sm.subModelsName === selectedSubModelType
    )

    // Show dropdown if there are elements with non-default names
    if (subModelGroup?.elements && subModelGroup.elements.length > 0) {
      const hasNonDefaultElement = subModelGroup.elements.some(
        (el) => el.elements !== 'default'
      )
      return hasNonDefaultElement
    }

    return false
  }, [selectedMediaItem, selectedSubModelType])

  // Get available element names for the selected sub-model type
  const availableElementNames = useMemo(() => {
    if (!selectedMediaItem || !selectedSubModelType) return []

    const subModelGroup = selectedMediaItem.subModels?.find(
      (sm) => sm.subModelsName === selectedSubModelType
    )

    if (!subModelGroup?.elements) return []

    // Get unique element names (in case there are duplicates)
    const elementNames = subModelGroup.elements
      .filter((el) => el.elements !== 'default')
      .map((el) => ({
        value: el.elements,
        label: el.elements,
      }))

    // Remove duplicates
    const uniqueNames = Array.from(
      new Map(elementNames.map((item) => [item.value, item])).values()
    )

    return uniqueNames
  }, [selectedMediaItem, selectedSubModelType])

  // Check if we should show operation type dropdown
  const shouldShowOperationTypeDropdown = useMemo(() => {
    return shouldShowElementDropdown && selectedElementName !== ''
  }, [shouldShowElementDropdown, selectedElementName])

  // Get available operation types for the selected element
  const availableOperationTypes = useMemo(() => {
    if (!selectedMediaItem || !selectedSubModelType || !selectedElementName)
      return []

    const subModelGroup = selectedMediaItem.subModels?.find(
      (sm) => sm.subModelsName === selectedSubModelType
    )

    if (!subModelGroup?.elements) return []

    // Get operation types for the selected element
    const operationTypes = subModelGroup.elements
      .filter((el) => el.elements === selectedElementName)
      .map((el) => ({
        value: el.operationType,
        label: el.operationType,
      }))

    // Remove duplicates
    const uniqueTypes = Array.from(
      new Map(operationTypes.map((item) => [item.value, item])).values()
    )

    return uniqueTypes
  }, [selectedMediaItem, selectedSubModelType, selectedElementName])

  // Get the appropriate models array based on structure
  const availableModels = useMemo(() => {
    if (!selectedMediaItem || !selectedMediaItem.subModels) return []

    if (shouldShowSubModelDropdown) {
      // For media types that require sub-model type selection (like script-to-video)
      if (!selectedSubModelType) return []

      const subModelGroup = selectedMediaItem.subModels.find(
        (sm) => sm.subModelsName === selectedSubModelType
      )

      if (!subModelGroup?.elements) return []

      // Check if we need element selection
      if (shouldShowElementDropdown) {
        // Need to select element name first
        if (!selectedElementName || selectedElementName === '') return []

        // Check if we need operation type selection
        if (shouldShowOperationTypeDropdown) {
          // Need to select operation type first
          if (!selectedOperationType || selectedOperationType === '') return []

          // Find the selected element by name AND operation type and get its models
          const elementGroup = subModelGroup.elements.find(
            (el) =>
              el.elements === selectedElementName &&
              el.operationType === selectedOperationType
          )
          return elementGroup?.models || []
        } else {
          // No operation type selection needed, find by name only
          const elementGroup = subModelGroup.elements.find(
            (el) => el.elements === selectedElementName
          )
          return elementGroup?.models || []
        }
      } else {
        // No element selection needed, use first element
        return subModelGroup.elements[0]?.models || []
      }
    } else {
      // For media types with "default" sub-model type (like image-to-image)
      // Get models from first subModel's first element
      if (selectedMediaItem.subModels[0]?.elements?.[0]?.models) {
        return selectedMediaItem.subModels[0].elements[0].models
      }
      return []
    }
  }, [
    selectedMediaItem,
    shouldShowSubModelDropdown,
    selectedSubModelType,
    shouldShowElementDropdown,
    selectedElementName,
    shouldShowOperationTypeDropdown,
    selectedOperationType,
  ])

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

  // Fetch config based on current filter selections
  const fetchConfigBasedOnFilters = async (filters) => {
    try {
      // Build query params from filter values
      const params = {}

      if (filters.orgId) params.orgId = filters.orgId
      if (filters.mediaType) params.mediaType = filters.mediaType
      if (filters.subModelType) params.subModelsName = filters.subModelType
      if (filters.element) params.elements = filters.element
      if (filters.operationType) params.operationType = filters.operationType
      if (filters.model) params.model = filters.model

      // Add configMode to params
      params.configMode = configMode

      console.log('Calling API with filters:', params)

      // TODO: Replace with your actual API endpoint
      // const response = await apiCall('get', config.GET_CONFIG_BY_FILTERS, { params })
      // if (response?.data?.data) {
      //   // Handle the response data here
      //   console.log('Config data:', response.data.data)
      // }
    } catch (error) {
      console.error('Error fetching config based on filters:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to fetch configuration',
        duration: 3000,
      })
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

    // Validate required fields
    if (!selectedMediaType || !selectedModel) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select both media type and model',
        duration: 3000,
      })
      return
    }

    // For media types that require sub-model type selection, check if it's selected
    const mediaItem = mediaData.find((item) => item.media === selectedMediaType)
    const requiresSubModel =
      mediaItem?.subModels &&
      !mediaItem.subModels.every((sm) => sm.subModelsName === 'default')

    if (requiresSubModel && !selectedSubModelType) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select sub-model type',
        duration: 3000,
      })
      return
    }

    // Check if element selection is required
    if (requiresSubModel && selectedSubModelType) {
      const subModelGroup = mediaItem.subModels?.find(
        (sm) => sm.subModelsName === selectedSubModelType
      )
      const requiresElement =
        subModelGroup?.elements &&
        subModelGroup.elements.length > 0 &&
        subModelGroup.elements.some((el) => el.elements !== 'default')

      if (requiresElement && !selectedElementName) {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Please select element',
          duration: 3000,
        })
        return
      }

      // Check if operation type selection is required
      if (requiresElement && selectedElementName) {
        const hasMultipleOperationTypes =
          subModelGroup.elements.filter(
            (el) => el.elements === selectedElementName
          ).length > 1

        if (hasMultipleOperationTypes && !selectedOperationType) {
          addToast({
            type: 'error',
            title: 'Error',
            description: 'Please select operation type',
            duration: 3000,
          })
          return
        }
      }
    }

    showSpinner()
    try {
      // Build payload based on selected model
      const payload = {
        media: selectedMediaType,
      }

      // Find the selected model details
      if (mediaItem && mediaItem.subModels) {
        let modelDetails

        if (requiresSubModel) {
          // For media types that require sub-model type selection (like script-to-video)
          const subModelGroup = mediaItem.subModels.find(
            (sm) => sm.subModelsName === selectedSubModelType
          )

          // Add sub-model type to payload
          if (selectedSubModelType) {
            payload.subModelsName = selectedSubModelType
          }

          // Navigate through elements to get models
          if (selectedElementName) {
            // Element was selected
            let elementGroup
            if (selectedOperationType) {
              // Find element by both name and operation type
              elementGroup = subModelGroup?.elements?.find(
                (el) =>
                  el.elements === selectedElementName &&
                  el.operationType === selectedOperationType
              )
            } else {
              // Find element by name only
              elementGroup = subModelGroup?.elements?.find(
                (el) => el.elements === selectedElementName
              )
            }
            const models = elementGroup?.models || []
            modelDetails = models.find((model) => model.value === selectedModel)

            // Add element to payload
            payload.elements = selectedElementName

            // Add operation type to payload if selected
            if (selectedOperationType) {
              payload.operationType = selectedOperationType
            }
          } else {
            // No element selection, use first element
            const models = subModelGroup?.elements?.[0]?.models || []
            modelDetails = models.find((model) => model.value === selectedModel)
          }
        } else {
          // For media types with "default" sub-model type (like image-to-image)
          const models = mediaItem.subModels[0]?.elements?.[0]?.models || []
          modelDetails = models.find((model) => model.value === selectedModel)
        }

        if (modelDetails) {
          payload.modelLabel = modelDetails.label // Use label for the payload
        }
      }

      // For specific organization, add orgId
      if (configMode === 'specific') {
        const selectedOrg = organizations.find(
          (org) =>
            org._id === selectedOrganization ||
            org.orgName === selectedOrganization
        )
        if (selectedOrg) {
          payload.orgId = selectedOrg._id
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
                        setSelectedSubModelType('')
                        setSelectedElementName('')
                        setSelectedOperationType('')
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
                        setSelectedSubModelType('')
                        setSelectedElementName('')
                        setSelectedOperationType('')
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
                        setSelectedSubModelType('')
                        setSelectedElementName('')
                        setSelectedOperationType('')
                        setSelectedModel('')
                        // Call API with organization filter
                        fetchConfigBasedOnFilters({
                          orgId: value,
                        })
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
                        setSelectedSubModelType('') // Reset sub-model type when media type changes
                        setSelectedElementName('') // Reset element name when media type changes
                        setSelectedOperationType('') // Reset operation type when media type changes
                        setSelectedModel('') // Reset model when media type changes
                        // Call API with current filters
                        fetchConfigBasedOnFilters({
                          orgId: selectedOrganization,
                          mediaType: value,
                        })
                      }}
                      placeholder="Select media type"
                      className="w-80"
                    />
                  </div>

                  {/* Sub-Model Type Selection - Show for script-to-video and other non-default sub-model types */}
                  {selectedMediaType &&
                    selectedMediaItem &&
                    shouldShowSubModelDropdown && (
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="subModelType"
                            className="block text-base font-semibold text-gray-900"
                          >
                            Sub-Model Type
                          </label>
                          <p className="mt-1 text-sm text-gray-600">
                            Select the sub-model type for{' '}
                            {selectedMediaItem.mediaName || selectedMediaType}
                          </p>
                        </div>
                        <SearchableDropdown
                          options={
                            Array.isArray(selectedMediaItem.subModels)
                              ? selectedMediaItem.subModels.map((sm) => ({
                                  value: sm.subModelsName,
                                  label: sm.subModelsName,
                                }))
                              : []
                          }
                          value={selectedSubModelType}
                          onChange={(value) => {
                            setSelectedSubModelType(value)
                            setSelectedElementName('') // Reset element name when sub-model type changes
                            setSelectedOperationType('') // Reset operation type when sub-model type changes
                            setSelectedModel('') // Reset model when sub-model type changes
                            // Call API with current filters
                            fetchConfigBasedOnFilters({
                              orgId: selectedOrganization,
                              mediaType: selectedMediaType,
                              subModelType: value,
                            })
                          }}
                          placeholder="Select sub-model type"
                          className="w-80"
                        />
                      </div>
                    )}

                  {/* Element Selection - Show when sub-model type is selected and has non-default elements */}
                  {selectedMediaType &&
                    selectedMediaItem &&
                    selectedSubModelType &&
                    shouldShowElementDropdown && (
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="element"
                            className="block text-base font-semibold text-gray-900"
                          >
                            Select Object
                          </label>
                          <p className="mt-1 text-sm text-gray-600">
                            Select the element for {selectedSubModelType}
                          </p>
                        </div>
                        <SearchableDropdown
                          options={availableElementNames}
                          value={selectedElementName}
                          onChange={(value) => {
                            setSelectedElementName(value)
                            setSelectedOperationType('') // Reset operation type when element changes
                            setSelectedModel('') // Reset model when element changes
                            // Call API with current filters
                            fetchConfigBasedOnFilters({
                              orgId: selectedOrganization,
                              mediaType: selectedMediaType,
                              subModelType: selectedSubModelType,
                              element: value,
                            })
                          }}
                          placeholder="Select element"
                          className="w-80"
                        />
                      </div>
                    )}

                  {/* Operation Type Selection - Show when element is selected and operation types are available */}
                  {selectedMediaType &&
                    selectedMediaItem &&
                    selectedSubModelType &&
                    shouldShowOperationTypeDropdown &&
                    availableOperationTypes.length > 0 && (
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="operationType"
                            className="block text-base font-semibold text-gray-900"
                          >
                            Operation Type
                          </label>
                          <p className="mt-1 text-sm text-gray-600">
                            Select the operation type for {selectedElementName}
                          </p>
                        </div>
                        <SearchableDropdown
                          options={availableOperationTypes}
                          value={selectedOperationType}
                          onChange={(value) => {
                            setSelectedOperationType(value)
                            setSelectedModel('') // Reset model when operation type changes
                            // Call API with current filters
                            fetchConfigBasedOnFilters({
                              orgId: selectedOrganization,
                              mediaType: selectedMediaType,
                              subModelType: selectedSubModelType,
                              element: selectedElementName,
                              operationType: value,
                            })
                          }}
                          placeholder="Select operation type"
                          className="w-80"
                        />
                      </div>
                    )}

                  {/* Model Selection - Show when media type is selected and all required selections are made */}
                  {selectedMediaType &&
                    selectedMediaItem &&
                    (!shouldShowSubModelDropdown || selectedSubModelType) &&
                    (!shouldShowElementDropdown || selectedElementName) &&
                    (!shouldShowOperationTypeDropdown ||
                      selectedOperationType) && (
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="model"
                            className="block text-base font-semibold text-gray-900"
                          >
                            {selectedOperationType
                              ? selectedOperationType.charAt(0).toUpperCase() +
                                selectedOperationType.slice(1)
                              : selectedMediaItem.mediaName
                              ? selectedMediaItem.mediaName
                                  .charAt(0)
                                  .toUpperCase() +
                                selectedMediaItem.mediaName.slice(1)
                              : 'Model'}
                          </label>
                          <p className="mt-1 text-sm text-gray-600">
                            {selectedOperationType && selectedElementName
                              ? `Select the model for ${selectedOperationType} operation on ${selectedElementName}`
                              : `Select the AI model for ${
                                  selectedMediaItem.mediaName ||
                                  selectedMediaType
                                }`}
                          </p>
                        </div>
                        <SearchableDropdown
                          options={
                            Array.isArray(availableModels)
                              ? availableModels.map((model) => ({
                                  value: model.value,
                                  label: model.label,
                                }))
                              : []
                          }
                          value={selectedModel}
                          onChange={(value) => {
                            setSelectedModel(value)
                            // Call API with all current filters
                            fetchConfigBasedOnFilters({
                              orgId: selectedOrganization,
                              mediaType: selectedMediaType,
                              subModelType: selectedSubModelType,
                              element: selectedElementName,
                              operationType: selectedOperationType,
                              model: value,
                            })
                          }}
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
                      setSelectedSubModelType('')
                      setSelectedElementName('')
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
