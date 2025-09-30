import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * AuthGuard component for handling authentication.
 *
 * @param {Object} children - The child components to be rendered.
 * @param {Object} rest - Additional props for the component.
 * @return {JSX.Element} The rendered child components based on authentication status.
 */
const AuthGuard = ({ children, ...rest }) => {
  const isAuthenticated = localStorage.getItem('bearerToken') ? true : false // You should implement your own authentication logic

  return <>{!isAuthenticated ? children : <Navigate to="/" replace />}</>
}

export default AuthGuard
