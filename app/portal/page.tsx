'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'


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
  const [step, setStep] = useState<'phone' | 'appointments'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentPhotos, setAppointmentPhotos] = useState<Record<string, AppointmentPhoto[]>>({})
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [debugInfo, setDebugInfo] = useState<string>('')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const normalizePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    // If it's 11 digits and starts with 1, remove the 1
    if (digits.length === 11 && digits[0] === '1') {
      return digits.substring(1)
    }
    
    // Return just the 10 digits
    return digits.substring(0, 10)
  }

  const formatPhoneForDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
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
    setDebugInfo('')

    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const normalizedPhone = normalizePhoneNumber(phoneNumber)

      // First, get ALL appointments to debug
      const { data: allAppointments, error: allError } = await supabase
        .from('appointments')
        .select('id, customer_name, customer_phone')
        .limit(5)

      if (allError) {
        console.error('Error fetching all appointments:', allError)
      } else {
        console.log('Sample appointments in database:', allAppointments)
        setDebugInfo(`Found ${allAppointments?.length || 0} total appointments in database. Searching for: ${normalizedPhone}`)
      }

      // Try multiple search strategies
      console.log('Searching for normalized phone:', normalizedPhone)

      // Strategy 1: Direct match on normalized digits
      let { data: matchedAppointments, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .or(`customer_phone.eq.${normalizedPhone},customer_phone.eq.+1${normalizedPhone},customer_phone.eq.(${normalizedPhone.slice(0,3)}) ${normalizedPhone.slice(3,6)}-${normalizedPhone.slice(6)},customer_phone.eq.${normalizedPhone.slice(0,3)}-${normalizedPhone.slice(3,6)}-${normalizedPhone.slice(6)}`)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Supabase query error:', fetchError)
        throw fetchError
      }

      // Strategy 2: If no matches, try using LIKE with wildcards
      if (!matchedAppointments || matchedAppointments.length === 0) {
        console.log('No exact matches, trying LIKE search...')
        
        const { data: likeMatches, error: likeError } = await supabase
          .from('appointments')
          .select('*')
          .ilike('customer_phone', `%${normalizedPhone.slice(-10)}%`)
          .order('created_at', { ascending: false })

        if (likeError) {
          console.error('LIKE query error:', likeError)
        } else {
          matchedAppointments = likeMatches
          console.log('LIKE search results:', likeMatches)
        }
      }

      // Strategy 3: If still no matches, get ALL and filter in JavaScript
      if (!matchedAppointments || matchedAppointments.length === 0) {
        console.log('No LIKE matches, trying client-side filtering...')
        
        const { data: allData, error: allError } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false })

        if (allError) {
          console.error('All appointments error:', allError)
        } else {
          console.log(`Fetched ${allData?.length} appointments, filtering...`)
          matchedAppointments = allData?.filter(apt => {
            const aptNormalized = normalizePhoneNumber(apt.customer_phone)
            const match = aptNormalized === normalizedPhone
            if (match) {
              console.log(`Match found: ${apt.customer_phone} normalized to ${aptNormalized}`)
            }
            return match
          })
          console.log(`Client-side filter found ${matchedAppointments?.length} matches`)
        }
      }

      if (!matchedAppointments || matchedAppointments.length === 0) {
        setError(`No appointments found for phone number: ${formatPhoneForDisplay(phoneNumber)}. Please check the number or contact us at (216) 481-8696.`)
        
        // Show debug info if available
        if (allAppointments && allAppointments.length > 0) {
          console.log('Available phone numbers in database:', allAppointments.map(a => a.customer_phone))
          setDebugInfo(prev => prev + `\n\nSample phone numbers in database: ${allAppointments.map(a => a.customer_phone).join(', ')}`)
        }
        return
      }

      console.log(`Found ${matchedAppointments.length} matching appointments`)
      setAppointments(matchedAppointments)
      
      // Load photos for all appointments
      for (const appointment of matchedAppointments) {
        await loadPhotosForAppointment(appointment.id)
      }

      setStep('appointments')
    } catch (err: any) {
      console.error('Portal login error:', err)
      setError('Unable to retrieve appointments. Please try again or call (216) 481-8696.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'in-progress':
      case 'in progress':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '⏳'
      case 'confirmed':
        return '✓'
      case 'in-progress':
      case 'in progress':
        return '🔧'
      case 'completed':
        return '✅'
      case 'cancelled':
        return '❌'
      default:
        return '📋'
    }
  }

  if (step === 'phone') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Portal</h1>
            <p className="text-gray-700">
              Enter your phone number to view your repair status and upload photos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="card space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(216) 481-8696"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter the phone number you used when scheduling your appointment
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {debugInfo && (
              <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-xs">
                <strong>Debug Info:</strong>
                <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
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
              <a
                href="tel:+12164818696"
                className="text-primary font-bold hover:underline"
              >
                Call (216) 481-8696
              </a>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-700">
              Phone: {formatPhoneForDisplay(phoneNumber)}
            </p>
          </div>
          <button
            onClick={() => {
              setStep('phone')
              setPhoneNumber('')
              setAppointments([])
              setAppointmentPhotos({})
              setError('')
              setDebugInfo('')
            }}
            className="text-primary hover:underline"
          >
            ← Back to Login
          </button>
        </div>

        {/* Global Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="card hover:shadow-xl transition-shadow">
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(appointment.status)}`}>
                  <span className="mr-2">{getStatusIcon(appointment.status)}</span>
                  {appointment.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  Submitted {new Date(appointment.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Appointment Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {appointment.vehicle_info}
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-semibold">Service:</span> {appointment.service_type}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Appointment Date:</span>{' '}
                      {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Time:</span> {appointment.appointment_time}
                    </p>
                  </div>

                  {appointment.message && (
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Notes:</p>
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                        {appointment.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column - Contact Actions */}
                <div className="space-y-4">
                  <div className="bg-primary-light/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
                    <div className="space-y-2">
                      <a
                        href="tel:+12164818696"
                        className="flex items-center text-primary hover:underline"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        (216) 481-8696
                      </a>
                      {appointment.customer_email && (
                        <a
                          href={`mailto:domesticbody@gmail.com?subject=Appointment Update - ${appointment.vehicle_info}`}
                          className="flex items-center text-primary hover:underline"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Send Email
                        </a>
                      )}
                    </div>
                  </div>

                  {appointment.status.toLowerCase() === 'pending' && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">⏳ Awaiting Confirmation</span>
                        <br />
                        We'll contact you shortly to confirm your appointment.
                      </p>
                    </div>
                  )}

                  {appointment.status.toLowerCase() === 'in-progress' && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">🔧 Work in Progress</span>
                        <br />
                        Your vehicle is currently being serviced.
                      </p>
                    </div>
                  )}

                  {appointment.status.toLowerCase() === 'completed' && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">✅ Ready for Pickup!</span>
                        <br />
                        Call us to schedule pickup: (216) 481-8696
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Vehicle Damage Photos
                </h4>

                {/* Upload Button */}
                <div className="mb-4">
                  <label
                    className={`btn-primary inline-flex items-center cursor-pointer ${
                      uploadingPhoto === appointment.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {uploadingPhoto === appointment.id ? `Uploading ${uploadProgress}%...` : 'Upload Photos'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingPhoto === appointment.id}
                      onChange={(e) => handlePhotoUpload(appointment.id, e.target.files)}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-600 mt-2">
                    Max 5MB per photo. Accepted formats: JPG, PNG, HEIC
                  </p>
                </div>

                {/* Photos Gallery */}
                {appointmentPhotos[appointment.id] && appointmentPhotos[appointment.id].length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {appointmentPhotos[appointment.id].map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.photo_url}
                          alt={photo.caption}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-primary transition-colors cursor-pointer"
                          onClick={() => window.open(photo.photo_url, '_blank')}
                        />
                        <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(photo.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">No photos uploaded yet</p>
                    <p className="text-sm text-gray-500 mt-1">Upload photos of your vehicle damage to help us prepare an accurate estimate</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center card bg-primary text-white">
          <h3 className="text-2xl font-bold mb-4">Need to Schedule Another Appointment?</h3>
          <a
            href="/schedule"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary-cream transition-colors"
          >
            Schedule Now
          </a>
        </div>
      </div>
    </div>
  )
}


