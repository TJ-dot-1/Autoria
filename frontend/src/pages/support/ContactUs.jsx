import React, { useState } from 'react'
import Title from '../../components/Title'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you within 24 hours.')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    })
  }

  const contactMethods = [
    {
      icon: "📞",
      title: "Phone",
      content: "+254706667129",
      description: "Available 24/7 for immediate assistance",
      link: "tel:+254706667129"
    },
    {
      icon: "📧",
      title: "Email",
      content: "josiejosiah89@gmail.com",
      description: "We respond within 24 hours",
      link: "mailto:josiejosiah89@gmail.com"
    },
    {
      icon: "💬",
      title: "Live Chat",
      content: "Available on our website",
      description: "Chat with our support team instantly"
    },
    {
      icon: "🌐",
      title: "Social Media",
      content: "@AutoriaKenya",
      description: "Follow us for updates and support"
    }
  ]

  const offices = [
    {
      city: "Nairobi",
      address: "Westlands Business District\nWestlands, Nairobi 00800",
      phone: "+254706667129",
      hours: "Mon-Fri: 8AM-6PM"
    },
    {
      city: "Mombasa",
      address: "Likoni Ferry Road\nMombasa 80100",
      phone: "+254706667129",
      hours: "Mon-Fri: 8AM-6PM"
    },
    {
      city: "Kisumu",
      address: "Central Business District\nKisumu 40100",
      phone: "+254706667129",
      hours: "Mon-Fri: 8AM-6PM"
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Title title="Contact Us" />
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Contact Us</h1>
            <p className="text-xl text-[var(--text-secondary)]">We're here to help with any questions or concerns</p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-[var(--bg-primary)] rounded-lg shadow-lg p-6 text-center border border-[var(--border-color)]">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{method.title}</h3>
                {method.link ? (
                  <a
                    href={method.link}
                    className="text-primary font-semibold mb-2 hover:text-primary-dark transition-colors block"
                  >
                    {method.content}
                  </a>
                ) : (
                  <p className="text-primary font-semibold mb-2">{method.content}</p>
                )}
                <p className="text-[var(--text-secondary)] text-sm">{method.description}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg p-8 border border-[var(--border-color)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Office Information */}
            <div>
              <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg p-8 mb-8 border border-[var(--border-color)]">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Our Offices</h2>
                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index} className="border-l-4 border-primary pl-6">
                      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{office.city}</h3>
                      <p className="text-[var(--text-secondary)] whitespace-pre-line mb-1">{office.address}</p>
                      <a
                        href={`tel:${office.phone}`}
                        className="text-primary font-semibold mb-1 hover:text-primary-dark transition-colors block"
                      >
                        {office.phone}
                      </a>
                      <p className="text-[var(--text-secondary)] opacity-75">{office.hours}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary text-white rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4">Emergency Support</h3>
                <p className="mb-4">For urgent issues during your rental, our 24/7 emergency support is available.</p>
                <div className="space-y-2">
                  <p className="font-semibold">🚗 Roadside Assistance</p>
                  <a
                    href="tel:+254706667129"
                    className="font-semibold hover:text-white/80 transition-colors block"
                  >
                    📱 Text Support: +254706667129
                  </a>
                  <p className="font-semibold">💬 Emergency Chat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs