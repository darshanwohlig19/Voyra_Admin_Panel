import React from 'react'
import { Flex, Button, Text, IconButton } from '@chakra-ui/react'
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from 'react-icons/fa'

/**
 * Reusable Pagination Component
 * @param {number} currentPage - Current active page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback function when page changes
 * @param {number} itemsPerPage - Number of items per page
 * @param {number} totalItems - Total number of items
 */
const Pagination = ({
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
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(currentPage - 1, 2)
      const end = Math.min(currentPage + 1, totalPages - 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalItems === 0) {
    return null // Don't show pagination if there's no data
  }

  return (
    <Flex
      mt={6}
      justify="space-between"
      align="center"
      wrap="wrap"
      gap={4}
      px={2}
    >
      {/* Items count info */}
      <Text color="gray.600" fontSize="sm">
        Showing {startItem} to {endItem} of {totalItems} entries
      </Text>

      {/* Pagination controls */}
      <Flex align="center" gap={1}>
        {/* First page button */}
        <IconButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          variant="ghost"
          colorPalette="purple"
          size="sm"
          _disabled={{
            opacity: 0.4,
            cursor: 'not-allowed',
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
          colorPalette="purple"
          size="sm"
          _disabled={{
            opacity: 0.4,
            cursor: 'not-allowed',
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
              variant={currentPage === page ? 'solid' : 'ghost'}
              colorPalette="purple"
              size="sm"
              minW="40px"
              _hover={{
                bg: currentPage === page ? 'purple.600' : 'purple.50',
              }}
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
          colorPalette="purple"
          size="sm"
          _disabled={{
            opacity: 0.4,
            cursor: 'not-allowed',
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
          colorPalette="purple"
          size="sm"
          _disabled={{
            opacity: 0.4,
            cursor: 'not-allowed',
          }}
          title="Last page"
        >
          <FaAngleDoubleRight />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default Pagination
