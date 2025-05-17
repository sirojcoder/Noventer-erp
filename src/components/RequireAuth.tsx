import React, { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

const RequireAuth: React.FC<{ children: ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default RequireAuth
