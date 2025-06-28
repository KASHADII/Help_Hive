import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminProtectedRoute } from './components/AdminProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { Home } from './pages/Home'
import { TaskList } from './pages/TaskList'
import { TaskDetail } from './pages/TaskDetail'
import { PostTask } from './pages/PostTask'
import { Profile } from './pages/Profile'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { NgoLogin } from './pages/NgoLogin'
import { NgoRegister } from './pages/NgoRegister'
import { NgoDetails } from './pages/NgoDetails'
import { NgoDashboard } from './pages/NgoDashboard'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'

const App = () => {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/ngo-login" element={<NgoLogin />} />
                <Route path="/ngo-register" element={<NgoRegister />} />
                
                {/* Protected Routes - Only for authenticated users */}
                <Route path="/post-task" element={
                  <ProtectedRoute>
                    <PostTask />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* NGO Specific Routes */}
                <Route path="/ngo-details" element={
                  <ProtectedRoute>
                    <NgoDetails />
                  </ProtectedRoute>
                } />
                <Route path="/ngo-dashboard" element={
                  <ProtectedRoute>
                    <NgoDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App