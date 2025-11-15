import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: 60,
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: {
      y: 30,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const services = [
    {
      title: "Car Rental",
      description: "Flexible short-term car rental solutions for personal and business use. Choose from our wide range of vehicles.",
      path: "/services/car-rental",
      icon: "🚗",
      features: ["Daily/Weekly Rates", "Flexible Pick-up", "24/7 Support", "Insurance Included"]
    },
    {
      title: "Long Term Lease",
      description: "Cost-effective long-term leasing options for extended periods. Perfect for businesses and long-term needs.",
      path: "/services/long-term-lease",
      icon: "📅",
      features: ["Monthly Plans", "Maintenance Included", "Flexible Terms", "Business Discounts"]
    },
    {
      title: "Business Rental",
      description: "Specialized rental solutions for corporate clients. Fleet management and dedicated account management.",
      path: "/services/business-rental",
      icon: "🏢",
      features: ["Corporate Rates", "Fleet Solutions", "Dedicated Support", "Invoice Billing"]
    },
    {
      title: "Airport Transfer",
      description: "Reliable airport transfer services to and from major airports. Punctual, safe, and comfortable rides.",
      path: "/services/airport-transfer",
      icon: "✈️",
      features: ["Flight Tracking", "Meet & Greet", "Comfortable Vehicles", "On-time Guarantee"]
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-[var(--bg-secondary)] py-8 md:py-16 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto px-4">
            Discover our comprehensive range of automotive services designed to meet your transportation needs.
            From short-term rentals to long-term leasing, we have the perfect solution for you.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[var(--bg-primary)] rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-[var(--border-color)]"
            >
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{service.icon}</span>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">{service.title}</h3>
              </div>

              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="mb-6">
                <h4 className="font-semibold text-[var(--text-primary)] mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-[var(--text-secondary)]">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={service.path}
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors duration-300"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6 opacity-90">
              Contact our team to discuss your specific requirements and find the perfect service for you.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-[var(--bg-primary)] text-primary font-semibold rounded-xl hover:bg-[var(--bg-secondary)] transition-colors duration-300 border border-[var(--border-color)]"
            >
              Contact Us Today
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Services