import React, { useState, useEffect } from 'react'
import { FaPlus, FaImage, FaEdit } from 'react-icons/fa'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import ShortTypeCard from '../../components/shortType/ShortTypeCard'
import AddShortTypeModal from '../../components/shortType/AddShortTypeModal'
import AddHeadingModal from '../../components/shortType/AddHeadingModal'

const ShortTypeManagement = () => {
  // State management
  const [shotTypes, setShotTypes] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isHeadingModalOpen, setIsHeadingModalOpen] = useState(false)
  const [selectedShotType, setSelectedShotType] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editData, setEditData] = useState(null)

  // Hooks
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  // Fetch shot types on mount and page change
  useEffect(() => {
    fetchShotTypes()
  }, [currentPage])

  const fetchShotTypes = async () => {
    showSpinner()
    try {
      // Try GET_SHOT_TYPE_DATA endpoint
      const response = await apiCall('get', config.GET_SHOT_TYPE_DATA)

      // Check if request was successful
      if (!response || response.status !== 200) {
        // If 404, it means no data exists yet - show empty state without error
        if (response?.status === 404 || response?.data?.code === 4004) {
          setShotTypes([])
          setTotalItems(0)
          return
        }

        // For other errors, show error toast
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

      // Handle different possible response structures
      let apiData = null

      // Check if response has the structure: { code, msg, data, error }
      if (
        response?.data?.code === 2000 ||
        response?.data?.status_code === 200
      ) {
        apiData = response.data.data
      }
      // Check if response.data itself is the data
      else if (response?.data?._id) {
        apiData = response.data
      }
      // Check if it's an array of shot types
      else if (Array.isArray(response?.data)) {
        // If it's an array, take the first one or handle multiple
        apiData = response.data[0]
      }

      // Check if data is null or empty
      if (!apiData) {
        // Show empty state - no data available yet
        setShotTypes([])
        setTotalItems(0)
        return
      }

      // Check if the data has the expected structure
      if (apiData._id) {
        // Transform the API response to match the expected format
        const transformedData = {
          _id: apiData._id,
          title: apiData.title || '',
          subtitle: apiData.subtitle || '',
          items: apiData.items || [],
          createdAt: apiData.createdAt,
          updatedAt: apiData.updatedAt,
        }

        console.log('Fetched shot type data:', transformedData)

        // Wrap in array since the component expects an array of shot types
        setShotTypes([transformedData])
        // Set total items based on the number of items in the array, not the shot type count
        setTotalItems(transformedData.items?.length || 0)
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
      const submitData = new FormData()

      // Generate imageKey from item name (convert to camelCase and remove spaces)
      const generateImageKey = (name) => {
        return name
          .trim()
          .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
          .replace(/\s/g, '')
          .replace(/^(.)/, (char) => char.toLowerCase())
      }

      // Get existing title and subtitle from shotTypes, or use empty strings
      const existingTitle = shotTypes.length > 0 ? shotTypes[0].title || '' : ''
      const existingSubtitle =
        shotTypes.length > 0 ? shotTypes[0].subtitle || '' : ''

      // Prepare metadata with title, subtitle, and items from form data
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

      // Append image files with their corresponding imageKeys
      formData.items.forEach((item) => {
        if (item.file) {
          const imageKey = generateImageKey(item.name)
          submitData.append(imageKey, item.file)
        }
      })

      const response = await apiCall('post', config.ADD_SHOT_TYPE, submitData, {
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
        fetchShotTypes() // Refresh list
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

      // Generate imageKey from item name (convert to camelCase and remove spaces)
      const generateImageKey = (name) => {
        return name
          .trim()
          .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
          .replace(/\s/g, '')
          .replace(/^(.)/, (char) => char.toLowerCase())
      }

      // Preserve existing title and subtitle from selectedShotType
      const existingTitle = selectedShotType?.title || ''
      const existingSubtitle = selectedShotType?.subtitle || ''

      // Prepare metadata with title, subtitle, and items from form data
      const metadata = {
        title: existingTitle,
        subtitle: existingSubtitle,
        items: formData.items.map((item) => {
          const imageKey = generateImageKey(item.name)
          return {
            name: item.name,
            typesubtitle: item.typesubtitle || '',
            imageKey: imageKey,
            // If there's an existing image and no new file, keep the existing image URL
            ...(item.image && !item.file ? { image: item.image } : {}),
          }
        }),
      }
      submitData.append('metadata', JSON.stringify(metadata))

      // Append new image files with their corresponding imageKeys
      formData.items.forEach((item) => {
        if (item.file) {
          const imageKey = generateImageKey(item.name)
          submitData.append(imageKey, item.file)
        }
      })

      const response = await apiCall(
        'put',
        `${config.UPDATE_SHOT_TYPE}/${selectedShotType._id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      // Check if status is 200 or 201 (successful)
      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Shot type updated successfully!',
          duration: 3000,
        })
        setIsEditModalOpen(false)
        setEditData(null)
        setSelectedShotType(null)
        fetchShotTypes() // Refresh list
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
    setSelectedShotType(shotType)
    setSelectedItem(item)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    showSpinner()
    try {
      // Use the item's _id from the items array for deletion
      const response = await apiCall(
        'delete',
        `${config.DELETE_SHOT_TYPE}/${selectedItem._id}`
      )

      // Check if status is 200 (successful)
      if (response.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Item deleted successfully!',
          duration: 3000,
        })
        setIsDeleteModalOpen(false)
        setSelectedShotType(null)
        setSelectedItem(null)
        fetchShotTypes() // Refresh list
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

  const handleEdit = (shotType) => {
    setSelectedShotType(shotType)
    setEditData(shotType)
    setIsEditModalOpen(true)
  }

  const handleAddHeading = async (formData) => {
    showSpinner()
    try {
      const submitData = new FormData()

      // Generate imageKey from item name (convert to camelCase and remove spaces)
      const generateImageKey = (name) => {
        return name
          .trim()
          .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
          .replace(/\s/g, '')
          .replace(/^(.)/, (char) => char.toLowerCase())
      }

      // Get existing items from shotTypes, or use empty array
      const existingItems =
        shotTypes.length > 0 && shotTypes[0].items ? shotTypes[0].items : []

      // Prepare metadata with new title and subtitle, and existing items
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

      console.log('Sending heading metadata:', metadata)
      submitData.append('metadata', JSON.stringify(metadata))

      // Check if we're updating existing data or creating new
      const shotTypeId = shotTypes.length > 0 ? shotTypes[0]._id : null

      let response
      if (shotTypeId) {
        // Update existing shot type
        response = await apiCall(
          'put',
          `${config.UPDATE_SHOT_TYPE}/${shotTypeId}`,
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
      } else {
        // Create new shot type with just title and subtitle
        response = await apiCall('post', config.ADD_SHOT_TYPE, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }

      console.log('Heading update response:', response)

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Heading saved successfully!',
          duration: 3000,
        })
        setIsHeadingModalOpen(false)
        await fetchShotTypes() // Refresh list
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
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
            currentPage === i
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30'
              : 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">Showing</span>
            <span className="rounded-md bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
              {startIndex} - {endIndex}
            </span>
            <span className="text-gray-600">of</span>
            <span className="font-bold text-gray-900">{totalItems}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
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
              Prev
            </button>
            <div className="flex items-center gap-1">{pages}</div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 px-4 py-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-6">
          {/* Header Content */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shot Type</h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                Manage your photography shot types
                <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  {totalItems} Total
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Only show Add Heading button if no heading exists */}
              {!(
                shotTypes.length > 0 &&
                (shotTypes[0].title || shotTypes[0].subtitle)
              ) && (
                <button
                  onClick={() => setIsHeadingModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                >
                  <FaPlus className="text-sm" />
                  Add Heading
                </button>
              )}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
              >
                <FaPlus className="text-sm" />
                Add Shot Type
              </button>
            </div>
          </div>
        </div>

        {/* Title and Subtitle Display Card */}
        {shotTypes.length > 0 &&
          (shotTypes[0].title || shotTypes[0].subtitle) && (
            <div className="mb-6">
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/20 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 flex-col gap-4">
                    {shotTypes[0].title && (
                      <div className="overflow-hidden">
                        <div className="mb-1 text-sm font-semibold text-gray-500">
                          Title
                        </div>
                        <h2 className="overflow-hidden text-ellipsis break-all text-xl font-bold text-gray-900">
                          {shotTypes[0].title}
                        </h2>
                      </div>
                    )}
                    {shotTypes[0].subtitle && (
                      <div className="overflow-hidden">
                        <div className="mb-1 text-sm font-semibold text-gray-500">
                          Subtitle
                        </div>
                        <p className="overflow-hidden text-ellipsis break-all text-base font-bold text-gray-900 ">
                          {shotTypes[0].subtitle}
                        </p>
                      </div>
                    )}
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

        {/* Shot Types Grid */}
        {shotTypes.length > 0 ? (
          <>
            {/* Check if there are any items to display */}
            {shotTypes.some((st) => st.items && st.items.length > 0) ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {shotTypes.map((shotType) =>
                  shotType.items.map((item, index) => (
                    <ShortTypeCard
                      key={`${shotType._id}-${index}`}
                      shotType={shotType}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            ) : (
              /* Shot type exists but no items - Show different empty state */
              <div className="flex min-h-[450px] items-center justify-center">
                <div className="max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                  <div className="mb-5 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
                      <FaImage className="text-4xl text-blue-500" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    No Items in Shot Type
                  </h3>
                  <p className="mb-1 text-sm leading-relaxed text-gray-500">
                    No items found. Add items to get started.
                  </p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {renderPagination()}
          </>
        ) : (
          /* Empty State */
          <div className="flex min-h-[450px] items-center justify-center">
            <div className="max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <div className="mb-5 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
                  <FaImage className="text-4xl text-blue-500" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No Shot Types Yet
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-500">
                Create your first shot type to start organizing your photography
                options.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
              >
                <FaPlus />
                Create First Shot Type
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Short Type Modal */}
      <AddShortTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddShotType}
      />

      {/* Edit Short Type Modal */}
      <AddShortTypeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditData(null)
          setSelectedShotType(null)
        }}
        onSubmit={handleEditShotType}
        editData={editData}
      />

      {/* Add Heading Modal */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedShotType(null)
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
    </div>
  )
}

export default ShortTypeManagement
