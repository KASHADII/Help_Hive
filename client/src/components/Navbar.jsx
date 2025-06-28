import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Menu, X, Heart, User, Plus, Home, Search, LogOut, Building, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthOptions, setShowAuthOptions] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  // Improved NGO user detection - check if user has NGO role or NGO-specific properties
  const isNgoUser = currentUser && (
    currentUser.role === 'ngo' || 
    (currentUser.displayName && !currentUser.displayName.includes(' ')) ||
    currentUser.email?.includes('ngo') ||
    currentUser.email?.includes('organization')
  )

  // Define navigation items based on user role:
  // - All users: Home, Browse Tasks
  // - Authenticated users: + Dashboard
  // - NGO users: + Post Task
  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', icon: Home },
      { path: '/tasks', label: 'Browse Tasks', icon: Search },
    ]

    // Add Dashboard for authenticated users
    if (currentUser) {
      baseItems.push({ path: '/dashboard', label: 'Dashboard', icon: User })
    }

    // Add Post Task only for NGO users
    if (isNgoUser) {
      baseItems.splice(2, 0, { path: '/post-task', label: 'Post Task', icon: Plus })
    }

    return baseItems
  }

  const navItems = getNavItems()

  const isActive = (path) => location.pathname === path

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <Heart className="h-8 w-8 text-blue-500 relative z-10 animate-pulse-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">HelpHive</span>
              <span className="text-xs text-gray-500 -mt-1">Community Impact</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover-lift ${
                    isActive(item.path)
                      ? 'gradient-primary text-white shadow-lg'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <Sparkles className="h-3 w-3 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Welcome, {currentUser.displayName || currentUser.email}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      isNgoUser 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {isNgoUser ? 'NGO' : 'Volunteer'}
                    </span>
                  </div>
                  <Link to={isNgoUser ? "/ngo-dashboard" : "/profile"}>
                    <Button variant="outline" size="sm" className="hover-lift">
                      {isNgoUser ? <Building className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                      {isNgoUser ? 'NGO Dashboard' : 'Profile'}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="hover-lift hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthOptions(!showAuthOptions)}
                  className="hover-lift"
                >
                  Sign In
                </Button>
                
                {showAuthOptions && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-scale-in">
                    <div className="p-2">
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setShowAuthOptions(false)}
                      >
                        <User className="h-4 w-4 mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Volunteer Login</div>
                          <div className="text-xs text-gray-500">For students & individuals</div>
                        </div>
                      </Link>
                      <Link
                        to="/ngo-login"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setShowAuthOptions(false)}
                      >
                        <Building className="h-4 w-4 mr-3 text-green-500" />
                        <div>
                          <div className="font-medium">NGO Login</div>
                          <div className="text-xs text-gray-500">For organizations</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
                
                <div className="ml-3 flex space-x-2">
                  <Link to="/register">
                    <Button size="sm" className="gradient-primary hover-lift">
                      <User className="h-4 w-4 mr-2" />
                      Volunteer
                    </Button>
                  </Link>
                  <Link to="/ngo-register">
                    <Button size="sm" variant="outline" className="hover-lift border-green-200 text-green-700 hover:bg-green-50">
                      <Building className="h-4 w-4 mr-2" />
                      NGO
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover-lift"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-down">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover-lift ${
                      isActive(item.path)
                        ? 'gradient-primary text-white'
                        : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <Sparkles className="h-4 w-4 animate-pulse ml-auto" />
                    )}
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-gray-200">
                {currentUser ? (
                  <div className="flex flex-col space-y-3">
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-2">
                        Welcome, {currentUser.displayName || currentUser.email}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        isNgoUser 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {isNgoUser ? 'NGO' : 'Volunteer'}
                      </span>
                    </div>
                    <Link to={isNgoUser ? "/ngo-dashboard" : "/profile"}>
                      <Button variant="outline" size="sm" className="w-full hover-lift">
                        {isNgoUser ? <Building className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                        {isNgoUser ? 'NGO Dashboard' : 'Profile'}
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full hover-lift hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <div className="px-4 py-2 text-sm text-gray-600 font-medium">
                      Sign in as:
                    </div>
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="w-full hover-lift">
                        <User className="h-4 w-4 mr-2" />
                        Volunteer
                      </Button>
                    </Link>
                    <Link to="/ngo-login">
                      <Button variant="outline" size="sm" className="w-full hover-lift">
                        <Building className="h-4 w-4 mr-2" />
                        NGO
                      </Button>
                    </Link>
                    <div className="px-4 py-2 text-sm text-gray-600 font-medium">
                      Or register as:
                    </div>
                    <Link to="/register">
                      <Button size="sm" className="w-full gradient-primary hover-lift">
                        <User className="h-4 w-4 mr-2" />
                        Volunteer
                      </Button>
                    </Link>
                    <Link to="/ngo-register">
                      <Button size="sm" variant="outline" className="w-full hover-lift border-green-200 text-green-700 hover:bg-green-50">
                        <Building className="h-4 w-4 mr-2" />
                        NGO
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 