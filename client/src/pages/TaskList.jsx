import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Clock, 
  Flame, 
  Users, 
  Calendar, 
  RefreshCw, 
  ArrowRight,
  Heart,
  TreePine,
  Utensils,
  BookOpen,
  Dog,
  ShieldCheck,
  X
} from 'lucide-react'
import { tasksAPI } from '../lib/api'

export const TaskList = () => {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
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
    'Disaster Relief',
    'Animal Welfare'
  ]

  const categoryImages = {
    'Environment': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    'Community Service': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    'Education': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    'Animal Welfare': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    'Healthcare': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    'Disaster Relief': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80',
    'Technology': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    'default': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80'
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await tasksAPI.getAll()
      setTasks(response.data || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load volunteer causes.')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            Explore Opportunities
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Volunteer Opportunities in Your Area
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Join hands with verified NGOs, contribute your skills, and earn certified karma hours.
          </p>
        </div>

        <button 
          onClick={fetchTasks}
          disabled={loading}
          className="self-start md:self-auto px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm text-xs font-bold transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by cause name, skill (e.g., teaching, tree planting), or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all capitalize shadow-xs ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Causes' : cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-3xl bg-white border border-slate-200 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const imageUrl = categoryImages[task.category] || categoryImages['default']
            return (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={imageUrl}
                      alt={task.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="font-bold text-[11px] px-3 py-1 rounded-full bg-white/95 text-slate-800 shadow-xs">
                        {task.category || 'Community'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="font-bold text-xs bg-amber-500 text-white px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-white" /> +{task.karmaPoints || 100}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-amber-600 transition-colors line-clamp-2">
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    {task.skillsRequired && task.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {task.skillsRequired.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" /> {task.location || 'Citywide'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {task.applicants?.length || 0} / {task.volunteersNeeded || 10} spots
                    </span>
                  </div>

                  <Link
                    to={`/tasks/${task._id}`}
                    className="w-full py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-500 text-amber-900 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Details & Volunteer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-white border border-slate-200 shadow-sm max-w-md mx-auto p-8 space-y-3">
          <Heart className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Volunteer Causes Found</h3>
          <p className="text-xs text-slate-500">Try clearing search filters or selecting another category.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}