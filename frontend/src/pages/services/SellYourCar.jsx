import React from 'react'
import { motion } from 'framer-motion'

const SellYourCar = () => {
  const benefits = [
    { icon: '📸', title: 'Easy Listing', description: 'Upload photos, add details, and publish your listing in minutes.' },
    { icon: '👥', title: 'Thousands of Buyers', description: 'Reach verified buyers across Kenya looking for vehicles like yours.' },
    { icon: '💰', title: 'Best Price', description: 'Our market valuation tools help you price your car competitively.' },
    { icon: '🔒', title: 'Secure Process', description: 'Verified buyer identities and secure payment processing for peace of mind.' },
    { icon: '📊', title: 'Seller Dashboard', description: 'Track views, inquiries, and manage your listings from one place.' },
    { icon: '🤝', title: 'Expert Support', description: 'Our team is here to help you every step of the selling process.' },
  ]

  return (
    <motion.div
      className="min-h-screen bg-[var(--bg-secondary)] py-16 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-5xl mb-4 block">💰</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Sell Your Car</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            List your vehicle on Kenya's most trusted car marketplace and get the best price.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = 'mailto:josiejosiah89@gmail.con'}
          >
            Start Selling
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default SellYourCar
