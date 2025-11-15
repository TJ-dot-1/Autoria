import React from 'react'
import Title from '../../components/Title'

const LegalNotice = () => {
  const companyInfo = {
    name: "Autoria Kenya Limited",
    registration: "Kenya Companies Act",
    taxId: "KRA PIN: A123456789B",
    address: "Westlands Business District\nWestlands, Nairobi 00800\nKenya",
    phone: "+254706667129",
    email: "josiejosiah89@gmail.com"
  }

  const intellectualProperty = [
    "The Autoria name, logo, and all related marks are trademarks of Autoria LLC",
    "All content on this website, including text, graphics, logos, and images, is the property of Autoria LLC",
    "Software, code, and algorithms used in our services are proprietary and confidential",
    "Unauthorized use, reproduction, or distribution of our intellectual property is prohibited"
  ]

  const disclaimers = [
    "Information on this website is provided on an 'as is' basis",
    "We make no warranties about the accuracy, reliability, or completeness of information",
    "Use of this website and our services is at your own risk",
    "We are not liable for any direct, indirect, incidental, or consequential damages"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Legal Notice" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Notice</h1>
            <p className="text-lg text-gray-600">Last updated: November 13, 2024</p>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Corporate Details</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Legal Name:</strong> {companyInfo.name}</p>
                  <p><strong>Registration:</strong> {companyInfo.registration}</p>
                  <p><strong>{companyInfo.taxId}</strong></p>
                  <p><strong>Incorporation Date:</strong> January 15, 2020</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="whitespace-pre-line"><strong>Address:</strong><br />{companyInfo.address}</p>
                  <p><strong>Phone:</strong> {companyInfo.phone}</p>
                  <p><strong>Email:</strong> {companyInfo.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              All intellectual property rights in the website, mobile applications, and services 
              are owned by Autoria LLC or its licensors.
            </p>
            <div className="space-y-4">
              {intellectualProperty.map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-primary mr-3 mt-1">©</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Prohibited Activities</h2>
            <p className="text-gray-600 mb-6">
              Users are prohibited from the following activities:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Violations</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Attempting to hack or disrupt our systems
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Reverse engineering our software
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Introducing viruses or malware
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Bypassing security measures
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Violations</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Using false or misleading information
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Violating any applicable laws
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Harassing other users or staff
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Fraudulent or criminal activities
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimers and Limitations</h2>
            <div className="space-y-4">
              {disclaimers.map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-yellow-500 mr-3 mt-1">⚠</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> This legal notice is provided for informational purposes only 
                and does not constitute legal advice. Please consult with legal counsel for specific questions 
                regarding your rights and obligations.
              </p>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law and Jurisdiction</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                This legal notice and any disputes arising from it shall be governed by and construed
                in accordance with the laws of the Republic of Kenya.
              </p>
              <p>
                Any legal action or proceeding arising under this notice shall be brought exclusively
                in the courts of Kenya located in Nairobi County, Nairobi.
              </p>
              <p>
                You consent to the personal jurisdiction of such courts and waive any objection to
                venue in such courts.
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Updates</h3>
            <p className="text-gray-600">
              Autoria LLC reserves the right to modify this legal notice at any time. Changes will be 
              effective immediately upon posting to this website. It is your responsibility to review 
              this notice periodically for any updates.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Legal Questions?</h2>
            <p className="text-xl mb-6">Contact our legal department for any questions or concerns</p>
            <div className="space-x-4">
              <a
                href={`mailto:${companyInfo.email}`}
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Email Legal Department
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

export default LegalNotice