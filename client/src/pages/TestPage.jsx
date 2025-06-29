import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../contexts/AuthContext'

export const TestPage = () => {
  const [testData, setTestData] = useState(null)
  const [error, setError] = useState(null)
  const { currentUser, isAuthenticated, login, logout } = useAuth()

  useEffect(() => {
    // Test with different data types
    const testObjects = [
      { name: 'Test NGO', address: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001' } },
      { name: 'Another NGO', contactPerson: { name: 'John Doe', email: 'john@example.com' } },
      { name: 'Simple NGO', description: 'Just a string' }
    ]

    setTestData(testObjects)
  }, [])

  const renderSafely = (value, fallback = '') => {
    if (!value) return fallback
    if (typeof value === 'object') {
      if (value.street || value.city || value.state || value.zipCode) {
        return `${value.street || ''}, ${value.city || ''}, ${value.state || ''} ${value.zipCode || ''}`.trim()
      }
      if (value.name || value.email || value.phone) {
        return value.name || value.email || value.phone || fallback
      }
      try {
        return JSON.stringify(value)
      } catch {
        return fallback
      }
    }
    return String(value)
  }

  const testLogin = async () => {
    try {
      // Test with a sample NGO account
      const user = await login('test@ngo.com', 'password123')
      console.log('Test login result:', user)
    } catch (error) {
      console.error('Test login error:', error)
      setError(error.message)
    }
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Page Error</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Test Page</h1>
      <p className="text-gray-600">Testing object rendering safety and authentication</p>

      {/* Authentication Debug */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Current User:</strong> {currentUser ? JSON.stringify(currentUser, null, 2) : 'None'}</p>
            <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
            <p><strong>User Role:</strong> {currentUser?.role || 'None'}</p>
          </div>
          <div className="mt-4 space-x-2">
            <Button onClick={testLogin} variant="outline">
              Test Login
            </Button>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Object Rendering Test */}
      <Card>
        <CardHeader>
          <CardTitle>Object Rendering Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {testData?.map((item, index) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-semibold">{renderSafely(item.name)}</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Address:</strong> {renderSafely(item.address, 'No address')}</div>
                  <div><strong>Contact Person:</strong> {renderSafely(item.contactPerson, 'No contact')}</div>
                  <div><strong>Description:</strong> {renderSafely(item.description, 'No description')}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => window.location.reload()}>
        Refresh Page
      </Button>
    </div>
  )
} 