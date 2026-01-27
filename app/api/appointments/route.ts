import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizePhone, isValidPhone } from '../../../lib/utils/phone'

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
      location,
      destination,
      subject,
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

    // Build detailed message based on service type
    let appointmentDetails = ''
    
    if (serviceType === 'tow-service') {
      appointmentDetails = `
TOW REQUEST
Location: ${location || 'Not specified'}
Destination: ${destination || 'Our shop'}
Vehicle: ${vehicleInfo || 'Not specified'}
Additional Info: ${message || 'None'}
      `.trim()
    } else if (serviceType === 'contact-inquiry') {
      appointmentDetails = `
CONTACT INQUIRY
Subject: ${subject || 'General inquiry'}
Message: ${message || 'None'}
      `.trim()
    } else {
      appointmentDetails = `
Service Type: ${serviceType || 'Not specified'}
Vehicle: ${vehicleInfo || 'Not specified'}
Preferred Date: ${appointmentDate}
Preferred Time: ${appointmentTime}
Additional Notes: ${message || 'None'}
      `.trim()
    }

    // Insert into database with NORMALIZED phone (digits only)
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        customer_name: name,
        customer_phone: normalizedPhone, // Store digits only: "2164818696"
        customer_email: normalizedEmail,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        service_type: serviceType || 'general-inquiry',
        vehicle_info: vehicleInfo || '',
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

    // Send notifications (SMS and Email) - existing code can stay the same
    // The SMS will still work with normalized phone

    return NextResponse.json({
      success: true,
      message: 'Request received successfully',
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
