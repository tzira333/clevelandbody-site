'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Get phone from env or use default
  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+12164818696'
  const businessAddress = '17017 Saint Clair Ave, Cleveland, OH 44110'
  const slogan = 'Building Our Future On Service To You!'
  
  // Format phone for display (XXX) XXX-XXXX
  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      {/* Top Contact Bar - Reduced height */}
      <div className="bg-primary-dark text-white py-1">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs">
          <a 
            href={`tel:${businessPhone}`}
            className="hover:text-secondary-cream transition-colors"
          >
            📞 {formatPhoneDisplay(businessPhone)}
          </a>
          <span className="hidden md:inline">
            Mon-Fri 8:00 AM - 4:30 PM | Sat 9:00 AM - 1:00 PM
          </span>
        </div>
      </div>

      {/* Main Navigation - Reduced padding */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          
          {/* Logo Section - Takes up 1/3 of header width, removed cars, added "Shop" */}
          <Link 
            href="/" 
            className="flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ width: '33.33%', minWidth: '280px' }}
          >
            <div className="bg-primary rounded-lg p-2 border-2 border-secondary-cream">
              {/* Top Text: DOMESTIC & FOREIGN */}
              <div className="text-center mb-1">
                <h1 className="text-secondary-cream font-bold text-lg md:text-xl lg:text-2xl tracking-wide">
                  DOMESTIC & FOREIGN
                </h1>
              </div>

              {/* AUTOBODY SHOP Text - Added "Shop" */}
              <div className="bg-secondary-cream text-primary text-center py-1 mb-1 rounded">
                <span className="font-bold text-base md:text-lg lg:text-xl tracking-widest">
                  AUTOBODY SHOP
                </span>
              </div>

              {/* Slogan */}
              <div className="text-center mb-1">
                <p className="text-secondary-cream italic text-xs font-serif">
                  {slogan}
                </p>
              </div>

              {/* Address and Phone */}
              <div className="text-center space-y-0.5">
                <p className="text-secondary-cream font-semibold text-xs">
                  {businessAddress}
                </p>
                <a 
                  href={`tel:${businessPhone}`}
                  className="block text-secondary-cream font-bold text-sm hover:text-white transition-colors"
                >
                  {formatPhoneDisplay(businessPhone)}
                </a>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Left-aligned in remaining space */}
          <div className="hidden lg:flex items-center justify-start flex-grow gap-3 ml-8">
            <Link href="/" className="text-sm text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Home
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/services" className="text-sm text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Services
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/insurance" className="text-sm text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Insurance
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/gallery" className="text-sm text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Gallery
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/reviews" className="text-sm text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Reviews
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/contact" className="text-sm text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Contact
            </Link>
            <span className="text-white/30">|</span>
            <Link 
              href="/portal" 
              className="text-xs px-3 py-1.5 border border-white text-white hover:bg-white hover:text-primary transition-colors rounded whitespace-nowrap"
            >
              Portal
            </Link>
            <Link 
              href="/schedule" 
              className="text-xs px-3 py-1.5 bg-white text-primary hover:bg-secondary-cream transition-colors rounded font-semibold whitespace-nowrap"
            >
              Schedule
            </Link>
            <Link 
              href="/admin" 
              className="text-xs px-3 py-1.5 border-2 border-white text-white hover:bg-white hover:text-primary transition-colors rounded font-semibold whitespace-nowrap"
            >
              Staff Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <Link 
              href="/" 
              className="block py-2 text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className="block py-2 text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/insurance" 
              className="block py-2 text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Insurance & Claims
            </Link>
            <Link 
              href="/gallery" 
              className="block py-2 text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Photo Gallery
            </Link>
            <Link 
              href="/reviews" 
              className="block py-2 text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/portal" 
              className="block py-2 text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Customer Portal
            </Link>
            <Link 
              href="/schedule" 
              className="block py-3 bg-white text-primary text-center font-semibold rounded hover:bg-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Schedule Appointment
            </Link>
            
            {/* Staff Login - Highlighted at bottom */}
            <Link 
              href="/admin" 
              className="block py-3 border-2 border-white text-white text-center font-semibold rounded hover:bg-white hover:text-primary transition-colors mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Staff Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}



