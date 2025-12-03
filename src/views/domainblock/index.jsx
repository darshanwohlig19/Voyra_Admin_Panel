import React, { useState, useEffect } from 'react'
import { FaEye, FaTrash, FaBan, FaEdit, FaPlus } from 'react-icons/fa' // FontAwesome icons
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'
import DataTable from '../../components/DataTable'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import AddDomainBlockModal from '../../components/domainblock/AddDomainBlockModal'
import EditDomainBlockModal from '../../components/domainblock/EditDomainBlockModal'

const DomainBlock = () => {
  const [domainBlocks, setDomainBlocks] = useState([])
  const [totalDomainBlocks, setTotalDomainBlocks] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchDomainBlocks()
  }, [currentPage, itemsPerPage])

  const fetchDomainBlocks = async () => {
    showSpinner()
    try {
      const response = await apiCall(
        'get',
        `${config.GET_DOMAIN_CREDIT_BLOCKS}?page=${currentPage}&limit=${itemsPerPage}`
      )
      if (response.status === 200 && response.data.data) {
        setDomainBlocks(response.data.data || [])
        setTotalDomainBlocks(
          response.data.pagination?.totalCount ||
            response.data.data?.length ||
            0
        )
      }
    } catch (error) {
      console.error('Error fetching domain blocks:', error)
      setDomainBlocks([])
      setTotalDomainBlocks(0)
    } finally {
      hideSpinner()
    }
  }

  const handleAdd = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleDelete = (domain) => {
    setSelectedDomain(domain)
    setIsDeleteModalOpen(true)
  }
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedDomain(null)
  }
  const handleEdit = (domain) => {
    setSelectedDomain(domain)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setSelectedDomain(null)
    setIsEditModalOpen(false)
  }

  const confirmDeleteDomain = async () => {
    if (!selectedDomain) return

    showSpinner()
    try {
      const response = await apiCall(
        'delete',
        `${config.DELETE_DOMAIN}/${selectedDomain._id}`
      )

      if (response.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Domain "${selectedDomain.domain}" deleted successfully`,
          duration: 3000,
        })

        // Refresh domain blocks list
        await fetchDomainBlocks()

        // Close modal
        closeDeleteModal()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to delete domain',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting domain:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to delete domain',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  const handleSaveDomain = async (formData) => {
    showSpinner()
    try {
      const response = await apiCall(
        'post',
        config.BLOCK_DOMAIN_CREDIT,
        formData
      )

      if (response.status === 200 || response.status === 201) {
        addToast({
          type: 'success',
          title: 'Success',
          description: `Domain "${formData.domain}" credit block ${
            formData.isCreditBlocked ? 'enabled' : 'disabled'
          } successfully`,
          duration: 3000,
        })

        // Refresh domain blocks list
        await fetchDomainBlocks()

        // Close whichever modal is open
        if (isAddModalOpen) closeAddModal()
        if (isEditModalOpen) closeEditModal()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.msg ||
            response?.data?.message ||
            'Failed to update domain credit block',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error updating domain credit block:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to update domain credit block',
        duration: 3000,
      })
    } finally {
      hideSpinner()
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(totalDomainBlocks / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Define table columns configuration
  const columns = [
    {
      key: 'domain',
      label: 'Domain',
      width: '250px',
      render: (_, value) => (
        <span className="text-base font-medium text-gray-900">
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'isCreditBlocked',
      label: 'Credit Blocked',
      width: '120px',
      render: (_, value) => {
        const isBlocked = value === true
        return (
          <span
            className={`inline-block rounded-md px-2 py-1 text-base ${
              isBlocked
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isBlocked ? 'Blocked' : 'Not Blocked'}
          </span>
        )
      },
    },
    {
      key: 'isBlocked',
      label: 'Domain Blocked',
      width: '120px',
      render: (_, value) => {
        const isBlocked = value === true
        return (
          <span
            className={`inline-block rounded-md px-2 py-1 text-base ${
              isBlocked
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isBlocked ? 'Blocked' : 'Not Blocked'}
          </span>
        )
      },
    },
    {
      key: 'isDashboard',
      label: 'Dashboard Page',
      width: '120px',
      render: (_, value) => {
        const isEnabled = value === true
        return (
          <span
            className={`inline-block rounded-md px-2 py-1 text-base ${
              isEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '150px',
      render: (_, value) =>
        value
          ? new Date(value).toLocaleDateString() +
            ' ' +
            new Date(value).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'N/A',
    },
    {
      key: 'blockedAt',
      label: 'Blocked At',
      width: '150px',
      render: (_, value) =>
        value
          ? new Date(value).toLocaleDateString() +
            ' ' +
            new Date(value).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'N/A',
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '80px',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
            onClick={() => handleEdit(row)}
            title="Delete"
          >
            <FaEdit size={14} />
          </button>
          <button
            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
            title="Delete"
            onClick={() => handleDelete(row)}
          >
            <FaTrash size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="mt-5 h-full w-full px-4">
      {/* Add Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAdd}
          className="hover:bg-indigo-700 flex items-center gap-2 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-95"
        >
          <FaPlus size={14} />
          Add Domain
        </button>
      </div>
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={domainBlocks}
        rowKey="_id"
        emptyMessage="No domains found"
        startIndex={startIndex}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalDomainBlocks}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Domain"
        message={`Are you sure you want to delete "${selectedDomain?.domain}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
        onConfirm={confirmDeleteDomain}
      />
      {/* Add Domain Modal */}
      <AddDomainBlockModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleSaveDomain}
      />
      <EditDomainBlockModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveDomain}
        domainBlock={selectedDomain}
      />
    </div>
  )
}

export default DomainBlock
