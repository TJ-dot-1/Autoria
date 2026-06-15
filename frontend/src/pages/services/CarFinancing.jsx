import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CarFinancing = () => {
  const plans = [
    { title: 'Standard Loan', rate: 'From 12%', term: '12-60 months', down: '20% min', highlight: false },
    { title: 'Premium Loan', rate: 'From 9.5%', term: '12-72 months', down: '10% min', highlight: true },
    { title: 'Balloon Payment', rate: 'From 11%', term: '24-48 months', down: '15% min', highlight: false },
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
          <span className="text-5xl mb-4 block">🏦</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Car Financing</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Flexible financing options to make your dream car affordable. Partner with Kenya's leading banks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`rounded-xl p-6 border text-center ${
                plan.highlight
                  ? 'bg-primary text-white border-primary shadow-xl scale-105'
                  : 'bg-[var(--bg-primary)] border-[var(--border-color)]'
              }`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              {plan.highlight && <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Most Popular</div>}
              <h3 className={`text-xl font-bold mb-3 ${plan.highlight ? 'text-white' : 'text-[var(--text-primary)]'}`}>{plan.title}</h3>
              <div className={`text-3xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-primary'}`}>{plan.rate}</div>
              <div className={`text-sm mb-4 ${plan.highlight ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>Interest Rate</div>
              <div className={`space-y-2 text-sm ${plan.highlight ? 'text-white/90' : 'text-[var(--text-secondary)]'}`}>
                <p>Term: {plan.term}</p>
                <p>Down Payment: {plan.down}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Apply for Financing
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default CarFinancing
