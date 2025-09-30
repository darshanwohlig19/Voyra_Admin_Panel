import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import CryptoJS from 'crypto-js'

const apiService = ApiCaller()

// const getAllUserList = async () => {
//   const apiUrl = apiConfig.USER_LIST
//   try {
//     const response = await apiService.apiCall('get', apiUrl)
//     if (response?.status === 200) {
//       return response?.data
//     } else {
//       console.error('Error response from API:', response)
//       return null
//     }
//   } catch (error) {
//     console.error('Error fetching config table data:', error)
//     return null
//   }
// }
// In your common function file
const addFolderAPI = async (name, parent_folder, type) => {
  const payload = {
    name: name,
    parent_folder: parent_folder,
    type: type,
    created_at: new Date().toISOString(),
    created_by: 'admin',
  }

  const apiUrl = apiConfig.NEW_FOLDER
  try {
    const response = await apiService.apiCall('post', apiUrl, payload)
    if (response?.status === 200) {
      return response
    } else {
      console.error('Error response from API:', response)
      return null
    }
  } catch (error) {
    console.error('Error fetching config table data:', error)
    return null
  }
}

export {
  addFolderAPI,
  //  getAllUserList
}
