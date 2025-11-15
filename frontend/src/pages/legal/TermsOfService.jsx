import React from 'react'
import Title from '../../components/Title'

const TermsOfService = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Autoria's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
      items: []
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of the materials on Autoria's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
      items: [
        "modify or copy the materials",
        "use the materials for any commercial purpose or for any public display",
        "attempt to decompile or reverse engineer any software contained on the website",
        "remove any copyright or other proprietary notations from the materials"
      ]
    },
    {
      title: "3. User Responsibilities",
      content: "As a user of our services, you agree to:",
      items: [
        "Provide accurate, current, and complete information during registration",
        "Maintain and update your account information",
        "Use the service only for lawful purposes",
        "Not use the service to transmit harmful, offensive, or illegal content",
        "Respect the rights of other users"
      ]
    },
    {
      title: "4. Rental Terms and Conditions",
      content: "All vehicle rentals are subject to additional terms and conditions including:",
      items: [
        "Minimum age requirements (25 years or older, unless otherwise specified)",
        "Valid driver's license requirements",
        "Insurance and liability coverage requirements",
        "Return policies and late fees",
        "Prohibited uses of rental vehicles"
      ]
    },
    {
      title: "5. Payment and Billing",
      content: "Payment terms and billing policies include:",
      items: [
        "All fees must be paid in advance or at the time of vehicle pickup",
        "Security deposits may be required and are refundable upon vehicle return",
        "Additional charges may apply for fuel, tolls, parking, or damage",
        "All fees are in USD unless otherwise specified"
      ]
    },
    {
      title: "6. Cancellation and Refund Policy",
      content: "Our cancellation and refund policy:",
      items: [
        "Cancellations made 24+ hours in advance receive full refund",
        "Cancellations made within 24 hours may incur a $50 fee",
        "No-shows forfeit the full rental amount",
        "Refunds are processed within 7-10 business days"
      ]
    },
    {
      title: "7. Privacy and Data Protection",
      content: "We are committed to protecting your privacy. Our collection, use, and disclosure of your personal information is governed by our Privacy Policy, which is incorporated into these terms by reference.",
      items: []
    },
    {
      title: "8. Limitation of Liability",
      content: "In no event shall Autoria or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Autoria's website.",
      items: []
    },
    {
      title: "9. Accuracy of Materials",
      content: "The materials appearing on Autoria's website could include technical, typographical, or photographic errors. Autoria does not warrant that any of the materials on its website are accurate, complete, or current.",
      items: []
    },
    {
      title: "10. Modifications",
      content: "Autoria may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
      items: []
    },
    {
      title: "11. Contact Information",
      content: "If you have any questions about these Terms of Service, please contact us at legal@autoria.com or by phone at 1-800-AUTORIA.",
      items: []
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Terms of Service" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">Last updated: November 13, 2024</p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Autoria</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service ("Terms") govern your use of Autoria's website and services. 
              Please read these Terms carefully before using our services. By accessing or using our 
              services, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{section.content}</p>
                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-2 text-gray-600">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legal Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
            <p className="text-yellow-700">
              These Terms of Service constitute a legally binding agreement between you and Autoria. 
              If you do not agree to these terms, please discontinue use of our services immediately. 
              Continued use of our services constitutes acceptance of these Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService