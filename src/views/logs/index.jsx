import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { HiChevronDown } from 'react-icons/hi'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'
import DataTable from '../../components/DataTable'

const Logs = () => {
  const [logs, setLogs] = useState([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [logEvents, setLogEvents] = useState([])
  const [selectedLogEvent, setSelectedLogEvent] = useState('')
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  // Fetch log events for dropdown
  useEffect(() => {
    const fetchLogEvents = async () => {
      try {
        const response = await apiCall('get', config.GET_LOGS_EVENTS_FILTER)
        if (response.status === 200 && response.data) {
          const responseData = response.data
          if (responseData?.type?.status_code === 200 && responseData?.data) {
            setLogEvents(responseData.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch log events:', error)
      }
    }
    fetchLogEvents()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const fetchLogs = async () => {
        showSpinner()
        try {
          let url = `${config.GET_ALL_LOGS}?page=${currentPage}&limit=${itemsPerPage}`
          if (searchTerm) {
            url += `&search=${encodeURIComponent(searchTerm)}`
          }
          if (selectedLogEvent) {
            url += `&events=${encodeURIComponent(selectedLogEvent)}`
          }

          const response = await apiCall('get', url)
          if (response.status === 200 && response.data?.data) {
            setLogs(response.data.data || [])
            setTotalLogs(
              response.data.totalCount || response.data.data.length || 0
            )
          }
        } catch (error) {
          console.error('Error fetching logs:', error)
          addToast({
            type: 'error',
            title: 'Error',
            description: error?.message || 'Failed to fetch logs',
            duration: 4000,
          })
        } finally {
          hideSpinner()
        }
      }

      fetchLogs()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [currentPage, itemsPerPage, searchTerm, selectedLogEvent])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  // Get event type color
  const getEventColorScheme = (event) => {
    switch (event?.toLowerCase()) {
      case 'login':
        return 'bg-green-100 text-green-800'
      case 'logout':
        return 'bg-red-100 text-red-800'
      case 'generatevideo':
        return 'bg-blue-100 text-blue-800'
      case 'generateimage':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(totalLogs / itemsPerPage)
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
      key: 'Name',
      label: 'User',
      width: '150px',
      render: (row) => {
        const userName = row?.Name?.Name || 'Unknown User'
        return (
          <span className="text-base text-gray-900">
            {userName.charAt(0).toUpperCase() + userName.slice(1)}
          </span>
        )
      },
    },
    {
      key: 'Email',
      label: 'Email',
      width: '180px',
      render: (row) => (
        <span className="text-base text-gray-900">
          {row?.Email?.email || 'No email'}
        </span>
      ),
    },
    {
      key: 'EvenType',
      label: 'Event Type',
      width: '120px',
      render: (row) => {
        const eventType = row?.EvenType?.event || 'Unknown'
        const colorClass = getEventColorScheme(eventType)
        return (
          <span
            className={`inline-block rounded-md px-2 py-1 text-base ${colorClass}`}
          >
            {eventType}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Date & Time',
      width: '180px',
      render: (row) => (
        <span className="text-base text-gray-600">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
  ]

  return (
    <div className="mt-5 h-full w-full px-4">
      {/* Search and Filter Section */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or event type..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-base focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-opacity-50"
          />
        </div>

        {/* Event Type Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedLogEvent}
            onChange={(e) => {
              setSelectedLogEvent(e.target.value)
              setCurrentPage(1) // Reset to first page when filtering
            }}
            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-base font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo"
          >
            <option value="">All Events</option>
            {logEvents.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <HiChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={logs}
        rowKey="_id"
        emptyMessage="No logs found"
        startIndex={startIndex}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalLogs}
      />
    </div>
  )
}

export default Logs
