import React from 'react'
import Title from '../components/Title'

const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Careers" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-600">Build your career with the leading car rental company</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Work With Us?</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Competitive salary and benefits
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Professional development opportunities
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Flexible work arrangements
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Innovative and dynamic work environment
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Culture</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Customer-first mindset
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Collaborative team environment
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Continuous learning and growth
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Work-life balance
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Open Positions</h3>
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h4 className="text-xl font-semibold text-gray-900">Senior Software Engineer</h4>
                <p className="text-gray-600 mb-2">Technology • Full-time • Remote</p>
                <p className="text-gray-700">Join our engineering team to build next-generation car rental solutions.</p>
              </div>
              <div className="border-l-4 border-primary pl-6">
                <h4 className="text-xl font-semibold text-gray-900">Customer Service Manager</h4>
                <p className="text-gray-600 mb-2">Operations • Full-time • Multiple Locations</p>
                <p className="text-gray-700">Lead our customer service teams to deliver exceptional experiences.</p>
              </div>
              <div className="border-l-4 border-primary pl-6">
                <h4 className="text-xl font-semibold text-gray-900">Marketing Specialist</h4>
                <p className="text-gray-600 mb-2">Marketing • Full-time • Hybrid</p>
                <p className="text-gray-700">Drive our marketing initiatives and brand awareness campaigns.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Join Us?</h3>
            <p className="text-gray-600 mb-6">Send your resume and cover letter to careers@autoria.com</p>
            <a 
              href="mailto:careers@autoria.com?subject=Job Application"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Careers