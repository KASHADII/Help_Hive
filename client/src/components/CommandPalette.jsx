import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Heart, 
  Building2, 
  User, 
  PlusCircle, 
  Compass, 
  ArrowRight, 
  X,
  Smile
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { tasksAPI } from '../lib/api'

export const CommandPalette = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState('')
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()
  const { isNgo, isAuthenticated } = useAuth()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen])

  useEffect(() => {
    if (isOpen) {
      tasksAPI.getAll({ limit: 8 })
        .then(res => {
          if (res && res.data) setTasks(res.data)
        })
        .catch(err => console.error(err))
    }
  }, [isOpen])

  const defaultCommands = [
    { id: 'explore-tasks', title: 'Browse All Volunteering Opportunities', category: 'Explore', icon: Compass, action: () => navigate('/tasks') },
    { id: 'home', title: 'HelpHive Homepage', category: 'General', icon: Heart, action: () => navigate('/') },
    ...(isAuthenticated ? [
      { id: 'dashboard', title: isNgo() ? 'NGO Dashboard' : 'My Volunteering Dashboard', category: 'My Account', icon: User, action: () => navigate(isNgo() ? '/ngo-dashboard' : '/dashboard') },
      { id: 'profile', title: 'My Profile & Certificates', category: 'My Account', icon: Sparkles, action: () => navigate('/profile') },
      ...(isNgo() ? [{ id: 'post-task', title: 'Post a New Volunteering Need', category: 'NGO Actions', icon: PlusCircle, action: () => navigate('/post-task') }] : [])
    ] : [
      { id: 'login', title: 'Volunteer Sign In', category: 'Account', icon: User, action: () => navigate('/login') },
      { id: 'register', title: 'Join as a Volunteer', category: 'Account', icon: Heart, action: () => navigate('/register') },
      { id: 'ngo-login', title: 'NGO Partner Sign In', category: 'For NGOs', icon: Building2, action: () => navigate('/ngo-login') }
    ])
  ]

  const filteredTasks = tasks.filter(t => 
    t.title?.toLowerCase().includes(query.toLowerCase()) || 
    t.category?.toLowerCase().includes(query.toLowerCase()) ||
    t.location?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4)

  const filteredCommands = defaultCommands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (item) => {
    if (item.action) {
      item.action()
    } else if (item._id) {
      navigate(`/tasks/${item._id}`)
    }
    setIsOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input */}
            <div className="flex items-center px-5 py-4 border-b border-slate-100 gap-3">
              <Search className="w-5 h-5 text-amber-500 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search volunteer opportunities, causes, or cities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-base focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                <span>ESC</span>
              </div>
            </div>

            {/* Content List */}
            <div className="max-h-96 overflow-y-auto p-3 space-y-3">
              {filteredCommands.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Links
                  </div>
                  <div className="space-y-0.5">
                    {filteredCommands.map((cmd) => {
                      const Icon = cmd.icon
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd)}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-900 group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 group-hover:text-amber-900">{cmd.title}</span>
                              <span className="ml-2 text-xs text-slate-400">({cmd.category})</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-600" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {filteredTasks.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    Active Opportunities
                  </div>
                  <div className="space-y-0.5">
                    {filteredTasks.map((t) => (
                      <button
                        key={t._id}
                        onClick={() => handleSelect(t)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 group transition-colors"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                            <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-slate-800 truncate group-hover:text-emerald-900">{t.title}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{t.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {t.location}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl shrink-0">
                          {t.karmaPoints || 100} Karma
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200">ESC</kbd> to close</span>
              <span className="text-amber-600 font-semibold">HelpHive Community</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
