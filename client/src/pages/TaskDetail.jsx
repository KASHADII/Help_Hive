import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  Calendar, 
  Building, 
  Phone, 
  Mail, 
  Globe,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { tasksAPI } from '../lib/api'
import { safeRender, formatLocation, formatDate } from '../lib/utils'

export const TaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await tasksAPI.getById(id)
      setTask(response.data)
    } catch (error) {
      console.error('Error fetching task:', error)
      setError('Failed to load task details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    setShowApplicationForm(true)
  }

  const handleSubmitApplication = (e) => {
    e.preventDefault()
    setHasApplied(true)
    setShowApplicationForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link to="/tasks" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tasks
      </Link>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Task
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchTask} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => navigate('/tasks')} variant="outline">
              Back to Tasks
            </Button>
          </div>
        </div>
      )}

      {/* Task Content */}
      {!loading && !error && task && (
        <>
          {/* Task Header */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    {task?.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{task?.rating}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {task?.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {task?.organization}
                </p>
                <p className="text-gray-600">
                  {task?.description}
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>
                  {typeof task?.location === 'object' && task.location !== null
                    ? `${task.location.address || ''}, ${task.location.city || ''}, ${task.location.state || ''} ${task.location.zipCode || ''}`
                    : task?.location || 'N/A'}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{task?.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>{task?.applicants} applicants</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Deadline: {new Date(task?.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {hasApplied ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Application Submitted!</span>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleApply}
                  className="flex-1 sm:flex-none"
                >
                  Apply for this Task
                </Button>
              )}
              <Button variant="outline" size="lg">
                Save for Later
              </Button>
            </div>
          </div>

          {/* Application Form Modal */}
          {showApplicationForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Apply for Task
                </h2>
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why are you interested in this task?
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Tell us about your motivation and relevant experience..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relevant skills or experience
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="List any relevant skills, experience, or qualifications..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Weekends, Afternoons, Flexible"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1">
                      Submit Application
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Detailed Information */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About this Task
                </h2>
                <div className="prose prose-gray max-w-none">
                  {(task.longDescription
                    ? task.longDescription.split('\n\n')
                    : ['No detailed description available.']
                  ).map((paragraph, index) => (
                    <p key={index} className="text-gray-600 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {Array.isArray(task?.requirements) && task.requirements.length > 0 ? (
                    task.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No specific requirements listed.</li>
                  )}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What You'll Gain
                </h2>
                <ul className="space-y-2">
                  {Array.isArray(task?.benefits) && task.benefits.length > 0 ? (
                    task.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No benefits listed.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Organization Info */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Organization
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{task?.organization}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{task?.contactInfo?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{task?.contactInfo?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    {task?.contactInfo?.website ? (
  <a href={`https://${task.contactInfo.website}`} className="text-red-600 hover:underline">
    {task.contactInfo.website}
  </a>
) : (
  <span className="text-gray-600">N/A</span>
)}
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Schedule
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Date</span>
                    <p className="text-gray-900">{task?.schedule?.date || 'N/A'}</p>
                    <span className="text-sm text-gray-500">Time</span>
                    <p className="text-gray-900">{task?.schedule?.time || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location</span>
                    <p className="text-gray-900">{task?.schedule?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(task?.skills) && task.skills.length > 0 ? (
  task.skills.map((skill, index) => (
    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
      {skill}
    </span>
  ))
) : (
  <span className="text-gray-500">No skills listed.</span>
)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}