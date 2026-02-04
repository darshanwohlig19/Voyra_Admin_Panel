import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTrash, FaTimes, FaPlus } from 'react-icons/fa'
import { useToaster } from 'common/Toaster'
import EditCtaModal from 'components/about/EditCtaModal'
import EditPortfolioGalleryModal from 'components/home/EditPortfolioGalleryModal'
import EditPortfolioImageModal from 'components/home/EditPortfolioImageModal'
import EditBrandValueModal from 'components/home/EditBrandValueModal'
import EditCategoryImageModal from 'components/home/EditCategoryImageModal'
import AddBrandPartnerModal from 'components/home/AddBrandPartnerModal'
import ConfirmationModal from 'components/modal/ConfirmationModal'

const Home = () => {
  const [craftedData, setCraftedData] = useState(null)
  const [categoryData, setCategoryData] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [brandValueData, setBrandValueData] = useState(null)
  const [brandPartnerData, setBrandPartnerData] = useState(null)
  const [portfolioData, setPortfolioData] = useState(null)
  const [ctaData, setCtaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [isEditCtaModalOpen, setIsEditCtaModalOpen] = useState(false)
  const [editCtaLoading, setEditCtaLoading] = useState(false)
  const [isEditPortfolioModalOpen, setIsEditPortfolioModalOpen] =
    useState(false)
  const [editPortfolioLoading, setEditPortfolioLoading] = useState(false)
  const [isEditPortfolioImageModalOpen, setIsEditPortfolioImageModalOpen] =
    useState(false)
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null)
  const [editPortfolioImageLoading, setEditPortfolioImageLoading] =
    useState(false)
  const [isEditBrandValueModalOpen, setIsEditBrandValueModalOpen] =
    useState(false)
  const [editBrandValueLoading, setEditBrandValueLoading] = useState(false)
  const [isAddBrandPartnerModalOpen, setIsAddBrandPartnerModalOpen] =
    useState(false)
  const [addBrandPartnerLoading, setAddBrandPartnerLoading] = useState(false)
  const [deleteBrandPartnerConfirm, setDeleteBrandPartnerConfirm] = useState({
    open: false,
    id: null,
    name: '',
  })
  const [isEditCategoryImageModalOpen, setIsEditCategoryImageModalOpen] =
    useState(false)
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [editCategoryImageLoading, setEditCategoryImageLoading] =
    useState(false)
  const [deleteBrandPartnerLoading, setDeleteBrandPartnerLoading] =
    useState(false)
  const { apiCall } = ApiCaller()
  const { addToast } = useToaster()

  useEffect(() => {
    fetchAllSections()
  }, [])

  const fetchAllSections = async () => {
    try {
      setLoading(true)
      const [
        craftedRes,
        categoryRes,
        brandValueRes,
        brandPartnerRes,
        portfolioRes,
        ctaRes,
      ] = await Promise.all([
        apiCall('get', apiConfig.GET_CRAFTED_DESIGN),
        apiCall('get', apiConfig.GET_CATEGORY_GALLERY),
        apiCall('get', apiConfig.GET_BRAND_VALUE),
        apiCall('get', apiConfig.GET_BRAND_PARTNER),
        apiCall('get', apiConfig.GET_PORTFOLIO_GALLERY),
        apiCall('get', `${apiConfig.GET_CTA_SECTION}?pageKey=home`),
      ])

      if (craftedRes?.data?.code === 2000) {
        setCraftedData(craftedRes.data.data)
      }
      if (categoryRes?.data?.code === 2000) {
        setCategoryData(categoryRes.data.data)
        if (categoryRes.data.data?.length > 0) {
          setSelectedCategory(categoryRes.data.data[0].category)
        }
      }
      if (brandValueRes?.data?.code === 2000) {
        setBrandValueData(brandValueRes.data.data)
      }
      if (brandPartnerRes?.data?.code === 2000) {
        setBrandPartnerData(brandPartnerRes.data.data)
      }
      if (portfolioRes?.data?.code === 2000) {
        setPortfolioData(portfolioRes.data.data)
      }
      if (ctaRes?.data?.code === 2000) {
        setCtaData(ctaRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle edit CTA section
  const handleEditCtaSubmit = async (formData) => {
    try {
      setEditCtaLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_CTA_SECTION}?pageKey=home`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditCtaModalOpen(false)
        setCtaData(response.data.data)
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

  // Handle edit Portfolio Gallery section
  const handleEditPortfolioSubmit = async (formData) => {
    try {
      setEditPortfolioLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_PORTFOLIO_GALLERY,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditPortfolioModalOpen(false)
        setPortfolioData(response.data.data)
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Portfolio gallery updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update portfolio gallery',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating portfolio gallery',
      })
    } finally {
      setEditPortfolioLoading(false)
    }
  }

  // Handle edit Portfolio Image
  const handleEditPortfolioImageSubmit = async (formData) => {
    try {
      setEditPortfolioImageLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_PORTFOLIO_GALLERY,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditPortfolioImageModalOpen(false)
        setSelectedPortfolioImage(null)
        setPortfolioData(response.data.data)
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Portfolio image updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update portfolio image',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating portfolio image',
      })
    } finally {
      setEditPortfolioImageLoading(false)
    }
  }

  const openEditPortfolioImageModal = (image) => {
    setSelectedPortfolioImage(image)
    setIsEditPortfolioImageModalOpen(true)
  }

  // Handle edit Category Image
  const openEditCategoryImageModal = (image, categoryId) => {
    setSelectedCategoryImage(image)
    setSelectedCategoryId(categoryId)
    setIsEditCategoryImageModalOpen(true)
  }

  const handleEditCategoryImageSubmit = async (formData) => {
    if (!selectedCategoryId) return
    try {
      setEditCategoryImageLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_CATEGORY_GALLERY}/${selectedCategoryId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditCategoryImageModalOpen(false)
        setSelectedCategoryImage(null)
        setSelectedCategoryId(null)
        // Refresh category gallery data
        const categoryRes = await apiCall('get', apiConfig.GET_CATEGORY_GALLERY)
        if (categoryRes?.data?.code === 2000) {
          setCategoryData(categoryRes.data.data)
        }
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Category image updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update category image',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating category image',
      })
    } finally {
      setEditCategoryImageLoading(false)
    }
  }

  // Handle edit Brand Value section
  const handleEditBrandValueSubmit = async (formData) => {
    try {
      setEditBrandValueLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_BRAND_VALUE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsEditBrandValueModalOpen(false)
        setBrandValueData(response.data.data)
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Brand value updated successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update brand value',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating brand value',
      })
    } finally {
      setEditBrandValueLoading(false)
    }
  }

  // Handle add Brand Partner
  const handleAddBrandPartnerSubmit = async (formData) => {
    try {
      setAddBrandPartnerLoading(true)
      const response = await apiCall(
        'post',
        apiConfig.CREATE_BRAND_PARTNER,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000) {
        setIsAddBrandPartnerModalOpen(false)
        // Refresh the brand partners list
        const brandPartnerRes = await apiCall(
          'get',
          apiConfig.GET_BRAND_PARTNER
        )
        if (brandPartnerRes?.data?.code === 2000) {
          setBrandPartnerData(brandPartnerRes.data.data)
        }
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Brand partner added successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to add brand partner',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error adding brand partner',
      })
    } finally {
      setAddBrandPartnerLoading(false)
    }
  }

  // Handle delete Brand Partner
  const handleDeleteBrandPartner = async () => {
    if (!deleteBrandPartnerConfirm.id) return

    try {
      setDeleteBrandPartnerLoading(true)
      const response = await apiCall(
        'delete',
        `${apiConfig.DELETE_BRAND_PARTNER}?id=${deleteBrandPartnerConfirm.id}`
      )
      if (response?.data?.code === 2000) {
        setDeleteBrandPartnerConfirm({ open: false, id: null, name: '' })
        // Refresh the brand partners list
        const brandPartnerRes = await apiCall(
          'get',
          apiConfig.GET_BRAND_PARTNER
        )
        if (brandPartnerRes?.data?.code === 2000) {
          setBrandPartnerData(brandPartnerRes.data.data)
        }
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Brand partner deleted successfully',
        })
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to delete brand partner',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting brand partner',
      })
    } finally {
      setDeleteBrandPartnerLoading(false)
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
      {/* Section 1: Designs Crafted */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              {craftedData?.title || 'Designs Crafted, Emotions Captured'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {craftedData?.description ||
                'Manage crafted design section here.'}
            </p>
          </div>
          <button
            onClick={() => console.log('Edit crafted section')}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {craftedData?.images?.map((image, index) => (
            <div
              key={image._id || index}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              <img
                src={image.url}
                alt={image.altText || `Crafted image ${index + 1}`}
                className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
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

      {/* Section 2: Category Gallery */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Category Gallery
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage category-wise image galleries.
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Category Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {categoryData?.map((cat, index) => (
            <button
              key={cat._id || index}
              onClick={() => setSelectedCategory(cat.category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat.category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Images Grid for Selected Category */}
        {categoryData?.map(
          (cat) =>
            cat.category === selectedCategory && (
              <div key={cat._id}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {cat.images?.map((image, imgIndex) => (
                    <div
                      key={image._id || imgIndex}
                      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
                    >
                      <img
                        src={image.url}
                        alt={
                          image.altText ||
                          `${cat.category} image ${imgIndex + 1}`
                        }
                        className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() => setLightboxImage(image.url)}
                      />

                      {/* Overlay with Actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          onClick={() =>
                            openEditCategoryImageModal(image, cat._id)
                          }
                          className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
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
            )
        )}
      </div>

      {/* Section 3: Brand Value */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Brand Value
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage brand value section.
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Brand Value Card */}
        {brandValueData && (
          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700">
            <div className="h-64 overflow-hidden">
              <img
                src={brandValueData.image?.url}
                alt="Brand Value"
                className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightboxImage(brandValueData.image?.url)}
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                {brandValueData.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {brandValueData.subtitle}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {brandValueData.description}
              </p>
            </div>

            {/* Overlay with Actions - covers whole card */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                onClick={() => setIsEditBrandValueModalOpen(true)}
                className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
              >
                <FaEdit className="h-3 w-3" />
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Brand Partners */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Brand Partners
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage brand partner logos.
            </p>
          </div>
          <button
            onClick={() => setIsAddBrandPartnerModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            <FaPlus className="h-4 w-4" />
            Add
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {brandPartnerData?.map((partner, index) => (
            <div
              key={partner._id || index}
              className="group relative flex h-48 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              <img
                src={partner.logo?.url}
                alt={partner.name}
                className="max-h-full max-w-full object-contain"
              />

              {/* Overlay with Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() =>
                    setDeleteBrandPartnerConfirm({
                      open: true,
                      id: partner._id,
                      name: partner.name,
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
      </div>

      {/* Section 5: Portfolio Gallery */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              {portfolioData?.title || 'Portfolio Gallery'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {portfolioData?.description || 'Manage portfolio gallery.'}
            </p>
          </div>
          <button
            onClick={() => setIsEditPortfolioModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Portfolio Images Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {portfolioData?.images?.map((image, index) => (
            <div
              key={image._id || index}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              <img
                src={image.url}
                alt={image.altText || `Portfolio image ${index + 1}`}
                className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightboxImage(image.url)}
              />

              {/* Overlay with Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => openEditPortfolioImageModal(image)}
                  className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: CTA Section */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              CTA Section
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage call to action section for home page.
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* CTA Preview Card */}
        {ctaData && (
          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700">
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
                  className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
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

      {/* Edit CTA Modal */}
      <EditCtaModal
        isOpen={isEditCtaModalOpen}
        onClose={() => setIsEditCtaModalOpen(false)}
        onSubmit={handleEditCtaSubmit}
        loading={editCtaLoading}
        ctaData={ctaData}
      />

      {/* Edit Portfolio Gallery Modal */}
      <EditPortfolioGalleryModal
        isOpen={isEditPortfolioModalOpen}
        onClose={() => setIsEditPortfolioModalOpen(false)}
        onSubmit={handleEditPortfolioSubmit}
        loading={editPortfolioLoading}
        portfolioData={portfolioData}
      />

      {/* Edit Portfolio Image Modal */}
      <EditPortfolioImageModal
        isOpen={isEditPortfolioImageModalOpen}
        onClose={() => {
          setIsEditPortfolioImageModalOpen(false)
          setSelectedPortfolioImage(null)
        }}
        onSubmit={handleEditPortfolioImageSubmit}
        loading={editPortfolioImageLoading}
        imageData={selectedPortfolioImage}
      />

      {/* Edit Brand Value Modal */}
      <EditBrandValueModal
        isOpen={isEditBrandValueModalOpen}
        onClose={() => setIsEditBrandValueModalOpen(false)}
        onSubmit={handleEditBrandValueSubmit}
        loading={editBrandValueLoading}
        brandValueData={brandValueData}
      />

      {/* Edit Category Image Modal */}
      <EditCategoryImageModal
        isOpen={isEditCategoryImageModalOpen}
        onClose={() => {
          setIsEditCategoryImageModalOpen(false)
          setSelectedCategoryImage(null)
          setSelectedCategoryId(null)
        }}
        onSubmit={handleEditCategoryImageSubmit}
        loading={editCategoryImageLoading}
        imageData={selectedCategoryImage}
      />

      {/* Add Brand Partner Modal */}
      <AddBrandPartnerModal
        isOpen={isAddBrandPartnerModalOpen}
        onClose={() => setIsAddBrandPartnerModalOpen(false)}
        onSubmit={handleAddBrandPartnerSubmit}
        loading={addBrandPartnerLoading}
      />

      {/* Delete Brand Partner Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteBrandPartnerConfirm.open}
        onClose={() =>
          setDeleteBrandPartnerConfirm({ open: false, id: null, name: '' })
        }
        onConfirm={handleDeleteBrandPartner}
        title="Delete Brand Partner"
        message={`Are you sure you want to delete "${deleteBrandPartnerConfirm.name}"? This action cannot be undone.`}
        confirmText={deleteBrandPartnerLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />
    </div>
  )
}

export default Home
