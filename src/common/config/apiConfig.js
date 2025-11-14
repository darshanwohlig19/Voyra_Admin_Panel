const baseUrl = process.env.REACT_APP_API_BASE_URL

const config = {
  //Login
  // SIGNUP_API: baseUrl + 'api/signup',
  GET_ORGANIZATIONS: baseUrl + '/api/organizations/getOrganizations',
  CHANGE_ORGANIZATION_STATUS:
    baseUrl + '/api/organizations/changeOrganizationStatus',
  DELETE_ORGANIZATION: baseUrl + '/api/organizations/deleteOrganization',
  GET_ORG_USERS: baseUrl + '/api/orgUsers',

  SIGNIN_API: baseUrl + '/api/userAuth/login',

  // Dashboard APIs
  GET_USER_STATS: baseUrl + '/api/adminDashboard/getUserStats',
  GET_SUBSCRIBER_STATS: baseUrl + '/api/adminDashboard/getSubscriberStats',

  GET_USER_ACTIVITY_STATS: baseUrl + '/api/adminDashboard/getUserActivityStats',
  GET_REVENUE_STATS: baseUrl + '/api/adminDashboard/getRevenueStats',
  GET_SALES_COUNT: baseUrl + '/api/adminDashboard/getSalesCount',
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

  // Short Type API
  ADD_SHORT_TYPE: baseUrl + '/api/adminShotType/addShotType',

  // Shot Type API
  GET_SHOT_TYPE_DATA: baseUrl + '/api/adminShotType/getShotTypeData',
  GET_SHOT_TYPES: baseUrl + '/api/adminShotType/getShotTypes',
  GET_SHOT_TYPE_BY_ID: baseUrl + '/api/adminShotType/getShotType',
  ADD_SHOT_TYPE: baseUrl + '/api/adminShotType/addShotType',
  UPDATE_SHOT_TYPE: baseUrl + '/api/adminShotType/updateShotType',
  DELETE_SHOT_TYPE: baseUrl + '/api/adminShotType/deleteShotType',
  UPDATE_SHOT_TYPE_STATUS: baseUrl + '/api/adminShotType/shotType/status',

  // Parameters API
  GET_PARAMETERS: baseUrl + '/api/adminParameters/getParameters',
  ADD_PARAMETERS: baseUrl + '/api/adminParameters/addParameters',
  UPDATE_PARAMETER: baseUrl + '/api/adminParameters/UpdateParameter',
  DELETE_PARAMETER: baseUrl + '/api/adminParameters/deleteParameter',

  // Projects API (Service Types)
  GET_SERVICE_TYPES: baseUrl + '/api/adminProjectType/ProjectType',
  ADD_SERVICE_TYPE: baseUrl + '/api/adminProjectType/ProjectType',
  DELETE_SERVICE_TYPE: baseUrl + '/api/adminProjectType/projectType',
  UPDATE_PROJECT_STATUS: baseUrl + '/api/adminProjectType/projectType/status',
}
export default config
