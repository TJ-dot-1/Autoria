import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import Title from '../components/Title'
import CarCard from './CarCard'
import { carsAPI } from '../utils/api'

const Cars = () => {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState('featured')
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCars = async () => {
    try {
      setLoading(true)
      
      // Build API parameters
      const params = {
        limit: 50, // Get more cars for client-side sorting
        ...(searchQuery && { search: searchQuery }),
        ...(sortBy === 'price-low' && { sort: 'price', order: 'asc' }),
        ...(sortBy === 'price-high' && { sort: 'price', order: 'desc' }),
        ...(sortBy === 'year-new' && { sort: 'year', order: 'desc' }),
        ...(sortBy === 'year-old' && { sort: 'year', order: 'asc' })
      }
      
      const response = await carsAPI.getAll(params)
      setCars(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch cars')
      console.error('Fetch cars error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchCars()
  }, [])

  // Fetch cars when search query or sort changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCars()
    }, 300) // Debounce search input

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, sortBy])

  // Remove client-side filtering since we're doing it server-side now
  const sortedCars = cars

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const cardVariants = {
    hidden: {
      y: 60,
      opacity: 0,
      scale: 0.9
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

  const filterVariants = {
    inactive: {
      scale: 1,
      backgroundColor: "#f3f4f6",
      color: "#374151"
    },
    active: {
      scale: 1.05,
      backgroundColor: "var(--color-primary)",
      color: "white"
    },
    hover: {
      scale: 1.02,
      backgroundColor: "#e5e7eb",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryClick = (category) => {
    setSearchQuery(category === 'All' ? '' : category)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Loading cars...</p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 md:py-8">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Title
            title="Available Cars"
            subtitle="Browse Our Premium Collection of Luxury and Economy Vehicles"
            className="px-4"
          />
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          className="rounded-2xl shadow-sm p-6 mb-8"
          style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className="flex flex-col lg:flex-row gap-6 items-center justify-between"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Search Bar */}
            <motion.div
              className="flex-1 w-full max-w-2xl"
              variants={itemVariants}
            >
              <div className="relative">
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </motion.div>
                <motion.input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by model, make, or features (e.g., SUV, GPS, Bluetooth)"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }}
                />
                {searchQuery && (
                  <motion.button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Sort Dropdown */}
            <motion.div
              className="w-full lg:w-auto"
              variants={itemVariants}
            >
              <motion.select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full lg:w-48 px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white appearance-none cursor-pointer"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest First</option>
                <option value="year-old">Year: Oldest First</option>
              </motion.select>
            </motion.div>
          </motion.div>

          {/* Results Count and Quick Filters */}
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="flex items-center space-x-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
                variants={itemVariants}
              >
                Showing <motion.span
                  className="text-primary font-bold inline-block"
                  animate={{
                    scale: [1, 1.1, 1],
                    color: ["#374151", "var(--color-primary)", "#374151"]
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {sortedCars.length}
                </motion.span>
                {sortedCars.length === 1 ? ' Car' : ' Cars'}
                {searchQuery && (
                  <motion.span
                    className="text-gray-500 ml-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    for "<span className="font-medium">{searchQuery}</span>"
                  </motion.span>
                )}
              </motion.p>
            </motion.div>

            {/* Quick Category Filters */}
            <motion.div
              className="flex flex-wrap gap-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {['All', 'SUV', 'Sedan', 'Luxury', 'Electric', 'Sports'].map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="px-4 py-2 rounded-lg text-sm font-medium relative overflow-hidden"
                  variants={filterVariants}
                  initial="inactive"
                  animate={
                    (category === 'All' && !searchQuery) ||
                    (category !== 'All' && searchQuery.toLowerCase() === category.toLowerCase())
                      ? "active"
                      : "inactive"
                  }
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                >
                  {category}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                    whileHover={{
                      opacity: [0, 0.2, 0],
                      x: ["-100%", "100%"]
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

        </motion.div>

        {/* Cars Grid */}
        {sortedCars.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {sortedCars.map((car, index) => (
              <motion.div
                key={car._id || car.id}
                variants={cardVariants}
                custom={index}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            className="text-center py-16 rounded-2xl shadow-sm"
            style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <motion.svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
            </motion.div>
            <motion.h3
              className="text-2xl font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No Cars Found
            </motion.h3>
            <motion.p
              className="max-w-md mx-auto mb-6"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {searchQuery 
                ? `We couldn't find any cars matching "${searchQuery}". Try adjusting your search terms or browse different categories.`
                : "We couldn't find any cars at the moment. Please check back later."
              }
            </motion.p>
            {searchQuery && (
              <motion.button
                onClick={clearSearch}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold relative overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="relative z-10">Clear Search</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  whileHover={{
                    opacity: [0, 0.3, 0],
                    x: ["-100%", "100%"]
                  }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Load More Button (if needed) */}
        {sortedCars.length > 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl relative overflow-hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="relative z-10">Load More Cars</span>
              <motion.svg
                className="w-5 h-5 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{
                  y: [0, 2, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
              <motion.div
                className="absolute inset-0 bg-primary"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Cars