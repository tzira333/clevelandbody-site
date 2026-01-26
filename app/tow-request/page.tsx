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
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          date: new Date().toISOString().split('T')[0], // Today
          time: new Date().toTimeString().split(' ')[0].slice(0, 5), // Current time
          serviceType: `Tow Service: ${formData.location} → ${formData.destination}`,
          vehicleInfo: formData.vehicleInfo,
          message: `${formData.message}\n\nPickup: ${formData.location}\nDestination: ${formData.destination}`,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setTimeout(() => router.push('/'), 3000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Tow request error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Request Tow Service</h1>
        <p className="text-gray-700 mb-8">
          Need a tow? We'll get your vehicle to our shop safely. Fill out the form below and we'll contact you immediately.
        </p>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ Tow request received! We'll contact you shortly. Redirecting...
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ✗ Something went wrong. Please call us at <a href="tel:+12164818696" className="underline font-bold">(216) 481-8696</a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="(216) 555-1234"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Pickup Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="1234 Main St, Cleveland, OH"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Destination *</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Our Shop or Your Preferred Location"
            />
            <p className="text-sm text-gray-600 mt-1">Leave blank if towing to our shop</p>
          </div>

          {/* Vehicle Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Vehicle Information *</label>
            <input
              type="text"
              name="vehicleInfo"
              value={formData.vehicleInfo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="2020 Honda Civic"
            />
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Additional Details</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Any special instructions? (e.g., vehicle doesn't start, flat tire, accident)"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Request Tow Service'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Or call us directly: <a href="tel:+12164818696" className="text-primary font-bold hover:underline">(216) 481-8696</a>
          </p>
        </form>
      </div>
    </div>
  )
}
