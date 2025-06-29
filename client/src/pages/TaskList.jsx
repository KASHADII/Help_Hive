import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Search, Filter, MapPin, Clock, Star, Users, Calendar, AlertCircle, RefreshCw } from 'lucide-react'
import { tasksAPI } from '../lib/api'
import { safeRender, formatLocation, formatDate } from '../lib/utils'

export const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = [
    'all',
    'Community Service',
    'Education',
    'Environment',
    'Healthcare',
    'Technology',
    'Arts & Culture',
    'Animal Welfare'
  ]

  const locations = [
    'all',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Remote'
  ]

  useEffect(() => {
    fetchTasks()
  }, [])

  // Refresh tasks when component comes into focus (e.g., after posting a task)
  useEffect(() => {
    const handleFocus = () => {
      fetchTasks()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await tasksAPI.getAll()
      console.log('Tasks received:', response.data)
      setTasks(response.data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('Failed to load tasks. Please try again.')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.ngo?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory
    const matchesLocation = selectedCategory === 'all' || 
                           task.location?.city?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                           task.location?.state?.toLowerCase().includes(selectedLocation.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesLocation
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <h1 className="text-4xl font-bold text-gray-900">
            Browse Available Tasks
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTasks}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find meaningful opportunities to contribute to your community and gain valuable experience.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {locations.map(location => (
              <option key={location} value={location}>
                {location === 'all' ? 'All Locations' : location}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedLocation('all')
            }}
            className="flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>Most Recent</option>
            <option>Deadline</option>
            <option>Rating</option>
            <option>Applicants</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Tasks
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchTasks} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Tasks Grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task._id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  {task.category}
                </span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{task.rating || 'New'}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {task.title}
              </h3>
              
              <p className="text-gray-600 mb-4 font-medium">
                {task.ngo?.organizationName || 'Organization'}
              </p>

              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {task.description}
              </p>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {formatLocation(task.location)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {task.requirements?.volunteersNeeded || 1} volunteers needed
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {task.applications?.length || 0} applicants
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Start: {task.dateTime?.startDate ? new Date(task.dateTime.startDate).toLocaleDateString() : 'TBD'}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {task.requirements?.skills?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {task.requirements?.skills?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{task.requirements.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <Link to={`/tasks/${task._id}`}>
                <Button className="w-full">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {tasks.length === 0 ? 'No tasks available' : 'No tasks found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {tasks.length === 0 
              ? 'Be the first to post a task and make a difference in your community!'
              : 'Try adjusting your search criteria or filters.'
            }
          </p>
          {tasks.length === 0 ? (
            <Link to="/post-task">
              <Button>Post First Task</Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedLocation('all')
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 