import React, { useState, useEffect } from 'react'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'

const About = () => {
  const [storyData, setStoryData] = useState(null)
  const [visionData, setVisionData] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const [ctaData, setCtaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const { apiCall } = ApiCaller()

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
      {/* Section 1: Our Story */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
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
            onClick={() => console.log('Edit story section')}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
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

      {/* Section 2: Vision Section */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Vision Section
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage why choose us and what we do sections.
            </p>
          </div>
          <button
            onClick={() => console.log('Edit vision section')}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Vision Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visionData?.map((item, index) => (
            <div
              key={item._id || index}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Image */}
              {item.images?.[0]?.url && (
                <div className="relative">
                  <img
                    src={item.images[0].url}
                    alt={item.images[0].altText || item.title}
                    className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setLightboxImage(item.images[0].url)}
                  />

                  {/* Overlay with Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => console.log('Edit vision item', item._id)}
                      className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      <FaEdit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        console.log('Delete vision item', item._id)
                      }
                      className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                    >
                      <FaTrash className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
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
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Team Section */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Team Section
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage our approach and team sections.
            </p>
          </div>
          <button
            onClick={() => console.log('Edit team section')}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-navy-600" />

        {/* Team Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {teamData?.map((item, index) => (
            <div
              key={item._id || index}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-navy-600 dark:bg-navy-700"
            >
              {/* Image */}
              {item.images?.[0]?.url && (
                <div className="relative">
                  <img
                    src={item.images[0].url}
                    alt={item.images[0].altText || item.title}
                    className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setLightboxImage(item.images[0].url)}
                  />

                  {/* Overlay with Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => console.log('Edit team item', item._id)}
                      className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      <FaEdit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => console.log('Delete team item', item._id)}
                      className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                    >
                      <FaTrash className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
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
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: CTA Section */}
      <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              CTA Section
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage call to action section for about page.
            </p>
          </div>
          <button
            onClick={() => console.log('Edit CTA section')}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaEdit className="h-4 w-4" />
            Edit
          </button>
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
                  onClick={() => console.log('Edit CTA', ctaData._id)}
                  className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <FaEdit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => console.log('Delete CTA', ctaData._id)}
                  className="flex items-center gap-1 rounded-md bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                >
                  <FaTrash className="h-3 w-3" />
                  Delete
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
    </div>
  )
}

export default About
