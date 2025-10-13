import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Badge, Heading, Flex, IconButton } from '@chakra-ui/react'
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
        <Badge
          colorPalette="gray"
          px={2}
          py={1}
          borderRadius="md"
          style={{ textTransform: 'capitalize', fontSize: '16px' }}
        >
          {value || 'User'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (_, value) => (
        <Badge
          colorPalette={getStatusColor(value)}
          px={2}
          py={1}
          borderRadius="md"
          style={{ fontSize: '16px' }}
        >
          {value || 'N/A'}
        </Badge>
      ),
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
        <Box display="flex" gap={2} justifyContent="center" alignItems="center">
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="35px"
            h="35px"
            borderRadius="lg"
            bg="red.50"
            color="red.600"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              bg: 'red.100',
              transform: 'translateY(-2px)',
              shadow: 'md',
            }}
            onClick={() => handleDeleteUser(row)}
            title="Delete"
          >
            <FaTrash size={14} />
          </Box>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      {/* Header Section */}
      <Flex mb={6} alignItems="center" gap={4}>
        <IconButton
          onClick={handleBack}
          colorPalette="purple"
          variant="outline"
          size="xl"
          borderRadius="lg"
          _hover={{ transform: 'translateX(-4px)', shadow: 'md' }}
          transition="all 0.2s"
          fontSize="24px"
        >
          <FaArrowLeft />
        </IconButton>
        <Heading size="4xl" color="gray.800" fontWeight="bold">
          {organization?.orgName || 'Organization Details'}
        </Heading>
      </Flex>

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
    </Box>
  )
}

export default OrganizationDetail
