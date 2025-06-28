import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  TrendingUp, 
  Award,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  User
} from 'lucide-react'

export const Dashboard = () => {
  const [userType, setUserType] = useState('student') // 'student' or 'ngo'

  // Mock data for student dashboard
  const studentData = {
    applications: [
      {
        id: 1,
        taskTitle: 'Help organize food drive for local shelter',
        organization: 'Community Care Center',
        status: 'pending',
        appliedDate: '2024-01-15',
        taskDate: '2024-02-15'
      },
      {
        id: 2,
        taskTitle: 'Teach basic computer skills to seniors',
        organization: 'Senior Tech Support',
        status: 'accepted',
        appliedDate: '2024-01-10',
        taskDate: '2024-02-20'
      },
      {
        id: 3,
        taskTitle: 'Assist with environmental cleanup event',
        organization: 'Green Earth Initiative',
        status: 'completed',
        appliedDate: '2024-01-05',
        taskDate: '2024-01-25'
      }
    ],
    stats: {
      totalApplications: 12,
      acceptedTasks: 8,
      completedTasks: 6,
      totalHours: 24
    }
  }

  // Mock data for NGO dashboard
  const ngoData = {
    postedTasks: [
      {
        id: 1,
        title: 'Help organize food drive for local shelter',
        applicants: 12,
        status: 'active',
        postedDate: '2024-01-10',
        deadline: '2024-02-15'
      },
      {
        id: 2,
        title: 'Website development for non-profit',
        applicants: 6,
        status: 'active',
        postedDate: '2024-01-08',
        deadline: '2024-03-01'
      },
      {
        id: 3,
        title: 'Art workshop for children',
        applicants: 10,
        status: 'completed',
        postedDate: '2024-01-05',
        deadline: '2024-01-25'
      }
    ],
    stats: {
      totalTasks: 15,
      activeTasks: 8,
      totalApplicants: 45,
      completedTasks: 7
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'completed': return <Award className="h-4 w-4" />
      case 'active': return <TrendingUp className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's an overview of your activity.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setUserType('student')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                userType === 'student'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('ngo')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                userType === 'ngo'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              NGO
            </button>
          </div>
          {userType === 'ngo' && (
            <Link to="/post-task">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Post New Task
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userType === 'student' ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{studentData.stats.totalApplications}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{studentData.stats.acceptedTasks}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{studentData.stats.completedTasks}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{studentData.stats.totalHours}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{ngoData.stats.totalTasks}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{ngoData.stats.activeTasks}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-2xl font-bold text-gray-900">{ngoData.stats.totalApplicants}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{ngoData.stats.completedTasks}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {userType === 'student' ? 'Recent Applications' : 'Posted Tasks'}
          </h2>
        </div>
        <div className="p-6">
          {userType === 'student' ? (
            <div className="space-y-4">
              {studentData.applications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{application.taskTitle}</h3>
                    <p className="text-sm text-gray-600">{application.organization}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                      <span>Task Date: {new Date(application.taskDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    <Link to={`/tasks/${application.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {ngoData.postedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {task.applicants} applicants
                      </span>
                      <span>Posted: {new Date(task.postedDate).toLocaleDateString()}</span>
                      <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <Link to={`/tasks/${task.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {userType === 'student' ? (
            <>
              <Link to="/tasks">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Search className="h-6 w-6 mb-2" />
                  Browse Tasks
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <User className="h-6 w-6 mb-2" />
                  Update Profile
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                <Award className="h-6 w-6 mb-2" />
                View Certificates
              </Button>
            </>
          ) : (
            <>
              <Link to="/post-task">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Plus className="h-6 w-6 mb-2" />
                  Post New Task
                </Button>
              </Link>
              <Link to="/tasks">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Search className="h-6 w-6 mb-2" />
                  Manage Tasks
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <User className="h-6 w-6 mb-2" />
                  Organization Profile
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 