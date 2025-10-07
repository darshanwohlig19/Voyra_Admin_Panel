import React, { useState, useEffect } from 'react'
import { Box, Badge } from '@chakra-ui/react'
import { FaEye, FaTrash } from 'react-icons/fa' // FontAwesome icons
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useLocation } from 'react-router-dom'
import RoutesComponent from '../../routes'
import DataTable from '../../components/DataTable'

const Organisations = () => {
  const [organisations, setOrganisations] = useState([])
  const [pageTitle, setPageTitle] = useState('Organisations')
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
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
    const fetchOrganisations = async () => {
      showSpinner()
      try {
        const response = await apiCall('get', config.GET_ORGANISATIONS)
        if (response.status === 200 && response.data.data) {
          setOrganisations(response.data.data.orgs)
        }
      } catch (error) {
        console.error('Error fetching organisations:', error)
      } finally {
        hideSpinner()
      }
    }

    fetchOrganisations()
  }, [])

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
    console.log('Edit organisation:', org)
    // Add your edit logic here
  }

  const handleDelete = (org) => {
    console.log('Delete organisation:', org)
    // Add your delete logic here
  }

  const handleView = (org) => {
    console.log('View organisation:', org)
    // Add your view logic here
  }

  // Define table columns configuration
  const columns = [
    {
      key: 'orgName',
      label: 'Organisation Name',
      width: '200px',
    },
    {
      key: 'planId',
      label: 'Plan',
      width: '150px',
      render: (_, value) => (
        <Badge
          colorPalette="purple"
          px={2}
          py={1}
          borderRadius="md"
          style={{ textTransform: 'capitalize' }}
        >
          {value}
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
      label: 'Created At',
      width: '150px',
      render: (_, value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
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
            bg="blue.50"
            color="blue.600"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              bg: 'blue.100',
              transform: 'translateY(-2px)',
              shadow: 'md',
            }}
            onClick={() => handleView(row)}
            title="View"
          >
            <FaEye size={16} />
          </Box>
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
            onClick={() => handleDelete(row)}
            title="Delete"
          >
            <FaTrash size={14} />
          </Box>
        </Box>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={organisations}
      rowKey="_id"
      emptyMessage="No organisations found"
    />
  )
}

export default Organisations
