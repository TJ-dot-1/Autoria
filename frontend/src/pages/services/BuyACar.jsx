import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const BuyACar = () => {
  const steps = [
    { step: '01', title: 'Browse Listings', description: 'Search our extensive inventory of verified vehicles. Filter by make, model, year, price, and more.' },
    { step: '02', title: 'Compare & Shortlist', description: 'Compare vehicles side by side and save your favorites. Check detailed specs and photos.' },
    { step: '03', title: 'Schedule a Viewing', description: 'Arrange a test drive or in-person viewing with the seller at your convenience.' },
    { step: '04', title: 'Complete Purchase', description: 'Finalize the deal with secure payment processing and transfer of ownership documentation.' },
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
          <span className="text-5xl mb-4 block">🚗</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Buy a Car</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Find your perfect vehicle from thousands of verified listings across Kenya.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] flex items-start gap-6"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <div className="text-3xl font-bold text-primary/20">{item.step}</div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)]">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/cars"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Browse Cars Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default BuyACar
