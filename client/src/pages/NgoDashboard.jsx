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

export const NgoDashboard = () => {
  const [ngoDetails, setNgoDetails] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate('/ngo-login')
      return
    }

    // Load NGO details from localStorage
    const details = localStorage.getItem('ngoDetails')
    if (details) {
      setNgoDetails(JSON.parse(details))
    }

    // Simulate loading tasks
    setTimeout(() => {
      setTasks([
        {
          id: 1,
          title: 'Volunteer for Community Cleanup',
          description: 'Help clean up the local park and surrounding areas',
          location: 'Central Park, Downtown',
          date: '2024-01-15',
          time: '09:00 AM',
          volunteers: 5,
          maxVolunteers: 10,
          status: 'active'
        },
        {
          id: 2,
          title: 'Food Distribution Drive',
          description: 'Distribute food packages to underprivileged families',
          location: 'Community Center',
          date: '2024-01-20',
          time: '02:00 PM',
          volunteers: 3,
          maxVolunteers: 8,
          status: 'active'
        },
        {
          id: 3,
          title: 'Educational Workshop',
          description: 'Conduct educational workshops for children',
          location: 'Local School',
          date: '2024-01-25',
          time: '10:00 AM',
          volunteers: 2,
          maxVolunteers: 5,
          status: 'completed'
        }
      ])
      setLoading(false)
    }, 1000)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                NGO Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {currentUser?.displayName}
              </p>
            </div>
            <Button onClick={() => navigate('/post-task')}>
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tasks.filter(task => task.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently running
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tasks.reduce((sum, task) => sum + task.volunteers, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all tasks
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
              <Button 
                onClick={() => navigate('/post-task')}
                disabled={ngoDetails?.status !== 'approved'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>

            {ngoDetails?.status !== 'approved' && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">Account Pending Approval</p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    You can view tasks but cannot create new ones until your organization is approved by our admin team.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      {getStatusBadge(task.status)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {task.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {task.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {task.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {task.volunteers}/{task.maxVolunteers} volunteers
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Volunteer Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Recent Volunteers</CardTitle>
                <CardDescription>
                  Volunteers who have signed up for your tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No volunteers have signed up yet.</p>
                  <p className="text-sm">Volunteers will appear here once they join your tasks.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 