import React, { useState } from 'react'
import Title from '../../components/Title'

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState('booking')
  
  const categories = [
    { id: 'booking', name: 'Booking & Reservations', icon: '📅' },
    { id: 'rental', name: 'Rental Process', icon: '🚗' },
    { id: 'payment', name: 'Payment & Pricing', icon: '💳' },
    { id: 'insurance', name: 'Insurance & Protection', icon: '🛡️' },
    { id: 'support', name: 'Customer Support', icon: '💬' },
    { id: 'technical', name: 'Technical Issues', icon: '🔧' }
  ]

  const helpContent = {
    booking: [
      {
        question: "How do I make a reservation?",
        answer: "You can make a reservation online through our website, mobile app, or by calling our customer service. Simply select your pickup location, dates, and vehicle type to get started."
      },
      {
        question: "Can I modify or cancel my reservation?",
        answer: "Yes, you can modify or cancel your reservation up to 24 hours before your pickup time without any penalty. Changes made within 24 hours may be subject to fees."
      },
      {
        question: "What if I need to extend my rental?",
        answer: "Contact our customer service to extend your rental. Extensions are subject to vehicle availability and may incur additional charges."
      },
      {
        question: "Do you offer one-way rentals?",
        answer: "Yes, we offer one-way rentals between most of our locations. Additional fees may apply depending on the distance and location."
      }
    ],
    rental: [
      {
        question: "What documents do I need to rent a car?",
        answer: "You'll need a valid driver's license, credit card, and proof of insurance. For international renters, a passport may also be required."
      },
      {
        question: "What is the minimum age to rent?",
        answer: "The minimum age to rent is 25 years old. Drivers aged 21-24 may rent for an additional young driver fee."
      },
      {
        question: "Can someone else drive the rental car?",
        answer: "Additional drivers are allowed for an extra fee. All additional drivers must meet the same requirements and be present at pickup."
      },
      {
        question: "What happens if I'm late for pickup?",
        answer: "We hold your vehicle for up to 2 hours after your scheduled pickup time. After that, the vehicle may be released to another customer."
      }
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, MasterCard, American Express), debit cards, and cash deposits at most locations."
      },
      {
        question: "Is there a deposit required?",
        answer: "A security deposit is required at pickup, typically ranging from $200-500 depending on the vehicle and rental duration."
      },
      {
        question: "When will I be charged?",
        answer: "You're charged at the time of pickup. Any additional charges (fuel, tolls, damage) will be processed after return."
      },
      {
        question: "Do you offer discounts or promotions?",
        answer: "Yes, we offer various discounts for AAA members, senior citizens, military personnel, and through our loyalty program."
      }
    ],
    insurance: [
      {
        question: "What insurance options are available?",
        answer: "We offer Collision Damage Waiver (CDW), Loss Damage Waiver (LDW), and various liability protection plans."
      },
      {
        question: "Does my personal car insurance cover rentals?",
        answer: "This depends on your specific policy. We recommend checking with your insurance provider to understand your coverage."
      },
      {
        question: "What happens if the car is damaged?",
        answer: "Report any damage immediately. Depending on your insurance coverage, you may be responsible for the deductible amount."
      },
      {
        question: "Are there any items not covered by insurance?",
        answer: "Personal items, interior damage from pets, and off-road damage are typically not covered by our standard protection plans."
      }
    ],
    support: [
      {
        question: "How can I contact customer support?",
        answer: "You can reach us 24/7 by phone, email, or through our mobile app chat feature."
      },
      {
        question: "What if I break down during my rental?",
        answer: "Call our roadside assistance hotline immediately. We provide 24/7 emergency support and can arrange towing if needed."
      },
      {
        question: "Can I change my pickup location?",
        answer: "Yes, you can change your pickup location by contacting customer service. Location changes may incur additional fees."
      },
      {
        question: "How do I report an issue with my rental?",
        answer: "Contact customer service immediately to report any issues. Document any problems with photos if possible."
      }
    ],
    technical: [
      {
        question: "The website isn't loading properly. What should I do?",
        answer: "Try clearing your browser cache and cookies, or use a different browser. You can also call us to make a reservation."
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your registered email address."
      },
      {
        question: "My booking confirmation email didn't arrive. What should I do?",
        answer: "Check your spam folder first. If you still can't find it, contact customer service for a new confirmation."
      },
      {
        question: "Can I manage my booking online?",
        answer: "Yes, you can view, modify, or cancel your booking through your account on our website or mobile app."
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Help Center" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600">Find answers to your questions and get the support you need</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <span className="font-semibold">{category.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Help Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {categories.find(cat => cat.id === activeCategory)?.name}
            </h2>
            <div className="space-y-6">
              {helpContent[activeCategory]?.map((item, index) => (
                <div key={index} className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-primary text-white rounded-lg p-8 mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl mb-6">Our customer support team is available 24/7 to assist you</p>
            <div className="space-x-4">
              <a
                href="tel:1-800-AUTORIA"
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Call 1-800-AUTORIA
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-block"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter