import axios from 'axios'
import { getEncryptedCookie, clearAuthCookies } from '../utils/cookieUtils'

const handle401Error = () => {
  // Don't redirect if already on sign-in or sign-up page
  const currentPath = window.location.pathname
  if (currentPath === '/sign-in' || currentPath === '/sign-up') {
    return
  }

  localStorage.clear()
  sessionStorage.clear()
  clearAuthCookies()
  window.location.href = '/sign-in'
}

const ApiCaller = () => {
  const apiCall = async (httpType, url, data, options = {}) => {
    try {
      let response

      // Get token from encrypted cookie
      const token = getEncryptedCookie('bearerToken')
      console.log('🚀 Request:', httpType.toUpperCase(), url)

      // Build config with token
      const config = {
        ...options,
        timeout: 30000, // 30 seconds timeout
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }

      // Add Bearer token if exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      console.log('🔑 Token included:', !!token)

      // Make request based on HTTP method
      switch (httpType.trim().toLowerCase()) {
        case 'get':
          response = await axios.get(url, config)
          break
        case 'post':
          response = await axios.post(url, data, config)
          break
        case 'put':
          response = await axios.put(url, data, config)
          break
        case 'delete':
          response = await axios.delete(url, { ...config, data })
          break
        default:
          throw new Error('Invalid HTTP method provided')
      }

      console.log('✅ Response:', response.status)

      // Check for 401 in response data
      if (response?.data?.code === 401) {
        handle401Error()
      }

      return response
    } catch (error) {
      // Handle cancelled requests
      if (axios.isCancel(error)) {
        console.warn('⚠️ Request was cancelled')
        throw error
      }

      // Handle 401 unauthorized
      if (error?.response?.status === 401) {
        console.error('❌ Unauthorized:', error.response?.config?.url)
        handle401Error()
      } else {
        console.error('❌ Error:', error.response?.status, error.message)
      }

      // Return error response for handling in components
      return error.response || { status: 500, data: { message: error.message } }
    }
  }

  return { apiCall }
}

export default ApiCaller
