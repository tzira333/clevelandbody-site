import { NextRequest, NextResponse } from 'next/server'

// Helper function to normalize phone numbers
function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // If it's 11 digits and starts with 1, remove the 1
  if (digits.length === 11 && digits[0] === '1') {
    return digits.substring(1)
  }
  
  // Return just the 10 digits
  return digits.substring(0, 10)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, date, time, serviceType, vehicleInfo, message } = body

    // Validate required fields
    if (!name || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Normalize phone number to 10 digits
    const normalizedPhone = normalizePhoneNumber(phone)

    // Store in Supabase (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        const { data: appointment, error: insertError } = await supabase
          .from('appointments')
          .insert({
            customer_name: name,
            customer_phone: normalizedPhone,
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

        if (insertError) {
          console.error('Supabase insert error:', insertError)
        } else {
          console.log('Appointment saved to database:', appointment?.id)
        }
      } catch (dbError) {
        console.error('Database error (non-fatal):', dbError)
      }
    }

    // Format appointment details for notifications
    const appointmentDetails = `
New Appointment Request

Customer: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}
Date: ${date}
Time: ${time}
Service: ${serviceType || 'Not specified'}
Vehicle: ${vehicleInfo || 'Not provided'}
Message: ${message || 'None'}

Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
    `.trim()

    const smsMessage = `New Appointment: ${name}, ${phone}, ${date} at ${time}, Vehicle: ${vehicleInfo || 'N/A'}`

    // Send notifications in parallel
    const notificationPromises = []

    // SMS via Twilio (if configured)
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER &&
      process.env.NOTIFICATION_PHONE_NUMBERS
    ) {
      const phoneNumbers = process.env.NOTIFICATION_PHONE_NUMBERS.split(',').map(p => p.trim())

      for (const toNumber of phoneNumbers) {
        const smsPromise = fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + Buffer.from(
                `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
              ).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              From: process.env.TWILIO_PHONE_NUMBER,
              To: toNumber,
              Body: smsMessage,
            }),
          }
        )
          .then(res => res.json())
          .then(data => {
            if (data.error_code) {
              console.error(`SMS failed to ${toNumber}:`, data.message)
            } else {
              console.log(`SMS sent to ${toNumber}`)
            }
          })
          .catch(err => console.error(`SMS error to ${toNumber}:`, err))

        notificationPromises.push(smsPromise)
      }
    }

    // Email via Resend (if configured)
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAILS) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        const emailAddresses = process.env.NOTIFICATION_EMAILS.split(',').map(e => e.trim())

        const emailPromise = resend.emails.send({
          from: 'Domestic & Foreign Auto Body <onboarding@resend.dev>',
          to: emailAddresses,
          subject: `New Appointment: ${name} - ${date}`,
          text: appointmentDetails,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2 style="color: #800000;">New Appointment Request</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Customer:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                ${email ? `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Time:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Service:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${serviceType || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Vehicle:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${vehicleInfo || 'Not provided'}</td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top;"><strong>Message:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${message}</td>
                </tr>
                ` : ''}
              </table>
              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
              </p>
            </div>
          `,
        })
          .then(() => {
            console.log('Emails sent to:', emailAddresses.join(', '))
          })
          .catch(err => console.error('Email error:', err))

        notificationPromises.push(emailPromise)
      } catch (emailError) {
        console.error('Resend import/send error:', emailError)
      }
    }

    // Wait for all notifications (non-blocking)
    await Promise.allSettled(notificationPromises)

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment request received. We will contact you shortly.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Appointment API error:', error)
    return NextResponse.json(
      { error: 'Failed to process appointment request' },
      { status: 500 }
    )
  }
}

