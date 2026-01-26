import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function normalizePhoneNumber(phone: string): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  const cleanDigits = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  if (cleanDigits.length !== 10) return phone
  return `${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 6)}-${cleanDigits.slice(6)}`
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, date, time, serviceType, vehicleInfo, message, location, destination, subject } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    const normalizedPhone = normalizePhoneNumber(phone)
    const normalizedEmail = email ? normalizeEmail(email) : ''

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error: dbError } = await supabase.from('appointments').insert({
        customer_name: name,
        customer_phone: normalizedPhone,
        customer_email: normalizedEmail,
        appointment_date: date || new Date().toISOString().split('T')[0],
        appointment_time: time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        service_type: serviceType || 'general-inquiry',
        vehicle_info: vehicleInfo || '',
        message: `${subject ? `Subject: ${subject}\n\n` : ''}${location ? `Pickup: ${location}\n` : ''}${destination ? `Destination: ${destination}\n` : ''}${message || ''}`,
        status: 'pending'
      })

      if (dbError) {
        console.error('Database error:', dbError)
      }
    }

    const appointmentDetails = `
New Appointment Request:
------------------------
Name: ${name}
Phone: ${normalizedPhone}
Email: ${normalizedEmail || 'Not provided'}
Date: ${date || 'ASAP'}
Time: ${time || 'Not specified'}
Service: ${serviceType || 'General Inquiry'}
Vehicle: ${vehicleInfo || 'Not specified'}
${location ? `Pickup Location: ${location}` : ''}
${destination ? `Destination: ${destination}` : ''}
${subject ? `Subject: ${subject}` : ''}
Message: ${message || 'No additional message'}

Submitted: ${new Date().toLocaleString()}
    `.trim()

    const smsMessage = `New appointment from ${name} (${normalizedPhone}) for ${serviceType || 'inquiry'}. Date: ${date || 'ASAP'}. Check admin dashboard.`

    const notificationPromises = []

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && process.env.NOTIFICATION_PHONE_NUMBERS) {
      const twilioPromise = (async () => {
        try {
          const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
          const phoneNumbers = process.env.NOTIFICATION_PHONE_NUMBERS.split(',')
          const smsPromises = phoneNumbers.map((phoneNumber: string) =>
            twilio.messages.create({
              body: smsMessage,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: phoneNumber.trim()
            })
          )
          await Promise.all(smsPromises)
          console.log('SMS notifications sent successfully')
        } catch (error) {
          console.error('Twilio error:', error)
        }
      })()
      notificationPromises.push(twilioPromise)
    }

    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAILS) {
      const resendPromise = (async () => {
        try {
          const { Resend } = require('resend')
          const resend = new Resend(process.env.RESEND_API_KEY)
          const emailAddresses = process.env.NOTIFICATION_EMAILS.split(',')
          await resend.emails.send({
            from: 'Domestic & Foreign Auto Body <notifications@clevelandbody.com>',
            to: emailAddresses.map((email: string) => email.trim()),
            subject: `New Appointment Request - ${name}`,
            text: appointmentDetails,
            html: `<pre style="font-family: monospace; white-space: pre-wrap;">${appointmentDetails}</pre>`
          })
          console.log('Email notifications sent successfully')
        } catch (error) {
          console.error('Resend error:', error)
        }
      })()
      notificationPromises.push(resendPromise)
    }

    await Promise.allSettled(notificationPromises)

    return NextResponse.json({
      success: true,
      message: 'Appointment request received successfully'
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}