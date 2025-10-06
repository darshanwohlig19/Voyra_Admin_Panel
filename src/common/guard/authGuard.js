import React from 'react'
import { Navigate } from 'react-router-dom'
import ApiCaller from 'common/services/apiServices'
import apiConfig from 'common/config/apiConfig'
import { getEncryptedCookie } from 'common/utils/cookieUtils'
/**
 * AuthGuard component for handling authentication.
 *
 * @param {Object} children - The child components to be rendered.
 * @param {Object} rest - Additional props for the component.
 * @return {JSX.Element} The rendered child components based on authentication status.
 */
const AuthGuard = ({ children, ...rest }) => {
  const isAuthenticated = getEncryptedCookie('bearerToken') ? true : false

  return <>{isAuthenticated ? children : <Navigate to="/sign-in" replace />}</>
}

export default AuthGuard
