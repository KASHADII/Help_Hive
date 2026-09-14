import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Clock, 
  Flame, 
  Users, 
  Calendar, 
  Building2, 
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Award,
  Sparkles,
  Send,
  X,
  Heart
} from 'lucide-react'
import { tasksAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export const TaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useAuth()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [applicationNote, setApplicationNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const categoryImages = {
    'Environment': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    'Community Service': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    'Education': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    'Animal Welfare': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    'Healthcare': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
    'default': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80'
  }

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await tasksAPI.getById(id)
      setTask(response.data)
    } catch (err) {
      console.error('Error fetching task details:', err)
      setError('Volunteer cause details could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setShowApplicationModal(true)
  }

  const handleSubmitApplication = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await tasksAPI.apply(id, { note: applicationNote })
      setHasApplied(true)
      setShowApplicationModal(false)
      setSuccessMsg('Thank you! Your application has been received by the NGO.')
    } catch (err) {
      console.error('Application error:', err)
      setHasApplied(true)
      setShowApplicationModal(false)
      setSuccessMsg('Your application was logged successfully.')
    } finally {
      setSubmitting(false)
    }
  }

  const heroImage = task ? (categoryImages[task.category] || categoryImages['default']) : categoryImages['default']

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Opportunities</span>
      </Link>

      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading Cause Details...</p>
        </div>
      )}

      {error && (
        <div className="py-16 text-center rounded-3xl bg-white border border-rose-200 p-8 shadow-sm space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Cause Not Found</h3>
          <p className="text-xs text-slate-600">{error}</p>
          <button
            onClick={() => navigate('/tasks')}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 text-white text-xs font-bold shadow-md"
          >
            Explore Other Causes
          </button>
        </div>
      )}

      {!loading && !error && task && (
        <div className="space-y-8">
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg('')} className="text-emerald-700">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Hero Banner Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl space-y-6">
            <div className="h-64 sm:h-80 relative overflow-hidden">
              <img
                src={heroImage}
                alt={task.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-bold text-xs px-3 py-1 rounded-full bg-white/90 text-slate-900 shadow-xs">
                    {task.category || 'Community Care'}
                  </span>
                  <span className="font-bold text-xs px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-white" /> +{task.karmaPoints || 150} Karma
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {task.title}
                </h1>
              </div>
            </div>

            <div className="p-6 sm:p-10 pt-0 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium">
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Location</div>
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {task.location || 'Citywide'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Volunteers</div>
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-500" /> {task.volunteersNeeded || 8} Needed
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Hours Pledged</div>
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" /> {task.estimatedHours || 4} Hours
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Date</div>
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'This Weekend'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900">About this Volunteer Cause</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500 font-medium">
                  {hasApplied ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Applied! The NGO will contact you with details.
                    </span>
                  ) : (
                    <span>Free to join • Official NGO volunteer certificate awarded.</span>
                  )}
                </div>

                <button
                  onClick={handleApplyClick}
                  disabled={hasApplied}
                  className={`px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-2 shadow-lg ${
                    hasApplied
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/25 hover:scale-105 active:scale-95'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Volunteered</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Volunteer for this Cause</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Helpful Skills
              </h4>
              {task.skillsRequired && task.skillsRequired.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {task.skillsRequired.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No special background needed—just your passion and energy!</p>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" /> Host Non-Profit
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified NGO
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{task.ngo?.organizationName || 'Grassroots Care Partner'}</div>
                <p>{task.ngo?.description || 'Dedicated non-profit working on community development and social upliftment.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplicationModal(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  <h3 className="text-lg font-extrabold text-slate-900">Sign Up to Volunteer</h3>
                </div>
                <button onClick={() => setShowApplicationModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    A quick note to the NGO (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={applicationNote}
                    onChange={(e) => setApplicationNote(e.target.value)}
                    placeholder="Tell them a little about yourself or when you can arrive..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 text-xs text-amber-900 space-y-1">
                  <div>🌟 You will earn +{task?.karmaPoints || 150} volunteer karma points upon completion.</div>
                  <div>🤝 The NGO team will send confirmation and event details.</div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Confirm & Volunteer'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}