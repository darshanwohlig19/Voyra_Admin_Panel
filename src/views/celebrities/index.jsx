import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'
import AddCelebrityCarouselModal from 'components/celebrities/AddCelebrityCarouselModal'
import EditCelebrityCarouselModal from 'components/celebrities/EditCelebrityCarouselModal'
import EditStardomModal from 'components/celebrities/EditStardomModal'
import EditStardomEventModal from 'components/celebrities/EditStardomEventModal'
import EditArtistCollectionModal from 'components/celebrities/EditArtistCollectionModal'
import EditArtistCollectionImageModal from 'components/celebrities/EditArtistCollectionImageModal'
import EditSpotlightModal from 'components/celebrities/EditSpotlightModal'
import EditSpotlightCelebrityModal from 'components/celebrities/EditSpotlightCelebrityModal'
import AddSpotlightCelebrityModal from 'components/celebrities/AddSpotlightCelebrityModal'
import EditLimelightModal from 'components/celebrities/EditLimelightModal'
import AddLimelightImageModal from 'components/celebrities/AddLimelightImageModal'
import EditLimelightImageModal from 'components/celebrities/EditLimelightImageModal'
import { useToaster } from 'common/Toaster'
import ConfirmationModal from 'components/modal/ConfirmationModal'
import ModalPortal from 'components/modal/ModalPortal'

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
  const [isEditStardomModalOpen, setIsEditStardomModalOpen] = useState(false)
  const [editStardomLoading, setEditStardomLoading] = useState(false)
  const [isEditStardomEventModalOpen, setIsEditStardomEventModalOpen] =
    useState(false)
  const [editStardomEventLoading, setEditStardomEventLoading] = useState(false)
  const [selectedStardomEvent, setSelectedStardomEvent] = useState(null)
  const [isEditArtistModalOpen, setIsEditArtistModalOpen] = useState(false)
  const [editArtistLoading, setEditArtistLoading] = useState(false)
  const [isEditArtistImageModalOpen, setIsEditArtistImageModalOpen] =
    useState(false)
  const [editArtistImageLoading, setEditArtistImageLoading] = useState(false)
  const [selectedArtistImage, setSelectedArtistImage] = useState(null)
  const [isEditSpotlightModalOpen, setIsEditSpotlightModalOpen] =
    useState(false)
  const [editSpotlightLoading, setEditSpotlightLoading] = useState(false)
  const [
    isEditSpotlightCelebrityModalOpen,
    setIsEditSpotlightCelebrityModalOpen,
  ] = useState(false)
  const [editSpotlightCelebrityLoading, setEditSpotlightCelebrityLoading] =
    useState(false)
  const [selectedSpotlightCelebrity, setSelectedSpotlightCelebrity] =
    useState(null)
  const [
    isAddSpotlightCelebrityModalOpen,
    setIsAddSpotlightCelebrityModalOpen,
  ] = useState(false)
  const [addSpotlightCelebrityLoading, setAddSpotlightCelebrityLoading] =
    useState(false)
  const [deleteSpotlightCelebrityConfirm, setDeleteSpotlightCelebrityConfirm] =
    useState({ open: false, id: null, name: '' })
  const [deleteSpotlightCelebrityLoading, setDeleteSpotlightCelebrityLoading] =
    useState(false)
  const [isEditLimelightModalOpen, setIsEditLimelightModalOpen] =
    useState(false)
  const [editLimelightLoading, setEditLimelightLoading] = useState(false)
  const [isAddLimelightImageModalOpen, setIsAddLimelightImageModalOpen] =
    useState(false)
  const [addLimelightImageLoading, setAddLimelightImageLoading] =
    useState(false)
  const [isEditLimelightImageModalOpen, setIsEditLimelightImageModalOpen] =
    useState(false)
  const [editLimelightImageLoading, setEditLimelightImageLoading] =
    useState(false)
  const [selectedLimelightImage, setSelectedLimelightImage] = useState(null)
  const [deleteLimelightImageConfirm, setDeleteLimelightImageConfirm] =
    useState({
      open: false,
      id: null,
    })
  const [deleteLimelightImageLoading, setDeleteLimelightImageLoading] =
    useState(false)
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

  const handleEditSpotlight = async (data) => {
    try {
      setEditSpotlightLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_SPOTLIGHT_SECTION}/${spotlightData._id}`,
        data
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Spotlight section updated successfully',
        })
        setIsEditSpotlightModalOpen(false)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update spotlight section',
        })
      }
    } catch (error) {
      console.error('Error updating spotlight section:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating spotlight section',
      })
    } finally {
      setEditSpotlightLoading(false)
    }
  }

  const openEditSpotlightCelebrityModal = (celeb) => {
    setSelectedSpotlightCelebrity(celeb)
    setIsEditSpotlightCelebrityModalOpen(true)
  }

  const handleEditSpotlightCelebrity = async (celebrityId, formData) => {
    try {
      setEditSpotlightCelebrityLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_SPOTLIGHT_CELEBRITY}/${spotlightData._id}/${celebrityId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Celebrity updated successfully',
        })
        setIsEditSpotlightCelebrityModalOpen(false)
        setSelectedSpotlightCelebrity(null)
        fetchAllSections()
        if (selectedType) {
          fetchSpotlightByType(selectedType)
        }
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to update celebrity',
        })
      }
    } catch (error) {
      console.error('Error updating spotlight celebrity:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating celebrity',
      })
    } finally {
      setEditSpotlightCelebrityLoading(false)
    }
  }

  const handleDeleteSpotlightCelebrity = async () => {
    if (!deleteSpotlightCelebrityConfirm.id) return
    try {
      setDeleteSpotlightCelebrityLoading(true)
      const response = await apiCall(
        'delete',
        `${apiConfig.DELETE_SPOTLIGHT_CELEBRITY}/${spotlightData._id}/byId/${deleteSpotlightCelebrityConfirm.id}`
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Celebrity deleted successfully',
        })
        setDeleteSpotlightCelebrityConfirm({ open: false, id: null, name: '' })
        fetchAllSections()
        if (selectedType) {
          fetchSpotlightByType(selectedType)
        }
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to delete celebrity',
        })
      }
    } catch (error) {
      console.error('Error deleting spotlight celebrity:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting celebrity',
      })
    } finally {
      setDeleteSpotlightCelebrityLoading(false)
    }
  }

  const handleAddSpotlightCelebrity = async (formData) => {
    try {
      setAddSpotlightCelebrityLoading(true)
      const response = await apiCall(
        'post',
        `${apiConfig.ADD_SPOTLIGHT_CELEBRITY}/${spotlightData._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Celebrity added successfully',
        })
        setIsAddSpotlightCelebrityModalOpen(false)
        fetchAllSections()
        if (selectedType) {
          fetchSpotlightByType(selectedType)
        }
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to add celebrity',
        })
      }
    } catch (error) {
      console.error('Error adding spotlight celebrity:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error adding celebrity',
      })
    } finally {
      setAddSpotlightCelebrityLoading(false)
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

  const handleEditStardom = async (data) => {
    try {
      setEditStardomLoading(true)
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_STARDOM}/${stardomData._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Stardom section updated successfully',
        })
        setIsEditStardomModalOpen(false)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update stardom section',
        })
      }
    } catch (error) {
      console.error('Error updating stardom section:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating stardom section',
      })
    } finally {
      setEditStardomLoading(false)
    }
  }

  const handleEditStardomEvent = async (formData) => {
    try {
      setEditStardomEventLoading(true)
      const response = await apiCall(
        'put',
        `${apiConfig.UPDATE_STARDOM}/${stardomData._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Stardom event updated successfully',
        })
        setIsEditStardomEventModalOpen(false)
        setSelectedStardomEvent(null)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update stardom event',
        })
      }
    } catch (error) {
      console.error('Error updating stardom event:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating stardom event',
      })
    } finally {
      setEditStardomEventLoading(false)
    }
  }

  const openEditStardomEventModal = (event) => {
    setSelectedStardomEvent(event)
    setIsEditStardomEventModalOpen(true)
  }

  const handleEditArtistCollection = async (formData) => {
    try {
      setEditArtistLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_ARTIST_COLLECTION,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Artist collection updated successfully',
        })
        setIsEditArtistModalOpen(false)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update artist collection',
        })
      }
    } catch (error) {
      console.error('Error updating artist collection:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating artist collection',
      })
    } finally {
      setEditArtistLoading(false)
    }
  }

  const handleEditArtistImage = async (formData) => {
    try {
      setEditArtistImageLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_ARTIST_COLLECTION,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Artist image updated successfully',
        })
        setIsEditArtistImageModalOpen(false)
        setSelectedArtistImage(null)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update artist image',
        })
      }
    } catch (error) {
      console.error('Error updating artist image:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating artist image',
      })
    } finally {
      setEditArtistImageLoading(false)
    }
  }

  const openEditArtistImageModal = (image) => {
    setSelectedArtistImage(image)
    setIsEditArtistImageModalOpen(true)
  }

  const handleEditLimelight = async (formData) => {
    try {
      setEditLimelightLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_CURRENT_LIMELIGHT,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Limelight section updated successfully',
        })
        setIsEditLimelightModalOpen(false)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description:
            response?.data?.message || 'Failed to update limelight section',
        })
      }
    } catch (error) {
      console.error('Error updating limelight section:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating limelight section',
      })
    } finally {
      setEditLimelightLoading(false)
    }
  }

  const handleAddLimelightImage = async (formData) => {
    try {
      setAddLimelightImageLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_CURRENT_LIMELIGHT,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Image added successfully',
        })
        setIsAddLimelightImageModalOpen(false)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to add image',
        })
      }
    } catch (error) {
      console.error('Error adding limelight image:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error adding image',
      })
    } finally {
      setAddLimelightImageLoading(false)
    }
  }

  const handleEditLimelightImage = async (formData) => {
    try {
      setEditLimelightImageLoading(true)
      const response = await apiCall(
        'put',
        apiConfig.UPDATE_CURRENT_LIMELIGHT,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Image updated successfully',
        })
        setIsEditLimelightImageModalOpen(false)
        setSelectedLimelightImage(null)
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to update image',
        })
      }
    } catch (error) {
      console.error('Error updating limelight image:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error updating image',
      })
    } finally {
      setEditLimelightImageLoading(false)
    }
  }

  const openEditLimelightImageModal = (image) => {
    setSelectedLimelightImage(image)
    setIsEditLimelightImageModalOpen(true)
  }

  const handleDeleteLimelightImage = async () => {
    if (!deleteLimelightImageConfirm.id) return
    try {
      setDeleteLimelightImageLoading(true)
      const response = await apiCall(
        'delete',
        `${apiConfig.DELETE_LIMELIGHT_IMAGE}/${deleteLimelightImageConfirm.id}`
      )
      if (response?.data?.code === 2000 || response?.status === 200) {
        addToast({
          type: 'success',
          title: 'Success',
          description: 'Image deleted successfully',
        })
        setDeleteLimelightImageConfirm({ open: false, id: null })
        fetchAllSections()
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          description: response?.data?.message || 'Failed to delete image',
        })
      }
    } catch (error) {
      console.error('Error deleting limelight image:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Error deleting image',
      })
    } finally {
      setDeleteLimelightImageLoading(false)
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
      {/* Section 1: Currently in the Limelight */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
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
              onClick={() => setIsEditLimelightModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
            >
              <FaEdit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => setIsAddLimelightImageModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
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
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700"
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
                  onClick={() => openEditLimelightImageModal(image)}
                  className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() =>
                    setDeleteLimelightImageConfirm({
                      open: true,
                      id: image._id,
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

      {/* Section 2: Artist Collection */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              {artistData?.title || 'Artist Collection'}
            </h2>
          </div>
          <button
            onClick={() => setIsEditArtistModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
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
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Artist Image */}
              <div className="overflow-hidden">
                <img
                  src={artist.url}
                  alt={artist.altText || `Artist ${index + 1}`}
                  className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setLightboxImage(artist.url)}
                />
              </div>

              {/* Artist Description */}
              {artist.description && (
                <div className="p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {artist.description}
                  </p>
                </div>
              )}

              {/* Overlay with Actions - covers full card */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => openEditArtistImageModal(artist)}
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

      {/* Section 3: Behind the Spotlight */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
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
              onClick={() => setIsEditSpotlightModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
            >
              <FaEdit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => setIsAddSpotlightCelebrityModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
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
                  ? 'bg-[#ebd6ac] text-white'
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
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700"
              >
                {/* Celebrity Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={celeb.image?.url}
                    alt={celeb.image?.altText || celeb.name}
                    className="h-40 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setLightboxImage(celeb.image?.url)}
                  />

                  {/* Type Badge */}
                  <div className="absolute left-2 top-2 rounded-full bg-[#ebd6ac] px-2 py-0.5 text-xs font-medium text-white">
                    {celeb.type}
                  </div>
                </div>

                {/* Celebrity Name */}
                <div className="p-3">
                  <h3 className="text-center text-sm font-semibold text-navy-700 dark:text-white">
                    {celeb.name}
                  </h3>
                </div>

                {/* Overlay with Actions - covers full card */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    onClick={() => openEditSpotlightCelebrityModal(celeb)}
                    className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
                  >
                    <FaEdit className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteSpotlightCelebrityConfirm({
                        open: true,
                        id: celeb._id,
                        name: celeb.name,
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
        )}

        {/* Empty State */}
        {!spotlightLoading && spotlightCelebrities.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No celebrities found for this type.
          </p>
        )}
      </div>

      {/* Section 4: Where Stardom Meets Your Story */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
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
            onClick={() => setIsEditStardomModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
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
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700"
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

              {/* Overlay with Actions - covers full card */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => openEditStardomEventModal(event)}
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

      {/* Section 5: Celebrity Carousel */}
      <div className="w-full rounded-xl bg-white p-6 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:bg-navy-800">
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
              className="flex items-center gap-2 rounded-lg bg-[#ebd6ac] px-4 py-2 text-black hover:bg-[#EDCF93]"
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
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-[0px_3px_8px_rgba(0,0,0,0.24)] dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={item.image?.url}
                  alt={item.image?.altText || 'Celebrity'}
                  className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setLightboxImage(item.image?.url)}
                />
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

              {/* Overlay with Actions - covers full card */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => openEditCarouselModal(item)}
                  className="flex items-center gap-1 rounded-md bg-[#ebd6ac] px-2 py-1 text-sm text-black hover:bg-[#EDCF93]"
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
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <ModalPortal>
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
        </ModalPortal>
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

      {/* Edit Spotlight Section Modal */}
      <EditSpotlightModal
        isOpen={isEditSpotlightModalOpen}
        onClose={() => setIsEditSpotlightModalOpen(false)}
        onSubmit={handleEditSpotlight}
        loading={editSpotlightLoading}
        spotlightData={spotlightData}
      />

      {/* Add Spotlight Celebrity Modal */}
      <AddSpotlightCelebrityModal
        isOpen={isAddSpotlightCelebrityModalOpen}
        onClose={() => setIsAddSpotlightCelebrityModalOpen(false)}
        onSubmit={handleAddSpotlightCelebrity}
        loading={addSpotlightCelebrityLoading}
        types={spotlightData?.types || []}
      />

      {/* Delete Spotlight Celebrity Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteSpotlightCelebrityConfirm.open}
        onClose={() =>
          setDeleteSpotlightCelebrityConfirm({
            open: false,
            id: null,
            name: '',
          })
        }
        onConfirm={handleDeleteSpotlightCelebrity}
        title="Delete Celebrity"
        message={`Are you sure you want to delete "${deleteSpotlightCelebrityConfirm.name}"? This action cannot be undone.`}
        confirmText={deleteSpotlightCelebrityLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />

      {/* Edit Spotlight Celebrity Modal */}
      <EditSpotlightCelebrityModal
        isOpen={isEditSpotlightCelebrityModalOpen}
        onClose={() => {
          setIsEditSpotlightCelebrityModalOpen(false)
          setSelectedSpotlightCelebrity(null)
        }}
        onSubmit={handleEditSpotlightCelebrity}
        loading={editSpotlightCelebrityLoading}
        celebrityData={selectedSpotlightCelebrity}
        types={spotlightData?.types || []}
      />

      {/* Edit Stardom Section Modal */}
      <EditStardomModal
        isOpen={isEditStardomModalOpen}
        onClose={() => setIsEditStardomModalOpen(false)}
        onSubmit={handleEditStardom}
        loading={editStardomLoading}
        stardomData={stardomData}
      />

      {/* Edit Stardom Event Modal */}
      <EditStardomEventModal
        isOpen={isEditStardomEventModalOpen}
        onClose={() => {
          setIsEditStardomEventModalOpen(false)
          setSelectedStardomEvent(null)
        }}
        onSubmit={handleEditStardomEvent}
        loading={editStardomEventLoading}
        eventData={selectedStardomEvent}
      />

      {/* Edit Artist Collection Modal */}
      <EditArtistCollectionModal
        isOpen={isEditArtistModalOpen}
        onClose={() => setIsEditArtistModalOpen(false)}
        onSubmit={handleEditArtistCollection}
        loading={editArtistLoading}
        artistData={artistData}
      />

      {/* Edit Artist Collection Image Modal */}
      <EditArtistCollectionImageModal
        isOpen={isEditArtistImageModalOpen}
        onClose={() => {
          setIsEditArtistImageModalOpen(false)
          setSelectedArtistImage(null)
        }}
        onSubmit={handleEditArtistImage}
        loading={editArtistImageLoading}
        imageData={selectedArtistImage}
      />

      {/* Edit Limelight Section Modal */}
      <EditLimelightModal
        isOpen={isEditLimelightModalOpen}
        onClose={() => setIsEditLimelightModalOpen(false)}
        onSubmit={handleEditLimelight}
        loading={editLimelightLoading}
        limelightData={limelightData}
      />

      {/* Add Limelight Image Modal */}
      <AddLimelightImageModal
        isOpen={isAddLimelightImageModalOpen}
        onClose={() => setIsAddLimelightImageModalOpen(false)}
        onSubmit={handleAddLimelightImage}
        loading={addLimelightImageLoading}
      />

      {/* Edit Limelight Image Modal */}
      <EditLimelightImageModal
        isOpen={isEditLimelightImageModalOpen}
        onClose={() => {
          setIsEditLimelightImageModalOpen(false)
          setSelectedLimelightImage(null)
        }}
        onSubmit={handleEditLimelightImage}
        loading={editLimelightImageLoading}
        imageData={selectedLimelightImage}
      />

      {/* Delete Limelight Image Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteLimelightImageConfirm.open}
        onClose={() =>
          setDeleteLimelightImageConfirm({ open: false, id: null })
        }
        onConfirm={handleDeleteLimelightImage}
        title="Delete Limelight Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText={deleteLimelightImageLoading ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        confirmColorScheme="red"
        icon="delete"
      />
    </div>
  )
}

export default Celebrities
