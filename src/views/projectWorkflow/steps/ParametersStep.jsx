import React, { useState, useEffect } from 'react'
import { FaLayerGroup, FaPlus, FaEdit } from 'react-icons/fa'
import ApiCaller from '../../../common/services/apiServices'
import config from '../../../common/config/apiConfig'
import { useSpinner } from '../../../common/SpinnerLoader'
import { useToaster } from '../../../common/Toaster'
import ParameterSection from '../../../components/parameters/ParameterSection'
import AddCategoryModal from '../../../components/parameters/AddCategoryModal'
import AddHeadingModal from '../../../components/parameters/AddHeadingModal'

const ParametersStep = ({
  selectedProject,
  selectedShotType,
  onProjectChange,
  onShotTypeChange,
}) => {
  const [allParametersData, setAllParametersData] = useState([])
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isHeadingModalOpen, setIsHeadingModalOpen] = useState(false)
  const [shotTypeItems, setShotTypeItems] = useState([])
  const [serviceItems, setServiceItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  // Fetch services (projects) on mount
  useEffect(() => {
    fetchServices()
  }, [])

  // Fetch shot types when project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchShotTypes()
    } else {
      setShotTypeItems([])
      setAllParametersData([])
    }
  }, [selectedProject])

  // Fetch parameters when shot type is selected
  useEffect(() => {
    if (selectedProject && selectedShotType) {
      fetchParameters(selectedProject, selectedShotType)
    } else {
      setAllParametersData([])
    }
  }, [selectedShotType, selectedProject])

  const deduplicateElements = (sections) => {
    return sections.map((section) => ({
      ...section,
      elements: section.elements.reduce((unique, element) => {
        if (!element._id) {
          unique.push(element)
          return unique
        }
        if (!unique.some((el) => el._id && el._id === element._id)) {
          unique.push(element)
        }
        return unique
      }, []),
    }))
  }

  const saveParametersToAPI = async (parameterData, imageFiles = {}) => {
    showSpinner()
    try {
      const deduplicatedData = {
        ...parameterData,
        sections: deduplicateElements(parameterData.sections),
      }

      const formData = new FormData()
      formData.append('metadata', JSON.stringify(deduplicatedData))

      Object.keys(imageFiles).forEach((imageKey) => {
        if (imageFiles[imageKey]) {
          formData.append(imageKey, imageFiles[imageKey])
        }
      })

      const apiUrl =
        selectedProject && selectedShotType
          ? `${config.ADD_PARAMETERS}?projectName=${encodeURIComponent(
              selectedProject
            )}&shotTypeName=${encodeURIComponent(selectedShotType)}`
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
        await fetchParameters(selectedProject, selectedShotType)
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
      const apiUrl =
        projectName && shotTypeName
          ? `${config.GET_PARAMETERS}?projectName=${encodeURIComponent(
              projectName
            )}&shotTypeName=${encodeURIComponent(shotTypeName)}`
          : config.GET_PARAMETERS

      const response = await apiCall('get', apiUrl)

      if (response.status === 200 && response.data.data) {
        const parametersData = response.data.data

        const mappedData = parametersData.map((page) => ({
          ...page,
          sections: page.sections?.map((section) => ({
            ...section,
            elements: section.elements?.map((element) => ({
              ...element,
              image: element.url || element.image,
            })),
          })),
        }))

        const deduplicatedData = mappedData.map((page) => ({
          ...page,
          sections: deduplicateElements(page.sections || []),
        }))

        setAllParametersData(deduplicatedData)
      } else if (response.status === 404) {
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
          const projectNames = responseData
          setServiceItems(projectNames)
        }
      } else if (response?.status === 404) {
        setServiceItems([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setServiceItems([])
    }
  }

  const fetchShotTypes = async () => {
    try {
      const apiUrl = selectedProject
        ? `${config.GET_SHOT_TYPE_IN_PARAMS}?projectName=${encodeURIComponent(
            selectedProject
          )}`
        : config.GET_SHOT_TYPE_IN_PARAMS

      const response = await apiCall('get', apiUrl)

      if (response.status === 200 && response.data) {
        const responseData = response.data.data || response.data
        const isSuccessful =
          response.data.code === 2000 ||
          response.data.status_code === 200 ||
          response.data.success === true

        if (isSuccessful && Array.isArray(responseData)) {
          const shotTypeNames = responseData
          setShotTypeItems(shotTypeNames)
        }
      } else if (response?.status === 404) {
        setShotTypeItems([])
      }
    } catch (error) {
      console.error('Error fetching shot types:', error)
      setShotTypeItems([])
    }
  }

  const getCurrentPageData = () => {
    return allParametersData.find((item) => item.type === selectedShotType)
  }

  const currentPageData = getCurrentPageData()
  const allSections = currentPageData?.sections || []

  // Extract unique categories from sections
  const uniqueCategories = [
    ...new Set(allSections.map((section) => section.categoryTitle)),
  ].filter(Boolean)

  // Filter sections based on selected category
  const parameters = selectedCategory
    ? allSections.filter(
        (section) => section.categoryTitle === selectedCategory
      )
    : allSections

  const title = currentPageData?.title || ''

  const handleAddCategory = async (formData) => {
    if (!selectedProject) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a project first',
        duration: 3000,
      })
      return
    }

    if (!selectedShotType) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a shot type first',
        duration: 3000,
      })
      return
    }

    const existingPageData = getCurrentPageData()
    const newSection = {
      categoryTitle: formData.categoryName,
      type: 'nameCard',
      elements: [],
    }

    const existingSections = existingPageData
      ? existingPageData.sections.map((section) => ({
          categoryTitle: section.categoryTitle,
          type: section.type || 'nameCard',
          elements: section.elements.map((el) => ({
            _id: el._id,
          })),
        }))
      : []

    const metadata = {
      type: selectedShotType,
      title: existingPageData?.title || '',
      sections: [...existingSections, newSection],
    }

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
    if (!selectedProject) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a project first',
        duration: 3000,
      })
      return
    }

    if (!selectedShotType) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a shot type first',
        duration: 3000,
      })
      return
    }

    const existingPageData = getCurrentPageData()

    const existingSections = existingPageData
      ? existingPageData.sections.map((section) => ({
          categoryTitle: section.categoryTitle,
          type: section.type || 'nameCard',
          elements: section.elements.map((el) => ({
            _id: el._id,
          })),
        }))
      : []

    const metadata = {
      type: selectedShotType,
      title: formData.title,
      sections: existingSections,
    }

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
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Parameters
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure parameters for your selected project and shot type
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Selector */}
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => onProjectChange(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10"
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
              value={selectedShotType}
              onChange={(e) => {
                onShotTypeChange(e.target.value)
                setSelectedCategory('') // Reset category when shot type changes
              }}
              disabled={!selectedProject}
              className={`h-10 appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 ${
                !selectedProject ? 'cursor-not-allowed opacity-50' : ''
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

          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={!selectedShotType || uniqueCategories.length === 0}
              className={`h-10 appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/10 ${
                !selectedShotType || uniqueCategories.length === 0
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              <option value="">All Categories</option>
              {uniqueCategories.length > 0 ? (
                uniqueCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
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
          {selectedProject &&
            selectedShotType &&
            !(currentPageData && currentPageData.title) && (
              <button
                onClick={() => setIsHeadingModalOpen(true)}
                className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
              >
                <FaPlus className="text-xs" />
                Add Heading
              </button>
            )}

          {/* Add Category Button */}
          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            disabled={!selectedProject || !selectedShotType}
            className="flex h-10 items-center gap-2 rounded-lg bg-indigo px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaPlus className="text-xs" />
            Add Category
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200"></div>

      {/* Show message if no project is selected */}
      {!selectedProject ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <FaLayerGroup className="text-2xl text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Project Selected
            </h3>
            <p className="text-sm text-gray-600">
              Please select a project from the dropdown above to manage
              parameters
            </p>
          </div>
        </div>
      ) : !selectedShotType ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <FaLayerGroup className="text-2xl text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Shot Type Selected
            </h3>
            <p className="text-sm text-gray-600">
              Please select a shot type from the dropdown above to manage
              parameters
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Parameters Content */}

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
                    const existingPageData = getCurrentPageData()

                    if (!existingPageData) return

                    const newElementImageKey = element.name
                      .toLowerCase()
                      .replace(/\s+/g, '')

                    const imageFiles = {}
                    if (element.imageFile) {
                      imageFiles[newElementImageKey] = element.imageFile
                    }

                    const updatedSections = existingPageData.sections.map(
                      (section) => {
                        if (section._id === sectionId) {
                          return {
                            categoryTitle: section.categoryTitle,
                            type: section.type || 'nameCard',
                            elements: [
                              ...section.elements.map((el) => ({
                                _id: el._id,
                                prompt: el.prompt || '',
                              })),
                              {
                                name: element.name,
                                value: element.name,
                                prompt: element.prompt || '',
                                imageKey: newElementImageKey,
                              },
                            ],
                          }
                        }
                        return {
                          categoryTitle: section.categoryTitle,
                          type: section.type || 'nameCard',
                          elements: section.elements.map((el) => ({
                            _id: el._id,
                            prompt: el.prompt || '',
                          })),
                        }
                      }
                    )

                    const metadata = {
                      type: selectedShotType,
                      title: existingPageData.title || '',
                      sections: updatedSections,
                    }

                    await saveParametersToAPI(metadata, imageFiles)
                  }}
                  onElementUpdated={async (sectionId, updatedElement) => {
                    showSpinner()
                    try {
                      const formData = new FormData()

                      formData.append('name', updatedElement.name)
                      formData.append('value', updatedElement.name)
                      formData.append('prompt', updatedElement.prompt || '')

                      if (updatedElement.imageFile) {
                        formData.append('image', updatedElement.imageFile)
                      }

                      const apiUrl =
                        selectedProject && selectedShotType
                          ? `${config.UPDATE_PARAMETER}/${
                              updatedElement._id
                            }?projectName=${encodeURIComponent(
                              selectedProject
                            )}&shotTypeName=${encodeURIComponent(
                              selectedShotType
                            )}`
                          : `${config.UPDATE_PARAMETER}/${updatedElement._id}`

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
                        if (selectedProject && selectedShotType) {
                          await fetchParameters(
                            selectedProject,
                            selectedShotType
                          )
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
                        description:
                          error?.message || 'Failed to update element',
                        duration: 3000,
                      })
                    } finally {
                      hideSpinner()
                    }
                  }}
                  onElementDeleted={async (sectionId, elementId) => {
                    showSpinner()
                    try {
                      const apiUrl =
                        selectedProject && selectedShotType
                          ? `${
                              config.DELETE_PARAMETER
                            }/${elementId}?projectName=${encodeURIComponent(
                              selectedProject
                            )}&shotTypeName=${encodeURIComponent(
                              selectedShotType
                            )}`
                          : `${config.DELETE_PARAMETER}/${elementId}`

                      const response = await apiCall('delete', apiUrl)

                      if (response.status === 200 || response.status === 204) {
                        addToast({
                          type: 'success',
                          title: 'Success',
                          description: 'Element deleted successfully',
                          duration: 3000,
                        })
                        if (selectedProject && selectedShotType) {
                          await fetchParameters(
                            selectedProject,
                            selectedShotType
                          )
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
                        description:
                          error?.message || 'Failed to delete element',
                        duration: 3000,
                      })
                    } finally {
                      hideSpinner()
                    }
                  }}
                  onSectionDeleted={async (sectionId) => {
                    showSpinner()
                    try {
                      const apiUrl =
                        selectedProject && selectedShotType
                          ? `${
                              config.DELETE_PARAMETER
                            }/${sectionId}?projectName=${encodeURIComponent(
                              selectedProject
                            )}&shotTypeName=${encodeURIComponent(
                              selectedShotType
                            )}`
                          : `${config.DELETE_PARAMETER}/${sectionId}`

                      const response = await apiCall('delete', apiUrl)

                      if (response.status === 200 || response.status === 204) {
                        addToast({
                          type: 'success',
                          title: 'Success',
                          description: 'Section deleted successfully',
                          duration: 3000,
                        })
                        if (selectedProject && selectedShotType) {
                          await fetchParameters(
                            selectedProject,
                            selectedShotType
                          )
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
                        description:
                          error?.message || 'Failed to delete section',
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
                      const newStatus =
                        currentStatus === 'Active' ? 'Inactive' : 'Active'

                      const apiUrl = `${config.UPDATE_PARAMETER_STATUS}?_id=${elementId}&status=${newStatus}`

                      const response = await apiCall('put', apiUrl)

                      if (response.status === 200 || response.status === 201) {
                        addToast({
                          type: 'success',
                          title: 'Success',
                          description: `Element status updated to ${newStatus} successfully`,
                          duration: 3000,
                        })
                        if (selectedProject && selectedShotType) {
                          await fetchParameters(
                            selectedProject,
                            selectedShotType
                          )
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
                      const newStatus =
                        currentStatus === 'Active' ? 'Inactive' : 'Active'

                      const apiUrl = `${config.UPDATE_SECTION_STATUS}?_id=${sectionId}&status=${newStatus}`

                      const response = await apiCall('put', apiUrl)

                      if (response.status === 200 || response.status === 201) {
                        addToast({
                          type: 'success',
                          title: 'Success',
                          description: `Section status updated to ${newStatus} successfully`,
                          duration: 3000,
                        })
                        if (selectedProject && selectedShotType) {
                          await fetchParameters(
                            selectedProject,
                            selectedShotType
                          )
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
                  onCategoryEdited={async (sectionId, newCategoryName) => {
                    console.log('onCategoryEdited called in ParametersStep')
                    console.log('sectionId:', sectionId)
                    console.log('newCategoryName:', newCategoryName)

                    showSpinner()
                    try {
                      // Build API URL with section _id
                      const apiUrl =
                        selectedProject && selectedShotType
                          ? `${
                              config.UPDATE_PARAMETER
                            }/${sectionId}?projectName=${encodeURIComponent(
                              selectedProject
                            )}&shotTypeName=${encodeURIComponent(
                              selectedShotType
                            )}`
                          : `${config.UPDATE_PARAMETER}/${sectionId}`

                      console.log('API URL:', apiUrl)

                      // Prepare request data
                      const formData = new FormData()
                      formData.append('categoryTitle', newCategoryName)

                      console.log(
                        'Calling API with categoryTitle:',
                        newCategoryName
                      )

                      // Call UPDATE API with section _id
                      const response = await apiCall('put', apiUrl, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      })

                      console.log('API Response:', response)
                      console.log('Response status:', response.status)

                      if (response.status === 200 || response.status === 201) {
                        addToast({
                          type: 'success',
                          title: 'Category Updated',
                          description:
                            'Category name has been updated successfully',
                          duration: 3000,
                        })
                        // Refresh parameters after successful update
                        if (selectedProject && selectedShotType) {
                          await fetchParameters(
                            selectedProject,
                            selectedShotType
                          )
                        }
                      } else {
                        addToast({
                          type: 'error',
                          title: 'Error',
                          description:
                            response?.data?.msg ||
                            response?.data?.message ||
                            'Failed to update category',
                          duration: 3000,
                        })
                      }
                    } catch (error) {
                      console.error('Error updating category:', error)
                      addToast({
                        type: 'error',
                        title: 'Error',
                        description:
                          error?.message || 'Failed to update category',
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
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <FaLayerGroup className="text-2xl text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No parameters yet
                </h3>
                <p className="text-sm text-gray-600">
                  Create your first parameter category to organize your
                  configuration options
                </p>
              </div>
            </div>
          )}
        </>
      )}

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

export default ParametersStep
