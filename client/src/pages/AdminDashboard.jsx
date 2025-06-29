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
import { adminAPI } from '../lib/api'

export const AdminDashboard = () => {
  const [ngos, setNGOs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNGO, setSelectedNGO] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [stats, setStats] = useState({})
  const [error, setError] = useState('')

  const { adminLogout } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load dashboard stats
      const dashboardData = await adminAPI.getDashboard()
      setStats(dashboardData.data)
      
      // Load NGOs
      const ngosData = await adminAPI.getNGOs()
      setNGOs(ngosData.data)
    } catch (error) {
      console.error('Error loading admin data:', error)
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveNGO = async (ngoId, adminNotes = '') => {
    try {
      await adminAPI.approveNGO(ngoId, adminNotes)
      await loadData() // Reload data
      setSelectedNGO(null)
    } catch (error) {
      console.error('Error approving NGO:', error)
      setError('Failed to approve NGO. Please try again.')
    }
  }

  const handleRejectNGO = async (ngoId, rejectionReason, adminNotes = '') => {
    try {
      await adminAPI.rejectNGO(ngoId, rejectionReason, adminNotes)
      await loadData() // Reload data
      setSelectedNGO(null)
    } catch (error) {
      console.error('Error rejecting NGO:', error)
      setError('Failed to reject NGO. Please try again.')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Helper function to safely render any field that might be an object
  const safeRender = (value, fallback = '') => {
    if (!value) return fallback
    if (typeof value === 'object') {
      // Handle address object
      if (value.street || value.city || value.state || value.zipCode) {
        return `${value.street || ''}, ${value.city || ''}, ${value.state || ''} ${value.zipCode || ''}`.trim()
      }
      // Handle contactPerson object
      if (value.name || value.email || value.phone) {
        return value.name || value.email || value.phone || fallback
      }
      // For other objects, try to stringify or return fallback
      try {
        return JSON.stringify(value)
      } catch {
        return fallback
      }
    }
    return String(value)
  }

  const filteredNGOs = ngos.filter(ngo => ngo.status === activeTab)

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
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ngos.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ngos.filter(ngo => ngo.status === 'pending').length}
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
                {ngos.filter(ngo => ngo.status === 'approved').length}
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
                {ngos.filter(ngo => ngo.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'pending', label: 'Pending Review', count: ngos.filter(ngo => ngo.status === 'pending').length },
                { id: 'approved', label: 'Approved', count: ngos.filter(ngo => ngo.status === 'approved').length },
                { id: 'rejected', label: 'Rejected', count: ngos.filter(ngo => ngo.status === 'rejected').length }
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
          {filteredNGOs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No {activeTab} applications found.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNGOs.map((ngo) => (
              <Card key={ngo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{safeRender(ngo.organizationName)}</CardTitle>
                      <CardDescription>
                        {safeRender(ngo.category)} • Submitted {new Date(ngo.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(ngo.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNGO(ngo)}
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
                      {safeRender(ngo.email)}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {safeRender(ngo.phone)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {safeRender(ngo.address)}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {safeRender(ngo.website)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {safeRender(ngo.description)}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedNGO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {safeRender(selectedNGO.organizationName)}
                </h2>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(selectedNGO.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedNGO(null)}
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
                      <div><strong>Category:</strong> {safeRender(selectedNGO.category)}</div>
                      <div><strong>Founded Year:</strong> {safeRender(selectedNGO.foundedYear)}</div>
                      <div><strong>Registration Number:</strong> {safeRender(selectedNGO.registrationNumber)}</div>
                      <div><strong>Website:</strong> <a href={safeRender(selectedNGO.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{safeRender(selectedNGO.website)}</a></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Contact Person:</strong> {safeRender(selectedNGO.contactPerson, 'No contact person')}</div>
                      <div><strong>Email:</strong> {safeRender(selectedNGO.contactEmail)}</div>
                      <div><strong>Phone:</strong> {safeRender(selectedNGO.phone)}</div>
                      <div><strong>Address:</strong> {safeRender(selectedNGO.address)}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{safeRender(selectedNGO.description)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                    <div className="space-y-2">
                      {selectedNGO.documents && Object.entries(selectedNGO.documents).map(([key, filename]) => (
                        <div key={key} className="flex items-center space-x-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-blue-600">{String(filename)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedNGO.status === 'pending' && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Review Decision</h3>
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleApproveNGO(selectedNGO._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            const reason = prompt('Please provide a reason for rejection:')
                            if (reason) {
                              handleRejectNGO(selectedNGO._id, reason)
                            }
                          }}
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