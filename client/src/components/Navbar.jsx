import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  User, 
  Plus, 
  Home, 
  Search, 
  LogOut, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  Compass,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export const Navbar = ({ onOpenCommandPalette }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, isNgo, logout } = useAuth()
  const { isAdminAuthenticated } = useAdminAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const isNgoUser = isNgo ? isNgo() : (currentUser?.role === 'ngo')

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tasks', label: 'Explore Causes', icon: Compass },
    ...(currentUser ? [
      { 
        path: isNgoUser ? '/ngo-dashboard' : '/dashboard', 
        label: isNgoUser ? 'NGO Dashboard' : 'My Volunteering', 
        icon: User 
      }
    ] : []),
    ...(isNgoUser ? [
      { path: '/post-task', label: 'Post a Cause', icon: Plus }
    ] : [])
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3.5 transition-all duration-300">
      <div className={`max-w-7xl mx-auto transition-all duration-300 rounded-3xl px-4 sm:px-6 py-3 flex items-center justify-between ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-[#14281D]/5 border border-[#14281D]/10' 
          : 'bg-white/80 backdrop-blur-sm border border-[#14281D]/8 shadow-sm'
      }`}>
        
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#14281D] text-white shadow-md shadow-[#14281D]/20 group-hover:scale-105 transition-transform duration-200">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#14281D] flex items-center gap-1">
                Help<span className="text-[#D95D39]">Hive</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest -mt-0.5">Small Acts. Living Impact.</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F5F2EB] p-1.5 rounded-2xl border border-[#14281D]/8">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  active
                    ? 'text-[#14281D] shadow-sm'
                    : 'text-slate-600 hover:text-[#14281D] hover:bg-white/60'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeArtNav"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/60"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${active ? 'text-[#D95D39]' : 'text-slate-400'}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenCommandPalette && onOpenCommandPalette()}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F5F2EB] hover:bg-slate-200/80 text-slate-600 text-xs font-medium border border-[#14281D]/8 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search causes...</span>
            <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">⌘K</kbd>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#E8F2EC] hover:bg-[#D4E8DC] border border-[#C5DFD0] text-xs font-bold text-[#163B25] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#14281D] text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline-block max-w-[110px] truncate">{currentUser.name || currentUser.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/ngo-login"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-[#E8F2EC] hover:bg-[#D4E8DC] rounded-2xl border border-[#C5DFD0] transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>For NGOs</span>
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#14281D] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-2xl bg-[#D95D39] hover:bg-[#C84B27] text-white text-xs font-extrabold shadow-md shadow-orange-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <span>Join Volunteer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {isAdminAuthenticated && (
            <Link
              to="/admin/dashboard"
              className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-2xl text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden max-w-7xl mx-auto mt-2 bg-white border border-slate-200 rounded-3xl p-4 shadow-xl space-y-3"
          >
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold ${
                      isActive(item.path)
                        ? 'bg-[#E8F2EC] text-[#163B25] border border-[#C5DFD0]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#D95D39]" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-2xl bg-slate-100 text-slate-800 text-sm font-bold border border-slate-200"
                  >
                    Volunteer Sign In
                  </Link>
                  <Link
                    to="/ngo-login"
                    className="w-full text-center py-2.5 rounded-2xl bg-[#E8F2EC] text-emerald-800 text-sm font-bold border border-[#C5DFD0]"
                  >
                    NGO Partner Portal
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 rounded-2xl bg-[#D95D39] text-white text-sm font-extrabold shadow-md"
                  >
                    Join as a Volunteer
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 text-sm font-bold text-slate-800"
                  >
                    <span>My Profile & Badges</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2.5 rounded-2xl bg-rose-50 text-rose-700 text-sm font-bold border border-rose-200"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}