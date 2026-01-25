'use client'

import { useState } from 'react'

export default function SchedulePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    serviceType: '',
    vehicleInfo: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit appointment')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        serviceType: '',
        vehicleInfo: '',
        message: '',
      })
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate time slots (8:00 AM - 4:00 PM in 30-minute intervals)
  const timeSlots = []
  for (let hour = 8; hour <= 16; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 16 && minute > 0) break // Stop at 4:00 PM
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const period = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      const timeDisplay = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`
      timeSlots.push({ value: time24, label: timeDisplay })
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Schedule an Appointment</h1>
      
      <div className="max-w-2xl mx-auto">
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">Appointment request received!</p>
            <p className="text-sm">We'll contact you shortly to confirm your appointment.</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">Error submitting appointment</p>
            <p className="text-sm">{errorMessage || 'Please try again or call us directly.'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="(216) 555-1234"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="your@email.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-semibold text-gray-900 mb-2">
                Preferred Time *
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-900 mb-2">
              Service Type
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a service</option>
              <option value="Collision Repair">Collision Repair</option>
              <option value="Custom Painting">Custom Painting</option>
              <option value="Frame Straightening">Frame Straightening</option>
              <option value="Rust Repair">Rust Repair</option>
              <option value="Free Estimate">Free Estimate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="vehicleInfo" className="block text-sm font-semibold text-gray-900 mb-2">
              Vehicle Information
            </label>
            <input
              type="text"
              id="vehicleInfo"
              name="vehicleInfo"
              value={formData.vehicleInfo}
              onChange={handleChange}
              className="input-field"
              placeholder="Year, Make, Model (e.g., 2020 Honda Accord)"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
              Additional Details
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Describe the work needed or any questions you have..."
            />
          </div>

          <div className="border-t pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Request Appointment'}
            </button>
            <p className="text-sm text-gray-600 text-center mt-3">
              * Required fields
            </p>
          </div>
        </form>

        <div className="mt-8 bg-secondary-cream p-6 rounded-lg text-center">
          <p className="text-gray-700 mb-2">Prefer to call?</p>
          <a href="tel:+12164818696" className="text-primary text-xl font-bold hover:underline">
            (216) 481-8696
          </a>
          <p className="text-sm text-gray-600 mt-2">
            Mon-Fri: 8:00 AM - 4:30 PM | Sat: 9:00 AM - 1:00 PM
          </p>
        </div>
      </div>
    </div>
  )
}


