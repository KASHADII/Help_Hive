import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Plus, X } from 'lucide-react'

export const PostTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    longDescription: '',
    location: '',
    duration: '',
    deadline: '',
    skills: [],
    requirements: [],
    benefits: [],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    organization: '',
    scheduleDate: '',
    scheduleTime: '',
    scheduleLocation: ''
  })

  const [newSkill, setNewSkill] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newBenefit, setNewBenefit] = useState('')

  const categories = [
    'Community Service',
    'Education',
    'Environment',
    'Healthcare',
    'Technology',
    'Arts & Culture',
    'Animal Welfare',
    'Other'
  ]

  const locations = [
    'Downtown',
    'North Side',
    'South Side',
    'East Side',
    'West Side',
    'Remote',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement('')
    }
  }

  const removeRequirement = (reqToRemove) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== reqToRemove)
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit('')
    }
  }

  const removeBenefit = (benefitToRemove) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Task data:', formData)
    alert('Task posted successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Post a New Task
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share your organization's needs and connect with passionate volunteers who want to make a difference.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Task Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Help organize food drive for local shelter"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., 2-3 hours"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Brief description of the task (will appear in task listings)"
              />
            </div>

            {/* Long Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Detailed description including responsibilities, requirements, and what volunteers will gain"
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Required Skills
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a required skill"
              />
              <Button type="button" onClick={addSkill} className="px-4">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Requirements
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a requirement"
              />
              <Button type="button" onClick={addRequirement} className="px-4">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.requirements.length > 0 && (
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1">{req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(req)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            What Volunteers Will Gain
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a benefit"
              />
              <Button type="button" onClick={addBenefit} className="px-4">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.benefits.length > 0 && (
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <span className="flex-1">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(benefit)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Contact Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Your organization name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="contact@organization.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Schedule Details
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="scheduleDate"
                value={formData.scheduleDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="text"
                name="scheduleTime"
                value={formData.scheduleTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., 9:00 AM - 12:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Location
              </label>
              <input
                type="text"
                name="scheduleLocation"
                value={formData.scheduleLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., 123 Main Street, Downtown"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" size="lg" className="px-8 py-3 text-lg">
            Post Task
          </Button>
        </div>
      </form>
    </div>
  )
} 