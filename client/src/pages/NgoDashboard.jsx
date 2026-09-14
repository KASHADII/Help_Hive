import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Plus, 
  Users, 
  Calendar, 
  MapPin, 
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Flame,
  ArrowRight,
  Heart
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { tasksAPI, ngoAPI } from '../lib/api'

export const NgoDashboard = () => {
  const [ngoDetails, setNgoDetails] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

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
        try {
          const ngoResponse = await ngoAPI.getMyNGO()
          setNgoDetails(ngoResponse.ngo)
        } catch (err) {
          console.warn('NGO details fetch note:', err)
        }

        const tasksResponse = await tasksAPI.getMyTasks()
        setTasks(tasksResponse.tasks || [])
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [currentUser, navigate])

  const totalVolunteersNeeded = tasks.reduce((sum, t) => sum + (t.volunteersNeeded || 0), 0)
  const totalApplicants = tasks.reduce((sum, t) => sum + (t.applicants?.length || 0), 0)
  const isVerified = ngoDetails?.verificationStatus === 'approved' || ngoDetails?.status === 'verified'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 uppercase">NGO Organization Portal</span>
            {isVerified ? (
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Non-Profit
              </span>
            ) : (
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Verification in Review
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {ngoDetails?.organizationName || currentUser?.name || 'Organization Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Create community causes, review volunteer applications, and verify volunteer certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/post-task"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Volunteer Cause</span>
          </Link>
          <Link
            to="/ngo-details"
            className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-xs"
          >
            Org Profile
          </Link>
        </div>
      </div>

      {/* Stats Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Causes</div>
          <div className="text-3xl font-black text-slate-900">{tasks.length}</div>
          <div className="text-xs font-bold text-emerald-700 mt-2">Active in Community</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Volunteer Signups</div>
          <div className="text-3xl font-black text-amber-600">{totalApplicants}</div>
          <div className="text-xs font-bold text-amber-700 mt-2">Ready to Help</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Volunteers Target</div>
          <div className="text-3xl font-black text-indigo-600">{totalVolunteersNeeded}</div>
          <div className="text-xs font-bold text-indigo-700 mt-2">Total Quota Needed</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Registration No.</div>
          <div className="text-base font-bold text-slate-900 truncate mt-2">
            {ngoDetails?.registrationNumber || ngoDetails?.taxId || '80G_CERTIFIED'}
          </div>
          <div className="text-xs font-bold text-slate-500 mt-2">Verified Status</div>
        </div>
      </div>

      {/* Main Causes List */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Your Posted Causes
          </h3>
          <span className="text-xs font-bold text-slate-400">{tasks.length} Total</span>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-amber-50/40 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px]">
                      {task.category || 'Cause'}
                    </span>
                    <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Posted on {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">{task.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">{task.description}</p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {task.applicants?.length || 0} / {task.volunteersNeeded || 5} Volunteers Signed Up
                  </span>
                  <Link
                    to={`/tasks/${task._id}`}
                    className="p-2.5 rounded-2xl bg-white hover:bg-emerald-600 hover:text-white text-slate-600 border border-slate-200 transition-colors shadow-2xs"
                    title="View Cause"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <Building2 className="w-12 h-12 mx-auto text-emerald-500/40" />
            <p className="text-base font-extrabold text-slate-800">No Causes Posted Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Publish your first volunteer need so thousands of compassionate volunteers can join you.</p>
            <Link
              to="/post-task"
              className="inline-block px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md"
            >
              Post a Cause
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}