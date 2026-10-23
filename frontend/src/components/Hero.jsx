import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/cars?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/cars');
    }
  };

  return (
    <section className="relative pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden bg-[#061426]">
      {/* Background ambient light radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#2684FF]/20 via-[#6BCBFF]/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#2684FF]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Refined Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1D33]/80 border border-[#2684FF]/35 shadow-[0_0_15px_rgba(38,132,255,0.2)] mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#6BCBFF] animate-pulse shadow-[0_0_8px_#6BCBFF]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6BCBFF]">
              Next-Gen Automotive Marketplace
            </span>
          </motion.div>

          {/* Cinematic Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6"
          >
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6BCBFF] via-[#2684FF] to-[#6BCBFF]">Perfect Drive.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#A8B7CC] max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Discover, compare, and explore verified luxury sedans, electric sports cars, and SUVs from trusted dealers across the country.
          </motion.p>

          {/* Embedded Quick Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto mb-8"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center p-1.5 rounded-full bg-[#0B1D33]/90 border border-[rgba(107,203,255,0.25)] shadow-[0_10px_35px_-5px_rgba(0,0,0,0.6),0_0_20px_rgba(38,132,255,0.25)] backdrop-blur-xl focus-within:border-[#2684FF] focus-within:shadow-[0_0_30px_rgba(38,132,255,0.4)] transition-all duration-300"
            >
              <div className="pl-4 text-[#6BCBFF]">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by make, model (e.g. Tesla, BMW, Audi)..."
                className="w-full bg-transparent border-0 px-3 py-2.5 text-sm sm:text-base text-white placeholder-[#A8B7CC]/60 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1B63E0] shadow-[0_0_15px_rgba(38,132,255,0.5)] transition-all duration-300"
              >
                <span>Search</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1B63E0] shadow-[0_0_25px_rgba(38,132,255,0.45)] hover:shadow-[0_0_35px_rgba(38,132,255,0.65)] transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Explore All Cars</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services/sell-your-car"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-[#F5F8FF] bg-[#0B1D33]/80 hover:bg-[#2684FF]/15 border border-[rgba(107,203,255,0.3)] hover:border-[#6BCBFF] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>List Your Car</span>
            </Link>
          </motion.div>
        </div>

        {/* Cinematic Hero Car Imagery Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-5xl mx-auto mt-2"
        >
          {/* Glowing pedestal backdrop ring */}
          <div className="absolute inset-x-8 bottom-0 h-28 bg-gradient-to-t from-[#2684FF]/30 to-transparent blur-3xl pointer-events-none rounded-full" />
          
          <div className="relative rounded-3xl overflow-hidden border border-[rgba(107,203,255,0.22)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(38,132,255,0.2)] group">
            <img
              src="/hero_sports_car.jpg"
              alt="Autoria High-Performance Electric Sports Car"
              className="w-full h-[280px] sm:h-[400px] md:h-[500px] object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700"
            />
            {/* Dark gradient overlay for bottom integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061426] via-[#061426]/20 to-transparent" />
            
            {/* Interactive floating badges inside hero car image */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div className="px-4 py-2 rounded-2xl bg-[#061426]/80 backdrop-blur-md border border-[rgba(107,203,255,0.2)]">
                <span className="text-xs text-[#A8B7CC]">Showcase Model</span>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6BCBFF] shadow-[0_0_6px_#6BCBFF]" />
                  HyperDrive GT Electric AWD
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#061426]/80 backdrop-blur-md border border-[rgba(107,203,255,0.2)]">
                <div>
                  <span className="text-[10px] text-[#A8B7CC] uppercase block">Top Speed</span>
                  <span className="text-xs font-bold text-[#6BCBFF]">280 km/h</span>
                </div>
                <div className="w-px h-6 bg-[rgba(107,203,255,0.2)]" />
                <div>
                  <span className="text-[10px] text-[#A8B7CC] uppercase block">0-100 km/h</span>
                  <span className="text-xs font-bold text-[#6BCBFF]">3.2s</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;