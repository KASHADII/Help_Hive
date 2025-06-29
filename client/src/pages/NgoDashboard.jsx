import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Building, 
  Plus, 
  Users, 
  Calendar, 
  MapPin, 
  Clock,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { tasksAPI, ngoAPI } from '../lib/api'

export const NgoDashboard = () => {
  const [ngoDetails, setNgoDetails] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentUser) {
        navigate('/ngo-login')
        return
      }

      try {
        setLoading(true)
        
        // Load NGO details from backend
        const ngoResponse = await ngoAPI.getMyNGO()
        setNgoDetails(ngoResponse.ngo)
        
        // Load tasks from backend
        const tasksResponse = await tasksAPI.getMyTasks()
        setTasks(tasksResponse.tasks || [])
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // If NGO details not found, redirect to registration
        if (error.message.includes('NGO not found')) {
          navigate('/ngo-register')
          return
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [currentUser, navigate])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getNgoStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                NGO Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {currentUser?.name || currentUser?.displayName}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/post-task')}
              disabled={!ngoDetails || ngoDetails.status !== 'approved'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Task
            </Button>
          </div>
        </div>

        {/* NGO Status */}
        {ngoDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verification Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getNgoStatusBadge(ngoDetails.status)}
                    {ngoDetails.status === 'pending' && (
                      <p className="text-sm text-gray-500">
                        Your application is under review. You'll be able to post tasks once approved.
                      </p>
                    )}
                    {ngoDetails.status === 'approved' && (
                      <p className="text-sm text-green-600">
                        Your organization has been approved! You can now post tasks.
                      </p>
                    )}
                    {ngoDetails.status === 'rejected' && (
                      <p className="text-sm text-red-600">
                        Your application was not approved. Please contact support for more information.
                      </p>
                    )}
                  </div>
                </div>
                {ngoDetails.status === 'pending' && (
                  <Button variant="outline" size="sm" disabled>
                    <Edit className="h-4 w-4 mr-2" />
                    Under Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Building },
                { id: 'tasks', label: 'My Tasks', icon: Calendar },
                { id: 'volunteers', label: 'Volunteers', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Total Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
                  <p className="text-sm text-gray-600">Tasks posted</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Active Volunteers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {tasks.reduce((total, task) => total + (task.volunteers || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Volunteers engaged</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Completed Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {tasks.filter(task => task.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Tasks completed</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
                <Button 
                  onClick={() => navigate('/post-task')}
                  disabled={!ngoDetails || ngoDetails.status !== 'approved'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Task
                </Button>
              </div>

              {tasks.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                      <p className="text-gray-600 mb-4">
                        {!ngoDetails || ngoDetails.status !== 'approved' 
                          ? 'You need to be approved to post tasks.'
                          : 'Start by posting your first task to connect with volunteers.'
                        }
                      </p>
                      {ngoDetails && ngoDetails.status === 'approved' && (
                        <Button onClick={() => navigate('/post-task')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Post Your First Task
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.map((task) => (
                    <Card key={task._id || task.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          {getStatusBadge(task.status)}
                        </div>
                        <CardDescription>{task.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {task.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(task.date).toLocaleDateString()} at {task.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {task.volunteers || 0} / {task.maxVolunteers || '∞'} volunteers
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'volunteers' && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Volunteer Management</h3>
                  <p className="text-gray-600">
                    Manage volunteers for your tasks. This feature is coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 