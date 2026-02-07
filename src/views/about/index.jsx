import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTimes } from 'react-icons/fa'
import { useToaster } from 'common/Toaster'
import EditStoryModal from 'components/about/EditStoryModal'
import EditStoryImageModal from 'components/about/EditStoryImageModal'
import EditVisionModal from 'components/about/EditVisionModal'
import EditTeamModal from 'components/about/EditTeamModal'
import EditCtaModal from 'components/about/EditCtaModal'

const About = () => {
  const [storyData, setStoryData] = useState(null)
  const [visionData, setVisionData] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [ctaData, setCtaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const { apiCall } = ApiCaller()
  const { addToast } = useToaster()

  // Edit story section modal state
  const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false)
  const [editStoryLoading, setEditStoryLoading] = useState(false)

  // Edit story image modal state
  const [isEditStoryImageModalOpen, setIsEditStoryImageModalOpen] =
    useState(false)
  const [editStoryImageData, setEditStoryImageData] = useState(null)
  const [editStoryImageLoading, setEditStoryImageLoading] = useState(false)

  // Edit vision modal state
  const [isEditVisionModalOpen, setIsEditVisionModalOpen] = useState(false)
  const [editVisionData, setEditVisionData] = useState(null)
  const [editVisionLoading, setEditVisionLoading] = useState(false)

  // Edit team modal state
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false)
  const [editTeamData, setEditTeamData] = useState(null)
  const [editTeamLoading, setEditTeamLoading] = useState(false)

  // Edit CTA modal state
  const [isEditCtaModalOpen, setIsEditCtaModalOpen] = useState(false)
  const [editCtaLoading, setEditCtaLoading] = useState(false)

  useEffect(() => {
    fetchAllSections()
  }, [])

  const fetchAllSections = async () => {
    try {
      setLoading(true)
      const [storyRes, visionRes, teamRes, ctaRes] = await Promise.all([
        apiCall('get', apiConfig.GET_STORY),
        apiCall('get', apiConfig.GET_VISION),
        apiCall('get', apiConfig.GET_TEAM),
        apiCall('get', `${apiConfig.GET_CTA_SECTION}?pageKey=about`),
      ])

      if (storyRes?.data?.code === 2000) {
        setStoryData(storyRes.data.data[0])
      }
      if (visionRes?.data?.code === 2000) {
        setVisionData(visionRes.data.data)
      }
      if (teamRes?.data?.code === 2000) {
        setTeamData(teamRes.data.data)
      }
      if (ctaRes?.data?.code === 2000) {
        setCtaData(ctaRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle edit story section submit
  const handleEditStorySubmit = async (formData) => {
    try {
      setEditStoryLoading(true)
      const response = await apiCall('put', apiConfig.UPDATE_STORY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response?.data?.code === 2000) {
        setIsEditStoryModalOpen(false)
        fetchAllSections()
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Story section updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update story section',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating story section',
      })
    } finally {
      setEditStoryLoading(false)
    }
  }

  // Handle edit story image
  const openEditStoryImageModal = (image) => {
    setEditStoryImageData(image)
    setIsEditStoryImageModalOpen(true)
  }

  const handleEditStoryImageSubmit = async (_imageId, formData) => {
    try {
      setEditStoryImageLoading(true)
      const response = await apiCall('put', apiConfig.UPDATE_STORY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response?.data?.code === 2000) {
        setIsEditStoryImageModalOpen(false)
        setEditStoryImageData(null)
        fetchAllSections()
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Story image updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update story image',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating story image',
      })
    } finally {
      setEditStoryImageLoading(false)
    }
  }

  // Handle edit vision item
  const openEditVisionModal = (item) => {
    setEditVisionData(item)
    setIsEditVisionModalOpen(true)
  }

  const handleEditVisionSubmit = async (visionId, formData) => {
    try {
      setEditVisionLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_VISION}/${visionId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditVisionModalOpen(false)
        setEditVisionData(null)
        fetchAllSections()
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Vision item updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update vision item',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating vision item',
      })
    } finally {
      setEditVisionLoading(false)
    }
  }

  // Handle edit team item
  const openEditTeamModal = (item) => {
    setEditTeamData(item)
    setIsEditTeamModalOpen(true)
  }

  const handleEditTeamSubmit = async (teamId, formData) => {
    try {
      setEditTeamLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_TEAM}/${teamId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditTeamModalOpen(false)
        setEditTeamData(null)
        fetchAllSections()
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Team item updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to update team item',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating team item',
      })
    } finally {
      setEditTeamLoading(false)
    }
  }

  // Handle edit CTA section
  const handleEditCtaSubmit = async (formData) => {
    try {
      setEditCtaLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_CTA_SECTION}?pageKey=about`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditCtaModalOpen(false)
        fetchAllSections()
        addToast({
          type: 'success',
          title: 'Success',
          description: 'CTA section updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update CTA section',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating CTA section',
      })
    } finally {
      setEditCtaLoading(false)
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
      {/* Section 1: Our Story */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              {storyData?.title || 'Our Story'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {storyData?.description || 'Manage our story section here.'}
            </p>
          </div>
          <button
            onClick={() => setIsEditStoryModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {storyData?.images?.map((image, index) => (
            <div
              key={image._id || index}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700"
            >
              <img
                src={image.url}
                alt={image.altText || `Story image ${index + 1}`}
                className="h-40 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightboxImage(image.url)}
              />

              {/* Overlay with Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => openEditStoryImageModal(image)}
                  className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
              </div>

              <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-navy-700">
                #{image.order + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Vision Section */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Vision Section
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage why choose us and what we do sections.
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Vision Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visionData?.map((item, index) => (
            <div
              key={item._id || index}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Image */}
              {item.images?.[0]?.url && (
                <div className="overflow-hidden">
                  <img
                    src={item.images[0].url}
                    alt={item.images[0].altText || item.title}
                    className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setLightboxImage(item.images[0].url)}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.subtitle}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>

              {/* Overlay with Actions - covers full card */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => openEditVisionModal(item)}
                  className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Team Section */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Team Section
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage our approach and team sections.
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Team Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {teamData?.map((item, index) => (
            <div
              key={item._id || index}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Image */}
              {item.images?.[0]?.url && (
                <div className="overflow-hidden">
                  <img
                    src={item.images[0].url}
                    alt={item.images[0].altText || item.title}
                    className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setLightboxImage(item.images[0].url)}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.subtitle}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>

              {/* Overlay with Actions - covers full card */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => openEditTeamModal(item)}
                  className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: CTA Section */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              CTA Section
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage call to action section for about page.
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* CTA Preview Card */}
        {ctaData && (
          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700">
            {/* Background Image */}
            <div className="relative h-64">
              <img
                src={ctaData.backgroundImage?.url}
                alt="CTA Background"
                className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightboxImage(ctaData.backgroundImage?.url)}
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-6 text-center">
                <h3 className="text-2xl font-bold text-white">
                  {ctaData.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-white/90">
                  {ctaData.subtitle}
                </p>
              </div>

              {/* Overlay with Actions on Hover */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => setIsEditCtaModalOpen(true)}
                  className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          </div>
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

      {/* Edit Story Section Modal */}
      <EditStoryModal
        isOpen={isEditStoryModalOpen}
        onClose={() => setIsEditStoryModalOpen(false)}
        onSubmit={handleEditStorySubmit}
        loading={editStoryLoading}
        storyData={storyData}
      />

      {/* Edit Story Image Modal */}
      <EditStoryImageModal
        isOpen={isEditStoryImageModalOpen}
        onClose={() => {
          setIsEditStoryImageModalOpen(false)
          setEditStoryImageData(null)
        }}
        onSubmit={handleEditStoryImageSubmit}
        loading={editStoryImageLoading}
        imageData={editStoryImageData}
      />

      {/* Edit Vision Modal */}
      <EditVisionModal
        isOpen={isEditVisionModalOpen}
        onClose={() => {
          setIsEditVisionModalOpen(false)
          setEditVisionData(null)
        }}
        onSubmit={handleEditVisionSubmit}
        loading={editVisionLoading}
        visionData={editVisionData}
      />

      {/* Edit Team Modal */}
      <EditTeamModal
        isOpen={isEditTeamModalOpen}
        onClose={() => {
          setIsEditTeamModalOpen(false)
          setEditTeamData(null)
        }}
        onSubmit={handleEditTeamSubmit}
        loading={editTeamLoading}
        teamData={editTeamData}
      />

      {/* Edit CTA Modal */}
      <EditCtaModal
        isOpen={isEditCtaModalOpen}
        onClose={() => setIsEditCtaModalOpen(false)}
        onSubmit={handleEditCtaSubmit}
        loading={editCtaLoading}
        ctaData={ctaData}
      />
    </div>
  )
}

export default About
