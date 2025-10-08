import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Badge, Heading, Button, Flex } from '@chakra-ui/react'
import { FaArrowLeft, FaEye, FaTrash, FaEdit } from 'react-icons/fa'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import DataTable from '../../components/DataTable'

const OrganizationDetail = () => {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const [organization, setOrganization] = useState(null)
  const [users, setUsers] = useState([])
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      showSpinner()
      try {
        // Fetch organization details
        // TODO: Replace with your actual API endpoint for getting single organization
        const orgResponse = await apiCall(
          'get',
          `${config.GET_ORGANIZATIONS}/${orgId}`
        )
        if (orgResponse.status === 200 && orgResponse.data.data) {
          setOrganization(orgResponse.data.data)
        }

        // Fetch users for this organization
        // TODO: Replace with your actual API endpoint for getting organization users
        const usersResponse = await apiCall(
          'get',
          `${config.GET_ORG_USERS}/${orgId}/getOrgUsers`
        )
        if (usersResponse.status === 200 && usersResponse.data.data) {
          setUsers(usersResponse.data.data.users || [])
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
  }, [orgId])

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

  const handleViewUser = (user) => {
    console.log('View user:', user)
    // Add your view user logic here
  }

  const handleEditUser = (user) => {
    console.log('Edit user:', user)
    // Add your edit user logic here
  }

  const handleDeleteUser = (user) => {
    console.log('Delete user:', user)
    // Add your delete user logic here
  }

  const handleBack = () => {
    navigate('/organizations')
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
          colorPalette="blue"
          px={2}
          py={1}
          borderRadius="md"
          style={{ textTransform: 'capitalize' }}
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
      <Flex
        mb={6}
        p={4}
        bg="white"
        borderRadius="lg"
        shadow="sm"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap={4}>
          <Button
            onClick={handleBack}
            leftIcon={<FaArrowLeft />}
            colorPalette="purple"
            variant="ghost"
            size="md"
          >
            Back
          </Button>
          <Box>
            <Heading size="lg" mb={1}>
              {organization?.orgName || 'Organization Details'}
            </Heading>
            <Flex gap={3} alignItems="center">
              <Badge colorPalette="purple" px={2} py={1}>
                Plan: {organization?.planId || 'N/A'}
              </Badge>
              <Badge
                colorPalette={getStatusColor(organization?.status)}
                px={2}
                py={1}
              >
                {organization?.status || 'N/A'}
              </Badge>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        rowKey="_id"
        emptyMessage="No users found for this organization"
      />
    </Box>
  )
}

export default OrganizationDetail
