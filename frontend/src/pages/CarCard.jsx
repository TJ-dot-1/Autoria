import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const CarCard = ({ car, cardType = 'rental' }) => {
  // Format price for display
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Price not available'
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  // Format mileage for display
  const formatMileage = (mileage) => {
    if (!mileage) return 'N/A'
    return new Intl.NumberFormat('en-US').format(mileage) + ' miles'
  }

  // Get car image URL or fallback (handles strings, objects, arrays)
  const getCarImage = (car) => {
    const PLACEHOLDER = '/auto.png'
    const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/i, '').replace(/\/$/, '')

    const resolveSrc = (img) => {
      if (!img) return null
      // if it's a string, return it
      if (typeof img === 'string') return img
      // if it's an object (e.g., Cloudinary result), try common fields
      if (typeof img === 'object') {
        return img.url || img.secure_url || img.path || img.filename || img.public_id || null
      }
      return null
    }

    // Prefer images array
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
      const candidate = resolveSrc(car.images[0])
      if (!candidate) return PLACEHOLDER
      return /^https?:\/\//i.test(candidate) ? candidate : `${API_HOST}${candidate.startsWith('/') ? '' : '/'}${candidate}`
    }

    // Fallback to single image field
    if (car.image) {
      const candidate = resolveSrc(car.image)
      if (!candidate) return PLACEHOLDER
      return /^https?:\/\//i.test(candidate) ? candidate : `${API_HOST}${candidate.startsWith('/') ? '' : '/'}${candidate}`
    }

    return PLACEHOLDER
  }

  // Determine card styling based on type
  // Determine card styling based on type
  const getCardStyles = () => {
    if (cardType === 'sale') {
      return {
        badge: 'bg-green-500',
        badgeText: 'For Sale',
        buttonText: 'View Details',
        buttonClass: 'bg-green-600 hover:bg-green-700'
      }
    }
    if (!car.isAvailable) {
      return {
        badge: 'bg-red-500',
        badgeText: 'Booked',
        buttonText: 'Unavailable',
        buttonClass: 'bg-gray-400 cursor-not-allowed'
      }
    }
    return {
      badge: 'bg-blue-500',
      badgeText: 'Available',
      buttonText: 'Book Now',
      buttonClass: 'bg-primary hover:bg-blue-700'
    }
  };  const cardStyles = getCardStyles()

  const cardVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
      variants={cardVariants}
      whileHover="hover"
      initial="hidden"
      animate="visible"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <motion.img
          src={getCarImage(car)}
          alt={`${car.make} ${car.model}`}
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          variants={imageVariants}
          whileHover="hover"
          onError={(e) => {
            e.target.src = '/auto.png'
          }}
        />
        
        {/* Badge */}
        <motion.div
          className="absolute top-4 left-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`${cardStyles.badge} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
            {cardStyles.badgeText}
          </span>
        </motion.div>

        {/* Favorite Button */}
        <motion.button
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Car Title and Year */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {car.year} {car.make} {car.model}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="capitalize">{car.category}</span>
            {car.mileage && (
              <>
                <span className="mx-2">•</span>
                <span>{formatMileage(car.mileage)}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-wrap gap-2">
            {car.features && car.features.map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link
              to={`/cars/${car._id || car.id}`}
              className={`block w-full ${cardStyles.buttonClass} text-white text-center py-3 px-4 rounded-xl font-semibold transition-colors duration-200`}
            >
              {cardStyles.buttonText}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 pointer-events-none"
        whileHover={{
          opacity: 1,
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
  )
}

export default CarCard
