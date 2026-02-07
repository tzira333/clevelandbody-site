'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr';
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClientComponentClient();
const router = useRouter();

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/admin/staff/login');
  router.refresh();
};


interface Appointment {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  service_type: string
  appointment_date: string
  appointment_time: string
  status: string
  vehicle_year?: string
  vehicle_make?: string
  vehicle_model?: string
  damage_description?: string
  insurance_claim?: string
  message?: string
  staff_notes?: string
  created_at: string
  archived_at?: string
}

interface NoteModalProps {
  appointment: Appointment
  onClose: () => void
  onSave: (id: string, notes: string) => void
}

function NoteModal({ appointment, onClose, onSave }: NoteModalProps) {
  const [notes, setNotes] = useState(appointment.staff_notes || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(appointment.id, notes)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Staff Notes</h2>
              <p className="text-sm text-gray-600 mt-1">
                {appointment.customer_name} - {appointment.service_type}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Date:</span>{' '}
                <span className="text-gray-900">{appointment.appointment_date}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Time:</span>{' '}
                <span className="text-gray-900">{appointment.appointment_time}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Phone:</span>{' '}
                <span className="text-gray-900">{appointment.customer_phone}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span>{' '}
                <span className={`font-semibold ${
                  appointment.status === 'completed' ? 'text-green-600' :
                  appointment.status === 'in-progress' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Internal Staff Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Add internal notes about this request...&#10;&#10;Examples:&#10;- Called customer to confirm details&#10;- Parts ordered on [date]&#10;- Vehicle dropped off at [time]&#10;- Special instructions from customer&#10;- Follow-up needed"
            />
            <p className="text-xs text-gray-500 mt-2">
              These notes are only visible to staff members and will not be shared with customers.
            </p>
          </div>

          {/* Buttons */}

          <div className="flex gap-3">
<button
  onClick={handleLogout}
  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
>
  Logout
</button>




            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                '💾 Save Notes'
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StaffDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [archivedAppointments, setArchivedAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'active' | 'archived'>('active')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  useEffect(() => {
    fetchAppointments()
  }, [view])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })

      if (view === 'active') {
        query = query.is('archived_at', null)
      } else {
        query = query.not('archived_at', 'is', null)
      }

      const { data, error } = await query

      if (error) throw error

      if (view === 'active') {
        setAppointments(data || [])
      } else {
        setArchivedAppointments(data || [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setAppointments(prev =>
        prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
      )
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const archiveAppointment = async (id: string) => {
    const appointment = appointments.find(apt => apt.id === id)
    
    if (!appointment) return

    // Check if status is completed
    if (appointment.status !== 'completed') {
      const confirmArchive = confirm(
        'This appointment is not marked as completed. Are you sure you want to archive it?'
      )
      if (!confirmArchive) return
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          archived_at: new Date().toISOString(),
          status: appointment.status === 'completed' ? 'completed' : appointment.status
        })
        .eq('id', id)

      if (error) throw error

      // Remove from active list
      setAppointments(prev => prev.filter(apt => apt.id !== id))
      
      alert('✅ Appointment archived successfully!')
    } catch (error) {
      console.error('Error archiving appointment:', error)
      alert('Failed to archive appointment')
    }
  }

  const unarchiveAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ archived_at: null })
        .eq('id', id)

      if (error) throw error

      // Remove from archived list
      setArchivedAppointments(prev => prev.filter(apt => apt.id !== id))
      
      alert('✅ Appointment restored successfully!')
    } catch (error) {
      console.error('Error unarchiving appointment:', error)
      alert('Failed to restore appointment')
    }
  }

  const saveNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ staff_notes: notes })
        .eq('id', id)

      if (error) throw error

      // Update local state
      if (view === 'active') {
        setAppointments(prev =>
          prev.map(apt => apt.id === id ? { ...apt, staff_notes: notes } : apt)
        )
      } else {
        setArchivedAppointments(prev =>
          prev.map(apt => apt.id === id ? { ...apt, staff_notes: notes } : apt)
        )
      }

      alert('✅ Notes saved successfully!')
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Failed to save notes')
    }
  }

  const openNoteModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowNoteModal(true)
  }

  const getServiceTypeBadge = (serviceType: string) => {
    const types: Record<string, { label: string; color: string }> = {
      'express-care': { label: '⚡ Express Care', color: 'bg-red-100 text-red-800 border-red-300' },
      'schedule': { label: '📅 Schedule', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      'tow-service': { label: '🚛 Tow Service', color: 'bg-orange-100 text-orange-800 border-orange-300' },
      'contact-inquiry': { label: '💬 Contact', color: 'bg-gray-100 text-gray-800 border-gray-300' },
    }
    
    const type = types[serviceType] || { label: serviceType, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${type.color}`}>
        {type.label}
      </span>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  const filteredAppointments = (view === 'active' ? appointments : archivedAppointments).filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
    const matchesSearch = 
      apt.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customer_phone.includes(searchQuery) ||
      apt.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 font-semibold">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage appointments and requests</p>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setView('active')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'active'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Active ({appointments.length})
              </button>
              <button
                onClick={() => setView('archived')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  view === 'archived'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📦 Archived ({archivedAppointments.length})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={fetchAppointments}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">
                {view === 'active' ? '📭' : '📦'}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {view === 'active' ? 'No Active Appointments' : 'No Archived Appointments'}
              </h3>
              <p className="text-gray-600">
                {view === 'active' 
                  ? 'All appointments are up to date!' 
                  : 'No appointments have been archived yet.'}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left: Appointment Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {appointment.customer_name}
                          </h3>
                          {getServiceTypeBadge(appointment.service_type)}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📞 {appointment.customer_phone}</p>
                          <p>📧 {appointment.customer_email}</p>
                          <p>📅 {appointment.appointment_date} at {appointment.appointment_time}</p>
                          
                          {appointment.vehicle_make && (
                            <p>🚗 {appointment.vehicle_year} {appointment.vehicle_make} {appointment.vehicle_model}</p>
                          )}
                          
                          {appointment.damage_description && (
                            <p className="mt-2">
                              <span className="font-semibold">Damage:</span> {appointment.damage_description}
                            </p>
                          )}
                          
                          {appointment.message && (
                            <p className="mt-2">
                              <span className="font-semibold">Message:</span> {appointment.message}
                            </p>
                          )}

                          {appointment.staff_notes && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="font-semibold text-blue-800 mb-1">📝 Staff Notes:</p>
                              <p className="text-blue-900 whitespace-pre-wrap">{appointment.staff_notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                        Status: {appointment.status}
                      </span>
                      {appointment.archived_at && (
                        <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300">
                          📦 Archived on {new Date(appointment.archived_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    {view === 'active' && (
                      <>
                        {/* Status Update */}
                        <select
                          value={appointment.status}
                          onChange={(e) => updateStatus(appointment.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Add/Edit Notes */}
                        <button
                          onClick={() => openNoteModal(appointment)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {appointment.staff_notes ? 'Edit Notes' : 'Add Notes'}
                        </button>

                        {/* Archive Button */}
                        <button
                          onClick={() => archiveAppointment(appointment.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-2 ${
                            appointment.status === 'completed'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-600 text-white hover:bg-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          Archive
                        </button>
                      </>
                    )}

                    {view === 'archived' && (
                      <>
                        {/* View Notes (Read-only) */}
                        <button
                          onClick={() => openNoteModal(appointment)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Notes
                        </button>

                        {/* Unarchive Button */}
                        <button
                          onClick={() => unarchiveAppointment(appointment.id)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Restore
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && selectedAppointment && (
        <NoteModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowNoteModal(false)
            setSelectedAppointment(null)
          }}
          onSave={saveNotes}
        />
      )}
    </div>
  )
}
