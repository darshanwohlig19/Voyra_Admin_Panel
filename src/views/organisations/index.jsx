import React, { useState, useEffect } from 'react'
import {
  Table,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumnHeader,
  Box,
  Badge,
} from '@chakra-ui/react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa' // FontAwesome icons
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useLocation } from 'react-router-dom'
import RoutesComponent from '../../routes'

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

  return (
    <Box p={4}>
      {/* <h1 className="mb-4 text-2xl font-bold">{pageTitle}</h1> */}
      <Box bg="white" borderRadius="lg" shadow="md" overflow="hidden">
        <TableRoot variant="simple" size="lg">
          <Table.Root>
            <TableHeader>
              <TableRow style={{ backgroundColor: '#716CF1' }}>
                <TableColumnHeader
                  color="white"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: '#716CF1' }}
                  width="80px"
                >
                  Sr No
                </TableColumnHeader>
                <TableColumnHeader
                  color="white"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: '#716CF1' }}
                >
                  Organisation Name
                </TableColumnHeader>
                <TableColumnHeader
                  color="white"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: '#716CF1' }}
                  width="150px"
                >
                  Plan
                </TableColumnHeader>
                <TableColumnHeader
                  color="white"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: '#716CF1' }}
                  width="120px"
                >
                  Status
                </TableColumnHeader>
                <TableColumnHeader
                  color="white"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: '#716CF1' }}
                  width="150px"
                >
                  Created At
                </TableColumnHeader>
                <TableColumnHeader
                  color="white"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: '#716CF1' }}
                  width="120px"
                >
                  Actions
                </TableColumnHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organisations.map((org, index) => (
                <TableRow key={org._id} _hover={{ bg: 'gray.100' }}>
                  <TableCell textAlign="center" width="80px">
                    {index + 1}
                  </TableCell>
                  <TableCell textAlign="center">{org.orgName}</TableCell>
                  <TableCell textAlign="center" width="150px">
                    <Badge
                      colorPalette="purple"
                      px={2}
                      py={1}
                      borderRadius="md"
                      style={{ textTransform: 'capitalize' }}
                    >
                      {org.planId}
                    </Badge>
                  </TableCell>
                  <TableCell textAlign="center" width="120px">
                    <Badge
                      colorPalette={getStatusColor(org.status)}
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {org.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell textAlign="center" width="150px">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell textAlign="center" width="120px">
                    <Box
                      display="flex"
                      gap={3}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <FaEye
                        size={18}
                        style={{ cursor: 'pointer', color: '#3182ce' }}
                        onClick={() => handleView(org)}
                        title="View"
                      />
                      {/* <FaEdit
                        size={18}
                        style={{ cursor: 'pointer', color: '#38a169' }}
                        onClick={() => handleEdit(org)}
                        title="Edit"
                      /> */}
                      <FaTrash
                        size={18}
                        style={{ cursor: 'pointer', color: '#e53e3e' }}
                        onClick={() => handleDelete(org)}
                        title="Delete"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table.Root>
        </TableRoot>
      </Box>
    </Box>
  )
}

export default Organisations
