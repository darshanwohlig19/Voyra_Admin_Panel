import React, { useState, useEffect } from 'react'
import ApiCaller from '../../common/services/apiServices'
import config from '../../common/config/apiConfig'
import { useSpinner } from '../../common/SpinnerLoader'
import { useToaster } from '../../common/Toaster'

const Config = () => {
  const [configData, setConfigData] = useState([])
  const [imageGeneration, setImageGeneration] = useState('')
  const [videoGeneration, setVideoGeneration] = useState('')
  const [voice, setVoice] = useState('')
  const [character, setCharacter] = useState('')
  const { apiCall } = ApiCaller()
  const { showSpinner, hideSpinner } = useSpinner()
  const { addToast } = useToaster()

  useEffect(() => {
    // fetchConfigData()
  }, [])

  const fetchConfigData = async () => {
    showSpinner()
    try {
      // Add your API call here
      // const response = await apiCall('get', config.GET_CONFIG)

      hideSpinner()
    } catch (error) {
      console.error('Error fetching config data:', error)
      addToast({
        type: 'error',
        title: 'Error',
        description: error?.message || 'Failed to fetch configuration',
        duration: 3000,
      })
      hideSpinner()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Configuration
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your application configuration settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Configuration Form */}
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <form>
              {/* Image Generation Section */}
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Image Generation
                </h3>

                <div className="space-y-2">
                  <label
                    htmlFor="imageGeneration"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Option
                  </label>
                  <select
                    id="imageGeneration"
                    value={imageGeneration}
                    onChange={(e) => setImageGeneration(e.target.value)}
                    className="focus:border-indigo-500 focus:ring-indigo-500/20 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2"
                  >
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>
              </div>

              {/* Video Generation Section */}
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Video Generation
                </h3>

                <div className="space-y-2">
                  <label
                    htmlFor="videoGeneration"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Option
                  </label>
                  <select
                    id="videoGeneration"
                    value={videoGeneration}
                    onChange={(e) => setVideoGeneration(e.target.value)}
                    className="focus:border-indigo-500 focus:ring-indigo-500/20 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2"
                  >
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>
              </div>

              {/* Voice Section */}
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Voice
                </h3>

                <div className="space-y-2">
                  <label
                    htmlFor="voice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Option
                  </label>
                  <select
                    id="voice"
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="focus:border-indigo-500 focus:ring-indigo-500/20 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2"
                  >
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>
              </div>

              {/* Character Section */}
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Character
                </h3>

                <div className="space-y-2">
                  <label
                    htmlFor="character"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Option
                  </label>
                  <select
                    id="character"
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                    className="focus:border-indigo-500 focus:ring-indigo-500/20 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2"
                  >
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hover:bg-indigo-700 rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Config
