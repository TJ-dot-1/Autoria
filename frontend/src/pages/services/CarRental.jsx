import React from 'react'
import Title from '../../components/Title'

const CarRental = () => {
  const rentalOptions = [
    {
      type: "Economy",
      description: "Compact cars perfect for city driving",
      features: ["Fuel efficient", "Easy parking", "Budget-friendly"],
      price: "From KES 3,900/day"
    },
    {
      type: "Sedan",
      description: "Comfortable midsize cars for any occasion",
      features: ["Spacious interior", "Great for families", "Smooth ride"],
      price: "From KES 5,200/day"
    },
    {
      type: "SUV",
      description: "Spacious vehicles for adventures",
      features: ["All-wheel drive", "Large cargo space", "Perfect for trips"],
      price: "From KES 7,900/day"
    },
    {
      type: "Luxury",
      description: "Premium vehicles for special occasions",
      features: ["High-end features", "Premium comfort", "Executive style"],
      price: "From KES 13,200/day"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Car Rental" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Car Rental Services</h1>
            <p className="text-xl text-gray-600">Flexible rental options for every need and budget</p>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Autoria?</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    24/7 customer support
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Free cancellation up to 24 hours
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Unlimited mileage on most vehicles
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    No hidden fees
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Well-maintained fleet
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <img 
                  src="/hero.png" 
                  alt="Car Rental"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Rental Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Fleet</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentalOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{option.type}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-primary mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xl font-bold text-primary mb-4">{option.price}</div>
                  <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Reserve Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose Your Vehicle</h3>
                <p className="text-gray-600 text-sm">Browse our fleet and select the perfect car for your needs</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">Make a Reservation</h3>
                <p className="text-gray-600 text-sm">Book online or call our team to secure your rental</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">Pick Up Your Car</h3>
                <p className="text-gray-600 text-sm">Visit our location or we'll deliver to you</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="font-semibold text-gray-900 mb-2">Enjoy Your Ride</h3>
                <p className="text-gray-600 text-sm">Drive with confidence and return when you're ready</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Rent?</h2>
            <p className="text-xl mb-6">Join millions of satisfied customers who trust Autoria</p>
            <a 
              href="/cars"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Browse Fleet
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarRental