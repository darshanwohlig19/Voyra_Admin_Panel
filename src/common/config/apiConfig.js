const baseUrl = process.env.REACT_APP_API_BASE_URL

const config = {
  //Login
  // SIGNUP_API: baseUrl + 'api/signup',
  GET_ORGANIZATIONS: baseUrl + '/api/organizations/getOrganizations',
  GET_ORG_USERS: baseUrl + '/api/orgUsers',

  SIGNIN_API: baseUrl + '/api/userAuth/login',

  // Dashboard APIs
  GET_USER_STATS: baseUrl + '/api/adminDashboard/getUserStats',
  GET_SUBSCRIBER_STATS: baseUrl + '/api/adminDashboard/getSubscriberStats',

  GET_USER_ACTIVITY_STATS: baseUrl + '/api/adminDashboard/getUserActivityStats',
  GET_REVENUE_STATS: baseUrl + '/api/adminDashboard/getRevenueStats',
  IS_LOGIN: baseUrl + 'isLoggedIn',
  IS_LOGOUT: baseUrl + 'refresh/logout',
  BLOCK_USER: baseUrl + 'block_user',
  NEW_FOLDER: baseUrl + 'new_folder',
  USER_LIST: baseUrl + 'get_all_users',
  GET_ALL_DEPARTMENTS: baseUrl + 'get_all_departments',
  UPDATE_FOLDER: baseUrl + 'update_folder/{folder_id}',
  DELETE_FOLDER: baseUrl + 'delete_folder/{folder_id}',
  VIEW_FOLDER: baseUrl + 'view_folder/{folder_id}',
  LOCK_FOLDER: baseUrl + 'lock_folder/{folder_id}',
  UPLOAD_FILES: baseUrl + 'upload_files',
  DOWNLOAD: baseUrl + '/download/{s3_key}',
  UPDATE_FILES: baseUrl + 'update_file/{file_id}',
  DELETE_FILES: baseUrl + 'delete_file/{file_id}',
  GET_ALL_DELETED_FILES: baseUrl + 'get_all_deleted_files',
  IS_LOGOUT: baseUrl + 'refresh/logout',
}
export default config
