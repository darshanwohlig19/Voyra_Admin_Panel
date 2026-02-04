import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCalendarAlt } from 'react-icons/fa'
import AddBlogModal from 'components/blog/AddBlogModal'
import EditBlogModal from 'components/blog/EditBlogModal'
import EditSectionModal from 'components/blog/EditSectionModal'
import ConfirmationModal from 'components/modal/ConfirmationModal'

const Blog = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    title: '',
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editBlogData, setEditBlogData] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [sectionLoading, setSectionLoading] = useState(false)
  const { apiCall } = ApiCaller()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await apiCall('get', apiConfig.GET_BLOGS)
      if (response?.data?.code === 2000) {
        setData(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBlog = async (formData) => {
    try {
      setSubmitLoading(true)
      const response = await apiCall('post', apiConfig.CREATE_BLOG, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response?.data?.code === 2000) {
        setIsAddModalOpen(false)
        fetchBlogs()
      } else {
        console.error('Failed to create blog:', response?.data?.message)
      }
    } catch (error) {
      console.error('Error creating blog:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteBlog = async () => {
    if (!deleteConfirm.id) return
    try {
      setDeleteLoading(true)
      const response = await apiCall(
        'delete',
        `${apiConfig.DELETE_BLOG_ITEM}/${deleteConfirm.id}`
      )
      if (response?.data?.code === 2000) {
        setDeleteConfirm({ open: false, id: null, title: '' })
        fetchBlogs()
      } else {
        console.error('Failed to delete blog:', response?.data?.message)
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const openEditModal = (blog) => {
    setEditBlogData(blog)
    setIsEditModalOpen(true)
  }

  const handleEditBlog = async (blogId, formData) => {
    try {
      setEditLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_BLOG_ITEM}/${blogId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditModalOpen(false)
        setEditBlogData(null)
        fetchBlogs()
      } else {
        console.error('Failed to update blog:', response?.data?.message)
      }
    } catch (error) {
      console.error('Error updating blog:', error)
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditSection = async (formData) => {
    try {
      setSectionLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_BLOG_SECTION,
        formData
      )
      if (response?.data?.code === 2000) {
        setIsSectionModalOpen(false)
        fetchBlogs()
      } else {
        console.error('Failed to update section:', response?.data?.message)
      }
    } catch (error) {
      console.error('Error updating section:', error)
    } finally {
      setSectionLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
              {data?.sectionTitle || 'Blog'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {data?.sectionDescription || 'Manage your blog posts here.'}
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

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.blogs?.map((blog, index) => (
            <div
              key={blog._id || index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700 dark:hover:border-navy-500"
            >
              {/* Blog Image */}
              {blog.image?.url && (
                <img
                  src={blog.image.url}
                  alt={blog.image.altText || blog.title}
                  className="h-40 w-full cursor-pointer rounded-lg object-cover transition-transform hover:scale-[1.02]"
                  onClick={() => setLightboxImage(blog.image.url)}
                />
              )}

              {/* Blog Content */}
              <div className="mt-3">
                <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                  {blog.title}
                </h3>

                {/* Date */}
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt className="h-3 w-3" />
                  {formatDate(blog.date)}
                </div>

                <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                  {blog.description}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(blog)}
                  className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      open: true,
                      id: blog._id,
                      title: blog.title,
                    })
                  }
                  className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                >
                  <FaTrash className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!data?.blogs || data.blogs.length === 0) && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No blog posts found.
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

      {/* Add Blog Modal */}
      <AddBlogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBlog}
        loading={submitLoading}
      />

      {/* Edit Blog Modal */}
      <EditBlogModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditBlogData(null)
        }}
        onSubmit={handleEditBlog}
        loading={editLoading}
        blogData={editBlogData}
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
        onClose={() => setDeleteConfirm({ open: false, id: null, title: '' })}
        onConfirm={handleDeleteBlog}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />
    </div>
  )
}

export default Blog
