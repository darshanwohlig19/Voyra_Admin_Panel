import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'
import AddCelebrityCarouselModal from 'components/celebrities/AddCelebrityCarouselModal'
import EditCelebrityCarouselModal from 'components/celebrities/EditCelebrityCarouselModal'
import { useToaster } from 'common/Toaster'
import ConfirmationModal from 'components/modal/ConfirmationModal'

const Celebrities = () => {
  const [limelightData, setLimelightData] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [artistData, setArtistData] = useState(null)
  const [spotlightData, setSpotlightData] = useState(null)
  const [spotlightCelebrities, setSpotlightCelebrities] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [spotlightLoading, setSpotlightLoading] = useState(false)
  const [stardomData, setStardomData] = useState(null)
  const [carouselData, setCarouselData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [isAddCarouselModalOpen, setIsAddCarouselModalOpen] = useState(false)
  const [addCarouselLoading, setAddCarouselLoading] = useState(false)
  const [isEditCarouselModalOpen, setIsEditCarouselModalOpen] = useState(false)
  const [editCarouselLoading, setEditCarouselLoading] = useState(false)
  const [selectedCarouselItem, setSelectedCarouselItem] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    title: '',
  })
  const { apiCall } = ApiCaller()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchAllSections()
  }, [])

  useEffect(() => {
    if (selectedType) {
      fetchSpotlightByType(selectedType)
    }
  }, [selectedType])
  const handleDeleteCarouselItem = async () => {
    if (!deleteConfirm.id) return
    try {
      setDeleteLoading(true)
      const response = await apiCall(
        'delete',
        `${apiConfig.DELETE_CELEBRITY_CAROUSEL}/${deleteConfirm.id}`
      )
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Carousel item deleted successfully',
        })
        setDeleteConfirm({ open: false, id: null, title: '' })
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to delete carousel item',
        })
      }
    } catch (error) {
      console.error('Error deleting carousel item:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting carousel item',
      })
    } finally {
      setDeleteLoading(false)
    }
  }
  const fetchAllSections = async () => {
    try {
      setLoading(true)
      const [limelightRes, artistRes, spotlightRes, stardomRes, carouselRes] =
        await Promise.all([
          apiCall('get', apiConfig.GET_CURRENT_LIMELIGHT),
          apiCall('get', apiConfig.GET_ARTIST_COLLECTION),
          apiCall('get', apiConfig.GET_SPOTLIGHT),
          apiCall('get', apiConfig.GET_STARDOM),
          apiCall('get', apiConfig.GET_CELEBRITY_CAROUSEL),
        ])

      if (limelightRes?.data?.code === 2000) {
        setLimelightData(limelightRes.data.data[0])
      }
      if (artistRes?.data?.code === 2000) {
        setArtistData(artistRes.data.data[0])
      }
      if (spotlightRes?.data?.code === 2000) {
        const data = spotlightRes.data.data[0]
        setSpotlightData(data)
        if (data?.types?.length > 0) {
          setSelectedType(data.types[0])
        }
      }
      if (stardomRes?.data?.code === 2000) {
        setStardomData(stardomRes.data.data[0])
      }
      if (carouselRes?.data?.code === 2000) {
        setCarouselData(carouselRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching celebrities data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSpotlightByType = async (type) => {
    try {
      setSpotlightLoading(true)
      const response = await apiCall(
        'get',
        `${apiConfig.GET_SPOTLIGHT}?celebrityType=${type}`
      )
      if (response?.data?.code === 2000) {
        const data = response.data.data[0]
        setSpotlightCelebrities(data?.celebrity || [])
      }
    } catch (error) {
      console.error('Error fetching spotlight celebrities:', error)
    } finally {
      setSpotlightLoading(false)
    }
  }

  const handleAddCarouselItem = async (formData) => {
    try {
      setAddCarouselLoading(true)
      const response = await apiCall(
        'post',
        apiConfig.CREATE_CELEBRITY_CAROUSEL,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Carousel item added successfully',
        })
        setIsAddCarouselModalOpen(false)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to add carousel item',
        })
      }
    } catch (error) {
      console.error('Error adding carousel item:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error adding carousel item',
      })
    } finally {
      setAddCarouselLoading(false)
    }
  }

  const handleEditCarouselItem = async (id, formData) => {
    try {
      setEditCarouselLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_CELEBRITY_CAROUSEL}/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Carousel item updated successfully',
        })
        setIsEditCarouselModalOpen(false)
        setSelectedCarouselItem(null)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update carousel item',
        })
      }
    } catch (error) {
      console.error('Error updating carousel item:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating carousel item',
      })
    } finally {
      setEditCarouselLoading(false)
    }
  }

  const openEditCarouselModal = (item) => {
    setSelectedCarouselItem(item)
    setIsEditCarouselModalOpen(true)
  }

  if (loading) {
    return (
      <div className="mt-3 h-full w-full">
        <div className="h-full w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 h-full w-full space-y-6">
      {/* Section 1: Currently in the Limelight */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              {limelightData?.title || 'Currently in the Limelight'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {limelightData?.description || 'Manage limelight section here.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => console.log('Edit limelight section')}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FaEdit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => console.log('Add limelight image')}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              <FaPlus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {limelightData?.images?.map((image, index) => (
            <div
              key={image._id || index}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              <img
                src={image.url}
                alt={image.altText || `Limelight image ${index + 1}`}
                className="h-40 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightboxImage(image.url)}
              />

              {/* Overlay with Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => console.log('Edit image', image._id)}
                  className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => console.log('Delete image', image._id)}
                  className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                >
                  <FaTrash className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Artist Collection */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              {artistData?.title || 'Artist Collection'}
            </h2>
          </div>
          <button
            onClick={() => console.log('Edit artist section')}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Artist Cards Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {artistData?.images?.map((artist, index) => (
            <div
              key={artist._id || index}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Artist Image */}
              <div className="relative">
                <img
                  src={artist.url}
                  alt={artist.altText || `Artist ${index + 1}`}
                  className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setLightboxImage(artist.url)}
                />

                {/* Overlay with Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    onClick={() => console.log('Edit artist', artist._id)}
                    className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    <FaEdit className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => console.log('Delete artist', artist._id)}
                    className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                  >
                    <FaTrash className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Artist Description */}
              {artist.description && (
                <div className="p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {artist.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Behind the Spotlight */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              {spotlightData?.title || 'Behind the Spotlight'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {spotlightData?.description ||
                'Manage spotlight celebrities here.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => console.log('Edit spotlight section')}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FaEdit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => console.log('Add spotlight celebrity')}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              <FaPlus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Type Filter Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {spotlightData?.types?.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-600 dark:text-gray-300 dark:hover:bg-navy-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Celebrity Cards Grid */}
        {spotlightLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {spotlightCelebrities.map((celeb, index) => (
              <div
                key={celeb._id || index}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
              >
                {/* Celebrity Image */}
                <div className="relative">
                  <img
                    src={celeb.image?.url}
                    alt={celeb.image?.altText || celeb.name}
                    className="h-40 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setLightboxImage(celeb.image?.url)}
                  />

                  {/* Overlay with Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => console.log('Edit celebrity', celeb._id)}
                      className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      <FaEdit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => console.log('Delete celebrity', celeb._id)}
                      className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                    >
                      <FaTrash className="h-3 w-3" />
                      Delete
                    </button>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute left-2 top-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
                    {celeb.type}
                  </div>
                </div>

                {/* Celebrity Name */}
                <div className="p-3">
                  <h3 className="text-center text-sm font-semibold text-navy-700 dark:text-white">
                    {celeb.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!spotlightLoading && spotlightCelebrities.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No celebrities found for this type.
          </p>
        )}
      </div>

      {/* Section 4: Where Stardom Meets Your Story */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              {stardomData?.title || 'Where Stardom Meets Your Story'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {stardomData?.description || 'Manage stardom section here.'}
            </p>
          </div>
          <button
            onClick={() => console.log('Edit stardom section')}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stardomData?.events?.map((event, index) => (
            <div
              key={event._id || index}
              className="group rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Logo Image */}
              <div className="mb-3 flex justify-center">
                <img
                  src={event.logoImage?.url}
                  alt={event.logoImage?.altText || event.title}
                  className="h-16 w-16 object-contain"
                />
              </div>

              {/* Event Title */}
              <h3 className="text-center text-lg font-semibold text-navy-700 dark:text-white">
                {event.title}
              </h3>

              {/* Event Description */}
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                {event.description}
              </p>

              {/* Actions */}
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => console.log('Edit event', event._id)}
                  className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => console.log('Delete event', event._id)}
                  className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                >
                  <FaTrash className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Celebrity Carousel */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Celebrity Carousel
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage celebrity testimonials carousel here.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddCarouselModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              <FaPlus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Carousel Items Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {carouselData?.map((item, index) => (
            <div
              key={item._id || index}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image?.url}
                  alt={item.image?.altText || 'Celebrity'}
                  className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setLightboxImage(item.image?.url)}
                />

                {/* Overlay with Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    onClick={() => openEditCarouselModal(item)}
                    className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    <FaEdit className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        open: true,
                        id: item._id,
                        title: item.author,
                      })
                    }
                    className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                  >
                    <FaTrash className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="line-clamp-3 text-sm italic text-gray-600 dark:text-gray-300">
                  "{item.comment}"
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-navy-700 dark:text-white">
                    {item.author}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute right-4 top-4 text-white hover:text-gray-300"
            onClick={() => setLightboxImage(null)}
          >
            <FaTimes className="h-8 w-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Lightbox"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Add Celebrity Carousel Modal */}
      <AddCelebrityCarouselModal
        isOpen={isAddCarouselModalOpen}
        onClose={() => setIsAddCarouselModalOpen(false)}
        onSubmit={handleAddCarouselItem}
        loading={addCarouselLoading}
      />

      {/* Edit Celebrity Carousel Modal */}
      <EditCelebrityCarouselModal
        isOpen={isEditCarouselModalOpen}
        onClose={() => {
          setIsEditCarouselModalOpen(false)
          setSelectedCarouselItem(null)
        }}
        onSubmit={handleEditCarouselItem}
        loading={editCarouselLoading}
        data={selectedCarouselItem}
      />
      <ConfirmationModal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null, title: '' })}
        onConfirm={handleDeleteCarouselItem}
        title="Delete Carousel Item"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />
    </div>
  )
}

export default Celebrities
