import axios from 'axios'

const handle401Error = () => {
  localStorage.clear()
  sessionStorage.clear() // If using sessionStorage
  window.location.href = '/sign-in'
}

const ApiCaller = () => {
  const apiCall = async (httpType, url, data, options = {}) => {
    try {
      let response
      const config = {
        ...options,
        withCredentials: true, // Always ensure cookies are sent with requests
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
