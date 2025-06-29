const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:5000/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    // If there are validation errors, throw them as an object
    if (data.errors && Array.isArray(data.errors)) {
      const error = new Error(data.message || 'Validation failed')
      error.errors = data.errors
      throw error
    }
    
    // Otherwise throw with the message
    throw new Error(data.message || 'Something went wrong')
  }
  
  return data
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  console.log('getAuthHeaders - Token:', token ? token.substring(0, 20) + '...' : 'No token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// Authentication API
export const authAPI = {
  // Register volunteer
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  // Register NGO
  ngoRegister: async (ngoData) => {
    const response = await fetch(`${API_BASE_URL}/auth/ngo-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ngoData)
    })
    return handleResponse(response)
  },

  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

  // Admin login
  adminLogin: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    return handleResponse(response)
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    return handleResponse(response)
  },

  // Reset password
  resetPassword: async (resetToken, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${resetToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    })
    return handleResponse(response)
  }
}

// Tasks API
export const tasksAPI = {
  // Get all tasks
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/tasks?${params}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get featured tasks
  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/featured`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get urgent tasks
  getUrgent: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/urgent`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get my tasks (for NGOs)
  getMyTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/tasks/my?${params}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get single task
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Create task
  create: async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    })
    return handleResponse(response)
  },

  // Update task
  update: async (id, taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    })
    return handleResponse(response)
  },

  // Delete task
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Apply for task
  apply: async (id, applicationData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    })
    return handleResponse(response)
  },

  // Update application status
  updateApplication: async (taskId, applicationId, statusData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/applications/${applicationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData)
    })
    return handleResponse(response)
  },

  // Complete task
  complete: async (id, completionData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(completionData)
    })
    return handleResponse(response)
  }
}

// Users API
export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    })
    return handleResponse(response)
  },

  // Update avatar
  updateAvatar: async (avatarUrl) => {
    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ avatar: avatarUrl })
    })
    return handleResponse(response)
  },

  // Get user by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get user tasks
  getUserTasks: async (id, type = 'completed') => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/tasks?type=${type}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/users/stats/leaderboard?limit=${limit}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Search users
  search: async (query, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/users/search?q=${query}&limit=${limit}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// NGOs API
export const ngosAPI = {
  // Get all NGOs
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/ngos?${params}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get featured NGOs
  getFeatured: async (limit = 6) => {
    const response = await fetch(`${API_BASE_URL}/ngos/featured?limit=${limit}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get NGO by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/ngos/${id}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get NGO tasks
  getTasks: async (id, filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/ngos/${id}/tasks?${params}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get my NGO profile
  getMyProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/ngos/profile/my`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Update NGO profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/ngos/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    })
    return handleResponse(response)
  },

  // Update logo
  updateLogo: async (logoUrl) => {
    const response = await fetch(`${API_BASE_URL}/ngos/logo`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ logo: logoUrl })
    })
    return handleResponse(response)
  },

  // Update banner
  updateBanner: async (bannerUrl) => {
    const response = await fetch(`${API_BASE_URL}/ngos/banner`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ banner: bannerUrl })
    })
    return handleResponse(response)
  },

  // Search NGOs
  search: async (query, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/ngos/search?q=${query}&limit=${limit}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get stats by category
  getStatsByCategory: async () => {
    const response = await fetch(`${API_BASE_URL}/ngos/stats/categories`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get stats by location
  getStatsByLocation: async () => {
    const response = await fetch(`${API_BASE_URL}/ngos/stats/locations`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// NGO API
export const ngoAPI = {
  // Get all NGOs (public)
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/ngos?${params}`)
    return handleResponse(response)
  },

  // Get featured NGOs
  getFeatured: async (limit = 6) => {
    const response = await fetch(`${API_BASE_URL}/ngos/featured?limit=${limit}`)
    return handleResponse(response)
  },

  // Get single NGO
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/ngos/${id}`)
    return handleResponse(response)
  },

  // Get tasks by NGO
  getTasks: async (id, filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/ngos/${id}/tasks?${params}`)
    return handleResponse(response)
  },

  // Get current user's NGO profile
  getMyNGO: async () => {
    const response = await fetch(`${API_BASE_URL}/ngos/profile/my`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Update NGO profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/ngos/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    })
    return handleResponse(response)
  },

  // Upload NGO logo
  uploadLogo: async (file) => {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await fetch(`${API_BASE_URL}/ngos/profile/logo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Upload NGO banner
  uploadBanner: async (file) => {
    const formData = new FormData()
    formData.append('banner', file)

    const response = await fetch(`${API_BASE_URL}/ngos/profile/banner`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    return handleResponse(response)
  }
}

// Admin API
export const adminAPI = {
  // Get dashboard stats
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get all users
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get all NGOs
  getNGOs: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/admin/ngos?${params}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Approve NGO
  approveNGO: async (id, adminNotes = '') => {
    const response = await fetch(`${API_BASE_URL}/admin/ngos/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ adminNotes })
    })
    return handleResponse(response)
  },

  // Reject NGO
  rejectNGO: async (id, rejectionReason, adminNotes = '') => {
    const response = await fetch(`${API_BASE_URL}/admin/ngos/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rejectionReason, adminNotes })
    })
    return handleResponse(response)
  },

  // Get all tasks
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/admin/tasks?${params}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Toggle task feature
  toggleTaskFeature: async (id, isFeatured) => {
    const response = await fetch(`${API_BASE_URL}/admin/tasks/${id}/feature`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isFeatured })
    })
    return handleResponse(response)
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Get system stats
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Send broadcast
  sendBroadcast: async (message, targetRole = 'all') => {
    const response = await fetch(`${API_BASE_URL}/admin/broadcast`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, targetRole })
    })
    return handleResponse(response)
  }
}

// Upload API
export const uploadAPI = {
  // Upload single image
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Upload multiple images
  uploadMultiple: async (files) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })

    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await fetch(`${API_BASE_URL}/upload/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Upload logo
  uploadLogo: async (file) => {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await fetch(`${API_BASE_URL}/upload/logo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Upload banner
  uploadBanner: async (file) => {
    const formData = new FormData()
    formData.append('banner', file)

    const response = await fetch(`${API_BASE_URL}/upload/banner`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Delete image
  deleteImage: async (publicId) => {
    const response = await fetch(`${API_BASE_URL}/upload/${publicId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// Token management
export const tokenManager = {
  setToken: (token) => {
    localStorage.setItem('token', token)
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  removeToken: () => {
    localStorage.removeItem('token')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
} 