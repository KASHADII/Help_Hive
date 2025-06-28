import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Menu, X, Heart, User, Plus, Home, Search, LogOut, Building } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthOptions, setShowAuthOptions] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tasks', label: 'Browse Tasks', icon: Search },
    { path: '/post-task', label: 'Post Task', icon: Plus },
    { path: '/dashboard', label: 'Dashboard', icon: User },
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

  const isNgoUser = currentUser && currentUser.displayName && !currentUser.displayName.includes(' ')

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold text-gray-900">HelpHive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Welcome, {currentUser.displayName || currentUser.email}
                  </span>
                  {isNgoUser && (
                    <Building className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <Link to={isNgoUser ? "/ngo-dashboard" : "/profile"}>
                  <Button variant="outline" size="sm">
                    {isNgoUser ? <Building className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                    {isNgoUser ? 'NGO Dashboard' : 'Profile'}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthOptions(!showAuthOptions)}
                >
                  Sign In
                </Button>
                
                {showAuthOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                    <div className="py-1">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAuthOptions(false)}
                      >
                        <User className="h-4 w-4 inline mr-2" />
                        Volunteer Login
                      </Link>
                      <Link
                        to="/ngo-login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAuthOptions(false)}
                      >
                        <Building className="h-4 w-4 inline mr-2" />
                        NGO Login
                      </Link>
                    </div>
                  </div>
                )}
                
                <div className="ml-2 flex space-x-2">
                  <Link to="/register">
                    <Button size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Volunteer
                    </Button>
                  </Link>
                  <Link to="/ngo-register">
                    <Button size="sm" variant="outline">
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
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="pt-4 border-t">
                {currentUser ? (
                  <div className="flex flex-col space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Welcome, {currentUser.displayName || currentUser.email}
                      {isNgoUser && <Building className="h-4 w-4 inline ml-2 text-blue-500" />}
                    </div>
                    <Link to={isNgoUser ? "/ngo-dashboard" : "/profile"}>
                      <Button variant="outline" size="sm" className="w-full">
                        {isNgoUser ? <Building className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                        {isNgoUser ? 'NGO Dashboard' : 'Profile'}
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
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
                  <div className="flex flex-col space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600 font-medium">
                      Sign in as:
                    </div>
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Volunteer
                      </Button>
                    </Link>
                    <Link to="/ngo-login">
                      <Button variant="outline" size="sm" className="w-full">
                        <Building className="h-4 w-4 mr-2" />
                        NGO
                      </Button>
                    </Link>
                    <div className="px-3 py-2 text-sm text-gray-600 font-medium mt-2">
                      Or register as:
                    </div>
                    <Link to="/register">
                      <Button size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Volunteer
                      </Button>
                    </Link>
                    <Link to="/ngo-register">
                      <Button size="sm" variant="outline" className="w-full">
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