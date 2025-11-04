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
    fetchParameters()
    fetchShotTypes()
    fetchServices()
  }, [])

  // Set the first shot type as selected when shot types are loaded
  useEffect(() => {
    if (shotTypeItems.length > 0 && !selectedPage) {
      setSelectedPage(shotTypeItems[0].name)
    }
  }, [shotTypeItems, selectedPage])

  // Get the selected shot type item object
  const getSelectedShotTypeItem = () => {
    return shotTypeItems.find((item) => item.name === selectedPage)
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

      const response = await apiCall('post', config.ADD_PARAMETERS, formData, {
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
        await fetchParameters()
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

  const fetchParameters = async () => {
    showSpinner()
    try {
      const response = await apiCall('get', config.GET_PARAMETERS)

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
      const response = await apiCall('get', config.GET_SERVICE_TYPES)

      if (response.status === 200 && response.data) {
        // Handle both response formats: new format with status_code or old format with success
        const responseData = response.data.data || response.data
        const isSuccessful =
          response.data.status_code === 200 || response.data.success === true

        if (isSuccessful && responseData) {
          // Handle both array and single object responses
          let data = responseData
          if (Array.isArray(responseData) && responseData.length > 0) {
            data = responseData[0]
          }

          if (data && data.projects && Array.isArray(data.projects)) {
            const projects = data.projects.map((project) => ({
              name: project.name,
            }))
            console.log('Project Items extracted:', projects)
            setServiceItems(projects)
          }
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
      const response = await apiCall('get', config.GET_SHOT_TYPE_DATA)

      if (response.status === 200 && response.data) {
        let apiData = null

        // Handle different response structures
        if (
          response?.data?.code === 2000 ||
          response?.data?.status_code === 200
        ) {
          apiData = response.data.data
        } else if (response?.data?._id) {
          apiData = response.data
        } else if (Array.isArray(response?.data)) {
          apiData = response.data[0]
        }

        // Extract full item objects from shot types (with _id and name)
        if (apiData && apiData.items && Array.isArray(apiData.items)) {
          const items = apiData.items
            .filter((item) => item.name && item._id)
            .map((item) => ({
              _id: item._id,
              name: item.name,
              typesubtitle: item.typesubtitle || '',
              image: item.image || '',
            }))
          console.log('Shot Type Items extracted:', items)
          setShotTypeItems(items)
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
    const selectedItem = getSelectedShotTypeItem()
    const pageType = selectedPage

    if (!selectedItem) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a shot type first',
        duration: 3000,
      })
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
      typeId: selectedItem._id,
      type: selectedItem.name,
      title: existingPageData?.title || '',
      sections: [...existingSections, newSection],
    }

    console.log('Add Category - Metadata being sent:', metadata)
    console.log('Selected Item:', selectedItem)

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
    const selectedItem = getSelectedShotTypeItem()
    const pageType = selectedPage

    if (!selectedItem) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Please select a shot type first',
        duration: 3000,
      })
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
      typeId: selectedItem._id,
      type: selectedItem.name,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 px-4 py-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parameters</h1>
              {title && (
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  {title}
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    {parameters.length} Sections
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Services Dropdown */}
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Projects</option>
                {serviceItems.length > 0 ? (
                  serviceItems.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No Projects available
                  </option>
                )}
              </select>

              {/* Pages Dropdown */}
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {shotTypeItems.length > 0 ? (
                  shotTypeItems.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option value="">No shot types available</option>
                )}
              </select>

              {/* Add Heading Button - Only show if no heading exists */}
              {!(currentPageData && currentPageData.title) && (
                <button
                  onClick={() => setIsHeadingModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                >
                  <FaPlus className="text-sm" />
                  Heading
                </button>
              )}

              {/* Add Category Button */}
              <button
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
              >
                <FaPlus className="text-sm" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Title Display Card */}
        {currentPageData && currentPageData.title && (
          <div className="mb-6">
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/20 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div className="overflow-hidden">
                    <div className="mb-1 text-sm font-semibold text-gray-500">
                      Title
                    </div>
                    <h2 className="overflow-hidden text-ellipsis break-all text-xl font-bold text-gray-900">
                      {currentPageData.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsHeadingModalOpen(true)}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all hover:bg-blue-200 hover:shadow-md"
                  title="Edit Heading"
                >
                  <FaEdit size={14} />
                </button>
              </div>
            </div>
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
                  const selectedItem = getSelectedShotTypeItem()
                  const existingPageData = getCurrentPageData()

                  if (!selectedItem || !existingPageData) return

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
                              // For existing elements, backend only needs _id to recognize them
                              const existingElement = {
                                _id: el._id, // Backend uses this to identify existing element
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
                        })),
                      }
                    }
                  )

                  // Build the metadata structure for API
                  const metadata = {
                    typeId: selectedItem._id,
                    type: selectedItem.name,
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

                    // Add image file if new image was uploaded
                    if (updatedElement.imageFile) {
                      formData.append('image', updatedElement.imageFile)
                    }

                    // Call UPDATE API with element _id
                    const response = await apiCall(
                      'put',
                      `${config.UPDATE_PARAMETER}/${updatedElement._id}`,
                      formData,
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
                        description: 'Element updated successfully',
                        duration: 3000,
                      })
                      // Refresh parameters after successful update
                      await fetchParameters()
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
                    // Call DELETE API with element _id
                    const response = await apiCall(
                      'delete',
                      `${config.DELETE_PARAMETER}/${elementId}`
                    )

                    if (response.status === 200 || response.status === 204) {
                      addToast({
                        type: 'success',
                        title: 'Success',
                        description: 'Element deleted successfully',
                        duration: 3000,
                      })
                      // Refresh parameters after successful delete
                      await fetchParameters()
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
                    // Call DELETE API with section _id
                    const response = await apiCall(
                      'delete',
                      `${config.DELETE_PARAMETER}/${sectionId}`
                    )

                    if (response.status === 200 || response.status === 204) {
                      addToast({
                        type: 'success',
                        title: 'Success',
                        description: 'Section deleted successfully',
                        duration: 3000,
                      })
                      // Refresh parameters after successful delete
                      await fetchParameters()
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
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[450px] items-center justify-center">
            <div className="max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <div className="mb-5 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
                  <FaLayerGroup className="text-4xl text-blue-500" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No Parameters Yet
              </h3>
              <p className="mb-1 text-sm leading-relaxed text-gray-500">
                No parameters found. Parameters will appear here once they are
                configured.
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
