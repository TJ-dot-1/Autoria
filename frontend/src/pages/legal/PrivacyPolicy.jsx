import React from 'react'
import Title from '../../components/Title'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Privacy Policy" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">Last updated: November 13, 2024</p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Matters</h2>
            <p className="text-gray-600 leading-relaxed">
              At Autoria, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              services, website, and mobile applications.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                <p className="text-gray-600 mb-4">
                  We may collect personal information that you voluntarily provide when using our services:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Name, email address, phone number, and mailing address
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Driver's license number and expiration date
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Payment information (credit/debit card details)
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Date of birth for age verification
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                <p className="text-gray-600 mb-4">
                  When you visit our website or use our services, we may automatically collect:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    IP address, browser type, and device information
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Pages visited, time spent on site, and referral URLs
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Location information (with your consent)
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Rental history and preferences
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-primary mr-3">✓</span>
                <span className="text-gray-700">Process and manage your rental bookings</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3">✓</span>
                <span className="text-gray-700">Communicate with you about your reservations and account</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3">✓</span>
                <span className="text-gray-700">Process payments and prevent fraudulent transactions</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3">✓</span>
                <span className="text-gray-700">Improve our services and customer experience</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3">✓</span>
                <span className="text-gray-700">Send promotional offers and marketing communications (with consent)</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3">✓</span>
                <span className="text-gray-700">Comply with legal obligations and enforce our terms</span>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-6">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Providers</h3>
                <p className="text-gray-600 text-sm">
                  With trusted third-party vendors who help us operate our business (payment processors, insurance companies, etc.)
                </p>
              </div>
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                <p className="text-gray-600 text-sm">
                  When required by law, court order, or government regulation
                </p>
              </div>
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Transfers</h3>
                <p className="text-gray-600 text-sm">
                  In connection with a merger, acquisition, or sale of assets
                </p>
              </div>
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Protection</h3>
                <p className="text-gray-600 text-sm">
                  To protect the rights, property, or safety of our users or the public
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-900">Encryption</h3>
                <p className="text-gray-600 text-sm">Data is encrypted in transit and at rest</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-semibold text-gray-900">Access Controls</h3>
                <p className="text-gray-600 text-sm">Limited access to authorized personnel only</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900">Regular Audits</h3>
                <p className="text-gray-600 text-sm">Regular security assessments and updates</p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
            <p className="text-gray-600 mb-6">You have the following rights regarding your personal information:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">Access and review your personal information</span>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">Correct inaccurate information</span>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">Delete your personal information</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">Restrict processing of your information</span>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">Opt-out of marketing communications</span>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-gray-700">Data portability</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
            <p className="text-xl mb-6">Contact our Privacy Team for any questions or concerns</p>
            <div className="space-x-4">
              <a
                href="mailto:josiejosiah89@gmail.com"
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Email Privacy Team
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

export default PrivacyPolicy