import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
} from 'react-icons/fa'
import AddTestimonialModal from 'components/testimonial/AddTestimonialModal'
import EditTestimonialModal from 'components/testimonial/EditTestimonialModal'
import EditSectionModal from 'components/testimonial/EditSectionModal'
import ConfirmationModal from 'components/modal/ConfirmationModal'
import { useToaster } from 'common/Toaster'

const Testimonials = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    name: '',
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editTestimonialData, setEditTestimonialData] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [sectionLoading, setSectionLoading] = useState(false)
  const { apiCall } = ApiCaller()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const response = await apiCall('get', apiConfig.GET_TESTIMONIALS)
      if (response?.data?.code === 2000) {
        setData(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTestimonial = async (formData) => {
    try {
      setSubmitLoading(true)
      const response = await apiCall(
        'post',
        apiConfig.CREATE_TESTIMONIAL,
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
          description: 'Testimonial created successfully',
        })
        setIsAddModalOpen(false)
        fetchTestimonials()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to create testimonial',
        })
      }
    } catch (error) {
      console.error('Error creating testimonial:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error creating testimonial',
      })
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteTestimonial = async () => {
    if (!deleteConfirm.id) return
    try {
      setDeleteLoading(true)
      const response = await apiCall(
        'delete',
        `${apiConfig.DELETE_TESTIMONIAL_ITEM}/${deleteConfirm.id}`
      )
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Testimonial deleted successfully',
        })
        setDeleteConfirm({ open: false, id: null, name: '' })
        fetchTestimonials()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to delete testimonial',
        })
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting testimonial',
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const openEditModal = (testimonial) => {
    setEditTestimonialData(testimonial)
    setIsEditModalOpen(true)
  }

  const handleEditTestimonial = async (testimonialId, formData) => {
    try {
      setEditLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_TESTIMONIAL_ITEM}/${testimonialId}`,
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
          description: 'Testimonial updated successfully',
        })
        setIsEditModalOpen(false)
        setEditTestimonialData(null)
        fetchTestimonials()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update testimonial',
        })
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating testimonial',
      })
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteTestimonialImage = async (testimonialId, fileId) => {
    try {
      const response = await apiCall(
        'delete',
        `${apiConfig.DELETE_TESTIMONIAL_IMAGE}/${testimonialId}/${fileId}`
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Image deleted successfully',
        })
        return true
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to delete image',
        })
        return false
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting image',
      })
      return false
    }
  }

  const handleEditSection = async (formData) => {
    try {
      setSectionLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_TESTIMONIAL_SECTION,
        formData
      )
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Section updated successfully',
        })
        setIsSectionModalOpen(false)
        fetchTestimonials()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to update section',
        })
      }
    } catch (error) {
      console.error('Error updating section:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating section',
      })
    } finally {
      setSectionLoading(false)
    }
  }

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="h-4 w-4 text-yellow-400" />
      )
    }
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="h-4 w-4 text-yellow-400" />
      )
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
      )
    }
    return stars
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
              {data?.title || 'Testimonials'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {data?.description || 'Manage customer testimonials here.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSectionModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
            >
              <FaEdit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
            >
              <FaPlus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200 dark:border-navy-600" />

        {/* Testimonials List */}
        <div className="space-y-4">
          {data?.testimonials?.map((testimonial, index) => (
            <div
              key={testimonial._id || index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700 dark:hover:border-navy-500"
            >
              {/* Client Info & Actions */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                    {testimonial.clientName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.designation}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(testimonial)}
                    className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
                  >
                    <FaEdit className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        open: true,
                        id: testimonial._id,
                        name: testimonial.clientName,
                      })
                    }
                    className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                  >
                    <FaTrash className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Rating - Multiple Stars */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="font-medium text-navy-700 dark:text-white">
                  {testimonial.rating}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({testimonial.reviewCount})
                </span>
              </div>

              {/* Testimonial Text */}
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                {testimonial.testimonialText}
              </p>

              {/* Images - Larger with Lightbox */}
              {testimonial.images && testimonial.images.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {testimonial.images.map((image, imgIndex) => (
                    <img
                      key={image._id || imgIndex}
                      src={image.url}
                      alt={image.altText || `Testimonial image ${imgIndex + 1}`}
                      className="h-24 w-24 cursor-pointer rounded-lg object-cover transition-transform hover:scale-105"
                      onClick={() => setLightboxImage(image.url)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!data?.testimonials || data.testimonials.length === 0) && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No testimonials found.
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

      {/* Add Testimonial Modal */}
      <AddTestimonialModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTestimonial}
        loading={submitLoading}
      />

      {/* Edit Testimonial Modal */}
      <EditTestimonialModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditTestimonialData(null)
        }}
        onSubmit={handleEditTestimonial}
        onDeleteImage={handleDeleteTestimonialImage}
        loading={editLoading}
        testimonialData={editTestimonialData}
      />

      {/* Edit Section Modal */}
      <EditSectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSubmit={handleEditSection}
        loading={sectionLoading}
        sectionData={data}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null, name: '' })}
        onConfirm={handleDeleteTestimonial}
        title="Delete Testimonial"
        message={`Are you sure you want to delete testimonial from "${deleteConfirm.name}"? This action cannot be undone.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />
    </div>
  )
}

export default Testimonials
