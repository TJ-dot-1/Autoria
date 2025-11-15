import React from 'react'
import Title from '../../components/Title'

const BusinessRental = () => {
  const businessFeatures = [
    {
      icon: "📊",
      title: "Corporate Account Management",
      description: "Dedicated account managers for your company's needs"
    },
    {
      icon: "💳",
      title: "Simplified Billing",
      description: "Monthly consolidated invoices with detailed reporting"
    },
    {
      icon: "🚗",
      title: "Fleet Management",
      description: "Multiple vehicles across locations with centralized control"
    },
    {
      icon: "🔧",
      title: "Maintenance & Support",
      description: "24/7 roadside assistance and regular fleet maintenance"
    },
    {
      icon: "💰",
      title: "Volume Discounts",
      description: "Competitive rates based on your rental volume"
    },
    {
      icon: "📱",
      title: "Digital Platform",
      description: "Easy booking, tracking, and management online"
    }
  ]

  const companySizes = [
    {
      size: "Small Business",
      employees: "1-50",
      benefits: ["Flexible terms", "Quick approval", "Volume discounts"],
      color: "bg-blue-50 border-blue-200"
    },
    {
      size: "Medium Business", 
      employees: "51-500",
      benefits: ["Account manager", "Custom reporting", "Extended fleet"],
      color: "bg-green-50 border-green-200"
    },
    {
      size: "Enterprise",
      employees: "500+",
      benefits: ["Dedicated support", "White-label solution", "Custom integration"],
      color: "bg-purple-50 border-purple-200"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Business Rental" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Car Rental</h1>
            <p className="text-xl text-gray-600">Comprehensive solutions for companies of all sizes</p>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tailored for Business Success</h2>
                <p className="text-gray-600 mb-6">
                  Streamline your company's transportation with our comprehensive business rental program. 
                  From startups to Fortune 500 companies, we provide flexible solutions that grow with your business.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">No credit check required for qualified businesses</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">30-day payment terms available</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">Driver management and policy enforcement</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">Cost tracking and expense reporting</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  src="/auto.png" 
                  alt="Business Rental"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Business Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Business Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Company Sizes */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Solutions by Company Size</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {companySizes.map((company, index) => (
                <div key={index} className={`${company.color} border-2 rounded-lg p-6`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{company.size}</h3>
                  <p className="text-gray-600 mb-4">{company.employees} employees</p>
                  <ul className="space-y-2 text-gray-700">
                    {company.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-primary mr-2">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Industries We Serve */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Industries We Serve</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="font-semibold text-gray-900">Technology</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🏥</div>
                <h3 className="font-semibold text-gray-900">Healthcare</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🏗️</div>
                <h3 className="font-semibold text-gray-900">Construction</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-semibold text-gray-900">Consulting</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-semibold text-gray-900">Education</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900">Finance</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-semibold text-gray-900">Logistics</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="font-semibold text-gray-900">Legal</h3>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Fleet?</h2>
            <p className="text-xl mb-6">Get a customized business rental solution for your company</p>
            <div className="space-x-4">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Request Quote
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessRental