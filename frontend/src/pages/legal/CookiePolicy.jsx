import React from 'react'
import Title from '../../components/Title'

const CookiePolicy = () => {
  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "Required for the website to function properly",
      purpose: "Enable core functionality such as security, network management, and accessibility",
      examples: ["Authentication cookies", "Session management", "Security cookies"],
      canBeDisabled: false
    },
    {
      name: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      purpose: "Collect information about page views, user behavior, and website performance",
      examples: ["Google Analytics", "Page visit tracking", "User flow analysis"],
      canBeDisabled: true
    },
    {
      name: "Marketing Cookies",
      description: "Used to deliver relevant advertisements and track campaign performance",
      purpose: "Display personalized ads and measure the effectiveness of marketing campaigns",
      examples: ["Facebook Pixel", "Google Ads", "Social media tracking"],
      canBeDisabled: true
    },
    {
      name: "Functional Cookies",
      description: "Remember your preferences and settings",
      purpose: "Enhance user experience by remembering choices and preferences",
      examples: ["Language preferences", "Location settings", "User interface customization"],
      canBeDisabled: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Cookie Policy" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-lg text-gray-600">Last updated: November 13, 2024</p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              improving our services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This Cookie Policy explains what cookies we use, why we use them, and how you can control them.
            </p>
          </div>

          {/* How We Use Cookies */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Cookies</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <span className="text-primary mr-3 text-xl">📊</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Website Performance</h3>
                  <p className="text-gray-600">Monitor website performance and identify technical issues</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 text-xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalization</h3>
                  <p className="text-gray-600">Remember your preferences and customize your experience</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 text-xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                  <p className="text-gray-600">Protect your account and prevent fraudulent activity</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 text-xl">📈</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-gray-600">Understand how our website is used to improve our services</p>
                </div>
              </div>
            </div>
          </div>

          {/* Types of Cookies */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
            <div className="space-y-6">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="border-l-4 border-primary pl-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{cookie.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cookie.canBeDisabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cookie.canBeDisabled ? 'Optional' : 'Required'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{cookie.description}</p>
                  <p className="text-gray-700 mb-3">
                    <strong>Purpose:</strong> {cookie.purpose}
                  </p>
                  <div className="text-gray-700">
                    <strong>Examples:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {cookie.examples.map((example, idx) => (
                        <li key={idx} className="text-sm">{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Managing Your Cookie Preferences</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Settings</h3>
                <p className="text-gray-600 mb-4">
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    View what cookies are stored
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Delete existing cookies
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Block cookies from specific sites
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Block all cookies
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cookie Consent Tool</h3>
                <p className="text-gray-600 mb-4">
                  Use our cookie preference center to customize your settings:
                </p>
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Manage Cookie Preferences
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Note: Disabling certain cookies may affect website functionality
                </p>
              </div>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Cookies</h2>
            <p className="text-gray-600 mb-6">
              We may also use third-party services that set their own cookies:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-3">🔍</div>
                <h3 className="font-semibold text-gray-900">Google Analytics</h3>
                <p className="text-gray-600 text-sm">Website analytics and performance tracking</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-3">📱</div>
                <h3 className="font-semibold text-gray-900">Social Media</h3>
                <p className="text-gray-600 text-sm">Social sharing and login functionality</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-3">💳</div>
                <h3 className="font-semibold text-gray-900">Payment Processors</h3>
                <p className="text-gray-600 text-sm">Secure payment processing</p>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Policy Updates</h3>
            <p className="text-yellow-700">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated revision date. We recommend checking this page periodically for the latest information.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
            <p className="text-xl mb-6">Contact us if you have any questions about our use of cookies</p>
            <div className="space-x-4">
              <a
                href="mailto:cookies@autoria.com"
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Email Our Team
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

export default CookiePolicy