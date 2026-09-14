import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  LogOut,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  RefreshCw,
  X
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
  const [actionNotes, setActionNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  const { adminLogout } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const dashboardData = await adminAPI.getDashboard()
      setStats(dashboardData.data || {})
      
      const ngosData = await adminAPI.getNGOs()
      setNGOs(ngosData.data || [])
    } catch (err) {
      console.error('Error loading admin data:', err)
      setError('Could not fetch NGO verification records.')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveNGO = async (ngoId) => {
    try {
      setProcessing(true)
      await adminAPI.approveNGO(ngoId, actionNotes)
      await loadData()
      setSelectedNGO(null)
      setActionNotes('')
    } catch (err) {
      console.error('Error approving NGO:', err)
      setError('Failed to approve NGO.')
    } finally {
      setProcessing(false)
    }
  }

  const handleRejectNGO = async (ngoId) => {
    try {
      setProcessing(true)
      await adminAPI.rejectNGO(ngoId, actionNotes || 'Document verification incomplete', actionNotes)
      await loadData()
      setSelectedNGO(null)
      setActionNotes('')
    } catch (err) {
      console.error('Error rejecting NGO:', err)
      setError('Failed to reject NGO.')
    } finally {
      setProcessing(false)
    }
  }

  const filteredNGOs = ngos.filter(ngo => {
    const status = ngo.verificationStatus || ngo.status
    if (activeTab === 'all') return true
    return status === activeTab
  })

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
            <ShieldCheck className="w-4 h-4" />
            <span>ADMINISTRATOR GATEWAY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            NGO Verification & Compliance Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Verify new non-profit registrations, review Tax IDs, and ensure safety across the community.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-2 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Records</span>
          </button>
          <button
            onClick={async () => {
              await adminLogout()
              navigate('/admin/login')
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Pending Review</div>
          <div className="text-3xl font-black text-slate-900">
            {stats.pendingNGOs !== undefined ? stats.pendingNGOs : ngos.filter(n => (n.verificationStatus || n.status) === 'pending').length}
          </div>
          <div className="text-xs font-bold text-amber-700 mt-2">Awaiting Verification</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Approved NGOs</div>
          <div className="text-3xl font-black text-emerald-600">
            {stats.verifiedNGOs !== undefined ? stats.verifiedNGOs : ngos.filter(n => (n.verificationStatus || n.status) === 'approved').length}
          </div>
          <div className="text-xs font-bold text-emerald-700 mt-2">Verified Community Partners</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Total Volunteers</div>
          <div className="text-3xl font-black text-indigo-600">
            {stats.totalUsers || 2400}
          </div>
          <div className="text-xs font-bold text-indigo-700 mt-2">Active Network Helpers</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {['pending', 'approved', 'rejected', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {tab} Queue
          </button>
        ))}
      </div>

      {/* NGO Verification Queue */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        {filteredNGOs.length > 0 ? (
          <div className="space-y-3">
            {filteredNGOs.map((ngo) => {
              const status = ngo.verificationStatus || ngo.status || 'pending'
              return (
                <div
                  key={ngo._id}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-purple-50/30 border border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{ngo.organizationName || 'Non-Profit Partner'}</h4>
                      <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        status === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        status === 'rejected' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                        'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap gap-4 font-medium">
                      <span>Email: {ngo.email || 'N/A'}</span>
                      <span>Tax / Registration ID: {ngo.taxId || ngo.registrationNumber || 'N/A'}</span>
                      <span>Contact: {ngo.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => setSelectedNGO(ngo)}
                      className="px-4 py-2 rounded-2xl bg-white hover:bg-purple-600 hover:text-white text-xs font-bold text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500">
            <Building2 className="w-12 h-12 mx-auto text-purple-400/40 mb-2" />
            <p className="text-base font-bold text-slate-800">No NGOs in this list.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedNGO && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNGO(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-extrabold text-slate-900">NGO Verification Review</h3>
                </div>
                <button onClick={() => setSelectedNGO(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div><span className="text-slate-500 font-bold">ORGANIZATION:</span> <span className="text-slate-900 font-extrabold text-sm">{selectedNGO.organizationName}</span></div>
                  <div><span className="text-slate-500 font-bold">EMAIL:</span> <span className="text-slate-800">{selectedNGO.email}</span></div>
                  <div><span className="text-slate-500 font-bold">REGISTRATION NUMBER:</span> <span className="text-emerald-700 font-bold">{selectedNGO.registrationNumber || selectedNGO.taxId || 'N/A'}</span></div>
                  <div><span className="text-slate-500 font-bold">DESCRIPTION:</span> <span className="text-slate-700">{selectedNGO.description || 'No description provided.'}</span></div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    Verification Notes
                  </label>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Enter approval note or reason for rejection..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleRejectNGO(selectedNGO._id)}
                  className="px-5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleApproveNGO(selectedNGO._id)}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify NGO</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}