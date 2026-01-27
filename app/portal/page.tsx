'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { normalizePhone, formatPhoneDisplay } from '@/lib/utils/phone'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface Appointment {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  appointment_date: string
  appointment_time: string
  service_type: string
  vehicle_info: string
  message: string
  status: string
  created_at: string
  updated_at: string
}

interface AppointmentPhoto {
  id: string
  appointment_id: string
  photo_url: string
  photo_path: string
  caption: string
  uploaded_by: string
  created_at: string
}

export default function CustomerPortalPage() {
  const [step, setStep] = useState<'login' | 'appointments'>('login')
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentPhotos, setAppointmentPhotos] = useState<Record<string, AppointmentPhoto[]>>({})
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const normalizeEmail = (email: string): string => {
    return email.toLowerCase().trim()
  }

  const loadPhotosForAppointment = async (appointmentId: string) => {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await supabase
        .from('appointment_photos')
        .select('*')
        .eq('appointment_id', appointmentId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setAppointmentPhotos(prev => ({
        ...prev,
        [appointmentId]: data || []
      }))
    } catch (err) {
      console.error('Error loading photos:', err)
    }
  }

  const handlePhotoUpload = async (appointmentId: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploadingPhoto(appointmentId)
    setUploadProgress(0)
    setError('')

    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const uploadedPhotos: AppointmentPhoto[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`)
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Max size is 5MB`)
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${appointmentId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('customer-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('customer-photos')
          .getPublicUrl(fileName)

        const { data: photoRecord, error: dbError } = await supabase
          .from('appointment_photos')
          .insert({
            appointment_id: appointmentId,
            photo_url: urlData.publicUrl,
            photo_path: fileName,
            caption: file.name,
            uploaded_by: 'customer'
          })
          .select()
          .single()

        if (dbError) throw dbError

        uploadedPhotos.push(photoRecord)
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      await loadPhotosForAppointment(appointmentId)
      alert(`Successfully uploaded ${uploadedPhotos.length} photo(s)!`)
    } catch (err: any) {
      console.error('Photo upload error:', err)
      setError(err.message || 'Failed to upload photos. Please try again.')
    } finally {
      setUploadingPhoto(null)
      setUploadProgress(0)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      let matchedAppointments: Appointment[] = []

      if (loginMethod === 'phone') {
        // CRITICAL FIX: Use normalizePhone utility for consistent lookup
        const normalized = normalizePhone(phoneNumber)
        console.log('Searching by normalized phone:', normalized)

        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('customer_phone', normalized) // Match digits only
          .order('created_at', { ascending: false })

        if (error) throw error
        matchedAppointments = data || []
      } else {
        const normalizedEmail = normalizeEmail(email)
        console.log('Searching by email:', normalizedEmail)

        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('customer_email', normalizedEmail)
          .order('created_at', { ascending: false })

        if (error) throw error
        matchedAppointments = data || []
      }

      if (matchedAppointments.length === 0) {
        const identifier = loginMethod === 'phone' 
          ? formatPhoneDisplay(phoneNumber)
          : email
        setError(`No appointments found for ${identifier}. Please check your ${loginMethod === 'phone' ? 'phone number' : 'email'} or contact us at (216) 481-8696.`)
        return
      }

      setAppointments(matchedAppointments)
      
      for (const appointment of matchedAppointments) {
        await loadPhotosForAppointment(appointment.id)
      }

      setStep('appointments')
    } catch (err: any) {
      console.error('Portal login error:', err)
      setError(`Error: ${err.message || 'Unable to retrieve appointments. Please try again or call (216) 481-8696.'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'in-progress': case 'in progress': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'completed': return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳'
      case 'confirmed': return '✓'
      case 'in-progress': case 'in progress': return '🔧'
      case 'completed': return '✅'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  if (step === 'login') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Portal</h1>
            <p className="text-gray-700">
              Enter your phone number or email to view your repair status and upload photos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="card space-y-6">
            {/* Login Method Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                📞 Phone
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✉️ Email
              </button>
            </div>

            {/* Phone Input */}
            {loginMethod === 'phone' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Allow any input format - we normalize on submit
                    setPhoneNumber(e.target.value)
                  }}
                  placeholder="216-555-1234 or 2165551234"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Enter the phone number you used when scheduling (any format works)
                </p>
              </div>
            )}

            {/* Email Input */}
            {loginMethod === 'email' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Enter the email address you used when scheduling
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'View My Appointments'}
            </button>

            <div className="text-center pt-4 border-t">
              <p className="text-gray-600 text-sm mb-2">Need help?</p>
              <a href="tel:+12164818696" className="text-primary font-bold hover:underline">
                Call (216) 481-8696
              </a>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Appointments view
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-700">
              {loginMethod === 'phone' ? `Phone: ${formatPhoneDisplay(phoneNumber)}` : `Email: ${email}`}
            </p>
          </div>
          <button
            onClick={() => {
              setStep('login')
              setPhoneNumber('')
              setEmail('')
              setAppointments([])
              setAppointmentPhotos({})
              setError('')
            }}
            className="text-primary hover:underline font-semibold"
          >
            ← Back to Login
          </button>
        </div>

        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="card hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(appointment.status)}`}>
                  <span className="mr-2">{getStatusIcon(appointment.status)}</span>
                  {appointment.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  Submitted {new Date(appointment.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{appointment.vehicle_info}</h3>
                    <p className="text-gray-700"><span className="font-semibold">Service:</span> {appointment.service_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-700"><span className="font-semibold">Time:</span> {appointment.appointment_time}</p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Contact:</span> {formatPhoneDisplay(appointment.customer_phone)}
                    </p>
                    {appointment.customer_email && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span> {appointment.customer_email}
                      </p>
                    )}
                  </div>
                  {appointment.message && (
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Notes:</p>
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">{appointment.message}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-primary-light/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
                    <a href="tel:+12164818696" className="flex items-center text-primary hover:underline mb-2">
                      📞 (216) 481-8696
                    </a>
                    <p className="text-sm text-gray-600">
                      Mon-Fri: 8:00 AM - 4:30 PM<br />
                      Sat: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">📷 Vehicle Damage Photos</h4>
                <div className="mb-4">
                  <label className={`btn-primary inline-flex items-center cursor-pointer ${uploadingPhoto === appointment.id ? 'opacity-50' : ''}`}>
                    ➕ {uploadingPhoto === appointment.id ? `Uploading ${uploadProgress}%...` : 'Upload Photos'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingPhoto === appointment.id}
                      onChange={(e) => handlePhotoUpload(appointment.id, e.target.files)}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-600 mt-2">Max 5MB per photo. JPG, PNG, or HEIC format.</p>
                </div>

                {appointmentPhotos[appointment.id]?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {appointmentPhotos[appointment.id].map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.photo_url}
                          alt={photo.caption}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-primary cursor-pointer transition-all"
                          onClick={() => window.open(photo.photo_url, '_blank')}
                        />
                        <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(photo.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600">No photos uploaded yet. Click "Upload Photos" to add images of vehicle damage.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
