import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, tokenManager } from '../lib/api'
import { LoadingSpinner } from '../components/LoadingSpinner'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (tokenManager.isAuthenticated()) {
          const response = await authAPI.getCurrentUser()
          setCurrentUser(response.data)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        tokenManager.removeToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Sign up function for volunteers
  const signup = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      tokenManager.setToken(response.token)
      setCurrentUser(response.user)
      return response.user
    } catch (error) {
      throw error
    }
  }

  // Sign up function for NGOs
  const ngoSignup = async (ngoData) => {
    try {
      const response = await authAPI.ngoRegister(ngoData)
      tokenManager.setToken(response.token)
      setCurrentUser(response.user)
      return { user: response.user, ngo: response.ngo }
    } catch (error) {
      throw error
    }
  }

  // Sign in function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      tokenManager.setToken(response.token)
      setCurrentUser(response.user)
      return response.user
    } catch (error) {
      throw error
    }
  }

  // Sign out function
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenManager.removeToken()
      setCurrentUser(null)
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.getCurrentUser()
      setCurrentUser(response.data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email)
      return response
    } catch (error) {
      throw error
    }
  }

  // Reset password
  const resetPassword = async (resetToken, password) => {
    try {
      const response = await authAPI.resetPassword(resetToken, password)
      tokenManager.setToken(response.token)
      setCurrentUser(response.user)
      return response.user
    } catch (error) {
      throw error
    }
  }

  const value = {
    currentUser,
    signup,
    ngoSignup,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAuthenticated: tokenManager.isAuthenticated()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 