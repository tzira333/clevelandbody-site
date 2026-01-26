'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneInput from '@.components/form/PhoneInput.tsx'
import EmailInput from '@/components/form/EmailInput.tsx'

export default function SchedulePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    serviceType: 'collision-repair',
    vehicleInfo: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule appointment')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schedule Free Estimate
          </h1>
          <p className="text-gray-600 mb-8">
            Fill out the form below and we'll contact you to confirm your appointment
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                Appointment Requested!
              </h2>
              <p className="text-green-700 mb-4">
                We've received your appointment request. Our team will contact you shortly to confirm.
              </p>
              <p className="text-sm text-green-600">
                Redirecting to homepage...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <PhoneInput
                label="Phone Number *"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                required
                placeholder="216-555-1234"
              />

              <EmailInput
                label="Email Address *"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                required
                placeholder="your.email@example.com"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <select
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                >
                  <option value="collision-repair">Collision Repair</option>
                  <option value="paintless-dent">Paintless Dent Repair</option>
                  <option value="paint-refinishing">Paint & Refinishing</option>
                  <option value="bumper-repair">Bumper Repair</option>
                  <option value="frame-alignment">Frame Alignment</option>
                  <option value="glass-repair">Glass Repair</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Information
                </label>
                <input
                  type="text"
                  value={formData.vehicleInfo}
                  onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="e.g., 2020 Honda Accord"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="Tell us more about your repair needs..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-maroon text-white py-3 px-6 rounded-lg font-semibold hover:bg-maroon-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Schedule Appointment'}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Questions? Call us at{' '}
                <a href="tel:+12164818696" className="text-maroon hover:underline">
                  (216) 481-8696
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
