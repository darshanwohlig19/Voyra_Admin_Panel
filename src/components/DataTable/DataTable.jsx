import React from 'react'
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
  Flex,
  Button,
  Text,
  IconButton,
} from '@chakra-ui/react'
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from 'react-icons/fa'

/**
 * Dynamic DataTable Component
 * @param {Array} columns - Array of column definitions with structure:
 *   [{
 *     key: string,           // Unique identifier for the column
 *     label: string,         // Display label for column header
 *     width?: string,        // Optional width (e.g., '80px', '150px')
 *     render?: function,     // Optional custom render function (row, value) => JSX
 *     align?: string,        // Text alignment: 'left', 'center', 'right' (default: 'center')
 *   }]
 * @param {Array} data - Array of data objects to display
 * @param {string} headerColor - Header background color (default: '#716CF1')
 * @param {boolean} showSerialNumber - Show serial number column (default: true)
 * @param {string} emptyMessage - Message to show when no data (default: 'No data available')
 * @param {number} startIndex - Starting index for serial numbers (for pagination support)
 * @param {boolean} showPagination - Show pagination controls (default: false)
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback for page change
 * @param {number} itemsPerPage - Items per page
 * @param {number} totalItems - Total number of items
 */
const DataTable = ({
  columns = [],
  data = [],
  headerColor = '#E5E4E2',
  showSerialNumber = true,
  emptyMessage = 'No data available',
  rowKey = '_id',
  startIndex = 0,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
}) => {
  // Function to generate page numbers with ellipsis
  const generatePageNumbers = () => {
    let pages = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) {
        pages.push('...')
      }
      const start = Math.max(currentPage - 1, 2)
      const end = Math.min(currentPage + 1, totalPages - 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  return (
    <Box bg="white" borderRadius="lg" shadow="md" overflow="hidden">
      <TableRoot variant="simple" size="lg">
        <Table.Root>
          <TableHeader>
            <TableRow style={{ backgroundColor: headerColor }}>
              {showSerialNumber && (
                <TableColumnHeader
                  color="black"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: headerColor }}
                  width="80px"
                  fontSize="16px"
                >
                  Sr No
                </TableColumnHeader>
              )}
              {columns.map((column) => (
                <TableColumnHeader
                  key={column.key}
                  color="black"
                  textAlign={column.align || 'center'}
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: headerColor }}
                  width={column.width}
                  fontSize="16px"
                >
                  {column.label}
                </TableColumnHeader>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showSerialNumber ? 1 : 0)}
                  textAlign="center"
                  py={8}
                  color="gray.500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={row[rowKey] || index}
                  _hover={{ bg: 'gray.100' }}
                >
                  {showSerialNumber && (
                    <TableCell textAlign="center" width="80px" fontSize="16px">
                      {startIndex + index + 1}
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.key]
                    return (
                      <TableCell
                        key={column.key}
                        textAlign={column.align || 'center'}
                        width={column.width}
                        fontSize="16px"
                      >
                        {column.render
                          ? column.render(row, value)
                          : value || 'N/A'}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table.Root>
      </TableRoot>

      {/* Pagination Section */}
      {showPagination && totalItems > 0 && (
        <Box
          borderTop="1px solid"
          borderColor="gray.200"
          bg="gray.50"
          px={6}
          py={4}
        >
          <Flex justify="center" align="center">
            {/* Pagination controls */}
            <Flex align="center" gap={1}>
              {/* First page button */}
              <IconButton
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                variant="ghost"
                colorPalette="gray"
                size="sm"
                _disabled={{
                  opacity: 0.4,
                  cursor: 'not-allowed',
                }}
                _hover={{
                  bg: 'gray.100',
                }}
                title="First page"
              >
                <FaAngleDoubleLeft />
              </IconButton>

              {/* Previous page button */}
              <IconButton
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="ghost"
                colorPalette="gray"
                size="sm"
                _disabled={{
                  opacity: 0.4,
                  cursor: 'not-allowed',
                }}
                _hover={{
                  bg: 'gray.100',
                }}
                title="Previous page"
              >
                <FaAngleLeft />
              </IconButton>

              {/* Page number buttons */}
              {generatePageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <Text key={`ellipsis-${index}`} px={2} color="gray.500">
                      ...
                    </Text>
                  )
                }

                return (
                  <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                    variant="ghost"
                    colorPalette="gray"
                    size="sm"
                    minW="40px"
                    bg={currentPage === page ? 'gray.200' : 'transparent'}
                    _hover={{
                      bg: currentPage === page ? 'gray.200' : 'gray.100',
                    }}
                    cursor={currentPage === page ? 'default' : 'pointer'}
                    fontWeight={currentPage === page ? 'bold' : 'normal'}
                  >
                    {page}
                  </Button>
                )
              })}

              {/* Next page button */}
              <IconButton
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                variant="ghost"
                colorPalette="gray"
                size="sm"
                _disabled={{
                  opacity: 0.4,
                  cursor: 'not-allowed',
                }}
                _hover={{
                  bg: 'gray.100',
                }}
                title="Next page"
              >
                <FaAngleRight />
              </IconButton>

              {/* Last page button */}
              <IconButton
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage >= totalPages}
                variant="ghost"
                colorPalette="gray"
                size="sm"
                _disabled={{
                  opacity: 0.4,
                  cursor: 'not-allowed',
                }}
                _hover={{
                  bg: 'gray.100',
                }}
                title="Last page"
              >
                <FaAngleDoubleRight />
              </IconButton>
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  )
}

export default DataTable
