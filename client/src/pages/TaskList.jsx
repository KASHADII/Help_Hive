import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Search, Filter, MapPin, Clock, Star, Users, Calendar } from 'lucide-react'

export const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

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
    'Downtown',
    'North Side',
    'South Side',
    'East Side',
    'West Side',
    'Remote'
  ]

  // Mock data - in a real app, this would come from an API
  const tasks = [
    {
      id: 1,
      title: 'Help organize food drive for local shelter',
      organization: 'Community Care Center',
      location: 'Downtown',
      duration: '2-3 hours',
      category: 'Community Service',
      rating: 4.8,
      applicants: 12,
      deadline: '2024-02-15',
      description: 'Assist with organizing and distributing food items to families in need.',
      skills: ['Organization', 'Communication', 'Teamwork']
    },
    {
      id: 2,
      title: 'Teach basic computer skills to seniors',
      organization: 'Senior Tech Support',
      location: 'Community Center',
      duration: '1-2 hours',
      category: 'Education',
      rating: 4.9,
      applicants: 8,
      deadline: '2024-02-20',
      description: 'Help seniors learn basic computer operations and internet safety.',
      skills: ['Patience', 'Teaching', 'Computer Skills']
    },
    {
      id: 3,
      title: 'Assist with environmental cleanup event',
      organization: 'Green Earth Initiative',
      location: 'City Park',
      duration: '3-4 hours',
      category: 'Environment',
      rating: 4.7,
      applicants: 15,
      deadline: '2024-02-10',
      description: 'Join our community cleanup event to help maintain our local park.',
      skills: ['Physical Activity', 'Teamwork', 'Environmental Awareness']
    },
    {
      id: 4,
      title: 'Website development for non-profit',
      organization: 'Tech for Good',
      location: 'Remote',
      duration: '10-15 hours',
      category: 'Technology',
      rating: 4.6,
      applicants: 6,
      deadline: '2024-03-01',
      description: 'Help develop a simple website for a local non-profit organization.',
      skills: ['Web Development', 'HTML/CSS', 'JavaScript']
    },
    {
      id: 5,
      title: 'Art workshop for children',
      organization: 'Creative Kids Foundation',
      location: 'North Side',
      duration: '2 hours',
      category: 'Arts & Culture',
      rating: 4.9,
      applicants: 10,
      deadline: '2024-02-25',
      description: 'Lead an art workshop for children aged 6-12 at our community center.',
      skills: ['Art', 'Teaching', 'Creativity']
    },
    {
      id: 6,
      title: 'Animal shelter volunteer',
      organization: 'Paws & Care',
      location: 'South Side',
      duration: '4-6 hours',
      category: 'Animal Welfare',
      rating: 4.8,
      applicants: 20,
      deadline: '2024-02-18',
      description: 'Help care for animals, clean facilities, and assist with adoptions.',
      skills: ['Animal Care', 'Compassion', 'Physical Activity']
    }
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || task.location === selectedLocation
    
    return matchesSearch && matchesCategory && matchesLocation
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Browse Available Tasks
        </h1>
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

      {/* Tasks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                {task.category}
              </span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{task.rating}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {task.title}
            </h3>
            
            <p className="text-gray-600 mb-4 font-medium">
              {task.organization}
            </p>

            <p className="text-gray-600 mb-4 text-sm line-clamp-2">
              {task.description}
            </p>

            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {task.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {task.duration}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {task.applicants} applicants
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {task.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {skill}
                  </span>
                ))}
                {task.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{task.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <Link to={`/tasks/${task.id}`}>
              <Button className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters.
          </p>
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
        </div>
      )}
    </div>
  )
} 