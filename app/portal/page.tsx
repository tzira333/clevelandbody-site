'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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

export default function CustomerPortalPage() {
  const [step, setStep] = useState<'phone' | 'appointments'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const supabase = createClientComponentClient()

  const formatPhoneForDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const formatPhoneForSearch = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')
    
    // Return variations that might be in the database
    return [
      digits,                           // 2164818696
      `+1${digits}`,                    // +12164818696
      `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`, // (216) 481-8696
      `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`,   // 216-481-8696
    ]
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const phoneVariations = formatPhoneForSearch(phoneNumber)

      // Query with OR conditions for all phone variations
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .or(phoneVariations.map(p => `customer_phone.eq.${p}`).join(','))
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      if (!data || data.length === 0) {
        setError('No appointments found for this phone number. Please check the number or contact us at (216) 481-8696.')
        return
      }

      setAppointments(data)
      setStep('appointments')
    } catch (err) {
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
              Enter your phone number to view your repair status and appointment details.
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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'View My Appointments'}
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
              setError('')
            }}
            className="text-primary hover:underline"
          >
            ← Back to Login
          </button>
        </div>

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
              <div className="grid md:grid-cols-2 gap-6">
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
