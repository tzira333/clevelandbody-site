export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Schedule an Appointment</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Book Your Free Estimate</h2>
          <p className="text-gray-700 mb-6">
            Online scheduling coming soon. For now, please call us to schedule your appointment or free estimate.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Call to Schedule</h3>
              <a href="tel:+12164818696" className="text-primary text-2xl hover:underline block">
                (216) 481-8696
              </a>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-700">Monday - Friday: 8:00 AM - 4:30 PM</p>
              <p className="text-gray-700">Saturday: 9:00 AM - 1:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary-dark text-white p-6 rounded-lg text-center">
          <p className="mb-4">Need immediate assistance or have questions?</p>
          <a href="tel:+12164818696" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-secondary-cream transition-colors inline-block">
            Call (216) 481-8696
          </a>
        </div>
      </div>
    </div>
  )
}

