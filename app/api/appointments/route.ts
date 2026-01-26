// Add this helper function at the top of the file
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

// Then in your POST handler, normalize the phone before saving:
const normalizedPhone = normalizePhoneNumber(phone)

// Use normalizedPhone when inserting into database:
const { data: appointment, error: insertError } = await supabase
  .from('appointments')
  .insert({
    customer_name: name,
    customer_phone: normalizedPhone, // <-- Use normalized version
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
