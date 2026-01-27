'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPhoneInput } from '@/lib/utils/phone'

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
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
          <div className="text-6xl mb-4">🚛✅</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Tow Request Received!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We've received your tow request and will dispatch a tow truck shortly. We'll call you at the number provided.
          </p>
          <p className="text-gray-600">
            Urgent? Call us now at{' '}
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
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Request Tow Service</h1>
        <p className="text-center text-gray-700 mb-8">
          Need a tow? Fill out the form below and we'll dispatch a truck right away.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Current Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="123 Main St, Cleveland, OH"
            />
            <p className="text-sm text-gray-600 mt-1">Where is your vehicle located?</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tow Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Our shop or another location"
            />
            <p className="text-sm text-gray-600 mt-1">Leave blank to tow to our shop</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Information *
            </label>
            <input
              type="text"
              value={formData.vehicleInfo}
              onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="2020 Honda Accord, Silver"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Additional Information
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Any special instructions or details about the vehicle condition..."
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
            {loading ? 'Requesting Tow...' : 'Request Tow Service'}
          </button>

          <div className="text-center pt-4 border-t">
            <p className="text-gray-600 mb-2">Need immediate assistance?</p>
            <a href="tel:+12164818696" className="text-primary font-bold hover:underline text-lg">
              Call (216) 481-8696
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
