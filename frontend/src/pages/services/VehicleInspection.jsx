import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const VehicleInspection = () => {
  const checks = [
    { category: 'Engine & Mechanical', items: ['Engine performance', 'Transmission', 'Brakes & suspension', 'Steering system', 'Exhaust system'] },
    { category: 'Body & Exterior', items: ['Paint condition', 'Panel alignment', 'Rust inspection', 'Glass & mirrors', 'Tire condition'] },
    { category: 'Interior & Electronics', items: ['Dashboard & gauges', 'AC & heating', 'Infotainment system', 'Seat condition', 'Window operations'] },
    { category: 'Safety & Documents', items: ['Airbag systems', 'Seatbelts', 'Registration validity', 'Service history', 'Accident history check'] },
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
          <span className="text-5xl mb-4 block">🔍</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Vehicle Inspection</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Our certified mechanics perform a comprehensive 200+ point inspection so you buy with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {checks.map((section, index) => (
            <motion.div
              key={index}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{section.category}</h3>
              <ul className="space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm text-[var(--text-secondary)]">
                    <svg className="w-4 h-4 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Book an Inspection
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default VehicleInspection
