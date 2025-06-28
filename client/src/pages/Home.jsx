import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Heart, Users, Award, Clock, MapPin, Star, Building, User, Sparkles, ArrowRight, CheckCircle, Globe, Shield } from 'lucide-react'
import { tasksAPI, ngosAPI } from '../lib/api'

export const Home = () => {
  const [animatedElements, setAnimatedElements] = useState([])
  const [recentTasks, setRecentTasks] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements(prev => [...prev, entry.target.dataset.animate])
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent tasks
        const tasksResponse = await tasksAPI.getAll({ limit: 3, sort: 'createdAt' })
        setRecentTasks(tasksResponse.data || [])

        // Fetch stats (you might want to create a dedicated stats endpoint)
        const defaultStats = [
          { number: '500+', label: 'Active Volunteers', icon: Users },
          { number: '50+', label: 'Partner NGOs', icon: Building },
          { number: '1000+', label: 'Tasks Completed', icon: CheckCircle },
          { number: '25+', label: 'Communities Served', icon: Globe }
        ]
        setStats(defaultStats)
      } catch (error) {
        console.error('Error fetching home data:', error)
        // Fallback to default data
        setRecentTasks([
          {
            id: 1,
            title: 'Help organize food drive for local shelter',
            organization: 'Community Care Center',
            location: 'Downtown',
            duration: '2-3 hours',
            category: 'Community Service',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
          },
          {
            id: 2,
            title: 'Teach basic computer skills to seniors',
            organization: 'Senior Tech Support',
            location: 'Community Center',
            duration: '1-2 hours',
            category: 'Education',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
          },
          {
            id: 3,
            title: 'Assist with environmental cleanup event',
            organization: 'Green Earth Initiative',
            location: 'City Park',
            duration: '3-4 hours',
            category: 'Environment',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
          }
        ])
        setStats(defaultStats)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const features = [
    {
      icon: Heart,
      title: 'Make a Difference',
      description: 'Connect with NGOs and contribute to meaningful causes in your community.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Join a network of volunteers and organizations working together for positive change.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: Award,
      title: 'Gain Experience',
      description: 'Develop skills, build your portfolio, and earn recognition for your contributions.',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Clock,
      title: 'Flexible Commitment',
      description: 'Choose tasks that fit your schedule and interests, from one-time events to ongoing projects.',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 gradient-hero"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-cyan-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 py-20">
          <div className="animate-fade-in-down">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
                <Heart className="h-20 w-20 text-blue-500 relative z-10 animate-bounce-slow" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 text-shadow">
              Connect.
              <span className="text-gradient block"> Serve.</span>
              <span className="text-gradient"> Impact.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join HelpHive to connect NGOs with passionate students and volunteers. 
              Make a difference in your community while gaining valuable experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/tasks">
                <Button size="lg" className="text-lg px-10 py-4 gradient-primary hover-lift hover-glow">
                  Browse Tasks
                </Button>
              </Link>
              <Link to="/post-task">
                <Button variant="outline" size="lg" className="text-lg px-10 py-4 hover-lift border-2 border-blue-200 hover:border-blue-300">
                  Post a Task
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index} 
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient || 'from-gray-500 to-gray-600'} text-white`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join HelpHive Today
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose how you want to make a difference in your community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="hover-lift card-shadow-lg animate-slide-in-left">
              <Link to="/register">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-50"></div>
                      <User className="h-20 w-20 text-blue-500 relative z-10" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-4">Volunteer</CardTitle>
                  <CardDescription className="text-lg">
                    Students and individuals looking to make a difference
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <ul className="text-gray-600 space-y-3 mb-8 text-left max-w-sm mx-auto">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      Browse and join volunteer opportunities
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      Build your skills and experience
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      Connect with NGOs and other volunteers
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      Track your impact and contributions
                    </li>
                  </ul>
                  <Button className="w-full gradient-primary hover-lift text-lg py-3">
                    Register as Volunteer
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover-lift card-shadow-lg animate-slide-in-right">
              <Link to="/ngo-register">
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-lg opacity-50"></div>
                      <Building className="h-20 w-20 text-green-500 relative z-10" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-4">NGO/Organization</CardTitle>
                  <CardDescription className="text-lg">
                    Non-profits and organizations seeking volunteers
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <ul className="text-gray-600 space-y-3 mb-8 text-left max-w-sm mx-auto">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      Post volunteer opportunities
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      Manage volunteer applications
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      Connect with passionate volunteers
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      Track task completion and impact
                    </li>
                  </ul>
                  <Button className="w-full gradient-success hover-lift text-lg py-3">
                    Register as NGO
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose HelpHive?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy for NGOs to find volunteers and for students to make a meaningful impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="text-center p-8 rounded-2xl hover-lift card-shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-center mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Tasks Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12 animate-fade-in-up">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Recent Tasks
              </h2>
              <p className="text-gray-600">Discover opportunities to make a difference</p>
            </div>
            <Link to="/tasks">
              <Button variant="outline" className="hover-lift">
                View All Tasks
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl card-shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              recentTasks.map((task, index) => (
                <div 
                  key={task._id || task.id} 
                  className="bg-white rounded-2xl card-shadow-lg hover-lift overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                    <img 
                      src={task.images?.[0] || task.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'} 
                      alt={task.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {task.category}
                      </span>
                    </div>
                    {task.rating && (
                      <div className="absolute top-4 right-4 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{task.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mb-4 font-medium">
                      {task.ngo?.name || task.organization}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {task.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        {task.duration || `${task.estimatedHours || 2} hours`}
                      </div>
                    </div>
                    
                    <Link to={`/tasks/${task._id || task.id}`}>
                      <Button className="w-full gradient-primary hover-lift">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 left-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto">
            Join thousands of volunteers and organizations already making an impact in communities worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-4 hover-lift bg-white text-blue-600 hover:bg-gray-100">
                <User className="h-5 w-5 mr-2" />
                Join as Volunteer
              </Button>
            </Link>
            <Link to="/ngo-register">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-4 hover-lift bg-white text-blue-600 hover:bg-gray-100">
                <Building className="h-5 w-5 mr-2" />
                Register as NGO
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 