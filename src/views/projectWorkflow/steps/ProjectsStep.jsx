import React, { useState, useEffect } from 'react'
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'
import ApiCaller from '../../../common/services/apiServices'
import config from '../../../common/config/apiConfig'
import { useSpinner } from '../../../common/SpinnerLoader'
import { useToaster } from '../../../common/Toaster'
import DataTable from '../../../components/DataTable'
import ConfirmationModal from '../../../components/modal/ConfirmationModal'
import AddProjectModal from '../../../components/projects/AddProjectModal'

const ProjectsStep = ({
  selectedProject,
  onProjectSelect,
  onProjectCreated,
}) => {
  const [services, setServices] = useState([])
  const [organizationId, setOrganizationId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [editData, setEditData] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState({})
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchServiceTypes()
  }, [])

  const fetchServiceTypes = async () => {
    showSpinner()
    try {
      const response = await apiCall('get', config.GET_SERVICE_TYPES)

      if (response.status === 204) {
        setServices([])
        addToast({
          type: 'info',
          title: 'No Data',
          description: 'No service types found for your organization',
          duration: 3000,
        })
      } else if (response.status === 200 && response.data) {
        const responseData = response.data.data || response.data
        const isSuccessful =
          response.data.status_code === 200 || response.data.success === true

        if (isSuccessful && responseData) {
          let data = responseData
          if (Array.isArray(responseData) && responseData.length > 0) {
            data = responseData[0]
          }

          if (data && data.projects) {
            setOrganizationId(data.organizationId)

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

  const handleOpenStatusModal = (project) => {
    setSelectedService(project)
    setIsStatusModalOpen(true)
  }

  const closeStatusModal = () => {
    setIsStatusModalOpen(false)
    setSelectedService(null)
  }

  const confirmToggleStatus = async () => {
    if (!selectedService) return

    showSpinner()
    try {
      const newStatus =
        selectedService.status === 'Active' ? 'Inactive' : 'Active'

      const response = await apiCall(
        'put',
        `${config.UPDATE_PROJECT_STATUS}?projectId=${selectedService._id}&status=${newStatus}`
      )

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Project "${selectedService.name}" status updated to ${newStatus} successfully`,
          duration: 3000,
        })

        await fetchServiceTypes()
        closeStatusModal()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            `Failed to update project status to ${newStatus}`,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error updating project status:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to update project status',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleEdit = (project) => {
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

      const formData = new FormData()
      formData.append('projectName', serviceType)
      formData.append('metadata', JSON.stringify(metaData))

      const response = await apiCall('post', config.ADD_SERVICE_TYPE, formData)

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Service "${serviceType}" added successfully`,
          duration: 3000,
        })

        await fetchServiceTypes()
        setIsAddModalOpen(false)

        // Notify parent that a project was created
        if (onProjectCreated) {
          onProjectCreated()
        }

        // Auto-select the newly created project
        if (onProjectSelect) {
          onProjectSelect(serviceType)
        }
      } else {
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

        addToast({
          type: 'error',
          title: 'Error',
          description: errorMessage,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error adding service:', error)

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

      let oldFieldKeys = []
      if (
        selectedService &&
        selectedService.schema &&
        selectedService.schema[serviceType]
      ) {
        oldFieldKeys = Object.keys(selectedService.schema[serviceType])
      }

      const newFieldKeys = Object.keys(metaData)

      const removedFields = oldFieldKeys.filter(
        (key) => !newFieldKeys.includes(key)
      )

      const completeMetaData = { ...metaData }
      removedFields.forEach((field) => {
        completeMetaData[field] = []
      })

      const formData = new FormData()
      formData.append('projectName', serviceType)
      formData.append('metadata', JSON.stringify(completeMetaData))

      if (selectedService && selectedService._id) {
        formData.append('serviceId', selectedService._id)
      }

      const response = await apiCall('post', config.ADD_SERVICE_TYPE, formData)

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Project "${serviceType}" updated successfully`,
          duration: 3000,
        })

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

        addToast({
          type: 'error',
          title: 'Error',
          description: errorMessage,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error updating service:', error)

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
      render: (row, value) => (
        <span
          className={`text-base font-semibold capitalize ${
            selectedProject === value ? 'text-indigo' : 'text-gray-900'
          }`}
        >
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Categories',
      width: '180px',
      render: (row, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return <span className="text-sm text-gray-500">N/A</span>
        }

        const categories = value.map((cat) => cat.name).filter(Boolean)

        if (categories.length === 0) {
          return <span className="text-sm text-gray-500">N/A</span>
        }

        const selectedCategory = selectedCategories[row._id] || categories[0]

        return (
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategories({
                ...selectedCategories,
                [row._id]: e.target.value,
              })
            }}
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
      render: (row, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return <span className="text-sm text-gray-500">N/A</span>
        }

        const categories = value.map((cat) => cat.name).filter(Boolean)
        const selectedCategory = selectedCategories[row._id] || categories[0]

        const selectedCategoryObj = value.find(
          (cat) => cat.name === selectedCategory
        )

        const subcategories = []
        if (
          selectedCategoryObj &&
          selectedCategoryObj.subcategory &&
          Array.isArray(selectedCategoryObj.subcategory)
        ) {
          selectedCategoryObj.subcategory.forEach((sub) => {
            if (sub.name) {
              subcategories.push(sub.name)
            }
          })
        }

        if (subcategories.length === 0) {
          return <span className="text-sm text-gray-500">No subcategories</span>
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
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (_, value) => (
        <span
          className={`inline-block rounded-md px-3 py-1 text-sm font-medium ${
            value === 'Active' || !value
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value === 'Active' || !value ? 'Active' : 'Inactive'}
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
      width: '200px',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="hover:bg-bg-indigohover:shadow-md flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-indigo  text-white transition-all duration-200 hover:-translate-y-0.5"
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
          <button
            onClick={() => handleOpenStatusModal(row)}
            className={`relative inline-flex h-[20px] w-[38px] items-center rounded-full transition-colors duration-200 focus:outline-none ${
              row.status === 'Inactive' ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                row.status === 'Inactive'
                  ? 'translate-x-[21px]'
                  : 'translate-x-[3px]'
              }`}
            />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full">
      {/* Header with Add Button */}
      <div className="mb-5  flex items-center justify-between">
        <div className="">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Projects
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your project types
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
        >
          <FaPlus className="text-sm" />
          Add Project
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200"></div>

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

      {/* Status Change Confirmation Modal */}
      <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={closeStatusModal}
        title={
          selectedService?.status === 'Active'
            ? 'Hide Project'
            : 'Unhide Project'
        }
        message={`Are you sure you want to ${
          selectedService?.status === 'Active' ? 'hide' : 'unhide'
        } "${selectedService?.name}" project?`}
        confirmText={selectedService?.status === 'Active' ? 'Hide' : 'Unhide'}
        cancelText="Cancel"
        confirmColorScheme={
          selectedService?.status === 'Active' ? 'orange' : 'green'
        }
        icon={selectedService?.status === 'Active' ? 'warning' : 'info'}
        onConfirm={confirmToggleStatus}
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

export default ProjectsStep
