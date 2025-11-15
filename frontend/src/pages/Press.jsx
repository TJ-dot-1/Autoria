import React from 'react'
import Title from '../components/Title'

const Press = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Press" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Press Center</h1>
            <p className="text-xl text-gray-600">Latest news and media resources</p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Media Contact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
                <p className="text-gray-600 mb-2">Director of Communications</p>
                <p className="text-gray-600 mb-1">📧 press@autoria.com</p>
                <p className="text-gray-600">📞 +1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Media Kit</h3>
                <p className="text-gray-600 mb-4">Download our logos, brand guidelines, and product images</p>
                <a 
                  href="/media-kit.zip"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
                >
                  Download Media Kit
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Latest Press Releases</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <div className="text-sm text-gray-500 mb-1">November 12, 2024</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Autoria Expands to 50 New Cities Across East Africa
                </h3>
                <p className="text-gray-700">
                  The leading car rental company announces major expansion, bringing their innovative 
                  rental services to millions of new customers.
                </p>
                <a href="#" className="text-primary hover:underline font-semibold">Read more →</a>
              </div>
              
              <div className="border-l-4 border-primary pl-6">
                <div className="text-sm text-gray-500 mb-1">October 28, 2024</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Autoria Launches Electric Vehicle Fleet Program
                </h3>
                <p className="text-gray-700">
                  New initiative aims to reduce carbon emissions by 40% with a fleet of 
                  500+ electric vehicles across major metropolitan areas.
                </p>
                <a href="#" className="text-primary hover:underline font-semibold">Read more →</a>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <div className="text-sm text-gray-500 mb-1">October 15, 2024</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Autoria Reports Record Quarterly Growth
                </h3>
                <p className="text-gray-700">
                  Company achieves 25% year-over-year growth with customer satisfaction 
                  ratings reaching all-time high of 96%.
                </p>
                <a href="#" className="text-primary hover:underline font-semibold">Read more →</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Company Facts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">Cities Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2M+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Press