import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiSliders, FiCalendar, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const BuyACar = () => {
  const steps = [
    { 
      step: '01', 
      title: 'Browse Verified Listings', 
      description: 'Search our curated inventory of verified premium vehicles. Filter easily by make, body type, fuel type, transmission, and location.' 
    },
    { 
      step: '02', 
      title: 'Compare & Save Favorites', 
      description: 'Review full technical specs, transparent pricing, and high-resolution gallery images. Save vehicles to your garage for comparison.' 
    },
    { 
      step: '03', 
      title: 'Schedule a Viewing or Test Drive', 
      description: 'Arrange an in-person viewing or direct dealership consultation at your convenience with complete vehicle paperwork.' 
    },
    { 
      step: '04', 
      title: 'Finalize Your Purchase Seamlessly', 
      description: 'Complete the deal with flexible financing options, verified title transfer, and total peace of mind guarantee.' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#061426] text-[#F5F8FF] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2684FF]/10 text-[#6BCBFF] text-xs font-semibold border border-[#2684FF]/30 mb-4">
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>Buyer's Guide</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            How to Buy a Car on <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6BCBFF] to-[#2684FF]">Autoria</span>
          </h1>
          <p className="text-base text-[#A8B7CC] max-w-xl mx-auto">
            A frictionless, transparent car-buying journey designed for maximum confidence.
          </p>
        </motion.div>

        <div className="space-y-4 mb-12">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] flex items-start gap-5 shadow-lg hover:border-[#6BCBFF]/40 transition-all"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="text-2xl font-black text-[#6BCBFF] opacity-60 flex-shrink-0 pt-0.5">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#A8B7CC] leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_25px_rgba(38,132,255,0.5)] transform hover:-translate-y-0.5 transition-all"
          >
            <span>Browse Inventory Now</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyACar;
