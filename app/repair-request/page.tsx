'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RepairRequestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleInfo: '',
    damageDescription: '',
    insuranceClaim: 'no',
    insuranceCompany: '',
    claimNumber: '',
    preferredDate: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const insuranceInfo = formData.insuranceClaim === 'yes'
        ? `\n\nInsurance: ${formData.insuranceCompany}\nClaim #: ${formData.claimNumber}`
        : '\n\nNo insurance claim'

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          date: formData.preferredDate || new Date().toISOString().split('T')[0],
          time: '09:00', // Default morning slot
          serviceType: 'Repair Request',
          vehicleInfo: formData.vehicleInfo,
          message: `Damage: ${formData.damageDescription}${insuranceInfo}\n\nAdditional: ${formData.message}`,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setTimeout(() => router.push('/'), 3000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Repair request error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Start Repair Request</h1>
        <p className="text-gray-700 mb-8">
          Get started on your auto body repair. Provide details about your vehicle and damage, and we'll contact you with an estimate.
        </p>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ Repair request received! We'll contact you shortly with an estimate. Redirecting...
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
            />
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
              placeholder="Year, Make, Model (e.g., 2020 Honda Civic)"
            />
          </div>

          {/* Damage Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Describe the Damage *</label>
            <textarea
              name="damageDescription"
              value={formData.damageDescription}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Front bumper damaged, scratch on driver door, etc."
            />
          </div>

          {/* Insurance Claim */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Filing Insurance Claim? *</label>
            <select
              name="insuranceClaim"
              value={formData.insuranceClaim}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="no">No - Paying Out of Pocket</option>
              <option value="yes">Yes - Insurance Claim</option>
            </select>
          </div>

          {/* Insurance Details (conditional) */}
          {formData.insuranceClaim === 'yes' && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Insurance Company</label>
                <input
                  type="text"
                  name="insuranceCompany"
                  value={formData.insuranceCompany}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="State Farm, Allstate, etc."
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Claim Number</label>
                <input
                  type="text"
                  name="claimNumber"
                  value={formData.claimNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Claim #12345"
                />
              </div>
            </>
          )}

          {/* Preferred Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Preferred Date for Estimate</label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Additional Details</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Any other information we should know?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Repair Request'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Or call us directly: <a href="tel:+12164818696" className="text-primary font-bold hover:underline">(216) 481-8696</a>
          </p>
        </form>
      </div>
    </div>
  )
}
