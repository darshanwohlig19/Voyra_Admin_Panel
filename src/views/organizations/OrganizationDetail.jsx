import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import DataTable from '../../components/DataTable'

const OrganizationDetail = () => {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const [organization, setOrganization] = useState(null)
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      showSpinner()
      try {
        // Fetch all organizations and find the specific one
        const orgResponse = await apiCall('get', config.GET_ORGANIZATIONS)
        if (orgResponse.status === 200 && orgResponse.data.data) {
          const org = orgResponse.data.data.orgs.find((o) => o._id === orgId)
          if (org) {
            setOrganization(org)
          }
        }

        // Fetch users for this organization with pagination
        const usersResponse = await apiCall(
          'get',
          `${config.GET_ORG_USERS}/${orgId}/getOrgUsers?page=${currentPage}&limit=${itemsPerPage}`
        )
        if (usersResponse.status === 200 && usersResponse.data.data) {
          setUsers(usersResponse.data.data.users || [])
          setTotalUsers(usersResponse.data.data.totalCount || 0)
        }
      } catch (error) {
        console.error('Error fetching organization details:', error)
      } finally {
        hideSpinner()
      }
    }

    if (orgId) {
      fetchOrganizationDetails()
    }
  }, [orgId, currentPage, itemsPerPage])

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

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user)
    // Add your delete user logic here
  }

  const handleBack = () => {
    navigate('/organizations')
  }

  // Pagination logic
  const totalPages = Math.ceil(totalUsers / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Define user table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'User Name',
      width: '200px',
    },
    {
      key: 'email',
      label: 'Email',
      width: '250px',
    },
    {
      key: 'role',
      label: 'Role',
      width: '150px',
      render: (_, value) => (
        <span className="inline-block rounded-md bg-gray-100 px-2 py-1 text-base capitalize text-gray-800">
          {value || 'User'}
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
      label: 'Joined Date',
      width: '150px',
      render: (_, value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '180px',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
            onClick={() => handleDeleteUser(row)}
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="mt-5 h-full w-full px-4">
      {/* Header Section */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-base text-gray-800 transition-all duration-200 hover:-translate-x-1 hover:shadow-md"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-[18px] font-bold text-gray-800">
          {organization?.orgName || 'Organization Details'}
        </h1>
      </div>

      {/* Users Table with Pagination */}
      <DataTable
        columns={columns}
        data={users}
        rowKey="_id"
        emptyMessage="No users found for this organization"
        startIndex={startIndex}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalUsers}
      />
    </div>
  )
}

export default OrganizationDetail
