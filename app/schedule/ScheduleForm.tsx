'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPhoneInput } from '@/lib/utils/phone'

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setFormData({ ...formData, phone: formatted })
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

      setSuccess(true)
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Appointment Requested!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Thank you! We've received your appointment request and will contact you shortly to confirm.
          </p>
          <p className="text-gray-600">
            Questions? Call us at{' '}
            <a href="tel:+12164818696" className="text-primary font-bold hover:underline">
              (216) 481-8696
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-4">Redirecting to homepage...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="John Smith"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="216-555-1234"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="name@example.com"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Preferred Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Preferred Time
          </label>
          <select
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
            <option value="4:00 PM">4:00 PM</option>
          </select>
        </div>
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Service Type
        </label>
        <select
          value={formData.serviceType}
          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
        <label className="block text-gray-700 font-semibold mb-2">
          Vehicle Information
        </label>
        <input
          type="text"
          value={formData.vehicleInfo}
          onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Year, Make, Model (e.g., 2020 Honda Accord)"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Additional Notes
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Please describe the damage or any special requests..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Schedule Estimate'}
      </button>
    </form>
  )
}
