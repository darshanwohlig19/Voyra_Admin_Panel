import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import {
  FaEdit,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaGlobe,
  FaCalendarAlt,
  FaDollarSign,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'
import EditAddressModal from 'components/contact/EditAddressModal'
import AddCountryModal from 'components/contact/AddCountryModal'
import AddBudgetModal from 'components/contact/AddBudgetModal'
import AddEventTypeModal from 'components/contact/AddEventTypeModal'
import ConfirmationModal from 'components/modal/ConfirmationModal'
import { useToaster } from 'common/Toaster'

const Contact = () => {
  const [addressData, setAddressData] = useState(null)
  const [mapUrl, setMapUrl] = useState('')
  const [countries, setCountries] = useState([])
  const [budgets, setBudgets] = useState([])
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddCountryModalOpen, setIsAddCountryModalOpen] = useState(false)
  const [addCountryLoading, setAddCountryLoading] = useState(false)
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false)
  const [addBudgetLoading, setAddBudgetLoading] = useState(false)
  const [isAddEventTypeModalOpen, setIsAddEventTypeModalOpen] = useState(false)
  const [addEventTypeLoading, setAddEventTypeLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    name: '',
    type: '', // 'country', 'budget', or 'eventType'
  })
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false)
  const [editAddressLoading, setEditAddressLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { apiCall } = ApiCaller()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [addressRes, countriesRes, budgetsRes, eventTypesRes] =
        await Promise.all([
          apiCall('get', apiConfig.GET_ADDRESS),
          apiCall('get', apiConfig.GET_COUNTRIES),
          apiCall('get', apiConfig.GET_BUDGETS),
          apiCall('get', apiConfig.GET_EVENT_TYPES),
        ])

      if (addressRes?.data?.code === 2000) {
        setAddressData(addressRes.data.data.address)
        setMapUrl(addressRes.data.data.mapUrl)
      }
      if (countriesRes?.data?.code === 2000) {
        setCountries(countriesRes.data.data)
      }
      if (budgetsRes?.data?.code === 2000) {
        setBudgets(budgetsRes.data.data)
      }
      if (eventTypesRes?.data?.code === 2000) {
        setEventTypes(eventTypesRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddress = async (data) => {
    try {
      setEditAddressLoading(true)
      const response = await apiCall('post', apiConfig.SAVE_ADDRESS, data)
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Address updated successfully',
        })
        setIsEditAddressModalOpen(false)
        fetchAllData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to update address',
        })
      }
    } catch (error) {
      console.error('Error updating address:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating address',
      })
    } finally {
      setEditAddressLoading(false)
    }
  }

  const handleAddCountries = async (data) => {
    try {
      setAddCountryLoading(true)
      const response = await apiCall(
        'post',
        apiConfig.BULK_CREATE_COUNTRIES,
        data
      )
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Countries added successfully',
        })
        setIsAddCountryModalOpen(false)
        fetchAllData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to add countries',
        })
      }
    } catch (error) {
      console.error('Error adding countries:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error adding countries',
      })
    } finally {
      setAddCountryLoading(false)
    }
  }

  const handleDeleteCountry = async () => {
    if (!deleteConfirm.id) return
    try {
      setDeleteLoading(true)
      const response = await apiCall('delete', apiConfig.DELETE_COUNTRY, {
        id: deleteConfirm.id,
      })
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Country deleted successfully',
        })
        setDeleteConfirm({ open: false, id: null, name: '', type: '' })
        fetchAllData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.msg || 'Failed to delete country',
        })
      }
    } catch (error) {
      console.error('Error deleting country:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting country',
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleAddBudgets = async (data) => {
    try {
      setAddBudgetLoading(true)
      const response = await apiCall(
        'post',
        apiConfig.BULK_CREATE_BUDGETS,
        data
      )
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Budget range added successfully',
        })
        setIsAddBudgetModalOpen(false)
        fetchAllData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to add budget range',
        })
      }
    } catch (error) {
      console.error('Error adding budget range:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error adding budget range',
      })
    } finally {
      setAddBudgetLoading(false)
    }
  }

  const handleDeleteBudget = async () => {
    console.log('handleDeleteBudget called, deleteConfirm:', deleteConfirm)
    if (!deleteConfirm.id) {
      console.log('No id found, returning early')
      return
    }
    try {
      setDeleteLoading(true)
      console.log('Calling DELETE API with id:', deleteConfirm.id)
      const response = await apiCall('delete', apiConfig.DELETE_BUDGET, {
        id: deleteConfirm.id,
      })
      console.log('Delete response:', response)
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Budget range deleted successfully',
        })
        setDeleteConfirm({ open: false, id: null, name: '', type: '' })
        fetchAllData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.msg || 'Failed to delete budget range',
        })
      }
    } catch (error) {
      console.error('Error deleting budget range:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting budget range',
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleAddEventTypes = async (data) => {
    try {
      setAddEventTypeLoading(true)
      const response = await apiCall(
        'post',
        apiConfig.BULK_CREATE_EVENT_TYPES,
        data
      )
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Event type added successfully',
        })
        setIsAddEventTypeModalOpen(false)
        fetchAllData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to add event type',
        })
      }
    } catch (error) {
      console.error('Error adding event type:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error adding event type',
      })
    } finally {
      setAddEventTypeLoading(false)
    }
  }

  const handleDeleteEventType = async () => {
    if (!deleteConfirm.id) return
    try {
      setDeleteLoading(true)
      const response = await apiCall('delete', apiConfig.DELETE_EVENT_TYPE, {
        id: deleteConfirm.id,
      })
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Event type deleted successfully',
        })
        setDeleteConfirm({ open: false, id: null, name: '', type: '' })
        fetchAllData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.msg || 'Failed to delete event type',
        })
      }
    } catch (error) {
      console.error('Error deleting event type:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting event type',
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-3 h-full w-full">
        <div className="h-full w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 h-full w-full space-y-6">
      {/* Section 1: Address & Map Settings */}

      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Event Types
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage event type options for the contact form.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddEventTypeModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
            >
              <FaPlus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        <div className="flex flex-wrap gap-3">
          {eventTypes.map((type) => (
            <div
              key={type._id || type.id}
              className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-all hover:border-gray-300 hover:shadow-sm dark:border-navy-600 dark:bg-navy-700"
            >
              <FaCalendarAlt className="h-4 w-4 text-blue-500" />
              <span className="text-navy-700 dark:text-white">{type.name}</span>
              <button
                onClick={() =>
                  setDeleteConfirm({
                    open: true,
                    id: type._id || type.id,
                    name: type.name,
                    type: 'eventType',
                  })
                }
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <FaTrash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {eventTypes.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No event types found.
          </p>
        )}
      </div>

      {/* Section 3: Budget Ranges */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Budget Ranges
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage budget range options for the contact form.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddBudgetModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
            >
              <FaPlus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        <div className="flex flex-wrap gap-3">
          {budgets.map((budget) => (
            <div
              key={budget._id || budget.id}
              className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-all hover:border-gray-300 hover:shadow-sm dark:border-navy-600 dark:bg-navy-700"
            >
              <FaDollarSign className="h-4 w-4 text-green-500" />
              <span className="text-navy-700 dark:text-white">
                {budget.name}
              </span>
              <button
                onClick={() => {
                  setDeleteConfirm({
                    open: true,
                    id: budget._id || budget.id,
                    name: budget.name,
                    type: 'budget',
                  })
                }}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <FaTrash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {budgets.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No budget ranges found.
          </p>
        )}
      </div>

      {/* Section 4: Countries */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Countries
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage country options for the contact form.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddCountryModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
            >
              <FaPlus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        <div className="flex flex-wrap gap-3">
          {countries.map((country) => (
            <div
              key={country._id}
              className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-all hover:border-gray-300 hover:shadow-sm dark:border-navy-600 dark:bg-navy-700"
            >
              <FaGlobe className="h-4 w-4 text-purple-500" />
              <span className="text-navy-700 dark:text-white">
                {country.name}
              </span>
              <button
                onClick={() =>
                  setDeleteConfirm({
                    open: true,
                    id: country._id,
                    name: country.name,
                    type: 'country',
                  })
                }
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <FaTrash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {countries.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No countries found.
          </p>
        )}
      </div>

      {/* Section 2: Event Types */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Address & Map Settings
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage contact address and map location.
            </p>
          </div>
          <button
            onClick={() => setIsEditAddressModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
              Contact Information
            </h3>

            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FaMapMarkerAlt className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Address
                  </p>
                  <p className="text-navy-700 dark:text-white">
                    {addressData?.address}
                  </p>
                </div>
              </div>

              {/* City, State, Country */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <FaBuilding className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    City, State, Country
                  </p>
                  <p className="text-navy-700 dark:text-white">
                    {addressData?.city}, {addressData?.state},{' '}
                    {addressData?.country}
                  </p>
                </div>
              </div>

              {/* Postal Code */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <FaGlobe className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Postal Code
                  </p>
                  <p className="text-navy-700 dark:text-white">
                    {addressData?.postalCode}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <FaPhone className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phone Number
                  </p>
                  <p className="text-navy-700 dark:text-white">
                    {addressData?.phoneNo}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <FaEnvelope className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-navy-700 dark:text-white">
                    {addressData?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-navy-700 dark:text-white">
              Map Preview
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-navy-600">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center bg-gray-100 dark:bg-navy-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    No map URL available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Address Modal */}
      <EditAddressModal
        isOpen={isEditAddressModalOpen}
        onClose={() => setIsEditAddressModalOpen(false)}
        onSubmit={handleEditAddress}
        loading={editAddressLoading}
        addressData={addressData}
      />

      {/* Add Country Modal */}
      <AddCountryModal
        isOpen={isAddCountryModalOpen}
        onClose={() => setIsAddCountryModalOpen(false)}
        onSubmit={handleAddCountries}
        loading={addCountryLoading}
      />

      {/* Add Budget Modal */}
      <AddBudgetModal
        isOpen={isAddBudgetModalOpen}
        onClose={() => setIsAddBudgetModalOpen(false)}
        onSubmit={handleAddBudgets}
        loading={addBudgetLoading}
      />

      {/* Add Event Type Modal */}
      <AddEventTypeModal
        isOpen={isAddEventTypeModalOpen}
        onClose={() => setIsAddEventTypeModalOpen(false)}
        onSubmit={handleAddEventTypes}
        loading={addEventTypeLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirm.open}
        onClose={() =>
          setDeleteConfirm({ open: false, id: null, name: '', type: '' })
        }
        onConfirm={() => {
          if (deleteConfirm.type === 'budget') {
            handleDeleteBudget()
          } else if (deleteConfirm.type === 'eventType') {
            handleDeleteEventType()
          } else {
            handleDeleteCountry()
          }
        }}
        title={
          deleteConfirm.type === 'budget'
            ? 'Delete Budget Range'
            : deleteConfirm.type === 'eventType'
            ? 'Delete Event Type'
            : 'Delete Country'
        }
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />
    </div>
  )
}

export default Contact
