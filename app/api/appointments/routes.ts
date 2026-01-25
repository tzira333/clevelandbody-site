import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import twilio from 'twilio'
import { createClient } from '@supabase/supabase-js'

// Initialize services
const resend = new Resend(process.env.RESEND_API_KEY!)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Notification recipients
const PHONE_NUMBERS = process.env.NOTIFICATION_PHONE_NUMBERS?.split(',') || []
const EMAIL_ADDRESSES = process.env.NOTIFICATION_EMAILS?.split(',') || []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, phone, email, date, time, serviceType, message, vehicleInfo } = body
    
    if (!name || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, date, time' },
        { status: 400 }
      )
    }

    // Format appointment details
    const appointmentDetails = `
New Appointment Request:

Customer: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}
Date: ${date}
Time: ${time}
Service: ${serviceType || 'Not specified'}
Vehicle: ${vehicleInfo || 'Not provided'}
Message: ${message || 'None'}

Requested at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
    `.trim()

    // 1. Store in Supabase (optional but recommended)
    const { data: appointment, error: dbError } = await supabase
      .from('appointments')
      .insert({
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        appointment_date: date,
        appointment_time: time,
        service_type: serviceType,
        vehicle_info: vehicleInfo,
        message: message,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      // Continue even if DB insert fails (still send notifications)
    }

    // 2. Send SMS notifications
    const smsPromises = PHONE_NUMBERS.map(async (phoneNumber) => {
      try {
        await twilioClient.messages.create({
          body: `New Appointment Request\n\n${name}\n${phone}\n${date} at ${time}\n${serviceType || 'Service TBD'}`,
          from: process.env.TWILIO_PHONE_NUMBER!,
          to: phoneNumber.trim(),
        })
        console.log(`SMS sent to ${phoneNumber}`)
      } catch (error) {
        console.error(`SMS failed to ${phoneNumber}:`, error)
        // Don't throw - continue with other notifications
      }
    })

    // 3. Send email notifications
    const emailPromises = EMAIL_ADDRESSES.map(async (emailAddress) => {
      try {
        await resend.emails.send({
          from: 'Domestic & Foreign Auto Body <appointments@clevelandbody.com>', // Update with your verified domain
          to: emailAddress.trim(),
          subject: `New Appointment Request - ${name}`,
          text: appointmentDetails,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #800000;">New Appointment Request</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                <p><strong>Customer:</strong> ${name}</p>
                <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p><strong>Email:</strong> ${email || 'Not provided'}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Service:</strong> ${serviceType || 'Not specified'}</p>
                <p><strong>Vehicle:</strong> ${vehicleInfo || 'Not provided'}</p>
                ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
              </p>
            </div>
          `,
        })
        console.log(`Email sent to ${emailAddress}`)
      } catch (error) {
        console.error(`Email failed to ${emailAddress}:`, error)
        // Don't throw - continue with other notifications
      }
    })

    // Wait for all notifications to complete
    await Promise.allSettled([...smsPromises, ...emailPromises])

    return NextResponse.json({
      success: true,
      message: 'Appointment request received. We will contact you shortly.',
      appointmentId: appointment?.id,
    })

  } catch (error) {
    console.error('Appointment API error:', error)
    return NextResponse.json(
      { error: 'Failed to process appointment request' },
      { status: 500 }
    )
  }
}