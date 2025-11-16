import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Banner = () => {
  const [showRequirementsModal, setShowRequirementsModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const imageVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const gradientVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <>
      <motion.div
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden mx-4 my-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 py-8 px-6">
          {/* Text Content */}
          <motion.div
            className="lg:col-span-2 text-center lg:text-left space-y-4 z-10"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center px-3 py-1 bg-primary/20 rounded-full mb-2"
              variants={badgeVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="text-primary font-semibold text-xs"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🚗 For Car Owners
              </motion.span>
            </motion.div>
            
            <motion.h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight"
              variants={itemVariants}
            >
              Do You Own a{' '}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_100%]"
                variants={gradientVariants}
                animate="animate"
                style={{ backgroundSize: '200% 100%' }}
              >
                Luxury Car?
              </motion.span>
            </motion.h2>
            
            <motion.p
              className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm"
              variants={itemVariants}
            >
              Turn your luxury vehicle into a source of passive income. Join thousands of car owners who are earning extra income by renting out their vehicles.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-3 pt-2"
              variants={containerVariants}
            >
              {[
                { value: "$1,200+", label: "Avg. Monthly", icon: "💰" },
                { value: "4.8★", label: "Owner Rating", icon: "⭐" },
                { value: "24/7", label: "Support", icon: "🛡️" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center lg:text-left"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2
                  }}
                >
                  <motion.div
                    className="text-lg font-bold text-white flex items-center gap-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.8 + index * 0.1, 
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <span>{stat.icon}</span>
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-4"
              variants={itemVariants}
            >
              <motion.button
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg text-sm flex items-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => window.location.href = 'mailto:josiejosiah89@gmail.con'}
              >
                <span>List Your Car Now</span>
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
              <motion.button
                className="border border-white/50 text-white px-6 py-3 rounded-xl font-semibold text-sm backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "white"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => setShowRequirementsModal(true)}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4"
              variants={containerVariants}
            >
              {[
                { text: "Fully Insured", icon: "📄" },
                { text: "Secure Payments", icon: "🔒" },
                { text: "Verified Renters", icon: "✅" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-1 bg-white/5 rounded-lg px-2 py-1"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span className="text-gray-400 text-xs">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            className="lg:col-span-3 relative z-10"
            variants={imageVariants}
          >
            <motion.div
              className="relative"
              variants={pulseVariants}
              animate={isMobile ? undefined : "animate"}
              style={{ transform: 'translateZ(0)' }}
            >
              <img
                src={'/banner_car_image.png'}
                alt="Luxury Car for Rent"
                className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
              />
              
              {/* Animated Floating Elements */}
              <motion.div
                className="absolute -top-3 -right-3 w-16 h-16 bg-primary/30 rounded-full blur-xl"
                variants={floatingVariants}
                animate={isMobile ? undefined : "animate"}
                style={{ transform: 'translateZ(0)' }}
              />
              <motion.div
                className="absolute -bottom-3 -left-3 w-20 h-20 bg-blue-500/30 rounded-full blur-xl"
                variants={floatingVariants}
                animate={isMobile ? undefined : "animate"}
                transition={{ delay: 1.5 }}
                style={{ transform: 'translateZ(0)' }}
              />
              
              {/* Feature Badges */}
              <motion.div
                className="absolute top-3 left-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg"
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                style={{ transform: 'translateZ(0)' }}
              >
                <motion.div
                  className="text-white text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-lg font-bold">85%</div>
                  <div className="text-xs text-gray-300 mt-1">Utilization</div>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-4 right-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg"
                initial={{ scale: 0, opacity: 0, rotate: 10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: -2 }}
                style={{ transform: 'translateZ(0)' }}
              >
                <motion.div
                  className="text-white text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="text-lg font-bold">$50K+</div>
                  <div className="text-xs text-gray-300 mt-1">Total Earned</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Pattern with Animation */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
        animate={isMobile ? {} : {
          x: ["-100%", "200%", "-100%"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translateZ(0)' }}
      />
    </motion.div>

    {/* Requirements Modal */}
    {showRequirementsModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Car Listing Requirements</h3>
              <button
                onClick={() => setShowRequirementsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="text-sm text-gray-600 mb-4">
                To list your car on our platform, please ensure your vehicle meets the following requirements:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Car must be manufactured in 2000 or later</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Valid registration and current insurance coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Clean title with no outstanding liens or encumbrances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Well-maintained with no major mechanical issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Located within our service areas (major cities)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Owner must be 21 years or older</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Valid driver's license</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Willing to provide vehicle history and maintenance records</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Contact us if you have questions about these requirements or need assistance with the listing process.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </>
  )
}

export default Banner