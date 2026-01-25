import { NextRequest, NextResponse } from 'next/server'

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

    // Format appointment details for SMS
    const smsMessage = `New Appointment Request

${name}
${phone}
${date} at ${time}
${serviceType || 'Service TBD'}
${vehicleInfo || ''}`.trim()

    // Format appointment details for email
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

    // 1. Store in Supabase (only if configured)
    let appointmentId = null
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )

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
        } else {
          appointmentId = appointment?.id
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
      }
    } else {
      console.warn('Supabase not configured - skipping database storage')
    }

    // 2. Send SMS notifications using Twilio (only if credentials exist)
    const smsPromises = []
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      for (const phoneNumber of PHONE_NUMBERS) {
        smsPromises.push(
          (async () => {
            try {
              const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`
              const auth = Buffer.from(
                `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
              ).toString('base64')

              const response = await fetch(twilioUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': `Basic ${auth}`,
                },
                body: new URLSearchParams({
                  To: phoneNumber.trim(),
                  From: process.env.TWILIO_PHONE_NUMBER!,
                  Body: smsMessage,
                }),
              })

              if (!response.ok) {
                const error = await response.text()
                console.error(`SMS failed to ${phoneNumber}:`, error)
              } else {
                console.log(`SMS sent to ${phoneNumber}`)
              }
            } catch (error) {
              console.error(`SMS error for ${phoneNumber}:`, error)
            }
          })()
        )
      }
    } else {
      console.warn('Twilio credentials not configured - skipping SMS notifications')
    }

    // 3. Send email notifications (only if Resend API key exists)
    const emailPromises = []
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        for (const emailAddress of EMAIL_ADDRESSES) {
          emailPromises.push(
            (async () => {
              try {
                await resend.emails.send({
                  from: 'Domestic & Foreign Auto Body <appointments@clevelandbody.com>',
                  to: emailAddress.trim(),
                  subject: `New Appointment Request - ${name}`,
                  text: appointmentDetails,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #800000;">New Appointment Request</h2>
                      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 8px 0;"><strong>Customer:</strong> ${name}</p>
                        <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #800000;">${phone}</a></p>
                        <p style="margin: 8px 0;"><strong>Email:</strong> ${email || 'Not provided'}</p>
                        <p style="margin: 8px 0;"><strong>Date:</strong> ${date}</p>
                        <p style="margin: 8px 0;"><strong>Time:</strong> ${time}</p>
                        <p style="margin: 8px 0;"><strong>Service:</strong> ${serviceType || 'Not specified'}</p>
                        <p style="margin: 8px 0;"><strong>Vehicle:</strong> ${vehicleInfo || 'Not provided'}</p>
                        ${message ? `<p style="margin: 8px 0;"><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>` : ''}
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
              }
            })()
          )
        }
      } catch (error) {
        console.error('Resend initialization error:', error)
      }
    } else {
      console.warn('Resend API key not configured - skipping email notifications')
    }

    // Wait for all notifications to complete
    await Promise.allSettled([...smsPromises, ...emailPromises])

    return NextResponse.json({
      success: true,
      message: 'Appointment request received. We will contact you shortly.',
      appointmentId,
    })

  } catch (error) {
    console.error('Appointment API error:', error)
    return NextResponse.json(
      { error: 'Failed to process appointment request' },
      { status: 500 }
    )
  }
}
