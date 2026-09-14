import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  X, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Users, 
  Award,
  Send,
  Heart
} from 'lucide-react'
import { tasksAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export const PostTask = () => {
  const navigate = useNavigate()
  const { currentUser, isAuthenticated, isNgo } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    category: 'Community Service',
    description: '',
    location: '',
    volunteersNeeded: 5,
    estimatedHours: 4,
    karmaPoints: 150,
    deadline: '',
    skillsRequired: []
  })

  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const categories = [
    'Community Service',
    'Education',
    'Environment',
    'Healthcare',
    'Technology',
    'Disaster Relief',
    'Animal Welfare'
  ]

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skillToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      if (!formData.title || !formData.description) {
        setError('Please provide a title and description for your cause.')
        return
      }

      await tasksAPI.create(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/tasks')
      }, 1500)
    } catch (err) {
      console.error('Error creating task:', err)
      setError(err.message || 'Failed to post cause. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || (currentUser && currentUser.role !== 'ngo' && !isNgo())) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xl">
          <Building2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-extrabold text-slate-900">NGO Partner Account Required</h2>
          <p className="text-xs text-slate-600">
            Posting community causes is reserved for verified non-profit organizations.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link to="/ngo-login" className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md">
              NGO Sign In
            </Link>
            <Link to="/ngo-register" className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold">
              Register NGO
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Opportunities</span>
      </Link>

      <div className="space-y-1">
        <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-100 px-3 py-1 rounded-full">
          Create Volunteer Opportunity
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Post a Cause & Request Volunteers
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Share your mission, schedule, and volunteer requirements with thousands of active community helpers.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Your volunteer cause was published successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700">Cause Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Weekend City Park Tree Planting & Sapling Care"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-500"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Description & Details *</label>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what volunteers will be doing, event agenda, what to wear/bring, and why it matters..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Location / City</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Central Library, Mumbai"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Volunteers Needed</label>
            <input
              type="number"
              min="1"
              max="500"
              value={formData.volunteersNeeded}
              onChange={(e) => setFormData({ ...formData, volunteersNeeded: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Karma Points Awarded</label>
            <input
              type="number"
              min="20"
              max="1000"
              step="10"
              value={formData.karmaPoints}
              onChange={(e) => setFormData({ ...formData, karmaPoints: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Helpful Skills (Optional)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. First Aid, Teaching, Photography..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700"
            >
              Add
            </button>
          </div>

          {formData.skillsRequired.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish Volunteer Cause'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
