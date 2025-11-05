import React, { useState, useEffect } from 'react'
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'
import { useLocation } from 'react-router-dom'
import RoutesComponent from '../../routes'
import DataTable from '../../components/DataTable'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import AddProjectModal from '../../components/projects/AddProjectModal'

const Projects = () => {
  const [services, setServices] = useState([])
  const [organizationId, setOrganizationId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [pageTitle, setPageTitle] = useState('Projects')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [editData, setEditData] = useState(null)
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()
  const location = useLocation()
  const routes = RoutesComponent()

  useEffect(() => {
    // Find the current route and set the page title dynamically
    const currentRoute = routes.find((route) =>
      location.pathname.includes(route.path)
    )
    if (currentRoute) {
      setPageTitle(currentRoute.name)
    }
  }, [location, routes])

  useEffect(() => {
    fetchServiceTypes()
  }, [])

  const fetchServiceTypes = async () => {
    showSpinner()
    try {
      const response = await apiCall('get', config.GET_SERVICE_TYPES)

      if (response.status === 204) {
        // No content - no service types found for this organization
        setServices([])
        addToast({
          type: 'info',
          title: 'No Data',
          description: 'No service types found for your organization',
          duration: 3000,
        })
      } else if (response.status === 200 && response.data) {
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

          if (data && data.projects) {
            setOrganizationId(data.organizationId)

            // Add createdAt to each project from parent data
            const projectsWithDate = (data.projects || []).map((project) => ({
              ...project,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            }))

            setServices(projectsWithDate)
          } else {
            setServices([])
          }
        } else {
          setServices([])
        }
      } else {
        setServices([])
      }
    } catch (error) {
      console.error('Error fetching service types:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to fetch service types',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleDelete = (service) => {
    setSelectedService(service)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedService(null)
  }

  const confirmDeleteService = async () => {
    if (!selectedService) return

    showSpinner()
    try {
      const response = await apiCall(
        'delete',
        `${config.DELETE_SERVICE_TYPE}/${selectedService._id}`
      )

      if (response.status === 200 || response.status === 204) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Service "${selectedService.name}" deleted successfully`,
          duration: 3000,
        })

        // Refresh service types list
        await fetchServiceTypes()
        closeDeleteModal()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to delete service',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to delete service',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleEdit = (project) => {
    // Convert project data to include schema format for the modal
    const editDataFormatted = {
      ...project,
      schema: {
        [project.name]: {
          category: project.category || [],
        },
      },
    }
    setSelectedService(project)
    setEditData(editDataFormatted)
    setIsEditModalOpen(true)
  }

  const handleAddProject = async ({ serviceType, metaData }) => {
    showSpinner()
    try {
      // Validate inputs
      if (!serviceType || !metaData || Object.keys(metaData).length === 0) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: 'Service type and metadata are required',
          duration: 3000,
        })
        hideSpinner()
        return
      }

      // Build form-data payload as shown in Postman
      const formData = new FormData()
      formData.append('projectName', serviceType)
      formData.append('metadata', JSON.stringify(metaData))

      // Log the data being sent for debugging
      console.log('Sending data:', {
        serviceType,
        metaData,
        formDataEntries: Array.from(formData.entries()),
      })

      // Send FormData - axios will automatically set the correct Content-Type with boundary
      const response = await apiCall('post', config.ADD_SERVICE_TYPE, formData)

      console.log('API Response:', response)

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Service "${serviceType}" added successfully`,
          duration: 3000,
        })

        // Refresh service types list
        await fetchServiceTypes()
        setIsAddModalOpen(false)
      } else {
        // Extract error message and ensure it's a string
        let errorMessage = 'Failed to add service'

        const responseData = response?.data
        if (responseData) {
          if (typeof responseData.msg === 'string') {
            errorMessage = responseData.msg
          } else if (typeof responseData.message === 'string') {
            errorMessage = responseData.message
          } else if (typeof responseData.error === 'string') {
            errorMessage = responseData.error
          } else if (typeof responseData === 'string') {
            errorMessage = responseData
          } else if (
            responseData.message &&
            typeof responseData.message === 'object'
          ) {
            errorMessage = JSON.stringify(responseData.message)
          }
        }

        console.error('API Error Response:', response?.data)

        addToast({
          type: 'error',
          title: 'Error',
          description: errorMessage,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error adding service:', error)
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      })

      // Extract error message and ensure it's a string
      let errorMessage = 'Failed to add service'

      if (error?.response?.data) {
        const data = error.response.data
        if (typeof data.message === 'string') {
          errorMessage = data.message
        } else if (typeof data.msg === 'string') {
          errorMessage = data.msg
        } else if (typeof data.error === 'string') {
          errorMessage = data.error
        } else if (typeof data === 'string') {
          errorMessage = data
        } else if (data.message && typeof data.message === 'object') {
          errorMessage = JSON.stringify(data.message)
        }
      } else if (error?.message) {
        errorMessage = String(error.message)
      }

      addToast({
        type: 'error',
        title: 'Error',
        description: errorMessage,
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleEditProject = async ({ serviceType, metaData }) => {
    showSpinner()
    try {
      // Validate inputs
      if (!serviceType || !metaData || Object.keys(metaData).length === 0) {
        addToast({
          type: 'error',
          title: 'Validation Error',
          description: 'Service type and metadata are required',
          duration: 3000,
        })
        hideSpinner()
        return
      }

      // Get all the old field keys from the existing service
      let oldFieldKeys = []
      if (
        selectedService &&
        selectedService.schema &&
        selectedService.schema[serviceType]
      ) {
        oldFieldKeys = Object.keys(selectedService.schema[serviceType])
      }

      // Get new field keys
      const newFieldKeys = Object.keys(metaData)

      // Find fields that were removed (exist in old but not in new)
      const removedFields = oldFieldKeys.filter(
        (key) => !newFieldKeys.includes(key)
      )

      // Create complete metadata with removed fields set to empty array
      const completeMetaData = { ...metaData }
      removedFields.forEach((field) => {
        completeMetaData[field] = []
      })

      // Build form-data payload
      const formData = new FormData()
      formData.append('projectName', serviceType)
      formData.append('metadata', JSON.stringify(completeMetaData))

      // Include serviceId to identify which service to update
      if (selectedService && selectedService._id) {
        formData.append('serviceId', selectedService._id)
      }

      console.log('Updating service:', {
        serviceType,
        originalMetaData: metaData,
        completeMetaData,
        serviceId: selectedService?._id,
        removedFields,
      })

      // Use POST method (same as add)
      const response = await apiCall('post', config.ADD_SERVICE_TYPE, formData)

      console.log('API Response:', response)

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Service "${serviceType}" updated successfully`,
          duration: 3000,
        })

        // Refresh service types list
        await fetchServiceTypes()
        setIsEditModalOpen(false)
        setEditData(null)
        setSelectedService(null)
      } else {
        const errorMessage =
          response?.data?.msg ||
          response?.data?.message ||
          response?.data?.error ||
          'Failed to update service'

        console.error('API Error Response:', response?.data)

        addToast({
          type: 'error',
          title: 'Error',
          description: errorMessage,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error updating service:', error)
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      })

      // Extract error message and ensure it's a string
      let errorMessage = 'Failed to update service'

      if (error?.response?.data) {
        const data = error.response.data
        if (typeof data.message === 'string') {
          errorMessage = data.message
        } else if (typeof data.msg === 'string') {
          errorMessage = data.msg
        } else if (typeof data.error === 'string') {
          errorMessage = data.error
        } else if (typeof data === 'string') {
          errorMessage = data
        } else if (data.message && typeof data.message === 'object') {
          errorMessage = JSON.stringify(data.message)
        }
      } else if (error?.message) {
        errorMessage = String(error.message)
      }

      addToast({
        type: 'error',
        title: 'Error',
        description: errorMessage,
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  // Pagination logic
  const totalItems = services.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedServices = services.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Define table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Project Name',
      width: '180px',
      render: (_, value) => (
        <span className="text-base font-semibold capitalize text-gray-900">
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Categories',
      width: '180px',
      render: (_, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return <span className="text-sm text-gray-500">N/A</span>
        }

        const categories = value.map((cat) => cat.name).filter(Boolean)

        if (categories.length === 0) {
          return <span className="text-sm text-gray-500">N/A</span>
        }

        return (
          <select
            defaultValue={categories[0]}
            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )
      },
    },
    {
      key: 'category',
      label: 'Subcategories',
      width: '180px',
      render: (_, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return <span className="text-sm text-gray-500">N/A</span>
        }

        const subcategories = []
        value.forEach((cat) => {
          if (cat.subcategory && Array.isArray(cat.subcategory)) {
            cat.subcategory.forEach((sub) => {
              if (sub.name) {
                subcategories.push(sub.name)
              }
            })
          }
        })

        if (subcategories.length === 0) {
          return <span className="text-sm text-gray-500">N/A</span>
        }

        return (
          <select
            defaultValue={subcategories[0]}
            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
          >
            {subcategories.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )
      },
    },

    {
      key: 'isGender',
      label: 'Gender',
      width: '100px',
      render: (_, value) => (
        <span
          className={`inline-block rounded-md px-3 py-1 text-sm font-medium ${
            value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {value ? 'Enabled' : 'Disabled'}
        </span>
      ),
    },

    {
      key: 'createdAt',
      label: 'Created At',
      width: '150px',
      render: (_, value) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
            onClick={() => handleEdit(row)}
            title="Edit Service"
          >
            <FaEdit size={14} />
          </button>
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
            onClick={() => handleDelete(row)}
            title="Delete Service"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="mt-5 h-full w-full px-4">
      {/* Header with Add Button */}
      <div className="mb-5 flex items-center justify-end">
        {/* <h1 className="text-2xl font-bold text-gray-900">Service Types</h1> */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
        >
          <FaPlus className="text-sm" />
          Add Project
        </button>
      </div>

      <DataTable
        columns={columns}
        data={paginatedServices}
        rowKey="_id"
        emptyMessage="No service types found"
        startIndex={startIndex}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Project Type"
        message={`Are you sure you want to delete "${selectedService?.name}" service? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
        onConfirm={confirmDeleteService}
      />

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProject}
        addToast={addToast}
      />

      {/* Edit Project Modal */}
      <AddProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditData(null)
          setSelectedService(null)
        }}
        onSubmit={handleEditProject}
        editData={editData}
        addToast={addToast}
      />
    </div>
  )
}

export default Projects
