import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative">
      {/* RED Section (Top) - Minimal */}
      <div className="bg-gradient-to-b from-primary to-primary-light text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Expert Auto Body & Collision Repair in Cleveland
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white/90">
              Over 40 years of experience serving domestic and foreign vehicles. Professional collision repair, custom painting, and restoration services.
            </p>
          </div>
        </div>
      </div>

      {/* Wave Divider - Red to White */}
      <div className="relative h-12 bg-white">
        <svg 
          className="absolute top-0 w-full h-12" 
          viewBox="0 0 1440 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 0L60 4C120 8 240 16 360 20C480 24 600 24 720 20C840 16 960 8 1080 6C1200 4 1320 8 1380 10L1440 12V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" 
            fill="#800000"
          />
        </svg>
      </div>

      {/* WHITE Section (Middle) - Primary Content */}
      <div className="bg-white text-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {/* Schedule Estimate - Red Border */}
              <Link 
                href="/schedule" 
                className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors text-center text-lg font-semibold rounded-lg whitespace-nowrap shadow-md hover:shadow-lg"
              >
                Schedule Estimate
              </Link>
              
              {/* Request Tow Service - Red Border */}
              <Link 
                href="/tow-request" 
                className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors text-center text-lg font-semibold rounded-lg whitespace-nowrap shadow-md hover:shadow-lg"
              >
                Request Tow Service
              </Link>
              
              {/* Start Repair Request - Solid Red */}
              <Link 
                href="/repair-request" 
                className="px-8 py-3 bg-primary text-white hover:bg-primary-dark transition-colors text-center text-lg font-semibold rounded-lg whitespace-nowrap shadow-md hover:shadow-lg"
              >
                Start Repair Request
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="w-12 h-12 text-yellow-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p className="font-bold text-gray-900">4.6 Star Rating</p>
                <p className="text-sm text-gray-600">Trusted by Customers</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="w-12 h-12 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="font-bold text-gray-900">All Insurance Accepted</p>
                <p className="text-sm text-gray-600">We handle claims</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-bold text-gray-900">40+ Years Experience</p>
                <p className="text-sm text-gray-600">Expert technicians</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider - White to Blue */}
      <div className="relative h-12 bg-blue-700">
        <svg 
          className="absolute top-0 w-full h-12" 
          viewBox="0 0 1440 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 0L60 4C120 8 240 16 360 20C480 24 600 24 720 20C840 16 960 8 1080 6C1200 4 1320 8 1380 10L1440 12V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" 
            fill="white"
          />
        </svg>
      </div>

      {/* BLUE Section (Bottom) - Additional Info */}
      <div className="bg-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {/* Why Choose Us */}
              <div>
                <h3 className="text-xl font-bold mb-3">Why Choose Us?</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Certified Technicians</li>
                  <li>✓ Lifetime Warranty</li>
                  <li>✓ Insurance Direct Billing</li>
                  <li>✓ Towing Service Available</li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-xl font-bold mb-3">Our Services</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Collision Repair</li>
                  <li>• Paint & Refinishing</li>
                  <li>• Frame Alignment</li>
                  <li>• Glass Repair</li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl font-bold mb-3">Contact Us</h3>
                <div className="space-y-2 text-sm">
                  <p>17017 Saint Clair Ave</p>
                  <p>Cleveland, OH 44110</p>
                  <a href="tel:+12164818696" className="block font-bold text-lg hover:text-blue-200 transition-colors">
                    (216) 481-8696
                  </a>
                  <p className="text-xs">Mon-Fri: 8AM-4:30PM</p>
                  <p className="text-xs">Sat: 9AM-1PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
