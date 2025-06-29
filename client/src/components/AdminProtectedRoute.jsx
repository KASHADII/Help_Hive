import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAdminAuth()

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
} 