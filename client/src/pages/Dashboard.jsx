import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Flame, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  CheckCircle2, 
  Plus, 
  Search, 
  User, 
  Compass,
  ArrowRight,
  Heart,
  Smile,
  Calendar,
  Sparkles
} from 'lucide-react'
import { tasksAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export const Dashboard = () => {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await tasksAPI.getAll({ limit: 6 })
        if (res && res.data) {
          setTasks(res.data)
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load your volunteering feed.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const userKarma = currentUser?.karmaPoints || 450
  const userHours = currentUser?.totalHours || 18
  const completedCount = currentUser?.completedTasks?.length || 4

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
            <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>VOLUNTEER COMMUNITY DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser?.name || 'Volunteer Friend'}! 🌟
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Check your earned karma points, upcoming events, and verified certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tasks"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Find New Causes</span>
          </Link>
          <Link
            to="/profile"
            className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors shadow-xs"
          >
            My Profile & Badges
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Karma Points */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Karma Points</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{userKarma}</div>
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
            🌟 Top 5% Helper
          </div>
        </div>

        {/* Volunteered Hours */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hours Given</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{userHours} hrs</div>
          <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl w-fit">
            Dual-Verified by NGOs
          </div>
        </div>

        {/* Causes Completed */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Causes Joined</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{completedCount}</div>
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
            Across 3 Non-Profits
          </div>
        </div>

        {/* Level */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Community Tier</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">Tier II</div>
          <div className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl w-fit">
            Next: Guardian Tier
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recommended Causes */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" /> Recommended Causes For You
            </h3>
            <Link to="/tasks" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 rounded-3xl bg-white border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px]">
                        {task.category || 'Community'}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1 font-medium text-[11px]">
                        <MapPin className="w-3 h-3 text-amber-500" /> {task.location || 'Citywide'}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-emerald-600" /> +{task.karmaPoints || 100} Karma
                    </span>
                    <Link
                      to={`/tasks/${task._id}`}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-amber-500 text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>Volunteer</span> <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center rounded-3xl bg-white border border-slate-200 p-6 text-slate-500">
              <p className="text-sm">No new causes available right now.</p>
            </div>
          )}
        </div>

        {/* Right: Badges */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Your Impact Badges
              </h4>
              <span className="text-xs font-bold text-slate-400">4 EARNED</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
                <div className="text-2xl">🌱</div>
                <div className="font-extrabold text-xs text-emerald-900">Green Thumb</div>
                <div className="text-[10px] text-emerald-700 font-medium">10 hrs Forestry</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-center space-y-1">
                <div className="text-2xl">🍲</div>
                <div className="font-extrabold text-xs text-amber-900">Meal Hero</div>
                <div className="text-[10px] text-amber-700 font-medium">Food Relief</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
                <div className="text-2xl">📚</div>
                <div className="font-extrabold text-xs text-indigo-900">Young Mentor</div>
                <div className="text-[10px] text-indigo-700 font-medium">Youth Tutoring</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-center space-y-1">
                <div className="text-2xl">💖</div>
                <div className="font-extrabold text-xs text-rose-900">Golden Heart</div>
                <div className="text-[10px] text-rose-700 font-medium">100% Reliable</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/profile"
                className="w-full block text-center py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                View Full Impact Certificate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}