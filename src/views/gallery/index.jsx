import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'

const Gallery = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const { apiCall } = ApiCaller()

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const response = await apiCall('get', apiConfig.GET_GALLERY)
      if (response?.data?.code === 2000) {
        setData(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
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
    <div className="mt-3 h-full w-full">
      <div className="h-full w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
              {data?.title || 'Gallery'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {data?.description || 'Manage your gallery images here.'}
            </p>
            {data?.overlayText && (
              <p className="mt-2 whitespace-pre-line text-sm italic text-gray-500 dark:text-gray-400">
                "{data.overlayText}"
              </p>
            )}
          </div>
          <button
            onClick={() => console.log('Edit header')}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200 dark:border-navy-600" />

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data?.images?.map((image, index) => (
            <div
              key={image._id || index}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700 dark:hover:border-navy-500"
            >
              {/* Image */}
              <img
                src={image.url}
                alt={image.altText || `Gallery image ${index + 1}`}
                className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightboxImage(image.url)}
              />

              {/* Overlay with Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => console.log('Edit', image._id)}
                  className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => console.log('Delete', image._id)}
                  className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                >
                  <FaTrash className="h-3 w-3" />
                  Delete
                </button>
              </div>

              {/* Alt Text Badge */}
              {image.altText && (
                <div className="to-transparent absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2">
                  <p className="truncate text-xs text-white">{image.altText}</p>
                </div>
              )}

              {/* Order Badge */}
              <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-navy-700">
                #{image.order + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!data?.images || data.images.length === 0) && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No images found.
          </p>
        )}
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

export default Gallery
