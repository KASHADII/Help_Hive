import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Shield, 
  Building, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  LogOut,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export const AdminDashboard = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')

  const { adminLogout } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Load NGO applications from localStorage
    const loadApplications = () => {
      const storedApplications = localStorage.getItem('ngoApplications')
      if (storedApplications) {
        const parsed = JSON.parse(storedApplications)
        console.log('Loaded applications from localStorage:', parsed)
        setApplications(parsed)
      } else {
        // Sample data for demonstration
        const sampleApplications = [
          {
            id: 1,
            ngoName: 'Community Care Center',
            email: 'admin@communitycare.org',
            contactPerson: 'John Smith',
            contactEmail: 'john@communitycare.org',
            phone: '+1-555-0123',
            address: '123 Main St, Downtown',
            website: 'https://communitycare.org',
            category: 'Healthcare',
            description: 'Providing healthcare services to underprivileged communities',
            foundedYear: '2015',
            registrationNumber: 'NGO-2023-001',
            status: 'pending',
            submittedAt: '2024-01-10T10:30:00Z',
            documents: {
              registrationCertificate: 'registration_cert.pdf',
              taxExemption: 'tax_exemption.pdf',
              annualReport: 'annual_report_2023.pdf'
            }
          },
          {
            id: 2,
            ngoName: 'Green Earth Initiative',
            email: 'info@greenearth.org',
            contactPerson: 'Sarah Johnson',
            contactEmail: 'sarah@greenearth.org',
            phone: '+1-555-0456',
            address: '456 Oak Ave, Green District',
            website: 'https://greenearth.org',
            category: 'Environment',
            description: 'Environmental conservation and sustainability projects',
            foundedYear: '2018',
            registrationNumber: 'NGO-2023-002',
            status: 'approved',
            submittedAt: '2024-01-08T14:20:00Z',
            documents: {
              registrationCertificate: 'green_registration.pdf',
              taxExemption: 'green_tax_exemption.pdf'
            }
          },
          {
            id: 3,
            ngoName: 'Youth Education Foundation',
            email: 'contact@youthedu.org',
            contactPerson: 'Michael Brown',
            contactEmail: 'michael@youthedu.org',
            phone: '+1-555-0789',
            address: '789 Pine St, Education District',
            website: 'https://youthedu.org',
            category: 'Education',
            description: 'Educational programs for underprivileged youth',
            foundedYear: '2020',
            registrationNumber: 'NGO-2023-003',
            status: 'rejected',
            submittedAt: '2024-01-05T09:15:00Z',
            documents: {
              registrationCertificate: 'youth_registration.pdf'
            }
          }
        ]
        console.log('Setting sample applications:', sampleApplications)
        setApplications(sampleApplications)
        localStorage.setItem('ngoApplications', JSON.stringify(sampleApplications))
      }
      setLoading(false)
    }

    loadApplications()
  }, [])

  const handleStatusUpdate = (applicationId, newStatus) => {
    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    )
    setApplications(updatedApplications)
    localStorage.setItem('ngoApplications', JSON.stringify(updatedApplications))
    setSelectedApplication(null)
  }

  const setSelectedApplicationWithLog = (application) => {
    console.log('Setting selectedApplication:', application)
    setSelectedApplication(application)
  }

  const getStatusBadge = (status) => {
    if (!status) {
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
    
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{String(status)}</Badge>
    }
  }

  const filteredApplications = applications.filter(app => app.status === activeTab)

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">NGO Application Management</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(app => app.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(app => app.status === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(app => app.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'pending', label: 'Pending Review', count: applications.filter(app => app.status === 'pending').length },
                { id: 'approved', label: 'Approved', count: applications.filter(app => app.status === 'approved').length },
                { id: 'rejected', label: 'Rejected', count: applications.filter(app => app.status === 'rejected').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No {activeTab} applications found.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{String(application.ngoName || '')}</CardTitle>
                      <CardDescription>
                        {String(application.category || '')} • Submitted {new Date(application.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(application.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplicationWithLog(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {String(application.email || '')}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {String(application.phone || '')}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {String(application.address || '')}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {String(application.website || '')}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {String(application.description || '')}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {String(selectedApplication.ngoName || '')}
                </h2>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(selectedApplication.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Organization Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Category:</strong> {String(selectedApplication.category || '')}</div>
                      <div><strong>Founded Year:</strong> {String(selectedApplication.foundedYear || '')}</div>
                      <div><strong>Registration Number:</strong> {String(selectedApplication.registrationNumber || '')}</div>
                      <div><strong>Website:</strong> <a href={String(selectedApplication.website || '')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{String(selectedApplication.website || '')}</a></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Contact Person:</strong> {String(selectedApplication.contactPerson || '')}</div>
                      <div><strong>Email:</strong> {String(selectedApplication.contactEmail || '')}</div>
                      <div><strong>Phone:</strong> {String(selectedApplication.phone || '')}</div>
                      <div><strong>Address:</strong> {String(selectedApplication.address || '')}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{String(selectedApplication.description || '')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                    <div className="space-y-2">
                      {selectedApplication.documents && Object.entries(selectedApplication.documents).map(([key, filename]) => (
                        <div key={key} className="flex items-center space-x-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-blue-600">{String(filename)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedApplication.status === 'pending' && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Review Decision</h3>
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 