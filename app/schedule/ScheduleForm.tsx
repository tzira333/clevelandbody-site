'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPhoneInput } from '../../lib/utils/phone'

export default function ScheduleForm() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    serviceType: 'collision-repair',
    vehicleInfo: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [confirmationNumber, setConfirmationNumber] = useState('')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  const generateConfirmationNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `SCH-${timestamp}-${random}`
  }

  const formatServiceType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit appointment')
      }

      const confNumber = generateConfirmationNumber()
      setConfirmationNumber(confNumber)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
          <div className="text-6xl mb-3">✅</div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Appointment Request Received!
          </h2>
          <div className="bg-white border-2 border-green-600 rounded-lg p-4 mt-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
            <p className="text-2xl font-bold text-primary">{confirmationNumber}</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
            <span className="text-2xl mr-2">📞</span>
            Important: Please Call to Confirm
          </h3>
          <p className="text-gray-700 mb-4">
            To confirm your appointment and ensure we have received your request, please call us at:
          </p>
          <a 
            href="tel:+12164818696"
            className="block text-center bg-blue-700 text-white font-bold text-2xl py-4 rounded-lg hover:bg-blue-800 transition-colors"
          >
            (216) 481-8696
          </a>
          <p className="text-sm text-gray-600 mt-3 text-center">
            Reference confirmation number: <span className="font-bold">{confirmationNumber}</span>
          </p>
        </div>

        {/* Submitted Information */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
            Your Submitted Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">{formData.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-semibold text-gray-900">{formData.phone}</p>
            </div>

            {formData.email && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{formData.email}</p>
              </div>
            )}

            {formData.date && (
              <div>
                <p className="text-sm text-gray-600">Preferred Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(formData.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {formData.time && (
              <div>
                <p className="text-sm text-gray-600">Preferred Time</p>
                <p className="font-semibold text-gray-900">{formData.time}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="font-semibold text-gray-900">{formatServiceType(formData.serviceType)}</p>
            </div>

            {formData.vehicleInfo && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Vehicle Information</p>
                <p className="font-semibold text-gray-900">{formData.vehicleInfo}</p>
              </div>
            )}

            {formData.message && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Additional Notes</p>
                <p className="font-semibold text-gray-900 whitespace-pre-wrap">{formData.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Our Business Hours</h3>
          <div className="space-y-1 text-gray-700">
            <p><span className="font-semibold">Monday - Friday:</span> 8:00 AM - 4:30 PM</p>
            <p><span className="font-semibold">Saturday:</span> 9:00 AM - 1:00 PM</p>
            <p><span className="font-semibold">Sunday:</span> Closed</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            🖨️ Print Confirmation
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Schedule an Estimate</h1>
      
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="John Smith"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="216-555-1234"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="name@example.com"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">
                Preferred Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">
                Preferred Time
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="">Select time</option>
                <option value="8:00 AM">8:00 AM</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Service Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Service Type
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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

          {/* Vehicle Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Vehicle Information
            </label>
            <input
              type="text"
              value={formData.vehicleInfo}
              onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="2020 Honda Accord"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">
              Additional Notes
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Describe the damage..."
            />
          </div>
        </div>

        {/* Error & Submit - Full Width */}
        <div className="md:col-span-2 space-y-3">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Schedule Estimate'}
          </button>
        </div>
      </form>
    </div>
  )
}
