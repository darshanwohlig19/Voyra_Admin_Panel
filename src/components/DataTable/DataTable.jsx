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
} from '@chakra-ui/react'

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
 */
const DataTable = ({
  columns = [],
  data = [],
  headerColor = '#716CF1',
  showSerialNumber = true,
  emptyMessage = 'No data available',
  rowKey = '_id',
}) => {
  return (
    <Box bg="white" borderRadius="lg" shadow="md" overflow="hidden">
      <TableRoot variant="simple" size="lg">
        <Table.Root>
          <TableHeader>
            <TableRow style={{ backgroundColor: headerColor }}>
              {showSerialNumber && (
                <TableColumnHeader
                  color="white"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: headerColor }}
                  width="80px"
                >
                  Sr No
                </TableColumnHeader>
              )}
              {columns.map((column) => (
                <TableColumnHeader
                  key={column.key}
                  color="white"
                  textAlign={column.align || 'center'}
                  textTransform="uppercase"
                  fontWeight="semibold"
                  style={{ backgroundColor: headerColor }}
                  width={column.width}
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
                    <TableCell textAlign="center" width="80px">
                      {index + 1}
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.key]
                    return (
                      <TableCell
                        key={column.key}
                        textAlign={column.align || 'center'}
                        width={column.width}
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
    </Box>
  )
}

export default DataTable
