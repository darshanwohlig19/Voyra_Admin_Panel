import React, { useState, useEffect } from 'react'
import { FaEye, FaTrash, FaBan } from 'react-icons/fa' // FontAwesome icons
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useLocation, useNavigate } from 'react-router-dom'
import RoutesComponent from '../../routes'
import DataTable from '../../components/DataTable'
import ConfirmationModal from '../../components/modal/ConfirmationModal'

const Organizations = () => {
  const [organizations, setOrganizations] = useState([])
  const [totalOrganizations, setTotalOrganizations] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [pageTitle, setPageTitle] = useState('Organizations')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
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
    const fetchOrganizations = async () => {
      showSpinner()
      try {
        const response = await apiCall(
          'get',
          `${config.GET_ORGANIZATIONS}?page=${currentPage}&limit=${itemsPerPage}`
        )
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
  }, [currentPage, itemsPerPage])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'red'
      case 'pending':
        return 'orange'
      default:
        return 'gray'
    }
  }

  const handleEdit = (org) => {
    console.log('Edit organization:', org)
    // Add your edit logic here
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

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedOrg(null)
  }

  const closeBlockModal = () => {
    setIsBlockModalOpen(false)
    setSelectedOrg(null)
  }

  // Pagination logic
  const totalPages = Math.ceil(totalOrganizations / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Define table columns configuration
  const columns = [
    {
      key: 'orgName',
      label: 'Organization Name',
      width: '200px',
    },
    {
      key: 'planId',
      label: 'Plan',
      width: '150px',
      render: (_, value) => (
        <span className="inline-block rounded-md bg-gray-100 px-2 py-1 text-base capitalize text-gray-800">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
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
      width: '150px',
      render: (_, value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
            onClick={() => handleView(row)}
            title="View"
          >
            <FaEye size={16} />
          </button>
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
            onClick={() => handleDelete(row)}
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-md"
            onClick={() => handleBlock(row)}
            title="Block"
          >
            <FaBan size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="mt-5 h-full w-full px-4">
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
        message={`Are you sure you want to delete "${selectedOrg?.orgName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />

      {/* Block Confirmation Modal */}
      <ConfirmationModal
        isOpen={isBlockModalOpen}
        onClose={closeBlockModal}
        title="Block Organization"
        message={`Are you sure you want to block "${selectedOrg?.orgName}"?`}
        confirmText="Block"
        cancelText="Cancel"
        confirmColorScheme="orange"
        icon="block"
      />
    </div>
  )
}

export default Organizations
