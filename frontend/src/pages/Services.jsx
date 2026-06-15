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
      title: "Buy a Car",
      description: "Browse our curated selection of quality vehicles. From economy cars to luxury SUVs, find your perfect match with detailed listings and verified sellers.",
      path: "/services/buy-a-car",
      icon: "🚗",
      features: ["Verified Listings", "Detailed Specs", "Price Comparisons", "Test Drive Scheduling"]
    },
    {
      title: "Sell Your Car",
      description: "List your vehicle and reach thousands of verified buyers across Kenya. Get the best price with our market valuation tools and seller support.",
      path: "/services/sell-your-car",
      icon: "💰",
      features: ["Free Listings", "Market Valuation", "Buyer Verification", "Seller Dashboard"]
    },
    {
      title: "Car Financing",
      description: "Flexible payment plans and loan options to help you drive your dream car. Partner with leading banks for competitive rates.",
      path: "/services/car-financing",
      icon: "🏦",
      features: ["Low Interest Rates", "Flexible Terms", "Quick Approval", "Multiple Lenders"]
    },
    {
      title: "Vehicle Inspection",
      description: "Professional pre-purchase inspection services to give you complete peace of mind. Our certified mechanics check everything.",
      path: "/services/vehicle-inspection",
      icon: "🔍",
      features: ["200+ Point Check", "Certified Mechanics", "Detailed Report", "Warranty Options"]
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
            Everything you need to buy or sell a car with confidence. From financing to inspections,
            we've got you covered every step of the way.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Car?</h2>
            <p className="text-xl mb-6 opacity-90">
              Browse thousands of cars from verified sellers, or list yours to reach buyers across Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cars"
                className="inline-flex items-center px-8 py-4 bg-[var(--bg-primary)] text-primary font-semibold rounded-xl hover:bg-[var(--bg-secondary)] transition-colors duration-300 border border-[var(--border-color)]"
              >
                Browse Cars
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors duration-300 border border-white/30"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Services