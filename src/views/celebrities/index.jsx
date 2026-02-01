import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'

const Celebrities = () => {
  const [limelightData, setLimelightData] = useState(null)
  const [artistData, setArtistData] = useState(null)
  const [stardomData, setStardomData] = useState(null)
  const [carouselData, setCarouselData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const { apiCall } = ApiCaller()

  useEffect(() => {
    fetchAllSections()
  }, [])

  const fetchAllSections = async () => {
    try {
      setLoading(true)
      const [limelightRes, artistRes, stardomRes, carouselRes] =
        await Promise.all([
          apiCall('get', apiConfig.GET_CURRENT_LIMELIGHT),
          apiCall('get', apiConfig.GET_ARTIST_COLLECTION),
          apiCall('get', apiConfig.GET_STARDOM),
          apiCall('get', apiConfig.GET_CELEBRITY_CAROUSEL),
        ])

      if (limelightRes?.data?.code === 2000) {
        setLimelightData(limelightRes.data.data[0])
      }
      if (artistRes?.data?.code === 2000) {
        setArtistData(artistRes.data.data[0])
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

              <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-navy-700">
                #{image.order + 1}
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

                <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-navy-700">
                  #{artist.order + 1}
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

      {/* Section 3: Where Stardom Meets Your Story */}
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

      {/* Section 4: Celebrity Carousel */}
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
              onClick={() => console.log('Edit carousel section')}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FaEdit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => console.log('Add carousel item')}
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
                    onClick={() => console.log('Edit carousel item', item._id)}
                    className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    <FaEdit className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      console.log('Delete carousel item', item._id)
                    }
                    className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                  >
                    <FaTrash className="h-3 w-3" />
                    Delete
                  </button>
                </div>

                {/* Order Badge */}
                <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-navy-700">
                  #{item.order}
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
    </div>
  )
}

export default Celebrities
