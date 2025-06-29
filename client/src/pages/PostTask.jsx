import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Plus, X, Loader2, AlertCircle } from 'lucide-react'
import { tasksAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export const PostTask = () => {
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    startDate: '',
    endDate: '',
    volunteersNeeded: 1,
    skills: [],
    requirements: [],
    benefits: [],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    scheduleDate: '',
    scheduleTime: '',
    scheduleLocation: ''
  })

  const [newSkill, setNewSkill] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newBenefit, setNewBenefit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if user is authenticated and is an NGO
  useEffect(() => {
    console.log('PostTask useEffect - isAuthenticated:', isAuthenticated)
    console.log('PostTask useEffect - currentUser:', currentUser)
    
    if (!isAuthenticated) {
      setError('You must be logged in to post a task.')
      return
    }
    
    if (currentUser && currentUser.role !== 'ngo') {
      setError('Only NGOs can post tasks. Please log in with an NGO account.')
      return
    }
    
    // Check if token is valid by making a test API call
    const checkTokenValidity = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('No authentication token found. Please log in again.')
          return
        }
        
        // Test the token by making a simple API call
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          setError('Authentication token is invalid. Please log in again.')
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Token validation error:', error)
        setError('Authentication check failed. Please log in again.')
      }
    }
    
    if (isAuthenticated && currentUser) {
      checkTokenValidity()
    }
  }, [isAuthenticated, currentUser])

  // Show authorization error if user is not authorized
  if (!isAuthenticated || (currentUser && currentUser.role !== 'ngo')) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Authorization Required
          </h3>
          <p className="text-gray-600 mb-4">
            {!isAuthenticated 
              ? 'You must be logged in to post a task.' 
              : 'Only NGOs can post tasks. Please log in with an NGO account.'
            }
          </p>
          <div className="flex gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button onClick={() => navigate('/login')} variant="outline">
                  Login
                </Button>
                <Button onClick={() => navigate('/ngo-login')} variant="outline">
                  NGO Login
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/ngo-login')} variant="outline">
                NGO Login
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const categories = [
    'Healthcare',
    'Education',
    'Environment',
    'Community Service',
    'Animal Welfare',
    'Disaster Relief',
    'Human Rights',
    'Arts & Culture',
    'Sports',
    'Technology',
    'Other'
  ]

  const locations = [
    'Downtown',
    'North Side',
    'South Side',
    'East Side',
    'West Side',
    'Remote',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement('')
    }
  }

  const removeRequirement = (reqToRemove) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== reqToRemove)
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit('')
    }
  }

  const removeBenefit = (benefitToRemove) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check authorization
    if (!isAuthenticated) {
      setError('You must be logged in to post a task.')
      return
    }
    
    if (currentUser && currentUser.role !== 'ngo') {
      setError('Only NGOs can post tasks. Please log in with an NGO account.')
      return
    }
    
    // Debug: Check token
    const token = localStorage.getItem('token')
    console.log('Current user:', currentUser)
    console.log('Is authenticated:', isAuthenticated)
    console.log('Token exists:', !!token)
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'No token')
    
    setLoading(true)
    setError('')
    
    try {
      // Transform form data to match backend structure
      const taskData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        dateTime: {
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString()
        },
        requirements: {
          volunteersNeeded: parseInt(formData.volunteersNeeded),
          skills: formData.skills,
          experience: 'beginner',
          trainingProvided: false
        },
        benefits: formData.benefits.join('. '),
        status: 'active'
      }
      
      console.log('Sending task data:', taskData)
      
      const response = await tasksAPI.create(taskData)
      alert('Task posted successfully!')
      navigate('/tasks')
    } catch (error) {
      console.error('Error posting task:', error)
      
      // Show more detailed error information
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map(err => `${err.path}: ${err.msg}`).join(', ')
        setError(`Validation errors: ${errorMessages}`)
      } else if (error.message) {
        setError(error.message)
      } else {
        setError('Failed to post task. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Post a New Task
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share your organization's needs and connect with passionate volunteers who want to make a difference.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Debug Info:</h3>
        <p className="text-blue-700 text-sm">Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p className="text-blue-700 text-sm">User Role: {currentUser?.role || 'None'}</p>
        <p className="text-blue-700 text-sm">Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
        <p className="text-blue-700 text-sm">User ID: {currentUser?._id || 'None'}</p>
        <div className="mt-2">
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            Refresh Page
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Task Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Help organize food drive for local shelter"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Mumbai"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., 123 Main Street"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Maharashtra"
              />
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., 400001"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Volunteers Needed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volunteers Needed *
              </label>
              <input
                type="number"
                name="volunteersNeeded"
                value={formData.volunteersNeeded}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., 5"
              />
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Detailed description including responsibilities, requirements, and what volunteers will gain"
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Required Skills
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a required skill"
              />
              <Button type="button" onClick={addSkill} className="px-4">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Requirements
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a requirement"
              />
              <Button type="button" onClick={addRequirement} className="px-4">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.requirements.length > 0 && (
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1">{req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(req)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            What Volunteers Will Gain
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a benefit"
              />
              <Button type="button" onClick={addBenefit} className="px-4">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.benefits.length > 0 && (
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <span className="flex-1">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(benefit)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Contact Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Your organization name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="contact@organization.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Schedule Details
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="scheduleDate"
                value={formData.scheduleDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="text"
                name="scheduleTime"
                value={formData.scheduleTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., 9:00 AM - 12:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Location
              </label>
              <input
                type="text"
                name="scheduleLocation"
                value={formData.scheduleLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., 123 Main Street, Downtown"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" size="lg" className="px-8 py-3 text-lg" disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Post Task'}
          </Button>
        </div>
      </form>
    </div>
  )
} 
