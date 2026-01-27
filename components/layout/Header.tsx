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
      {/* Main Navigation - Very compact */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-1">
          
          {/* Logo Section - Minimal height */}
          <Link 
            href="/" 
            className="flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ width: '28%', minWidth: '240px' }}
          >
            <div className="bg-primary rounded p-1 border border-secondary-cream">
              {/* DOMESTIC & FOREIGN */}
              <div className="text-center">
                <h1 className="text-secondary-cream font-bold text-sm md:text-base lg:text-lg tracking-wide leading-tight">
                  DOMESTIC & FOREIGN
                </h1>
              </div>

              {/* AUTOBODY SHOP */}
              <div className="bg-secondary-cream text-primary text-center py-0.5 my-0.5 rounded">
                <span className="font-bold text-xs md:text-sm lg:text-base tracking-wider">
                  AUTOBODY SHOP
                </span>
              </div>

              {/* Phone (most important info) */}
              <div className="text-center">
                <a 
                  href={`tel:${businessPhone}`}
                  className="block text-secondary-cream font-bold text-xs md:text-sm hover:text-white transition-colors"
                >
                  {formatPhoneDisplay(businessPhone)}
                </a>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Compact */}
          <div className="hidden lg:flex items-center justify-start flex-grow gap-2 ml-6">
            <Link href="/" className="text-xs text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Home
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/services" className="text-xs text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Services
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/insurance" className="text-xs text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Insurance
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/gallery" className="text-xs text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Gallery
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/reviews" className="text-xs text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Reviews
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/contact" className="text-xs text-white hover:text-secondary-cream transition-colors whitespace-nowrap">
              Contact
            </Link>
            <span className="text-white/30">|</span>
            <Link 
              href="/portal" 
              className="text-xs px-2 py-1 border border-white text-white hover:bg-white hover:text-primary transition-colors rounded whitespace-nowrap"
            >
              Portal
            </Link>
            <Link 
              href="/schedule" 
              className="text-xs px-2 py-1 bg-white text-primary hover:bg-secondary-cream transition-colors rounded font-semibold whitespace-nowrap"
            >
              Schedule
            </Link>
            <Link 
              href="/admin" 
              className="text-xs px-2 py-1 border-2 border-white text-white hover:bg-white hover:text-primary transition-colors rounded font-semibold whitespace-nowrap"
            >
              Staff Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden pb-2 space-y-1">
            <Link 
              href="/" 
              className="block py-1 text-sm text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className="block py-1 text-sm text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/insurance" 
              className="block py-1 text-sm text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Insurance & Claims
            </Link>
            <Link 
              href="/gallery" 
              className="block py-1 text-sm text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Photo Gallery
            </Link>
            <Link 
              href="/reviews" 
              className="block py-1 text-sm text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link 
              href="/contact" 
              className="block py-1 text-sm text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/portal" 
              className="block py-1 text-sm text-white hover:text-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Customer Portal
            </Link>
            <Link 
              href="/schedule" 
              className="block py-2 bg-white text-primary text-center text-sm font-semibold rounded hover:bg-secondary-cream transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Schedule Appointment
            </Link>
            
            {/* Staff Login */}
            <Link 
              href="/admin" 
              className="block py-2 border-2 border-white text-white text-center text-sm font-semibold rounded hover:bg-white hover:text-primary transition-colors mt-2"
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




