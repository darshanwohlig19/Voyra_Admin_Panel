import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTimes } from 'react-icons/fa'
import EditHeroSectionModal from 'components/hero-section/EditHeroSectionModal'
import { useToaster } from 'common/Toaster'

const PAGE_KEYS = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'celebrities', label: 'Celebrities' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'blog', label: 'Blog' },
  { key: 'contact', label: 'Contact' },
]

const HeroSections = () => {
  const [heroData, setHeroData] = useState({})
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPageKey, setSelectedPageKey] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const { apiCall } = ApiCaller()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchAllHeroSections()
  }, [])

  const fetchAllHeroSections = async () => {
    try {
      setLoading(true)
      const responses = await Promise.all(
        PAGE_KEYS.map((page) =>
          apiCall('get', `${apiConfig.GET_HERO_SECTION}?pageKey=${page.key}`)
        )
      )

      const data = {}
      responses.forEach((res, index) => {
        if (res?.data?.code === 2000) {
          data[PAGE_KEYS[index].key] = res.data.data
        }
      })
      setHeroData(data)
    } catch (error) {
      console.error('Error fetching hero sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (pageKey) => {
    setSelectedPageKey(pageKey)
    setEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditModalOpen(false)
    setSelectedPageKey(null)
  }

  const handleUpdateHeroSection = async (formData) => {
    try {
      setUpdateLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_HERO_SECTION}?pageKey=${selectedPageKey}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Hero section updated successfully',
        })
        handleCloseModal()
        // Refresh the data for the updated page
        const refreshResponse = await apiCall(
          'get',
          `${apiConfig.GET_HERO_SECTION}?pageKey=${selectedPageKey}`
        )
        if (refreshResponse?.data?.code === 2000) {
          setHeroData((prev) => ({
            ...prev,
            [selectedPageKey]: refreshResponse.data.data,
          }))
        }
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update hero section',
        })
      }
    } catch (error) {
      console.error('Error updating hero section:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating hero section',
      })
    } finally {
      setUpdateLoading(false)
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
              Hero Sections
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage hero sections for all pages. Each page has its own hero
              section with background image, title, subtitle, and description.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200 dark:border-navy-600" />

        {/* Hero Sections Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PAGE_KEYS.map((page) => {
            const hero = heroData[page.key]
            return (
              <div
                key={page.key}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
              >
                {/* Background Image */}
                <div className="relative h-48">
                  {hero?.backgroundImage?.url ? (
                    <img
                      src={hero.backgroundImage.url}
                      alt={hero.backgroundImage.altText || `${page.label} Hero`}
                      className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setLightboxImage(hero.backgroundImage.url)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-navy-600">
                      <p className="text-gray-500 dark:text-gray-400">
                        No image set
                      </p>
                    </div>
                  )}

                  {/* Page Label Badge */}
                  <div className="absolute left-2 top-2 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                    {page.label}
                  </div>

                  {/* Overlay with Edit Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => handleEditClick(page.key)}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      <FaEdit className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                    {hero?.title || 'No title set'}
                  </h3>
                  {hero?.subtitle && (
                    <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {hero.subtitle}
                    </p>
                  )}
                  {!hero && (
                    <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
                      Hero section not configured for this page.
                    </p>
                  )}
                </div>
              </div>
            )
          })}
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

      {/* Edit Hero Section Modal */}
      <EditHeroSectionModal
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleUpdateHeroSection}
        loading={updateLoading}
        heroData={selectedPageKey ? heroData[selectedPageKey] : null}
        pageLabel={
          PAGE_KEYS.find((p) => p.key === selectedPageKey)?.label || ''
        }
      />
    </div>
  )
}

export default HeroSections
