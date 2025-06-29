import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { 
  Building, 
  MapPin, 
  Phone, 
  Globe, 
  FileText, 
  Upload, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const NgoDetails = () => {
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    website: '',
    description: '',
    category: '',
    foundedYear: '',
    contactPerson: '',
    contactEmail: '',
    registrationNumber: ''
  })
  const [documents, setDocuments] = useState({
    registrationCertificate: null,
    taxExemption: null,
    annualReport: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated and has registration data
    if (!currentUser) {
      navigate('/ngo-login')
      return
    }

    const ngoData = localStorage.getItem('ngoRegistrationData')
    if (!ngoData) {
      navigate('/ngo-register')
      return
    }
  }, [currentUser, navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field, file) => {
    setDocuments(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)

      // Here you would typically upload files to Firebase Storage
      // and save the NGO details to Firestore
      // For now, we'll simulate the process

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Store NGO details for admin review
      const ngoApplication = {
        id: Date.now(),
        ...formData,
        userId: currentUser._id,
        email: currentUser.email,
        ngoName: currentUser.name,
        documents: documents,
        status: 'pending', // pending, approved, rejected
        submittedAt: new Date().toISOString()
      }

      // Get existing applications or create new array
      const existingApplications = localStorage.getItem('ngoApplications')
      const applications = existingApplications ? JSON.parse(existingApplications) : []
      applications.push(ngoApplication)
      localStorage.setItem('ngoApplications', JSON.stringify(applications))

      // Store NGO details in localStorage for the user
      localStorage.setItem('ngoDetails', JSON.stringify({
        ...formData,
        userId: currentUser._id,
        email: currentUser.email,
        ngoName: currentUser.name,
        documents: documents,
        status: 'pending',
        createdAt: new Date().toISOString()
      }))
      
      // Clear registration data
      localStorage.removeItem('ngoRegistrationData')
      
      setSuccess(true)
      
      // Redirect to NGO dashboard after 2 seconds
      setTimeout(() => {
        navigate('/ngo-dashboard')
      }, 2000)

    } catch (error) {
      console.error('Error saving NGO details:', error)
      setError('Failed to save organization details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const requiredFields = ['address', 'phone', 'description', 'category', 'contactPerson', 'contactEmail']
  const isFormValid = requiredFields.every(field => formData[field]?.trim())

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Registration Complete!
              </h2>
              <p className="text-gray-600 mb-4">
                Your organization details have been submitted successfully. 
                Our team will review your application and get back to you soon.
              </p>
              <div className="animate-pulse">
                <p className="text-sm text-gray-500">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Organization Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Please provide additional details about your organization to complete the registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide essential details about your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="pl-10"
                      placeholder="Enter organization address"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                      placeholder="Enter phone number"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="pl-10"
                      placeholder="https://example.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Environment">Environment</SelectItem>
                      <SelectItem value="Community Service">Community Service</SelectItem>
                      <SelectItem value="Animal Welfare">Animal Welfare</SelectItem>
                      <SelectItem value="Disaster Relief">Disaster Relief</SelectItem>
                      <SelectItem value="Human Rights">Human Rights</SelectItem>
                      <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your organization's mission and activities..."
                  rows={4}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Primary contact person for volunteer coordination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person Name *</Label>
                  <Input
                    id="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Enter contact person name"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="contact@organization.com"
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </CardTitle>
              <CardDescription>
                Upload required documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationCertificate">Registration Certificate *</Label>
                  <div className="relative">
                    <Input
                      id="registrationCertificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('registrationCertificate', e.target.files[0])}
                      disabled={loading}
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxExemption">Tax Exemption Certificate</Label>
                  <div className="relative">
                    <Input
                      id="taxExemption"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('taxExemption', e.target.files[0])}
                      disabled={loading}
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualReport">Annual Report</Label>
                  <div className="relative">
                    <Input
                      id="annualReport"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('annualReport', e.target.files[0])}
                      disabled={loading}
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card>
            <CardContent className="pt-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isFormValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isFormValid ? 'All required fields completed' : 'Please complete all required fields'}
                  </span>
                </div>

                <Button type="submit" disabled={!isFormValid || loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
} 