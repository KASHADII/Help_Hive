import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    // Check if the route is NGO-specific and redirect accordingly
    if (location.pathname.includes('/ngo-')) {
      return <Navigate to="/ngo-login" replace />
    }
    return <Navigate to="/login" replace />
  }

  return children
} 