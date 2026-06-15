import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Banner from '../components/Banner'
import { Link } from 'react-router-dom'
import CarCard from './CarCard'
import { scrollToTopWithRetry } from '../utils/scrollToTop'
import { carsAPI } from '../utils/api'

const Home = () => {
    const [featuredCars, setFeaturedCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        fetchFeaturedCars()
    }, [])

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const fetchFeaturedCars = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await carsAPI.getAll({ limit: 4 })
            setFeaturedCars(response.data || [])
        } catch (err) {
            console.error('Failed to fetch featured cars:', err)
            setError('Failed to load featured cars')
        } finally {
            setLoading(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: isMobile ? 0.05 : 0.2,
                delayChildren: isMobile ? 0.05 : 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {
            y: isMobile ? 30 : 60,
            opacity: 0,
            scale: isMobile ? 0.9 : 0.8
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: isMobile ? 0.4 : 0.8,
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

    const buttonVariants = {
        initial: {
            scale: 1,
            y: 0
        },
        hover: {
            scale: 1.05,
            y: -2,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.95,
            y: 0,
            transition: {
                duration: 0.1
            }
        }
    };

    return (
        <motion.div
            className="min-h-screen"
            style={{ backgroundColor: 'var(--bg-primary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <Hero />

            {/* Featured Cars Section */}
            <motion.section
                className="py-8 md:py-16 px-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                <div className="container mx-auto">
                    <motion.h2
                        className="text-3xl font-bold text-center mb-12"
                        style={{ color: 'var(--text-primary)' }}
                        variants={titleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Featured Cars for Sale
                    </motion.h2>
                    
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {featuredCars.map((car, index) => (
                            <motion.div
                                key={car._id}
                                variants={itemVariants}
                                custom={index}
                            >
                                <CarCard car={car} isMobile={isMobile} />
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    {/* Explore More Cars Button */}
                    <motion.div
                        className="text-center mt-12"
                        variants={titleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <motion.div
                            variants={buttonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link
                                to="/cars"
                                className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl shadow-lg"
                                onClick={() => scrollToTopWithRetry(true)}
                            >
                                Explore All Cars
                                <motion.svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    animate={{
                                        x: [0, 5, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </motion.svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Banner Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <Banner />
            </motion.div>
        </motion.div>
    )
}

export default Home