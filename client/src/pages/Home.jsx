import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Heart, Users, Award, Clock, MapPin, Star, Building, User } from 'lucide-react'

export const Home = () => {
  const features = [
    {
      icon: Heart,
      title: 'Make a Difference',
      description: 'Connect with NGOs and contribute to meaningful causes in your community.'
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Join a network of volunteers and organizations working together for positive change.'
    },
    {
      icon: Award,
      title: 'Gain Experience',
      description: 'Develop skills, build your portfolio, and earn recognition for your contributions.'
    },
    {
      icon: Clock,
      title: 'Flexible Commitment',
      description: 'Choose tasks that fit your schedule and interests, from one-time events to ongoing projects.'
    }
  ]

  const recentTasks = [
    {
      id: 1,
      title: 'Help organize food drive for local shelter',
      organization: 'Community Care Center',
      location: 'Downtown',
      duration: '2-3 hours',
      category: 'Community Service',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Teach basic computer skills to seniors',
      organization: 'Senior Tech Support',
      location: 'Community Center',
      duration: '1-2 hours',
      category: 'Education',
      rating: 4.9
    },
    {
      id: 3,
      title: 'Assist with environmental cleanup event',
      organization: 'Green Earth Initiative',
      location: 'City Park',
      duration: '3-4 hours',
      category: 'Environment',
      rating: 4.7
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect. Serve.
            <span className="text-red-600"> Impact.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join HelpHive to connect NGOs with passionate students and volunteers. 
            Make a difference in your community while gaining valuable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tasks">
              <Button size="lg" className="text-lg px-8 py-3">
                Browse Tasks
              </Button>
            </Link>
            <Link to="/post-task">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Post a Task
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* User Type Selection */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join HelpHive Today
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose how you want to make a difference in your community
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/register">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <User className="h-16 w-16 text-blue-500" />
                </div>
                <CardTitle className="text-2xl">Volunteer</CardTitle>
                <CardDescription>
                  Students and individuals looking to make a difference
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Browse and join volunteer opportunities</li>
                  <li>• Build your skills and experience</li>
                  <li>• Connect with NGOs and other volunteers</li>
                  <li>• Track your impact and contributions</li>
                </ul>
                <Button className="w-full">
                  Register as Volunteer
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/ngo-register">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Building className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl">NGO/Organization</CardTitle>
                <CardDescription>
                  Non-profits and organizations seeking volunteers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Post volunteer opportunities</li>
                  <li>• Manage volunteer applications</li>
                  <li>• Connect with passionate volunteers</li>
                  <li>• Track task completion and impact</li>
                </ul>
                <Button className="w-full">
                  Register as NGO
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose HelpHive?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy for NGOs to find volunteers and for students to make a meaningful impact.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <Icon className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent Tasks Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Recent Tasks
          </h2>
          <Link to="/tasks">
            <Button variant="outline">
              View All Tasks
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  {task.category}
                </span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{task.rating}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {task.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {task.organization}
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {task.location}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {task.duration}
                </div>
              </div>
              <Link to={`/tasks/${task.id}`}>
                <Button className="w-full mt-4">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of volunteers and organizations already making an impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <User className="h-5 w-5 mr-2" />
              Join as Volunteer
            </Button>
          </Link>
          <Link to="/ngo-register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Building className="h-5 w-5 mr-2" />
              Register as NGO
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 