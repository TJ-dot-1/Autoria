import React from 'react'
import Title from '../../components/Title'

const InsuranceInfo = () => {
  const insuranceOptions = [
    {
      name: "Collision Damage Waiver (CDW)",
      description: "Reduces your financial responsibility for damage to the rental vehicle",
      coverage: "Up to vehicle value",
      deductible: "KES 50,000 - 100,000",
      features: ["Protection against collision damage", "Covers vehicle repair costs", "Theft protection included"]
    },
    {
      name: "Loss Damage Waiver (LDW)",
      description: "Comprehensive protection covering theft, vandalism, and natural disasters",
      coverage: "Full vehicle value",
      deductible: "KES 0 - 50,000",
      features: ["Complete vehicle protection", "Includes theft coverage", "Acts of nature protection"]
    },
    {
      name: "Personal Accident Insurance (PAI)",
      description: "Covers medical expenses for you and your passengers in case of accident",
      coverage: "Up to KES 5M",
      deductible: "None",
      features: ["Medical expense coverage", "Accidental death benefit", "Covers driver and passengers"]
    },
    {
      name: "Liability Protection",
      description: "Protection against claims from third parties for injury or property damage",
      coverage: "Up to KES 50M",
      deductible: "None",
      features: ["Third-party liability coverage", "Property damage protection", "Medical payments coverage"]
    }
  ]

  const faqItems = [
    {
      question: "Do I need insurance to rent a car?",
      answer: "Yes, insurance is required for all rentals. You can choose our coverage options or use your personal auto insurance if it includes rental car coverage."
    },
    {
      question: "What if I already have car insurance?",
      answer: "Many personal auto insurance policies extend to rental cars. Check with your insurance provider to confirm your coverage includes rental vehicles."
    },
    {
      question: "What's the difference between CDW and LDW?",
      answer: "CDW covers collision damage while LDW provides broader protection including theft, vandalism, and natural disasters. LDW offers more comprehensive coverage."
    },
    {
      question: "Are there items not covered by insurance?",
      answer: "Personal items in the car, interior damage from pets, off-road driving damage, and driving under the influence are typically not covered."
    },
    {
      question: "Can I decline all insurance options?",
      answer: "Some form of insurance coverage is mandatory. However, you may be able to use your personal auto insurance if it covers rentals."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Insurance Information" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Insurance & Protection</h1>
            <p className="text-xl text-gray-600">Comprehensive coverage options for peace of mind during your rental</p>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Protect Your Rental Experience</h2>
                <p className="text-gray-600 mb-6">
                  We offer comprehensive insurance and protection options to ensure you're covered 
                  during your rental period. Choose from our flexible plans to match your needs and budget.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">No hidden fees or surprise charges</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">24/7 roadside assistance included</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">Easy claims process</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    <span className="text-gray-700">Multiple coverage levels available</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  src="/banner.png" 
                  alt="Insurance Protection"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Insurance Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Insurance Coverage Options</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {insuranceOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{option.name}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">Coverage:</span>
                      <p className="text-gray-600">{option.coverage}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Deductible:</span>
                      <p className="text-gray-600">{option.deductible}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-gray-600">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-primary mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* What to Do in Case of Accident */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Do in Case of an Accident</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Ensure Safety</h3>
                <p className="text-gray-600 text-sm">Check for injuries and move to safety if possible</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">Call Authorities</h3>
                <p className="text-gray-600 text-sm">Contact police and emergency services if needed</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">Document Incident</h3>
                <p className="text-gray-600 text-sm">Take photos and collect witness information</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-600 text-sm">Call our 24/7 support line immediately</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-l-4 border-primary pl-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Coverage?</h2>
            <p className="text-xl mb-6">Our insurance specialists are here to help you understand your options</p>
            <div className="space-x-4">
              <a
                href="tel:1-800-AUTORIA"
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Call Insurance Hotline
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-block"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsuranceInfo