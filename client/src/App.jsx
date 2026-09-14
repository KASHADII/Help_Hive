import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { CommandPalette } from './components/CommandPalette'
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
import { TestPage } from './pages/TestPage'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#090A0F] text-white p-4">
          <div className="max-w-md w-full bg-[#0E1118] border border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">
              System Exception Captured
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              {this.state.error?.message || 'An unexpected error occurred in HelpHive OS'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
            >
              Restart Terminal
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const AppContent = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#090A0F] text-gray-100 selection:bg-indigo-500/30">
      <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
      
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test-page" element={<TestPage />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngo-login" element={<NgoLogin />} />
          <Route path="/ngo-register" element={<NgoRegister />} />
          
          {/* Protected Routes */}
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
  )
}

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App