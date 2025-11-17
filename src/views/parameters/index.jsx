import React, { useState, useEffect } from 'react'
import { FaLayerGroup, FaPlus, FaEdit } from 'react-icons/fa'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'
import ParameterSection from '../../components/parameters/ParameterSection'
import AddCategoryModal from '../../components/parameters/AddCategoryModal'
import AddHeadingModal from '../../components/parameters/AddHeadingModal'

const Parameters = () => {
  const [allParametersData, setAllParametersData] = useState([])
  const [selectedPage, setSelectedPage] = useState('')
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isHeadingModalOpen, setIsHeadingModalOpen] = useState(false)
  const [shotTypeItems, setShotTypeItems] = useState([])
  const [serviceItems, setServiceItems] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchServices()
  }, [])

  // Fetch shot types when project is selected
  useEffect(() => {
    // Clear selected shot type whenever project changes
    setSelectedPage('')

    if (selectedService) {
      fetchShotTypes()
    } else {
      // Clear shot types and parameters when no project is selected
      setShotTypeItems([])
      setAllParametersData([])
    }
  }, [selectedService])

  // Fetch parameters when shot type is selected
  useEffect(() => {
    if (selectedService && selectedPage) {
      const selectedShotTypeName = getSelectedShotTypeName()
      if (selectedShotTypeName) {
        fetchParameters(selectedService, selectedShotTypeName)
      }
    } else {
      // Clear parameters when no shot type is selected
      setAllParametersData([])
    }
  }, [selectedPage, selectedService])

  // Optional: Auto-select first shot type (commented out to require manual selection)
  // useEffect(() => {
  // if (shotTypeItems.length > 0 && !selectedPage) {
  // setSelectedPage(shotTypeItems[0].name)
  // }
  // }, [shotTypeItems, selectedPage])

  // Get the selected shot type name
  const getSelectedShotTypeName = () => {
    return shotTypeItems.find((name) => name === selectedPage)
  }

  // Helper function to deduplicate elements by _id
  const deduplicateElements = (sections) => {
    return sections.map((section) => ({
      ...section,
      elements: section.elements.reduce((unique, element) => {
        // If element has no _id, keep it (it's a new element)
        if (!element._id) {
          unique.push(element)
          return unique
        }
        // Only add if we haven't seen this _id before
        if (!unique.some((el) => el._id && el._id === element._id)) {
          unique.push(element)
        }
        return unique
      }, []),
    }))
  }

  // Helper function to save parameters to API
  const saveParametersToAPI = async (parameterData, imageFiles = {}) => {
    showSpinner()
    try {
      // Deduplicate elements before sending
      const deduplicatedData = {
        ...parameterData,
        sections: deduplicateElements(parameterData.sections),
      }

      console.log('Sending to API - Raw Data:', parameterData)
      console.log('Sending to API - Deduplicated Data:', deduplicatedData)
      console.log('Sending to API - Image Files:', imageFiles)

      const formData = new FormData()
      formData.append('metadata', JSON.stringify(deduplicatedData))

      // Append image files with their imageKeys
      Object.keys(imageFiles).forEach((imageKey) => {
        if (imageFiles[imageKey]) {
          formData.append(imageKey, imageFiles[imageKey])
        }
      })

      // Build API URL with projectName and shotTypeName if selected
      const apiUrl =
        selectedService && selectedPage
          ? `${config.ADD_PARAMETERS}?projectName=${encodeURIComponent(
              selectedService
            )}&shotTypeName=${encodeURIComponent(selectedPage)}`
          : config.ADD_PARAMETERS

      const response = await apiCall('post', apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Parameters saved successfully',
          duration: 3000,
        })
        // Refresh parameters after successful save
        await fetchParameters(selectedService, selectedPage)
        return true
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to save parameters',
          duration: 3000,
        })
        return false
      }
    } catch (error) {
      console.error('Error saving parameters:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to save parameters',
        duration: 3000,
      })
      return false
    } finally {
      hideSpinner()
    }
  }

  const fetchParameters = async (projectName, shotTypeName) => {
    showSpinner()
    try {
      // Build API URL with projectName and shotTypeName if selected
      const apiUrl =
        projectName && shotTypeName
          ? `${config.GET_PARAMETERS}?projectName=${encodeURIComponent(
              projectName
            )}&shotTypeName=${encodeURIComponent(shotTypeName)}`
          : config.GET_PARAMETERS

      const response = await apiCall('get', apiUrl)

      console.log('GET_PARAMETERS Response:', response)
      console.log('GET_PARAMETERS Data:', response?.data?.data)

      if (response.status === 200 && response.data.data) {
        const parametersData = response.data.data
        console.log(
          'Parameters Data Structure:',
          JSON.stringify(parametersData, null, 2)
        )

        // Log first element to see structure
        if (
          parametersData.length > 0 &&
          parametersData[0].sections?.length > 0
        ) {
          console.log('First Section:', parametersData[0].sections[0])
          if (parametersData[0].sections[0].elements?.length > 0) {
            console.log(
              'First Element:',
              parametersData[0].sections[0].elements[0]
            )
          }
        }

        // Map 'url' to 'image' for display
        const mappedData = parametersData.map((page) => ({
          ...page,
          sections: page.sections?.map((section) => ({
            ...section,
            elements: section.elements?.map((element) => ({
              ...element,
              image: element.url || element.image, // Map url to image
            })),
          })),
        }))

        console.log('Mapped Data with images:', mappedData)

        // Check for duplicate _id in elements
        mappedData.forEach((page, pageIdx) => {
          page.sections?.forEach((section, sectionIdx) => {
            const elementIds = section.elements?.map((el) => el._id) || []
            const duplicates = elementIds.filter(
              (id, index) => elementIds.indexOf(id) !== index
            )
            if (duplicates.length > 0) {
              console.error(
                `❌ DUPLICATE ELEMENT IDs FOUND in Page ${pageIdx}, Section ${sectionIdx}:`,
                duplicates
              )
              console.error('All element IDs:', elementIds)
              console.error('All elements:', section.elements)
            }
          })
        })

        // Deduplicate elements from backend response
        const deduplicatedData = mappedData.map((page) => ({
          ...page,
          sections: deduplicateElements(page.sections || []),
        }))

        console.log('Deduplicated Data:', deduplicatedData)

        setAllParametersData(deduplicatedData)
      } else if (response.status === 404) {
        // No parameters found - show empty state
        setAllParametersData([])
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Failed to fetch parameters',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error fetching parameters:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to fetch parameters',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const fetchServices = async () => {
    try {
      const response = await apiCall('get', config.GET_PROJECT_TYPES)

      if (response.status === 200 && response.data) {
        const responseData = response.data.data || response.data
        const isSuccessful =
          response.data.status_code === 200 || response.data.success === true

        if (isSuccessful && responseData && Array.isArray(responseData)) {
          // Response is an array of project names (strings)
          const projectNames = responseData
          console.log('Project Names extracted:', projectNames)
          setServiceItems(projectNames)
        }
      } else if (response?.status === 404) {
        // No projects found - set empty array
        setServiceItems([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Don't show error toast, just log it
      setServiceItems([])
    }
  }

  const fetchShotTypes = async () => {
    try {
      // Build API URL with projectName if selected
      const apiUrl = selectedService
        ? `${config.GET_SHOT_TYPE_IN_PARAMS}?projectName=${encodeURIComponent(
            selectedService
          )}`
        : config.GET_SHOT_TYPE_IN_PARAMS

      const response = await apiCall('get', apiUrl)

      if (response.status === 200 && response.data) {
        const responseData = response.data.data || response.data
        const isSuccessful =
          response.data.code === 2000 ||
          response.data.status_code === 200 ||
          response.data.success === true

        // New API returns array of shot type names (strings)
        if (isSuccessful && Array.isArray(responseData)) {
          const shotTypeNames = responseData
          console.log('Shot Type Names extracted:', shotTypeNames)
          setShotTypeItems(shotTypeNames)
        }
      } else if (response?.status === 404) {
        // No shot types found - set empty array
        setShotTypeItems([])
      }
    } catch (error) {
      console.error('Error fetching shot types:', error)
      // Don't show error toast, just log it
      setShotTypeItems([])
    }
  }

  // Get current page data based on selected page
  const getCurrentPageData = () => {
    return allParametersData.find((item) => item.type === selectedPage)
  }

  const currentPageData = getCurrentPageData()
  const parameters = currentPageData?.sections || []
  const title = currentPageData?.title || ''

  const handleAddCategory = async (formData) => {
    // Validate project is selected
    if (!selectedService) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a project first',
        duration: 3000,
      })
      return
    }

    // Validate shot type is selected
    if (!selectedPage) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a shot type first',
        duration: 3000,
      })
      return
    }

    const selectedShotTypeName = getSelectedShotTypeName()

    if (!selectedShotTypeName) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a valid shot type',
        duration: 3000,
      })
      console.error('Selected page:', selectedPage)
      console.error('Shot type items:', shotTypeItems)
      return
    }

    // Get existing page data or create new structure
    const existingPageData = getCurrentPageData()
    const newSection = {
      categoryTitle: formData.categoryName,
      type: 'nameCard',
      elements: [],
    }

    // Format existing sections for API (preserve _id fields)
    const existingSections = existingPageData
      ? existingPageData.sections.map((section) => ({
          categoryTitle: section.categoryTitle,
          type: section.type || 'nameCard',
          elements: section.elements.map((el) => ({
            _id: el._id, // Backend uses this to identify existing element
          })),
        }))
      : []

    // Build the metadata structure for API
    const metadata = {
      type: selectedShotTypeName,
      title: existingPageData?.title || '',
      sections: [...existingSections, newSection],
    }

    console.log('Add Category - Metadata being sent:', metadata)
    console.log('Selected Shot Type:', selectedShotTypeName)

    // Call API to save parameters
    const success = await saveParametersToAPI(metadata)

    if (success) {
      addToast({
        type: 'success',
        title: 'Category Added',
        description: `Category "${formData.categoryName}" has been added successfully`,
        duration: 3000,
      })
      setIsAddCategoryModalOpen(false)
    }
  }

  const handleAddHeading = async (formData) => {
    // Validate project is selected
    if (!selectedService) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a project first',
        duration: 3000,
      })
      return
    }

    // Validate shot type is selected
    if (!selectedPage) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a shot type first',
        duration: 3000,
      })
      return
    }

    const selectedShotTypeName = getSelectedShotTypeName()

    if (!selectedShotTypeName) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a valid shot type',
        duration: 3000,
      })
      console.error('Selected page:', selectedPage)
      console.error('Shot type items:', shotTypeItems)
      return
    }

    // Get existing page data or create new structure
    const existingPageData = getCurrentPageData()

    // Format existing sections for API (preserve _id fields)
    const existingSections = existingPageData
      ? existingPageData.sections.map((section) => ({
          categoryTitle: section.categoryTitle,
          type: section.type || 'nameCard',
          elements: section.elements.map((el) => ({
            _id: el._id, // Backend uses this to identify existing element
          })),
        }))
      : []

    // Build the metadata structure for API
    const metadata = {
      type: selectedShotTypeName,
      title: formData.title,
      sections: existingSections,
    }

    // Call API to save parameters
    const success = await saveParametersToAPI(metadata)

    if (success) {
      addToast({
        type: 'success',
        title: 'Heading Saved',
        description: `Heading "${formData.title}" has been saved successfully`,
        duration: 3000,
      })
      setIsHeadingModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Parameters
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your parameter configurations
                {title && (
                  <span className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                    {parameters.length} Sections
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Project Selector */}
              <div className="relative">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="h-10 appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">Select Project</option>
                  {serviceItems.length > 0 ? (
                    serviceItems.map((projectName, index) => (
                      <option key={index} value={projectName}>
                        {projectName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No projects available
                    </option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Shot Type Selector */}
              <div className="relative">
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  disabled={!selectedService}
                  className={`h-10 appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${
                    !selectedService ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <option value="">Select Shot Type</option>
                  {shotTypeItems.length > 0 ? (
                    shotTypeItems.map((shotTypeName, index) => (
                      <option key={index} value={shotTypeName}>
                        {shotTypeName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No shot types available
                    </option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Add Heading Button */}
              {!(currentPageData && currentPageData.title) && (
                <button
                  onClick={() => {
                    if (!selectedService) {
                      addToast({
                        type: 'error',
                        title: 'Error',
                        description: 'Please select project name first',
                        duration: 3000,
                      })
                      return
                    }
                    if (!selectedPage) {
                      addToast({
                        type: 'error',
                        title: 'Error',
                        description: 'Please select shot type first',
                        duration: 3000,
                      })
                      return
                    }
                    setIsHeadingModalOpen(true)
                  }}
                  disabled={!selectedService || !selectedPage}
                  className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaPlus className="text-xs" />
                  Add Heading
                </button>
              )}

              {/* Add Category Button */}
              <button
                onClick={() => {
                  if (!selectedService) {
                    addToast({
                      type: 'error',
                      title: 'Error',
                      description: 'Please select project name first',
                      duration: 3000,
                    })
                    return
                  }
                  if (!selectedPage) {
                    addToast({
                      type: 'error',
                      title: 'Error',
                      description: 'Please select shot type first',
                      duration: 3000,
                    })
                    return
                  }
                  setIsAddCategoryModalOpen(true)
                }}
                disabled={!selectedService || !selectedPage}
                className="flex h-10 items-center gap-2 rounded-lg bg-indigo px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-900"
              >
                <FaPlus className="text-xs" />
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title and Subtitle Section */}
        {currentPageData && currentPageData.title && (
          <div className="group relative mb-8">
            <div className="absolute right-0 top-0">
              <button
                onClick={() => setIsHeadingModalOpen(true)}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-all duration-200 hover:bg-gray-900 hover:text-white"
                title="Edit Heading"
              >
                <FaEdit size={12} />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                {currentPageData.title}
              </h2>
            </div>

            {/* Subtle divider */}
            <div className="mt-6 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
          </div>
        )}

        {/* Content */}
        {parameters.length > 0 ? (
          <div className="space-y-5">
            {parameters.map((section) => (
              <ParameterSection
                key={section._id}
                section={section}
                onElementAdded={async (sectionId, element) => {
                  const selectedShotTypeName = getSelectedShotTypeName()
                  const existingPageData = getCurrentPageData()

                  if (!selectedShotTypeName || !existingPageData) return

                  // Generate imageKey for the new element
                  const newElementImageKey = element.name
                    .toLowerCase()
                    .replace(/\s+/g, '')

                  // Collect image files
                  const imageFiles = {}
                  if (element.imageFile) {
                    imageFiles[newElementImageKey] = element.imageFile
                  }

                  // Find the section and add the element
                  const updatedSections = existingPageData.sections.map(
                    (section) => {
                      if (section._id === sectionId) {
                        return {
                          categoryTitle: section.categoryTitle,
                          type: section.type || 'nameCard',
                          elements: [
                            ...section.elements.map((el) => {
                              // For existing elements, send _id and prompt
                              const existingElement = {
                                _id: el._id, // Backend uses this to identify existing element
                                prompt: el.prompt || '', // Include prompt for existing elements
                              }
                              console.log(
                                'Existing element being sent:',
                                existingElement
                              )
                              return existingElement
                            }),
                            {
                              name: element.name,
                              value: element.name,
                              prompt: element.prompt || '', // Include prompt field
                              imageKey: newElementImageKey, // Only new elements get imageKey
                            },
                          ],
                        }
                      }
                      return {
                        categoryTitle: section.categoryTitle,
                        type: section.type || 'nameCard',
                        elements: section.elements.map((el) => ({
                          _id: el._id, // Backend uses this to identify existing element
                          prompt: el.prompt || '', // Include prompt for existing elements
                        })),
                      }
                    }
                  )

                  // Build the metadata structure for API
                  const metadata = {
                    type: selectedShotTypeName,
                    title: existingPageData.title || '',
                    sections: updatedSections,
                  }

                  await saveParametersToAPI(metadata, imageFiles)
                }}
                onElementUpdated={async (sectionId, updatedElement) => {
                  showSpinner()
                  try {
                    console.log('=== Element Update Debug ===')
                    console.log('Updated Element:', updatedElement)

                    // Prepare FormData for update
                    const formData = new FormData()

                    // Add element name and value
                    formData.append('name', updatedElement.name)
                    formData.append('value', updatedElement.name)
                    formData.append('prompt', updatedElement.prompt || '')

                    // Add image file if new image was uploaded
                    if (updatedElement.imageFile) {
                      formData.append('image', updatedElement.imageFile)
                    }

                    // Build API URL with projectName and shotTypeName if selected
                    const apiUrl =
                      selectedService && selectedPage
                        ? `${config.UPDATE_PARAMETER}/${
                            updatedElement._id
                          }?projectName=${encodeURIComponent(
                            selectedService
                          )}&shotTypeName=${encodeURIComponent(selectedPage)}`
                        : `${config.UPDATE_PARAMETER}/${updatedElement._id}`

                    // Call UPDATE API with element _id
                    const response = await apiCall('put', apiUrl, formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    })

                    if (response.status === 200 || response.status === 201) {
                      addToast({
                        type: 'success',
                        title: 'Success',
                        description: 'Element updated successfully',
                        duration: 3000,
                      })
                      // Refresh parameters after successful update
                      if (selectedService && selectedPage) {
                        await fetchParameters(selectedService, selectedPage)
                      }
                    } else {
                      addToast({
                        type: 'error',
                        title: 'Error',
                        description:
                          response?.data?.msg ||
                          response?.data?.message ||
                          'Failed to update element',
                        duration: 3000,
                      })
                    }
                  } catch (error) {
                    console.error('Error updating element:', error)
                    addToast({
                      type: 'error',
                      title: 'Error',
                      description: error?.message || 'Failed to update element',
                      duration: 3000,
                    })
                  } finally {
                    hideSpinner()
                  }
                }}
                onElementDeleted={async (sectionId, elementId) => {
                  showSpinner()
                  try {
                    // Build API URL with projectName and shotTypeName if selected
                    const apiUrl =
                      selectedService && selectedPage
                        ? `${
                            config.DELETE_PARAMETER
                          }/${elementId}?projectName=${encodeURIComponent(
                            selectedService
                          )}&shotTypeName=${encodeURIComponent(selectedPage)}`
                        : `${config.DELETE_PARAMETER}/${elementId}`

                    // Call DELETE API with element _id
                    const response = await apiCall('delete', apiUrl)

                    if (response.status === 200 || response.status === 204) {
                      addToast({
                        type: 'success',
                        title: 'Success',
                        description: 'Element deleted successfully',
                        duration: 3000,
                      })
                      // Refresh parameters after successful delete
                      if (selectedService && selectedPage) {
                        await fetchParameters(selectedService, selectedPage)
                      }
                    } else {
                      addToast({
                        type: 'error',
                        title: 'Error',
                        description:
                          response?.data?.msg ||
                          response?.data?.message ||
                          'Failed to delete element',
                        duration: 3000,
                      })
                    }
                  } catch (error) {
                    console.error('Error deleting element:', error)
                    addToast({
                      type: 'error',
                      title: 'Error',
                      description: error?.message || 'Failed to delete element',
                      duration: 3000,
                    })
                  } finally {
                    hideSpinner()
                  }
                }}
                onSectionDeleted={async (sectionId) => {
                  showSpinner()
                  try {
                    // Build API URL with projectName and shotTypeName if selected
                    const apiUrl =
                      selectedService && selectedPage
                        ? `${
                            config.DELETE_PARAMETER
                          }/${sectionId}?projectName=${encodeURIComponent(
                            selectedService
                          )}&shotTypeName=${encodeURIComponent(selectedPage)}`
                        : `${config.DELETE_PARAMETER}/${sectionId}`

                    // Call DELETE API with section _id
                    const response = await apiCall('delete', apiUrl)

                    if (response.status === 200 || response.status === 204) {
                      addToast({
                        type: 'success',
                        title: 'Success',
                        description: 'Section deleted successfully',
                        duration: 3000,
                      })
                      // Refresh parameters after successful delete
                      if (selectedService && selectedPage) {
                        await fetchParameters(selectedService, selectedPage)
                      }
                    } else {
                      addToast({
                        type: 'error',
                        title: 'Error',
                        description:
                          response?.data?.msg ||
                          response?.data?.message ||
                          'Failed to delete section',
                        duration: 3000,
                      })
                    }
                  } catch (error) {
                    console.error('Error deleting section:', error)
                    addToast({
                      type: 'error',
                      title: 'Error',
                      description: error?.message || 'Failed to delete section',
                      duration: 3000,
                    })
                  } finally {
                    hideSpinner()
                  }
                }}
                onElementStatusToggled={async (
                  sectionId,
                  elementId,
                  currentStatus
                ) => {
                  showSpinner()
                  try {
                    // Toggle status between Active and Inactive
                    const newStatus =
                      currentStatus === 'Active' ? 'Inactive' : 'Active'

                    // Build API URL with element _id and new status
                    const apiUrl = `${config.UPDATE_PARAMETER_STATUS}?_id=${elementId}&status=${newStatus}`

                    const response = await apiCall('put', apiUrl)

                    if (response.status === 200 || response.status === 201) {
                      addToast({
                        type: 'success',
                        title: 'Success',
                        description: `Element status updated to ${newStatus} successfully`,
                        duration: 3000,
                      })
                      // Refresh parameters after successful update
                      if (selectedService && selectedPage) {
                        await fetchParameters(selectedService, selectedPage)
                      }
                    } else {
                      addToast({
                        type: 'error',
                        title: 'Error',
                        description:
                          response?.data?.msg ||
                          response?.data?.message ||
                          `Failed to update status to ${newStatus}`,
                        duration: 3000,
                      })
                    }
                  } catch (error) {
                    console.error('Error updating element status:', error)
                    addToast({
                      type: 'error',
                      title: 'Error',
                      description:
                        error?.message || 'Failed to update element status',
                      duration: 3000,
                    })
                  } finally {
                    hideSpinner()
                  }
                }}
                onSectionStatusToggled={async (sectionId, currentStatus) => {
                  showSpinner()
                  try {
                    // Toggle status between Active and Inactive
                    const newStatus =
                      currentStatus === 'Active' ? 'Inactive' : 'Active'

                    // Build API URL with section _id and new status
                    const apiUrl = `${config.UPDATE_SECTION_STATUS}?_id=${sectionId}&status=${newStatus}`

                    const response = await apiCall('put', apiUrl)

                    if (response.status === 200 || response.status === 201) {
                      addToast({
                        type: 'success',
                        title: 'Success',
                        description: `Section status updated to ${newStatus} successfully`,
                        duration: 3000,
                      })
                      // Refresh parameters after successful update
                      if (selectedService && selectedPage) {
                        await fetchParameters(selectedService, selectedPage)
                      }
                    } else {
                      addToast({
                        type: 'error',
                        title: 'Error',
                        description:
                          response?.data?.msg ||
                          response?.data?.message ||
                          `Failed to update section status to ${newStatus}`,
                        duration: 3000,
                      })
                    }
                  } catch (error) {
                    console.error('Error updating section status:', error)
                    addToast({
                      type: 'error',
                      title: 'Error',
                      description:
                        error?.message || 'Failed to update section status',
                      duration: 3000,
                    })
                  } finally {
                    hideSpinner()
                  }
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <FaLayerGroup className="text-2xl text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {selectedService && selectedPage
                  ? 'No parameters yet'
                  : !selectedService
                  ? 'Select a project to get started'
                  : 'Select a shot type to view parameters'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedService && selectedPage
                  ? 'Create your first parameter category to organize your configuration options'
                  : !selectedService
                  ? 'Choose a project from the dropdown menu to view and manage parameters'
                  : 'Choose a shot type to view parameter configurations'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      {/* Add Heading Modal */}
      <AddHeadingModal
        isOpen={isHeadingModalOpen}
        onClose={() => setIsHeadingModalOpen(false)}
        onSubmit={handleAddHeading}
        existingData={currentPageData ? { title: currentPageData.title } : null}
      />
    </div>
  )
}

export default Parameters
