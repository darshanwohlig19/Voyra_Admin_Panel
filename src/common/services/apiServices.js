import axios from 'axios'
import { getEncryptedCookie, clearAuthCookies } from '../utils/cookieUtils'

const handle401Error = () => {
  localStorage.clear()
  sessionStorage.clear() // If using sessionStorage
  clearAuthCookies() // Clear encrypted cookies
  window.location.href = '/sign-in'
}

const ApiCaller = () => {
  const apiCall = async (httpType, url, data, options = {}) => {
    try {
      let response

      const config = {
        ...options,
        withCredentials: true, // Enable cookies for cross-origin requests (backend jwt cookie)
        headers: {
          ...options.headers,
        },
      }

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

      if (response?.data?.code === 401) {
        handle401Error()
      }

      return response
    } catch (error) {
      if (error?.response?.status === 401) {
        handle401Error()
      }
      return error.response
    }
  }

  return { apiCall }
}

export default ApiCaller
