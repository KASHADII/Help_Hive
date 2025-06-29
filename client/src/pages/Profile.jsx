import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { User, Mail, Phone, MapPin, Building, Edit, Save, X } from 'lucide-react'

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userType, setUserType] = useState('student') // 'student' or 'ngo'

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'Downtown',
    bio: 'Passionate student looking to make a difference in my community through volunteer work.',
    skills: ['Communication', 'Teamwork', 'Organization', 'Teaching'],
    interests: ['Community Service', 'Education', 'Environment'],
    organization: 'Community Care Center',
    website: 'www.communitycare.org'
  })

  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interestToRemove) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setUserType('student')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                userType === 'student'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('ngo')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                userType === 'ngo'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              NGO
            </button>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Basic Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Organization (for NGOs) */}
          {userType === 'ngo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="organization"
                  value={profileData.organization}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          )}

          {/* Website (for NGOs) */}
          {userType === 'ngo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={profileData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="https://www.example.org"
              />
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Skills & Expertise
        </h2>
        
        <div className="space-y-4">
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a skill"
              />
              <Button onClick={addSkill} className="px-4">
                Add
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {Array.isArray(profileData.skills) && profileData.skills.length > 0 ? (
  profileData.skills.map((skill, index) => (
    <span key={index} className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
      {skill}
      {isEditing && (
        <button
          onClick={() => removeSkill(skill)}
          className="hover:text-red-900"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  ))
) : (
  <span className="text-gray-500">No skills listed.</span>
)}
          </div>
        </div>
      </div>

      {/* Interests Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Areas of Interest
        </h2>
        
        <div className="space-y-4">
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add an interest"
              />
              <Button onClick={addInterest} className="px-4">
                Add
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {profileData.interests.map((interest, index) => (
              <span key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {interest}
                {isEditing && (
                  <button
                    onClick={() => removeInterest(interest)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Account Settings
        </h2>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Notification Preferences
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Privacy Settings
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}