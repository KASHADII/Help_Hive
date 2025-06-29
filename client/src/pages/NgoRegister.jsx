import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Mail, Lock, Eye, EyeOff, Building, User, MapPin, Phone, AlertCircle } from 'lucide-react'
import { authAPI } from '../lib/api'

export const NgoRegister = () => {
  const [formData, setFormData] = useState({
    // User details
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // NGO details
    organizationName: '',
    registrationNumber: '',
    category: '',
    description: '',
    foundedYear: new Date().getFullYear(),
    
    // Contact person
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    
    // Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Optional fields
    website: '',
    mission: '',
    vision: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  const navigate = useNavigate()

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'name':
        return !value.trim() ? 'Your full name is required' : ''
      case 'email':
        if (!value.trim()) return 'Your email address is required'
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters long'
        return ''
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
        return ''
      case 'organizationName':
        return !value.trim() ? 'Organization name is required' : ''
      case 'registrationNumber':
        return !value.trim() ? 'Registration number is required' : ''
      case 'category':
        return !value ? 'Please select an organization category' : ''
      case 'description':
        return !value.trim() ? 'Organization description is required' : ''
      case 'contactPersonName':
        return !value.trim() ? 'Primary contact person name is required' : ''
      case 'contactPersonEmail':
        if (!value.trim()) return 'Primary contact person email is required'
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address'
        return ''
      case 'contactPersonPhone':
        return !value.trim() ? 'Primary contact person phone is required' : ''
      case 'street':
        return !value.trim() ? 'Street address is required' : ''
      case 'city':
        return !value.trim() ? 'City is required' : ''
      case 'state':
        return !value.trim() ? 'State is required' : ''
      case 'zipCode':
        return !value.trim() ? 'ZIP code is required' : ''
      default:
        return ''
    }
  }

  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value })
    
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    const requiredFields = [
      'name', 'email', 'password', 'confirmPassword', 'organizationName', 
      'registrationNumber', 'category', 'description', 'contactPersonName', 
      'contactPersonEmail', 'contactPersonPhone', 'street', 'city', 'state', 'zipCode'
    ]
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
      }
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)  
      setGeneralError('Please fix the errors below before submitting.')
      return
    }
    
    try {
      setErrors({})
      setGeneralError('')
      setLoading(true)
      
      const ngoData = {
        // User data
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        
        // NGO data
        organizationName: formData.organizationName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        category: formData.category,
        description: formData.description.trim(),
        foundedYear: parseInt(formData.foundedYear),
        
        // Contact person
        contactPerson: {
          name: formData.contactPersonName.trim(),
          email: formData.contactPersonEmail.trim(),
          phone: formData.contactPersonPhone.trim()
        },
        
        // Address
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim()
        },
        
        // Optional fields
        website: formData.website.trim() || undefined,
        mission: formData.mission.trim() || undefined,
        vision: formData.vision.trim() || undefined
      }
      
      const response = await authAPI.ngoRegister(ngoData)
      
      // Registration successful
      alert('NGO registration successful! Your account is pending admin approval. You will be notified once approved.')
      navigate('/ngo-login')
    } catch (error) {
      console.error('NGO Registration error:', error)
      
      // Handle different types of errors
      if (error.message) {
        setGeneralError(error.message)
      } else if (error.errors && Array.isArray(error.errors)) {
        // Handle validation errors from backend
        const errorMessages = error.errors.map(err => err.msg).join(', ')
        setGeneralError(errorMessages)
      } else {
        setGeneralError('Failed to create NGO account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getErrorStyle = (fieldName) => {
    return errors[fieldName] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
  }

  const getErrorCount = () => {
    return Object.keys(errors).filter(key => errors[key]).length
  }

  const categories = [
    'Healthcare', 'Education', 'Environment', 'Community Service', 
    'Animal Welfare', 'Disaster Relief', 'Human Rights', 
    'Arts & Culture', 'Sports', 'Technology', 'Other'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            NGO Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register your organization to post tasks and connect with volunteers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Summary */}
          {Object.keys(errors).filter(key => errors[key]).length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-600 font-medium">
                  ⚠️ {Object.keys(errors).filter(key => errors[key]).length} validation error{Object.keys(errors).filter(key => errors[key]).length > 1 ? 's' : ''} found:
                </span>
              </div>
              <ul className="text-sm text-red-600 space-y-1">
                {Object.entries(errors).map(([field, error]) => error && (
                  <li key={field} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {generalError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{generalError}</p>
            </div>
          )}

          {/* Account Holder Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Holder Information
              </CardTitle>
              <CardDescription>
                Your personal account details for logging into HelpHive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className={getErrorStyle('name')}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className={`pl-10 ${getErrorStyle('email')}`}
                      placeholder="your.email@organization.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Your Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="pl-10"
                      placeholder="+1 (555) 123-4567"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Account Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      className={`pl-10 pr-10 ${getErrorStyle('password')}`}
                      placeholder="Create a password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    className={`pl-10 pr-10 ${getErrorStyle('confirmPassword')}`}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Information about your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => handleFieldChange('organizationName', e.target.value)}
                    placeholder="Enter organization name"
                    disabled={loading}
                    className={getErrorStyle('organizationName')}
                  />
                  {errors.organizationName && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.organizationName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
                    placeholder="Enter registration number"
                    disabled={loading}
                    className={getErrorStyle('registrationNumber')}
                  />
                  {errors.registrationNumber && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleFieldChange('category', value)}>
                    <SelectTrigger className={getErrorStyle('category')}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year *</Label>
                  <Select value={formData.foundedYear.toString()} onValueChange={(value) => handleFieldChange('foundedYear', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Describe your organization's mission and activities..."
                  rows={4}
                  disabled={loading}
                  className={getErrorStyle('description')}
                />
                {errors.description && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission</Label>
                  <Input
                    id="mission"
                    type="text"
                    value={formData.mission}
                    onChange={(e) => handleFieldChange('mission', e.target.value)}
                    placeholder="Organization mission"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vision">Vision</Label>
                  <Input
                    id="vision"
                    type="text"
                    value={formData.vision}
                    onChange={(e) => handleFieldChange('vision', e.target.value)}
                    placeholder="Organization vision"
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Organization's Primary Contact Person
              </CardTitle>
              <CardDescription>
                Main contact person for volunteer coordination (can be different from account holder)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> This is the person who will be contacted by volunteers about your tasks. 
                  This can be the same as the account holder or a different person in your organization.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                  <Input
                    id="contactPersonName"
                    type="text"
                    required
                    value={formData.contactPersonName}
                    onChange={(e) => handleFieldChange('contactPersonName', e.target.value)}
                    placeholder="Contact person full name"
                    disabled={loading}
                    className={getErrorStyle('contactPersonName')}
                  />
                  {errors.contactPersonName && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.contactPersonName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPersonEmail">Contact Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contactPersonEmail"
                      type="email"
                      required
                      value={formData.contactPersonEmail}
                      onChange={(e) => handleFieldChange('contactPersonEmail', e.target.value)}
                      className={`pl-10 ${getErrorStyle('contactPersonEmail')}`}
                      placeholder="contact@organization.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.contactPersonEmail && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.contactPersonEmail}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPersonPhone">Contact Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contactPersonPhone"
                      type="tel"
                      required
                      value={formData.contactPersonPhone}
                      onChange={(e) => handleFieldChange('contactPersonPhone', e.target.value)}
                      className={`pl-10 ${getErrorStyle('contactPersonPhone')}`}
                      placeholder="+1 (555) 123-4567"
                      disabled={loading}
                    />
                  </div>
                  {errors.contactPersonPhone && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.contactPersonPhone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Organization Address
              </CardTitle>
              <CardDescription>
                Physical address of your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => handleFieldChange('street', e.target.value)}
                  placeholder="123 Main Street"
                  disabled={loading}
                  className={getErrorStyle('street')}
                />
                {errors.street && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.street}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="City"
                    disabled={loading}
                    className={getErrorStyle('city')}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="State"
                    disabled={loading}
                    className={getErrorStyle('state')}
                  />
                  {errors.state && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.state}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                    placeholder="12345"
                    disabled={loading}
                    className={getErrorStyle('zipCode')}
                  />
                  {errors.zipCode && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-red-600 hover:text-red-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-red-600 hover:text-red-500">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating NGO Account...' : 'Create NGO Account'}
              </Button>
            </CardContent>
          </Card>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/ngo-login" className="font-medium text-red-600 hover:text-red-500">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Are you a volunteer?{' '}
            <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
              Register as volunteer
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 