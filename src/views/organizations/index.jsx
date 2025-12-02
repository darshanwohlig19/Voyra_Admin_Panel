import React, { useState, useEffect } from 'react'
import { FaEye, FaTrash, FaBan, FaEdit, FaSearch } from 'react-icons/fa' // FontAwesome icons
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'
import { useLocation, useNavigate } from 'react-router-dom'
import RoutesComponent from '../../routes'
import DataTable from '../../components/DataTable'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import EditPlanModal from '../../components/organization/EditPlanModal'

const Organizations = () => {
  const [organizations, setOrganizations] = useState([])
  const [totalOrganizations, setTotalOrganizations] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [pageTitle, setPageTitle] = useState('Organizations')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()
  const location = useLocation()
  const navigate = useNavigate()
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
    const debounceTimer = setTimeout(() => {
      const fetchOrganizations = async () => {
        showSpinner()
        try {
          let url = `${config.GET_ORGANIZATIONS}?page=${currentPage}&limit=${itemsPerPage}`
          if (searchTerm) {
            url += `&search=${encodeURIComponent(searchTerm)}`
          }

          const response = await apiCall('get', url)
          if (response.status === 200 && response.data.data) {
            setOrganizations(response.data.data.orgs || [])
            setTotalOrganizations(
              response.data.data.totalCount ||
                response.data.data.orgs?.length ||
                0
            )
          }
        } catch (error) {
          console.error('Error fetching organizations:', error)
        } finally {
          hideSpinner()
        }
      }

      fetchOrganizations()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [currentPage, itemsPerPage, searchTerm])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'red'
      case 'blocked':
        return 'red'
      case 'pending':
        return 'orange'
      default:
        return 'gray'
    }
  }

  const handleEdit = (org) => {
    setSelectedOrg(org)
    setIsEditModalOpen(true)
  }

  const handleDelete = (org) => {
    setSelectedOrg(org)
    setIsDeleteModalOpen(true)
  }

  const handleView = (org) => {
    navigate(`/organizations/${org._id}`)
  }

  const handleBlock = (org) => {
    setSelectedOrg(org)
    setIsBlockModalOpen(true)
  }

  const handleUnblock = (org) => {
    setSelectedOrg(org)
    setIsUnblockModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedOrg(null)
  }

  const confirmDeleteOrganization = async () => {
    if (!selectedOrg) return

    showSpinner()
    try {
      // Call API to delete organization
      const response = await apiCall(
        'delete',
        `${config.DELETE_ORGANIZATION}/${selectedOrg._id}`
      )

      if (response.status === 200 || response.status === 204) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Organization "${selectedOrg.username}" deleted successfully`,
          duration: 3000,
        })

        // Refresh organizations list after successful delete
        let fetchUrl = `${config.GET_ORGANIZATIONS}?page=${currentPage}&limit=${itemsPerPage}`
        if (searchTerm) {
          fetchUrl += `&search=${encodeURIComponent(searchTerm)}`
        }
        const fetchResponse = await apiCall('get', fetchUrl)
        if (fetchResponse.status === 200 && fetchResponse.data.data) {
          setOrganizations(fetchResponse.data.data.orgs || [])
          setTotalOrganizations(
            fetchResponse.data.data.totalCount ||
              fetchResponse.data.data.orgs?.length ||
              0
          )
        }

        // Close modal
        closeDeleteModal()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to delete organization',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting organization:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to delete organization',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const closeBlockModal = () => {
    setIsBlockModalOpen(false)
    setSelectedOrg(null)
  }

  const confirmBlockOrganization = async () => {
    if (!selectedOrg) return

    showSpinner()
    try {
      // Call API to change organization status (block/unblock)
      const response = await apiCall(
        'put',
        `${config.CHANGE_ORGANIZATION_STATUS}/${selectedOrg._id}`
      )

      if (response.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Organization "${selectedOrg.username}" status changed successfully`,
          duration: 3000,
        })

        // Refresh organizations list after successful block
        let fetchUrl = `${config.GET_ORGANIZATIONS}?page=${currentPage}&limit=${itemsPerPage}`
        if (searchTerm) {
          fetchUrl += `&search=${encodeURIComponent(searchTerm)}`
        }
        const fetchResponse = await apiCall('get', fetchUrl)
        if (fetchResponse.status === 200 && fetchResponse.data.data) {
          setOrganizations(fetchResponse.data.data.orgs || [])
          setTotalOrganizations(
            fetchResponse.data.data.totalCount ||
              fetchResponse.data.data.orgs?.length ||
              0
          )
        }

        // Close modal
        closeBlockModal()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to change organization status',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error changing organization status:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to change organization status',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const closeUnblockModal = () => {
    setIsUnblockModalOpen(false)
    setSelectedOrg(null)
  }

  const confirmUnblockOrganization = async () => {
    if (!selectedOrg) return

    showSpinner()
    try {
      // Call API to change organization status (block/unblock)
      const response = await apiCall(
        'put',
        `${config.CHANGE_ORGANIZATION_STATUS}/${selectedOrg._id}`
      )

      if (response.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Organization "${selectedOrg.username}" unblocked successfully`,
          duration: 3000,
        })

        // Refresh organizations list after successful unblock
        let fetchUrl = `${config.GET_ORGANIZATIONS}?page=${currentPage}&limit=${itemsPerPage}`
        if (searchTerm) {
          fetchUrl += `&search=${encodeURIComponent(searchTerm)}`
        }
        const fetchResponse = await apiCall('get', fetchUrl)
        if (fetchResponse.status === 200 && fetchResponse.data.data) {
          setOrganizations(fetchResponse.data.data.orgs || [])
          setTotalOrganizations(
            fetchResponse.data.data.totalCount ||
              fetchResponse.data.data.orgs?.length ||
              0
          )
        }

        // Close modal
        closeUnblockModal()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to unblock organization',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error unblocking organization:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to unblock organization',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedOrg(null)
  }

  const handleSavePlan = async (formData) => {
    showSpinner()
    try {
      // Prepare request body
      const requestBody = {
        orgName: formData.orgName,
        planId: formData.plan,
      }

      // Add credits if provided
      if (
        formData.credits !== '' &&
        formData.credits !== null &&
        formData.credits !== undefined
      ) {
        requestBody.credits = {
          monthlyBalance: formData.credits,
        }
      }

      // Call API to update organization
      const response = await apiCall(
        'put',
        `${config.UPDATE_ORGANIZATION}/${formData.organizationId}`,
        requestBody
      )

      if (response.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Organization updated successfully',
          duration: 3000,
        })

        // Refresh organizations list
        let fetchUrl = `${config.GET_ORGANIZATIONS}?page=${currentPage}&limit=${itemsPerPage}`
        if (searchTerm) {
          fetchUrl += `&search=${encodeURIComponent(searchTerm)}`
        }
        const fetchResponse = await apiCall('get', fetchUrl)
        if (fetchResponse.status === 200 && fetchResponse.data.data) {
          setOrganizations(fetchResponse.data.data.orgs || [])
          setTotalOrganizations(
            fetchResponse.data.data.totalCount ||
              fetchResponse.data.data.orgs?.length ||
              0
          )
        }

        // Close modal
        closeEditModal()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to update organization',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error updating organization:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to update organization',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(totalOrganizations / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Define table columns configuration
  const columns = [
    {
      key: 'username',
      label: 'Username',
      width: '150px',
      render: (_, value) => {
        if (!value) return 'N/A'
        return value.charAt(0).toUpperCase() + value.slice(1)
      },
    },
    {
      key: 'email',
      label: 'Email',
      width: '150px',
      render: (_, value) => (
        <span className="text-base text-gray-900">{value || 'N/A'}</span>
      ),
    },

    {
      key: 'planId',
      label: 'Plan',
      width: '80px',
      render: (_, value) => (
        <span className="inline-block rounded-md bg-gray-100 px-2 py-1 text-base capitalize text-gray-800">
          {value}
        </span>
      ),
    },
    {
      key: 'credits',
      label: 'Monthly Balance',
      width: '120px',
      render: (row) => (
        <span className="inline-block rounded-md bg-blue-50 px-2 py-1 text-base font-medium text-blue-800">
          {row?.credits?.monthlyBalance || 0}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '80px',
      render: (_, value) => {
        const colorMap = {
          green: 'bg-green-100 text-green-800',
          red: 'bg-red-100 text-red-800',
          orange: 'bg-orange-100 text-orange-800',
          gray: 'bg-gray-100 text-gray-800',
        }
        const colorClass = colorMap[getStatusColor(value)] || colorMap.gray
        return (
          <span
            className={`inline-block rounded-md px-2 py-1 text-base ${colorClass}`}
          >
            {value || 'N/A'}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '130px',
      render: (_, value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'sourceType',
      label: 'Source Type',
      width: '130px',
      render: (_, value) => {
        if (!value) return 'N/A'
        return value.charAt(0).toUpperCase() + value.slice(1)
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '80px',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-indigo text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
            onClick={() => handleView(row)}
            title="View"
          >
            <FaEye size={16} />
          </button>
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
            onClick={() => handleDelete(row)}
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
          {row.status?.toLowerCase() === 'inactive' ||
          row.status?.toLowerCase() === 'blocked' ? (
            <button
              className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-md"
              onClick={() => handleUnblock(row)}
              title="Unblock"
            >
              <FaBan size={14} />
            </button>
          ) : (
            <button
              className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-green-50 text-green-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-100 hover:shadow-md"
              onClick={() => handleBlock(row)}
              title="Block"
            >
              <FaBan size={14} />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="mt-5 h-full w-full px-4">
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" size={16} />
          </div>
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-base focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-opacity-50"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        rowKey="_id"
        emptyMessage="No organizations found"
        startIndex={startIndex}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalOrganizations}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Organization"
        message={`Are you sure you want to delete "${selectedOrg?.username}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
        onConfirm={confirmDeleteOrganization}
      />

      {/* Block Confirmation Modal */}
      <ConfirmationModal
        isOpen={isBlockModalOpen}
        onClose={closeBlockModal}
        title="Block Organization"
        message={`Are you sure you want to block "${selectedOrg?.username}"?`}
        confirmText="Block"
        cancelText="Cancel"
        confirmColorScheme="orange"
        icon="block"
        onConfirm={confirmBlockOrganization}
      />

      {/* Unblock Confirmation Modal */}
      <ConfirmationModal
        isOpen={isUnblockModalOpen}
        onClose={closeUnblockModal}
        title="Unblock Organization"
        message={`Are you sure you want to unblock "${selectedOrg?.username}"?`}
        confirmText="Unblock"
        cancelText="Cancel"
        confirmColorScheme="green"
        icon="unblock"
        onConfirm={confirmUnblockOrganization}
      />

      {/* Edit Plan Modal */}
      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        organization={selectedOrg}
        onSave={handleSavePlan}
      />
    </div>
  )
}

export default Organizations
