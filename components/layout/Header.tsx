'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+12164818696'
  
  const formatPhoneDisplay = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }

  return (
    <header className="bg-primary text-white border-b-2 border-secondary-cream relative z-50">
      {/* Contact Bar - Hidden on mobile, visible on tablet+ */}
      <div className="hidden sm:block bg-primary-dark py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <a 
            href={`tel:${phoneNumber}`}
            className="hover:text-secondary-cream transition-colors"
          >
            📞 {formatPhoneDisplay(phoneNumber)}
          </a>
          <span className="text-secondary-cream hidden md:inline">17017 Saint Clair Ave, Cleveland, OH 44110</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section - Responsive width */}
          <Link 
            href="/"
            className="flex-shrink-0"
            style={{ width: '180px', minWidth: '150px' }}
          >
            <div className="p-1 sm:p-2">
              {/* Top Line: DOMESTIC & FOREIGN */}
              <div className="text-secondary-cream font-bold tracking-wider mb-0.5" style={{ fontSize: '9px', lineHeight: '1' }}>
                DOMESTIC & FOREIGN
              </div>
              
              {/* AUTOBODY SHOP Badge */}
              <div className="bg-secondary-cream text-primary px-1.5 sm:px-2 py-0.5 rounded mb-0.5 inline-block">
                <span className="font-bold tracking-wide" style={{ fontSize: '10px' }}>
                  AUTOBODY SHOP
                </span>
              </div>
              
              {/* Slogan - Hidden on very small screens */}
              <div className="text-secondary-cream italic hidden xs:block" style={{ fontSize: '6.5px', lineHeight: '1.2' }}>
                Building Our Future On Service To You!
              </div>
              
              {/* Address & Phone - Responsive */}
              <div className="text-secondary-cream space-y-0" style={{ fontSize: '6.5px', lineHeight: '1.3', marginTop: '2px' }}>
                <div className="hidden sm:block">17017 Saint Clair Ave, Cleveland, OH 44110</div>
                <div className="font-semibold">(216) 481-8696</div>
              </div>
            </div>
          </Link>

          {/* Center - Schedule an Appointment Button - Desktop & Large Tablets */}
          <div className="hidden xl:flex flex-1 justify-center px-4">
            <Link
              href="/schedule"
              className="bg-white text-primary px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg font-bold text-base lg:text-lg hover:bg-secondary-cream transition-colors shadow-lg whitespace-nowrap"
            >
              Schedule an Appointment
            </Link>
          </div>

          {/* Tablet - Compact Schedule Button */}
          <div className="hidden lg:flex xl:hidden flex-1 justify-center px-2">
            <Link
              href="/schedule"
              className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-secondary-cream transition-colors shadow-lg whitespace-nowrap"
            >
              Schedule Appt
            </Link>
          </div>

          {/* Desktop Navigation - Right aligned - Hidden on mobile/tablet */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
            <Link href="/" className="hover:text-secondary-cream transition-colors text-xs xl:text-sm font-semibold whitespace-nowrap">
              Home
            </Link>
            <Link href="/schedule" className="hover:text-secondary-cream transition-colors text-xs xl:text-sm font-semibold whitespace-nowrap">
              Services
            </Link>
            <Link href="/contact" className="hover:text-secondary-cream transition-colors text-xs xl:text-sm font-semibold whitespace-nowrap">
              Insurance
            </Link>
            <Link href="/contact" className="hover:text-secondary-cream transition-colors text-xs xl:text-sm font-semibold whitespace-nowrap">
              Contact
            </Link>
            
            {/* Customer Portal with Tooltip */}
            <div className="relative group">
              <Link 
                href="/portal" 
                className="px-2 xl:px-3 py-1.5 xl:py-2 border-2 border-white rounded-lg hover:bg-white hover:text-primary transition-colors text-xs xl:text-sm font-semibold whitespace-nowrap"
              >
                Customer Portal
              </Link>
              {/* Tooltip - Desktop only */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden xl:group-hover:block z-50">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-2xl whitespace-nowrap text-sm font-semibold">
                  View, Update your appointment or add pictures
                  {/* Arrow pointing down */}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600"></div>
                </div>
              </div>
            </div>

            <Link 
              href="/admin" 
              className="px-2 xl:px-3 py-1.5 xl:py-2 border-2 border-white rounded-lg hover:bg-white hover:text-primary transition-colors text-xs xl:text-sm font-semibold whitespace-nowrap"
            >
              Staff Portal
            </Link>
          </nav>

          {/* Mobile/Tablet - Quick Actions + Hamburger */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            {/* Click-to-Call Button - Mobile */}
            <a 
              href={`tel:${phoneNumber}`}
              className="sm:hidden bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Call us"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 hover:bg-primary-dark rounded-lg transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-primary-dark border-t-2 border-primary-light">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <nav className="flex flex-col gap-2">
              {/* Main Navigation Links */}
              <Link 
                href="/" 
                className="text-white hover:bg-primary hover:text-secondary-cream transition-colors py-3 px-4 rounded-lg font-semibold flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              
              <Link 
                href="/schedule" 
                className="text-white hover:bg-primary hover:text-secondary-cream transition-colors py-3 px-4 rounded-lg font-semibold flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Services
              </Link>
              
              <Link 
                href="/contact" 
                className="text-white hover:bg-primary hover:text-secondary-cream transition-colors py-3 px-4 rounded-lg font-semibold flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Insurance
              </Link>
              
              <Link 
                href="/contact" 
                className="text-white hover:bg-primary hover:text-secondary-cream transition-colors py-3 px-4 rounded-lg font-semibold flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </Link>

              {/* Divider */}
              <div className="border-t border-primary-light my-2"></div>

              {/* Primary Action - Schedule an Appointment */}
              <Link 
                href="/schedule" 
                className="bg-white text-primary px-6 py-4 rounded-lg font-bold text-center hover:bg-secondary-cream transition-colors shadow-lg flex items-center justify-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule an Appointment
              </Link>

              {/* Divider */}
              <div className="border-t border-primary-light my-2"></div>

              {/* Customer Portal */}
              <Link 
                href="/portal" 
                className="border-2 border-white text-white px-4 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="flex-1">
                    <div className="font-bold">Customer Portal</div>
                    <div className="text-xs opacity-90 mt-1">View, Update your appointment or add pictures</div>
                  </div>
                </div>
              </Link>

              {/* Staff Portal */}
              <Link 
                href="/admin" 
                className="border-2 border-white text-white px-4 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-bold">Staff Portal</span>
              </Link>

              {/* Quick Contact */}
              <div className="mt-3 pt-3 border-t border-primary-light text-center">
                <a 
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call {formatPhoneDisplay(phoneNumber)}
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

