import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizePhone, isValidPhone } from '@/lib/utils/phone'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const body = await request.json()
    const {
      name,
      phone,
      email,
      date,
      time,
      serviceType,
      vehicleInfo,
      message,
    } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Name and phone number are required' },
        { status: 400 }
      )
    }

    // CRITICAL FIX: Normalize phone number before storing
    const normalizedPhone = normalizePhone(phone)
    
    // Validate phone format
    if (!isValidPhone(normalizedPhone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format. Please enter a 10-digit US phone number.' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email ? email.toLowerCase().trim() : null

    // Use current date/time if not provided
    const appointmentDate = date || new Date().toISOString().split('T')[0]
    const appointmentTime = time || new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })

    // Build detailed message
    const appointmentDetails = `
Service Type: ${serviceType || 'Not specified'}
Vehicle: ${vehicleInfo || 'Not specified'}
Preferred Date: ${appointmentDate}
Preferred Time: ${appointmentTime}
Additional Notes: ${message || 'None'}
    `.trim()

    // Insert into database with NORMALIZED phone
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        customer_name: name,
        customer_phone: normalizedPhone, // Store digits only
        customer_email: normalizedEmail,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        service_type: serviceType || 'general-inquiry',
        vehicle_info: vehicleInfo,
        message: appointmentDetails,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, message: 'Database error: ' + error.message },
        { status: 500 }
      )
    }

    // Send notifications (SMS and Email)
    const notificationPromises = []

    // SMS Notification (Twilio)
    if (process.env.TWILIO_ACCOUNT_SID && 
        process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_PHONE_NUMBER &&
        process.env.NOTIFICATION_PHONE_NUMBERS) {
      
      const twilio = require('twilio')
      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )

      const smsMessage = `New Appointment Request!\n\nCustomer: ${name}\nPhone: ${normalizedPhone}\nService: ${serviceType || 'General'}\nDate: ${appointmentDate}\nTime: ${appointmentTime}\n\nView details in admin dashboard.`

      const recipientNumbers = process.env.NOTIFICATION_PHONE_NUMBERS.split(',')
      
      for (const recipient of recipientNumbers) {
        const smsPromise = twilioClient.messages.create({
          body: smsMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: recipient.trim(),
        }).catch((err: any) => console.error('SMS error:', err))
        
        notificationPromises.push(smsPromise)
      }
    }

    // Email Notification (Resend/Postmark/SendGrid)
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAILS) {
      // Add email notification logic here
      // (existing email code)
    }

    // Wait for all notifications
    await Promise.allSettled(notificationPromises)

    return NextResponse.json({
      success: true,
      message: 'Appointment request received successfully',
      data,
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}



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
          const notificationPhones = process.env.NOTIFICATION_PHONE_NUMBERS!
          const phoneNumbers = notificationPhones.split(',')
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
          const notificationEmails = process.env.NOTIFICATION_EMAILS!
          const emailAddresses = notificationEmails.split(',')
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
