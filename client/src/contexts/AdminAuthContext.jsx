import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, tokenManager } from '../lib/api'

const AdminAuthContext = createContext()

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is already logged in
    const checkAdminAuth = async () => {
      try {
        if (tokenManager.isAuthenticated()) {
          const response = await authAPI.getCurrentUser()
          if (response.data.role === 'admin') {
            setAdminUser(response.data)
            setIsAdminAuthenticated(true)
          } else {
            // Not an admin user, clear token
            tokenManager.removeToken()
          }
        }
      } catch (error) {
        console.error('Admin auth check failed:', error)
        tokenManager.removeToken()
      } finally {
        setLoading(false)
      }
    }

    checkAdminAuth()
  }, [])

  const adminLogin = async (username, password) => {
    try {
      const response = await authAPI.adminLogin(username, password)
      tokenManager.setToken(response.token)
      setAdminUser(response.user)
      setIsAdminAuthenticated(true)
      return { success: true, user: response.user }
    } catch (error) {
      throw error
    }
  }

  const adminLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Admin logout error:', error)
    } finally {
      tokenManager.removeToken()
      setAdminUser(null)
      setIsAdminAuthenticated(false)
    }
  }

  const value = {
    isAdminAuthenticated,
    adminUser,
    adminLogin,
    adminLogout
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
} 