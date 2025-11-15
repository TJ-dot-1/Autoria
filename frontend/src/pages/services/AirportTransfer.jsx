import React from 'react'
import Title from '../../components/Title'

const AirportTransfer = () => {
  const transferOptions = [
    {
      type: "Shared Ride",
      description: "Cost-effective shared shuttle service",
      features: ["Comfortable vehicles", "Regular departures", "Meet & greet service"],
      price: "From KES 2,500",
      duration: "45-60 min"
    },
    {
      type: "Private Transfer",
      description: "Dedicated vehicle for your group",
      features: ["Direct service", "Meet & greet", "Flight monitoring"],
      price: "From KES 6,500",
      duration: "30-45 min"
    },
    {
      type: "Executive Transfer",
      description: "Premium service with luxury vehicles",
      features: ["Luxury vehicles", "Professional drivers", "Premium amenities"],
      price: "From KES 11,500",
      duration: "30-45 min"
    }
  ]

  const airports = [
    "Jomo Kenyatta International Airport (JKIA)",
    "Moi International Airport (MIA)",
    "Kisumu Airport (KIS)",
    "Eldoret International Airport (EIK)",
    "Mombasa Airport (MBA)",
    "Wilson Airport (WIL)",
    "Nakuru Airport (NUU)",
    "Malindi Airport (MYD)"
  ]

  const features = [
    {
      icon: "🛫",
      title: "Flight Tracking",
      description: "We monitor your flight and adjust pickup time automatically"
    },
    {
      icon: "👋",
      title: "Meet & Greet",
      description: "Professional driver waits at arrivals with name board"
    },
    {
      icon: "🧳",
      title: "Luggage Assistance",
      description: "Help with loading and unloading your luggage"
    },
    {
      icon: "🚗",
      title: "Clean Vehicles",
      description: "Sanitized and well-maintained vehicles for your safety"
    },
    {
      icon: "⏰",
      title: "On-Time Guarantee",
      description: "We'll wait up to 30 minutes after landing at no extra cost"
    },
    {
      icon: "💳",
      title: "Fixed Pricing",
      description: "No surge pricing - know your cost upfront"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Airport Transfer" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Airport Transfer Services</h1>
            <p className="text-xl text-gray-600">Reliable and comfortable transfers to and from major airports</p>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Stress-Free Airport Travel</h2>
                <p className="text-gray-600 mb-6">
                  Start and end your journey with comfort and reliability. Our professional airport transfer 
                  services connect you seamlessly between airports and your destination.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">Available 24/7, 365 days a year</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">Professional, licensed drivers</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">Real-time flight tracking</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">Easy online booking and payment</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  src="/hero.png" 
                  alt="Airport Transfer"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Transfer Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Transfer Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {transferOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.type}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-primary mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-4">
                    <div className="text-2xl font-bold text-primary mb-2">{option.price}</div>
                    <div className="text-sm text-gray-500 mb-4">Typical journey: {option.duration}</div>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Airport Transfer?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Airport Coverage */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Airport Coverage</h2>
            <p className="text-center text-gray-600 mb-8">
              We provide reliable transfers to and from these major airports:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {airports.map((airport, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="text-gray-700 font-medium">{airport}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-6">
              Don't see your airport? <a href="#" className="text-primary hover:underline">Contact us</a> for custom arrangements.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Book Online</h3>
                <p className="text-gray-600 text-sm">Select your airport, date, and service type</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">Receive Confirmation</h3>
                <p className="text-gray-600 text-sm">Get instant confirmation with driver details</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">Meet Your Driver</h3>
                <p className="text-gray-600 text-sm">Professional meet & greet at arrivals or departure</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="font-semibold text-gray-900 mb-2">Enjoy Your Ride</h3>
                <p className="text-gray-600 text-sm">Relax in comfort as we take you to your destination</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Next Trip?</h2>
            <p className="text-xl mb-6">Book your airport transfer today and travel with confidence</p>
            <div className="space-x-4">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Book Transfer
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AirportTransfer