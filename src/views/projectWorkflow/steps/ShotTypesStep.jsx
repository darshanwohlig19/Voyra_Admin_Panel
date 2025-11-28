import React, { useState, useEffect } from 'react'
import { FaPlus, FaImage, FaEdit } from 'react-icons/fa'
import ApiCaller from '../../../common/services/apiServices'
import config from '../../../common/config/apiConfig'
import { useSpinner } from '../../../common/SpinnerLoader'
import { useToaster } from '../../../common/Toaster'
import ConfirmationModal from '../../../components/modal/ConfirmationModal'
import ShortTypeCard from '../../../components/shortType/ShortTypeCard'
import AddShortTypeModal from '../../../components/shortType/AddShortTypeModal'
import AddHeadingModal from '../../../components/shortType/AddHeadingModal'

const ShotTypesStep = ({
  selectedProject,
  selectedShotType,
  onProjectChange,
  onShotTypeSelect,
  onShotTypeCreated,
  navigationButtons,
}) => {
  const [shotTypes, setShotTypes] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isHeadingModalOpen, setIsHeadingModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedShotTypeObj, setSelectedShotTypeObj] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editData, setEditData] = useState(null)

  // Service dropdown state
  const [serviceItems, setServiceItems] = useState([])

  // Hooks
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  // Fetch shot types when project changes
  useEffect(() => {
    if (selectedProject) {
      fetchShotTypes()
    } else {
      setShotTypes([])
      setTotalItems(0)
    }
  }, [currentPage, selectedProject])

  // Fetch services on mount
  useEffect(() => {
    fetchServices()
  }, [])

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
    showSpinner()
    try {
      const apiUrl = selectedProject
        ? `${config.GET_SHOT_TYPES}?projectName=${encodeURIComponent(
            selectedProject
          )}`
        : config.GET_SHOT_TYPES

      const response = await apiCall('get', apiUrl)

      if (!response || response.status !== 200) {
        if (response?.status === 404 || response?.data?.code === 4004) {
          setShotTypes([])
          setTotalItems(0)
          return
        }

        addToast({
          type: 'error',
          title: 'Error',
          description: `Failed to fetch data. Status: ${
            response?.status || 'Unknown'
          }`,
          duration: 3000,
        })
        return
      }

      const responseData = response.data.data || response.data
      const isSuccessful =
        response.data.code === 2000 ||
        response.data.status_code === 200 ||
        response.data.success === true

      if (isSuccessful && responseData) {
        if (responseData._id && responseData.items) {
          const transformedData = {
            _id: responseData._id,
            title: responseData.title || '',
            subtitle: responseData.subtitle || '',
            items: responseData.items || [],
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
          }

          setShotTypes([transformedData])
          setTotalItems(transformedData.items?.length || 0)
        } else {
          setShotTypes([])
          setTotalItems(0)
        }
      } else {
        setShotTypes([])
        setTotalItems(0)
      }
    } catch (error) {
      console.error('Error fetching shot types:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to fetch shot types',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleAddShotType = async (formData) => {
    showSpinner()
    try {
      if (!selectedProject) {
        addToast({
          type: 'error',
          title: 'Error',
          description: 'Please select a project first',
          duration: 3000,
        })
        hideSpinner()
        return
      }

      const submitData = new FormData()

      const generateImageKey = (name) => {
        return name
          .trim()
          .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
          .replace(/\s/g, '')
          .replace(/^(.)/, (char) => char.toLowerCase())
      }

      const existingTitle = shotTypes.length > 0 ? shotTypes[0].title || '' : ''
      const existingSubtitle =
        shotTypes.length > 0 ? shotTypes[0].subtitle || '' : ''

      const metadata = {
        title: existingTitle,
        subtitle: existingSubtitle,
        items: formData.items.map((item) => ({
          name: item.name,
          typesubtitle: item.typesubtitle || '',
          imageKey: generateImageKey(item.name),
        })),
      }
      submitData.append('metadata', JSON.stringify(metadata))

      formData.items.forEach((item) => {
        if (item.file) {
          const imageKey = generateImageKey(item.name)
          submitData.append(imageKey, item.file)
        }
      })

      const apiUrl = `${config.ADD_SHOT_TYPE}?projectTypeId=${selectedProject}`

      const response = await apiCall('post', apiUrl, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Shot type added successfully!',
          duration: 3000,
        })
        setIsAddModalOpen(false)
        await fetchShotTypes()

        // Notify parent that a shot type was created
        if (onShotTypeCreated) {
          onShotTypeCreated()
        }

        // Auto-select the newly created shot type
        if (onShotTypeSelect && formData.items.length > 0) {
          onShotTypeSelect(formData.items[0].name)
        }
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to add shot type',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error adding shot type:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description:
          error?.message || 'An error occurred while adding shot type',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleEditShotType = async (formData) => {
    showSpinner()
    try {
      const submitData = new FormData()

      const generateImageKey = (name) => {
        return name
          .trim()
          .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
          .replace(/\s/g, '')
          .replace(/^(.)/, (char) => char.toLowerCase())
      }

      const existingTitle = selectedShotTypeObj?.title || ''
      const existingSubtitle = selectedShotTypeObj?.subtitle || ''

      const editedItem = formData.items[0]
      const existingItems = selectedShotTypeObj?.items || []

      const editingItemId = editData?.items?.[0]?._id
      const editingItemIndex = existingItems.findIndex(
        (item) => item._id === editingItemId
      )

      const updatedItems = existingItems.map((item, index) => {
        if (index === editingItemIndex) {
          const imageKey = generateImageKey(editedItem.name)
          return {
            name: editedItem.name,
            typesubtitle: editedItem.typesubtitle || '',
            imageKey: imageKey,
            ...(editedItem.image && !editedItem.file
              ? { image: editedItem.image }
              : {}),
          }
        } else {
          return {
            name: item.name,
            typesubtitle: item.typesubtitle || '',
            imageKey: generateImageKey(item.name),
            ...(item.image ? { image: item.image } : {}),
          }
        }
      })

      const metadata = {
        title: existingTitle,
        subtitle: existingSubtitle,
        items: updatedItems,
      }
      submitData.append('metadata', JSON.stringify(metadata))

      if (editedItem.file) {
        const imageKey = generateImageKey(editedItem.name)
        submitData.append(imageKey, editedItem.file)
      }

      const apiUrl = selectedProject
        ? `${config.UPDATE_SHOT_TYPE}/${selectedShotTypeObj._id}?projectTypeId=${selectedProject}`
        : `${config.UPDATE_SHOT_TYPE}/${selectedShotTypeObj._id}`

      const response = await apiCall('put', apiUrl, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Shot type item updated successfully!',
          duration: 3000,
        })
        setIsEditModalOpen(false)
        setEditData(null)
        setSelectedShotTypeObj(null)
        fetchShotTypes()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to update shot type',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error updating shot type:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description:
          error?.message || 'An error occurred while updating shot type',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleDelete = (shotType, item) => {
    setSelectedShotTypeObj(shotType)
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    showSpinner()
    try {
      const apiUrl = selectedProject
        ? `${config.DELETE_SHOT_TYPE}/${selectedItem._id}?projectTypeId=${selectedProject}`
        : `${config.DELETE_SHOT_TYPE}/${selectedItem._id}`

      const response = await apiCall('delete', apiUrl)

      if (response.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Item deleted successfully!',
          duration: 3000,
        })
        setIsDeleteModalOpen(false)
        setSelectedShotTypeObj(null)
        setSelectedItem(null)
        fetchShotTypes()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to delete item',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'An error occurred while deleting item',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleEdit = (shotType, item) => {
    setSelectedShotTypeObj(shotType)
    setEditData({
      ...shotType,
      items: [item],
    })
    setIsEditModalOpen(true)
  }

  const handleToggleStatus = (shotType, item) => {
    setSelectedShotTypeObj(shotType)
    setSelectedItem(item)
    setIsStatusModalOpen(true)
  }

  const closeStatusModal = () => {
    setIsStatusModalOpen(false)
    setSelectedShotTypeObj(null)
    setSelectedItem(null)
  }

  const confirmToggleStatus = async () => {
    if (!selectedItem) return

    showSpinner()
    try {
      const newStatus = selectedItem.status === 'Active' ? 'Inactive' : 'Active'

      const apiUrl = `${config.UPDATE_SHOT_TYPE_STATUS}?shotTypeId=${selectedItem._id}&status=${newStatus}`

      const response = await apiCall('put', apiUrl)

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Shot type "${selectedItem.name}" status updated to ${newStatus} successfully`,
          duration: 3000,
        })

        await fetchShotTypes()
        closeStatusModal()
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
      console.error('Error updating shot type status:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to update shot type status',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleAddHeading = async (formData) => {
    showSpinner()
    try {
      const submitData = new FormData()

      const generateImageKey = (name) => {
        return name
          .trim()
          .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
          .replace(/\s/g, '')
          .replace(/^(.)/, (char) => char.toLowerCase())
      }

      const existingItems =
        shotTypes.length > 0 && shotTypes[0].items ? shotTypes[0].items : []

      const metadata = {
        title: formData.title,
        subtitle: formData.subtitle,
        items: existingItems.map((item) => ({
          name: item.name,
          typesubtitle: item.typesubtitle || '',
          imageKey: generateImageKey(item.name),
          ...(item.image ? { image: item.image } : {}),
        })),
      }

      submitData.append('metadata', JSON.stringify(metadata))

      const shotTypeId = shotTypes.length > 0 ? shotTypes[0]._id : null

      let response
      if (shotTypeId) {
        const apiUrl = selectedProject
          ? `${config.UPDATE_SHOT_TYPE}/${shotTypeId}?projectTypeId=${selectedProject}`
          : `${config.UPDATE_SHOT_TYPE}/${shotTypeId}`

        response = await apiCall('put', apiUrl, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      } else {
        const apiUrl = selectedProject
          ? `${config.ADD_SHOT_TYPE}?projectTypeId=${selectedProject}`
          : config.ADD_SHOT_TYPE

        response = await apiCall('post', apiUrl, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Heading saved successfully!',
          duration: 3000,
        })
        setIsHeadingModalOpen(false)
        await fetchShotTypes()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to save heading',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error saving heading:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'An error occurred while saving heading',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  // Pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative h-9 w-9 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentPage === i
              ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Showing</span>
          <span className="font-medium text-gray-900">
            {startIndex}-{endIndex}
          </span>
          <span>of</span>
          <span className="font-medium text-gray-900">{totalItems}</span>
          <span>items</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>
          <div className="flex items-center gap-1">{pages}</div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            Next
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Shot Types
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure shot types for your selected project
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

          {/* Add Heading Button */}
          {selectedProject &&
            !(
              shotTypes.length > 0 &&
              (shotTypes[0].title || shotTypes[0].subtitle)
            ) && (
              <button
                onClick={() => setIsHeadingModalOpen(true)}
                className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
              >
                <FaPlus className="text-xs" />
                Add Heading
              </button>
            )}

          {/* Add Shot Type Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={!selectedProject}
            className="flex h-10 items-center gap-2 rounded-lg bg-indigo px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaPlus className="text-xs" />
            Add Shot Type
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200"></div>

      {/* Navigation Buttons */}
      {navigationButtons && <div className="mb-6">{navigationButtons}</div>}

      {/* Show message if no project is selected */}
      {!selectedProject ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <FaImage className="text-2xl text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Project Selected
            </h3>
            <p className="text-sm text-gray-600">
              Please select a project from the dropdown above to manage shot
              types
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Title and Subtitle Section */}
          {shotTypes.length > 0 &&
            (shotTypes[0].title || shotTypes[0].subtitle) && (
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
                  {shotTypes[0].title && (
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      {shotTypes[0].title}
                    </h2>
                  )}
                  {shotTypes[0].subtitle && (
                    <p className="text-lg leading-relaxed text-gray-600">
                      {shotTypes[0].subtitle}
                    </p>
                  )}
                </div>

                <div className="mt-6 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              </div>
            )}

          {/* Shot Types Grid or Empty State */}
          {shotTypes.length > 0 ? (
            <>
              {shotTypes.some((st) => st.items && st.items.length > 0) ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        <FaImage className="text-sm text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {shotTypes.map((shotType) =>
                      shotType.items.map((item, index) => (
                        <ShortTypeCard
                          key={`${shotType._id}-${index}`}
                          shotType={shotType}
                          item={item}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onToggleStatus={handleToggleStatus}
                        />
                      ))
                    )}
                  </div>

                  {renderPagination()}
                </>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                      <FaImage className="text-2xl text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      No items yet
                    </h3>
                    <p className="mb-6 text-sm text-gray-600">
                      Get started by adding your first shot type item
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800"
                    >
                      <FaPlus className="text-xs" />
                      Add Shot Type
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <FaImage className="text-2xl text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No shot types yet
                </h3>
                <p className="text-sm text-gray-600">
                  Create your first shot type to organize your photography
                  options
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddShortTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddShotType}
      />

      <AddShortTypeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditData(null)
          setSelectedShotTypeObj(null)
        }}
        onSubmit={handleEditShotType}
        editData={editData}
      />

      <AddHeadingModal
        isOpen={isHeadingModalOpen}
        onClose={() => setIsHeadingModalOpen(false)}
        onSubmit={handleAddHeading}
        existingData={
          shotTypes.length > 0
            ? {
                title: shotTypes[0].title || '',
                subtitle: shotTypes[0].subtitle || '',
              }
            : null
        }
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedShotTypeObj(null)
          setSelectedItem(null)
        }}
        title="Delete Item"
        message={`Are you sure you want to delete "${
          selectedItem?.name || 'this item'
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
        onConfirm={confirmDelete}
      />

      <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={closeStatusModal}
        title={
          selectedItem?.status === 'Active'
            ? 'Hide Shot Type'
            : 'Unhide Shot Type'
        }
        message={`Are you sure you want to ${
          selectedItem?.status === 'Active' ? 'hide' : 'unhide'
        } "${selectedItem?.name}"?`}
        confirmText={selectedItem?.status === 'Active' ? 'Hide' : 'Unhide'}
        cancelText="Cancel"
        confirmColorScheme={
          selectedItem?.status === 'Active' ? 'orange' : 'green'
        }
        icon={selectedItem?.status === 'Active' ? 'warning' : 'info'}
        onConfirm={confirmToggleStatus}
      />
    </div>
  )
}

export default ShotTypesStep
