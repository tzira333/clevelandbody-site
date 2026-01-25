export default function PortalPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Customer Portal</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Portal Coming Soon</h2>
          <p className="text-gray-700 mb-6">
            We're building a customer portal where you'll be able to:
          </p>
          
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span className="text-gray-700">Track your repair status</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span className="text-gray-700">View photos of your vehicle</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span className="text-gray-700">Upload insurance documents</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span className="text-gray-700">Communicate with our team</span>
            </li>
          </ul>
          
          <p className="text-gray-600 mb-4">For now, please call us for updates on your repair:</p>
          <a href="tel:+12164818696" className="btn-primary inline-block">
            (216) 481-8696
          </a>
        </div>
      </div>
    </div>
  )
}