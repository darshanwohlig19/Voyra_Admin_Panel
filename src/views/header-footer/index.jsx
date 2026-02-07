import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import {
  FaInstagram,
  FaPinterest,
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'
import EditNavbarModal from 'components/header-footer/EditNavbarModal'
import EditFooterModal from 'components/header-footer/EditFooterModal'
import AddSocialLinkModal from 'components/header-footer/AddSocialLinkModal'
import ConfirmationModal from 'components/modal/ConfirmationModal'
import { useToaster } from 'common/Toaster'

const iconMap = {
  FaInstagram,
  FaPinterest,
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaYoutube,
}

const getIconComponent = (iconName) => iconMap[iconName] || null

const HeaderFooter = () => {
  const [navbarData, setNavbarData] = useState(null)
  const [footerData, setFooterData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Navbar modal
  const [isEditNavbarModalOpen, setIsEditNavbarModalOpen] = useState(false)
  const [editNavbarLoading, setEditNavbarLoading] = useState(false)

  // Footer modal
  const [isEditFooterModalOpen, setIsEditFooterModalOpen] = useState(false)
  const [editFooterLoading, setEditFooterLoading] = useState(false)

  // Social link modals
  const [isAddSocialLinkModalOpen, setIsAddSocialLinkModalOpen] =
    useState(false)
  const [addSocialLinkLoading, setAddSocialLinkLoading] = useState(false)
  const [deleteSocialConfirm, setDeleteSocialConfirm] = useState({
    open: false,
    id: null,
    name: '',
  })
  const [deleteSocialLoading, setDeleteSocialLoading] = useState(false)

  const { apiCall } = ApiCaller()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [navbarRes, footerRes] = await Promise.all([
        apiCall('get', apiConfig.GET_NAVBAR),
        apiCall('get', apiConfig.GET_FOOTER),
      ])

      if (navbarRes?.data?.code === 2000) {
        setNavbarData(navbarRes.data.data)
      }
      if (footerRes?.data?.code === 2000) {
        setFooterData(footerRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching header/footer data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle edit navbar
  const handleEditNavbar = async (formData) => {
    try {
      setEditNavbarLoading(true)
      const response = await apiCall('put', apiConfig.UPDATE_NAVBAR, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Navbar updated successfully',
        })
        setIsEditNavbarModalOpen(false)
        fetchData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to update navbar',
        })
      }
    } catch (error) {
      console.error('Error updating navbar:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating navbar',
      })
    } finally {
      setEditNavbarLoading(false)
    }
  }

  // Handle edit footer
  const handleEditFooter = async (formData) => {
    try {
      setEditFooterLoading(true)
      const response = await apiCall('put', apiConfig.UPDATE_FOOTER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Footer updated successfully',
        })
        setIsEditFooterModalOpen(false)
        fetchData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to update footer',
        })
      }
    } catch (error) {
      console.error('Error updating footer:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating footer',
      })
    } finally {
      setEditFooterLoading(false)
    }
  }

  // Handle add social link
  const handleAddSocialLink = async (newLink) => {
    try {
      setAddSocialLinkLoading(true)
      const existingLinks = footerData?.socialLinks || []
      const updatedLinks = [
        ...existingLinks,
        { ...newLink, order: existingLinks.length },
      ]

      const formData = new FormData()
      formData.append('leftTagline', footerData?.leftTagline || '')
      formData.append('rightTagline', footerData?.rightTagline || '')
      formData.append('socialLinks', JSON.stringify(updatedLinks))

      const response = await apiCall('put', apiConfig.UPDATE_FOOTER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Social link added successfully',
        })
        setIsAddSocialLinkModalOpen(false)
        fetchData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to add social link',
        })
      }
    } catch (error) {
      console.error('Error adding social link:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error adding social link',
      })
    } finally {
      setAddSocialLinkLoading(false)
    }
  }

  // Handle delete social link
  const handleDeleteSocialLink = async () => {
    if (!deleteSocialConfirm.id) return
    try {
      setDeleteSocialLoading(true)
      const updatedLinks = (footerData?.socialLinks || []).filter(
        (link) => link._id !== deleteSocialConfirm.id
      )

      const formData = new FormData()
      formData.append('leftTagline', footerData?.leftTagline || '')
      formData.append('rightTagline', footerData?.rightTagline || '')
      formData.append('socialLinks', JSON.stringify(updatedLinks))

      const response = await apiCall('put', apiConfig.UPDATE_FOOTER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response?.data?.code === 2000) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Social link deleted successfully',
        })
        setDeleteSocialConfirm({ open: false, id: null, name: '' })
        fetchData()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to delete social link',
        })
      }
    } catch (error) {
      console.error('Error deleting social link:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting social link',
      })
    } finally {
      setDeleteSocialLoading(false)
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
      {/* Section 1: Header / Navbar */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Header
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage website header/navbar logo.
            </p>
          </div>
          <button
            onClick={() => setIsEditNavbarModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Logo Preview Card */}
        {navbarData?.logo?.url && (
          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700">
            <div className="flex h-48 items-center justify-center p-4">
              <img
                src={navbarData.logo.url}
                alt="Navbar Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Overlay with Edit Button */}
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                onClick={() => setIsEditNavbarModalOpen(true)}
                className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-3 py-2 text-sm text-black hover:bg-[#EDCF93]"
              >
                <FaEdit className="h-3 w-3" />
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Footer */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Footer
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage website footer content and social links.
            </p>
          </div>
          <button
            onClick={() => setIsEditFooterModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Logo Preview */}
        {footerData?.logo?.url && (
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-navy-700 dark:text-white">
              Logo
            </h3>
            <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700">
              <div className="flex h-48 items-center justify-center p-4">
                <img
                  src={footerData.logo.url}
                  alt="Footer Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Overlay with Edit Button */}
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => setIsEditFooterModalOpen(true)}
                  className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-3 py-2 text-sm text-black hover:bg-[#EDCF93]"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Taglines */}
        <div className="mb-6 space-y-3">
          <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
            Taglines
          </h3>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-navy-600 dark:bg-navy-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Left Tagline
            </p>
            <p className="mt-1 text-navy-700 dark:text-white">
              {footerData?.leftTagline || '—'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-navy-600 dark:bg-navy-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Right Tagline
            </p>
            <p className="mt-1 text-navy-700 dark:text-white">
              {footerData?.rightTagline || '—'}
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
              Social Links
            </h3>
            <button
              onClick={() => setIsAddSocialLinkModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-3 py-1.5 text-sm text-black hover:bg-[#EDCF93]"
            >
              <FaPlus className="h-3 w-3" />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {footerData?.socialLinks
              ?.sort((a, b) => a.order - b.order)
              .map((link) => {
                const IconComponent = getIconComponent(link.iconName)
                return (
                  <div
                    key={link._id}
                    className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-all hover:border-gray-300 hover:shadow-sm dark:border-navy-600 dark:bg-navy-700"
                  >
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-navy-700 dark:text-white">
                      {link.name}
                    </span>
                    <button
                      onClick={() =>
                        setDeleteSocialConfirm({
                          open: true,
                          id: link._id,
                          name: link.name,
                        })
                      }
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
          </div>

          {(!footerData?.socialLinks ||
            footerData.socialLinks.length === 0) && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No social links found.
            </p>
          )}
        </div>
      </div>

      {/* Edit Navbar Modal */}
      <EditNavbarModal
        isOpen={isEditNavbarModalOpen}
        onClose={() => setIsEditNavbarModalOpen(false)}
        onSubmit={handleEditNavbar}
        loading={editNavbarLoading}
        navbarData={navbarData}
      />

      {/* Edit Footer Modal */}
      <EditFooterModal
        isOpen={isEditFooterModalOpen}
        onClose={() => setIsEditFooterModalOpen(false)}
        onSubmit={handleEditFooter}
        loading={editFooterLoading}
        footerData={footerData}
      />

      {/* Add Social Link Modal */}
      <AddSocialLinkModal
        isOpen={isAddSocialLinkModalOpen}
        onClose={() => setIsAddSocialLinkModalOpen(false)}
        onSubmit={handleAddSocialLink}
        loading={addSocialLinkLoading}
      />

      {/* Delete Social Link Confirmation */}
      <ConfirmationModal
        isOpen={deleteSocialConfirm.open}
        onClose={() =>
          setDeleteSocialConfirm({ open: false, id: null, name: '' })
        }
        onConfirm={handleDeleteSocialLink}
        title="Delete Social Link"
        message={`Are you sure you want to delete "${deleteSocialConfirm.name}"? This action cannot be undone.`}
        confirmText={deleteSocialLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />
    </div>
  )
}

export default HeaderFooter
