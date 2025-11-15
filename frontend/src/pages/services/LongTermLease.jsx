import React from 'react'
import Title from '../../components/Title'

const LongTermLease = () => {
  const leasePlans = [
    {
      duration: "3 Months",
      discount: "10% OFF",
      savings: "Save KES 55,000",
      description: "Perfect for seasonal workers or project-based assignments"
    },
    {
      duration: "6 Months",
      discount: "15% OFF",
      savings: "Save KES 165,000",
      description: "Ideal for extended business trips or temporary relocations"
    },
    {
      duration: "12 Months",
      discount: "20% OFF",
      savings: "Save KES 440,000",
      description: "Best value for long-term contracts or annual assignments"
    }
  ]

  const benefits = [
    {
      icon: "💰",
      title: "Lower Monthly Payments",
      description: "Enjoy significantly reduced rates compared to short-term rentals"
    },
    {
      icon: "🔧",
      title: "Maintenance Included",
      description: "All maintenance, repairs, and roadside assistance are included"
    },
    {
      icon: "🚗",
      title: "Fleet Flexibility",
      description: "Swap vehicles anytime based on changing needs"
    },
    {
      icon: "📋",
      title: "Simplified Administration",
      description: "One contract, one monthly payment, one point of contact"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Long Term Lease" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Long Term Lease</h1>
            <p className="text-xl text-gray-600">Flexible monthly rental solutions for extended needs</p>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect for Extended Projects</h2>
                <p className="text-gray-600 mb-6">
                  Our long-term lease programs offer the perfect solution for companies and individuals 
                  who need vehicles for 3-12 months. Enjoy lower rates, included maintenance, and 
                  complete flexibility.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Monthly billing for easy budgeting
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    No upfront deposits required
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Option to purchase at lease end
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Flexible early termination
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <img 
                  src="/banner.png" 
                  alt="Long Term Lease"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Lease Plans */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Lease Plans & Pricing</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {leasePlans.map((plan, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                  <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                    {plan.discount}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.duration}</h3>
                  <div className="text-primary text-xl font-bold mb-4">{plan.savings}</div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Get Quote
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Long Term Lease?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal For */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ideal For</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Use</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Project teams on extended assignments</li>
                  <li>• Construction companies</li>
                  <li>• Consulting firms</li>
                  <li>• Healthcare professionals</li>
                  <li>• Educational institutions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Use</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Temporary relocations</li>
                  <li>• Extended business travel</li>
                  <li>• Sabbaticals and research trips</li>
                  <li>• Home renovations</li>
                  <li>• Seasonal workers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Lease?</h2>
            <p className="text-xl mb-6">Get a customized quote for your long-term rental needs</p>
            <div className="space-x-4">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Quote
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LongTermLease