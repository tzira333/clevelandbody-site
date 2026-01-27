/**
 * Phone number utility functions
 * Ensures consistent storage and lookup across the application
 */

/**
 * Normalize phone number to digits only
 * Examples:
 *   "(216) 481-8696" -> "2164818696"
 *   "216-481-8696" -> "2164818696"
 *   "+1 216 481 8696" -> "12164818696"
 *   "2164818696" -> "2164818696"
 */
export function normalizePhone(phone: string): string {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '')
  
  // If it starts with 1 and is 11 digits, keep the 1 (US country code)
  // Otherwise return as-is
  return digitsOnly
}

/**
 * Format phone number for display
 * Input: "2164818696" or "12164818696"
 * Output: "(216) 481-8696"
 */
export function formatPhoneDisplay(phone: string): string {
  if (!phone) return ''
  
  const normalized = normalizePhone(phone)
  
  // Handle 10-digit US numbers
  if (normalized.length === 10) {
    return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`
  }
  
  // Handle 11-digit numbers (with country code 1)
  if (normalized.length === 11 && normalized.startsWith('1')) {
    return `(${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7)}`
  }
  
  // Return as-is if unusual format
  return phone
}

/**
 * Format phone number for form input (xxx-xxx-xxxx)
 * Used during typing in forms
 */
export function formatPhoneInput(value: string): string {
  const normalized = normalizePhone(value)
  
  if (normalized.length === 0) return ''
  if (normalized.length <= 3) return normalized
  if (normalized.length <= 6) return `${normalized.slice(0, 3)}-${normalized.slice(3)}`
  if (normalized.length <= 10) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6, 10)}`
  }
  
  // Handle 11+ digits (with country code)
  if (normalized.startsWith('1')) {
    const withoutCountry = normalized.slice(1, 11)
    return `${withoutCountry.slice(0, 3)}-${withoutCountry.slice(3, 6)}-${withoutCountry.slice(6)}`
  }
  
  return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6, 10)}`
}

/**
 * Validate US phone number
 * Returns true if valid 10 or 11-digit US number
 */
export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone)
  
  // Valid if 10 digits or 11 digits starting with 1
  return normalized.length === 10 || 
         (normalized.length === 11 && normalized.startsWith('1'))
}