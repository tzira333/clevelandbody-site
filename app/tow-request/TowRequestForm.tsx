'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPhoneInput } from '../../lib/utils/phone'

export default function TowRequestForm() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    destination: '',
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
        body: JSON.stringify({
          ...formData,
          serviceType: 'tow-service',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit tow request')
      }

      setSuccess(true)
      
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
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
          <div className="text-5xl mb-3">🚛✅</div>
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Tow Request Received!
          </h2>
          <p className="text-base text-gray-700 mb-4">
            We've received your tow request and will dispatch a truck shortly.
          </p>
          <p className="text-gray-600 text-sm">
            Urgent? Call{' '}
            <a href="tel:+12164818696" className="text-primary font-bold hover:underline">
              (216) 481-8696
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Request Tow Service</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="216-555-1234"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Vehicle Info *</label>
            <input
              type="text"
              value={formData.vehicleInfo}
              onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="2020 Honda Accord, Silver"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Current Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="123 Main St, Cleveland, OH"
            />
            <p className="text-xs text-gray-600 mt-1">Where is your vehicle?</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Tow Destination</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Our shop"
            />
            <p className="text-xs text-gray-600 mt-1">Leave blank to tow to our shop</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm">Additional Info</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Special instructions..."
            />
          </div>
        </div>

        {/* Full Width Submit */}
        <div className="md:col-span-2 space-y-3">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Requesting Tow...' : 'Request Tow Service'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Need immediate help? Call{' '}
            <a href="tel:+12164818696" className="text-primary font-bold hover:underline">
              (216) 481-8696
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
