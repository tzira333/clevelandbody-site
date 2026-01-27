'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TowRequestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    destination: '',
    vehicleInfo: '',
    message: '',
    date: '',
    time: ''
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
        body: JSON.stringify({
          ...formData,
          serviceType: 'tow-service'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit tow request')
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
    <div className="min-h-screen bg-gray-50 py-12 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request Tow Service
          </h1>
          <p className="text-gray-600 mb-8">
            Need your vehicle towed? Fill out the form and we'll coordinate pickup and delivery.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                Tow Request Received!
              </h2>
              <p className="text-green-700 mb-4">
                We've received your tow service request. Our team will contact you shortly to arrange pickup.
              </p>
              <p className="text-sm text-green-600">
                Redirecting to homepage...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
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
                  name="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    const input = e.target.value
                    const digits = input.replace(/\D/g, '')
                    const limited = digits.slice(0, 10)
                    let formatted = ''
                    if (limited.length <= 3) {
                      formatted = limited
                    } else if (limited.length <= 6) {
                      formatted = `${limited.slice(0, 3)}-${limited.slice(3)}`
                    } else {
                      formatted = `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`
                    }
                    setFormData({ ...formData, phone: formatted })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="216-555-1234"
                  maxLength={12}
                />
                <p className="text-xs text-gray-500 mt-1">Format: xxx-xxx-xxxx</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location (Pickup Address) *
                </label>
                <input
                  type="text"
                  name="street-address"
                  autoComplete="street-address"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="123 Main St, Cleveland, OH 44101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Address
                </label>
                <input
                  type="text"
                  name="destination"
                  autoComplete="off"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="Our shop or another location"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank to tow to Domestic & Foreign Auto Body Inc.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Information *
                </label>
                <input
                  type="text"
                  name="vehicle"
                  autoComplete="off"
                  required
                  value={formData.vehicleInfo}
                  onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="e.g., 2020 Honda Accord, Silver"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pickup Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pickup Time
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  >
                    <option value="">ASAP</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
                  placeholder="Any special instructions or details we should know..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    backgroundColor: '#800000',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {loading ? 'Submitting...' : 'Request Tow Service'}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center pt-2">
                Emergency towing? Call us directly at{' '}
                <a href="tel:+12164818696" className="text-maroon hover:underline font-semibold">
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

