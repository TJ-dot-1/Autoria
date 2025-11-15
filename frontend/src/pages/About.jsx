import React from 'react'
import { motion } from 'framer-motion'

const About = () => {
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

  const stats = [
    { value: "10,000+", label: "Happy Customers" },
    { value: "5,000+", label: "Cars Available" },
    { value: "50+", label: "Locations" },
    { value: "24/7", label: "Customer Support" }
  ];

  const values = [
    {
      title: "Quality First",
      description: "We maintain the highest standards in our vehicle fleet and service quality.",
      icon: "⭐"
    },
    {
      title: "Customer Centric",
      description: "Your satisfaction is our priority. We go above and beyond to meet your needs.",
      icon: "👥"
    },
    {
      title: "Innovation",
      description: "We continuously improve our services using the latest technology and best practices.",
      icon: "🚀"
    },
    {
      title: "Sustainability",
      description: "We're committed to environmentally friendly practices and sustainable transportation.",
      icon: "🌱"
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-[var(--bg-secondary)] py-16 px-4"
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
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            About Autoria
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Revolutionizing car rental with technology, trust, and exceptional customer service.
            Your journey begins with us.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          className="bg-[var(--bg-primary)] rounded-2xl shadow-lg p-8 mb-16 border border-[var(--border-color)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Our Story</h2>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  Founded in 2020, Autoria emerged from a simple idea: make car rental as easy and accessible
                  as booking a hotel room. We recognized the frustrations of traditional car rental processes
                  and set out to create a seamless, technology-driven experience.
                </p>
                <p>
                  Today, we're proud to serve thousands of customers across multiple locations, offering
                  a diverse fleet of vehicles from economy cars to luxury SUVs. Our commitment to innovation
                  and customer satisfaction has made us a trusted name in the automotive rental industry.
                </p>
                <p>
                  We're not just in the business of renting cars – we're in the business of creating
                  memorable journeys and building lasting relationships with our customers.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="aspect-square bg-white rounded-2xl flex items-center justify-center p-8">
                <img
                  src="/auto.png"
                  alt="Autoria Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[var(--bg-primary)] rounded-xl shadow-md p-6 text-center border border-[var(--border-color)]"
            >
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-[var(--text-secondary)] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-[var(--text-primary)]"
            variants={titleVariants}
          >
            Our Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[var(--bg-primary)] rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-[var(--border-color)]"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{value.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white text-center"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            To democratize access to quality transportation by providing exceptional car rental services
            that combine cutting-edge technology with personalized customer care, making every journey
            memorable and hassle-free.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default About