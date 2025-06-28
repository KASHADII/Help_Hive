import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Menu, X, Heart, User, Plus, Home, Search } from 'lucide-react'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would come from auth context

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tasks', label: 'Browse Tasks', icon: Search },
    { path: '/post-task', label: 'Post Task', icon: Plus },
    { path: '/dashboard', label: 'Dashboard', icon: User },
  ]

  const isActive = (path) => location.pathname === path

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
            {isLoggedIn ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
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
                {isLoggedIn ? (
                  <div className="flex flex-col space-y-2">
                    <Link to="/profile">
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setIsLoggedIn(false)
                        setIsMenuOpen(false)
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="w-full">
                        Sign Up
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