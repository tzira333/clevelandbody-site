'use client'

import { useState } from 'react'
import { formatPhoneInput } from '../../lib/utils/phone'

export default function ContactForm() {
  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+12164818696'

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
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
          serviceType: 'contact-inquiry',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message')
      }

      setSuccess(true)
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' })
      
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information - Left */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Get In Touch</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <span className="text-xl">📞</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Phone</p>
                <a href={`tel:${businessPhone}`} className="text-primary hover:underline">
                  {formatPhoneDisplay(businessPhone)}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="text-xl">✉️</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Email</p>
                <a href="mailto:domesticbody@gmail.com" className="text-primary hover:underline text-sm">
                  domesticbody@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Address</p>
                <p className="text-gray-700 text-sm">17017 Saint Clair Ave<br />Cleveland, OH 44110</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="text-xl">⏰</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Hours</p>
                <p className="text-gray-700 text-sm">Mon-Fri: 8:00 AM - 4:30 PM</p>
                <p className="text-gray-700 text-sm">Sat: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form - Right */}
        <div>
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              Message sent! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="Tell us more..."
              />
            </div>

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
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
