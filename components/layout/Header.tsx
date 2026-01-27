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
      {/* Top Contact Bar */}
      <div className="bg-primary-dark text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
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

      {/* Main Navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          
          {/* Logo Section - Takes up 1/3 of header width */}
          <Link 
            href="/" 
            className="flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ width: '33.33%', minWidth: '280px' }}
          >
            <div className="bg-primary rounded-lg p-4 border-2 border-secondary-cream">
              {/* Top Text: DOMESTIC & FOREIGN */}
              <div className="text-center mb-2">
                <h1 className="text-secondary-cream font-bold text-xl md:text-2xl lg:text-3xl tracking-wide">
                  DOMESTIC & FOREIGN
                </h1>
              </div>

              {/* Car Images Row */}
              <div className="flex justify-center items-center gap-4 mb-2">
                {/* Classic American Muscle Car */}
                <div className="w-20 h-12 md:w-24 md:h-14 lg:w-28 lg:h-16 relative">
                  <svg viewBox="0 0 100 50" className="w-full h-full fill-secondary-cream">
                    {/* Classic muscle car silhouette */}
                    <path d="M10,35 L15,30 L20,28 L30,28 L35,25 L45,25 L50,28 L70,28 L75,30 L80,32 L85,35 L90,35 L90,42 L85,42 L83,45 L75,45 L73,42 L30,42 L28,45 L20,45 L18,42 L10,42 Z"/>
                    {/* Wheels */}
                    <circle cx="25" cy="42" r="5"/>
                    <circle cx="75" cy="42" r="5"/>
                    {/* Windows */}
                    <path d="M35,28 L38,25 L42,25 L45,28 Z" fill="#800000"/>
                  </svg>
                </div>

                {/* European Convertible */}
                <div className="w-20 h-12 md:w-24 md:h-14 lg:w-28 lg:h-16 relative">
                  <svg viewBox="0 0 100 50" className="w-full h-full fill-secondary-cream">
                    {/* Convertible silhouette */}
                    <path d="M15,38 L20,33 L25,30 L35,30 L40,28 L50,28 L55,30 L75,30 L82,35 L88,38 L88,43 L82,43 L80,46 L72,46 L70,43 L32,43 L30,46 L22,46 L20,43 L15,43 Z"/>
                    {/* Wheels */}
                    <circle cx="28" cy="43" r="5"/>
                    <circle cx="75" cy="43" r="5"/>
                    {/* Windshield */}
                    <path d="M40,30 L42,28 L48,28 L50,30 Z" fill="#800000"/>
                  </svg>
                </div>
              </div>

              {/* AUTOBODY Text */}
              <div className="bg-secondary-cream text-primary text-center py-1 mb-2 rounded">
                <span className="font-bold text-lg md:text-xl lg:text-2xl tracking-widest">
                  AUTOBODY
                </span>
              </div>

              {/* Slogan */}
              <div className="text-center mb-2">
                <p className="text-secondary-cream italic text-xs md:text-sm font-serif">
                  {slogan}
                </p>
              </div>

              {/* Address and Phone */}
              <div className="text-center space-y-1">
                <p className="text-secondary-cream font-semibold text-xs md:text-sm">
                  {businessAddress}
                </p>
                <a 
                  href={`tel:${businessPhone}`}
                  className="block text-secondary-cream font-bold text-sm md:text-base hover:text-white transition-colors"
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


