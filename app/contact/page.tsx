export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Get in Touch</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <a href="tel:+12164818696" className="text-primary text-lg hover:underline">
                (216) 481-8696
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <a href="mailto:domesticbody@gmail.com" className="text-primary hover:underline">
                domesticbody@gmail.com
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
              <p className="text-gray-700">Monday - Friday: 8:00 AM - 4:30 PM</p>
              <p className="text-gray-700">Saturday: 9:00 AM - 1:00 PM</p>
              <p className="text-gray-700">Sunday: Closed</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-700">17017 Saint Clair Ave</p>
              <p className="text-gray-700">Cleveland, OH 44110</p>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary-cream p-8 rounded-lg">
          <h3 className="text-xl font-bold text-primary mb-4">Need a Free Estimate?</h3>
          <p className="text-gray-700 mb-6">
            Stop by our shop or give us a call. We'll inspect your vehicle and provide a detailed estimate at no charge.
          </p>
          <a href="tel:+12164818696" className="btn-primary inline-block">
            Call Now
          </a>
        </div>
      </div>
    </div>
  )
}
