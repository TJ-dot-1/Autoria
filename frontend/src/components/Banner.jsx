import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiTag, 
  FiHeart, 
  FiLayers, 
  FiPercent, 
  FiTruck 
} from 'react-icons/fi';

const Banner = () => {
  const quickActions = [
    { label: 'New Cars', filter: 'New', icon: FiTruck, path: '/cars?condition=New' },
    { label: 'Used Cars', filter: 'Used', icon: FiTag, path: '/cars?condition=Used' },
    { label: 'Compare', filter: 'compare', icon: FiLayers, path: '/cars' },
    { label: 'Favorites', filter: 'favorites', icon: FiHeart, path: '/my-inquiries' },
    { label: 'Deals', filter: 'deals', icon: FiPercent, path: '/cars?deals=true' },
  ];

  return (
    <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto">
      {/* Quick Action Category Tiles (AutoHub Panel 2 Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              to={action.path}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0B1D33]/70 hover:bg-[#0B1D33] border border-[rgba(107,203,255,0.15)] hover:border-[#6BCBFF]/50 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(38,132,255,0.25)] group transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2684FF]/20 to-[#6BCBFF]/10 border border-[#2684FF]/30 flex items-center justify-center text-[#6BCBFF] group-hover:scale-110 group-hover:text-white group-hover:bg-[#2684FF] transition-all duration-300 shadow-[0_0_10px_rgba(38,132,255,0.2)]">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#F5F8FF] group-hover:text-[#6BCBFF] transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Featured Banner Card: "Discover Your Next Car" */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B1D33] via-[#0D2440] to-[#07192F] border border-[rgba(107,203,255,0.22)] shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(38,132,255,0.15)]"
      >
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#2684FF]/15 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#6BCBFF]/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 sm:p-10 lg:p-12 relative z-10">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2684FF]/15 border border-[#2684FF]/35 text-[#6BCBFF] text-xs font-semibold">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Certified Autoria Showroom</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6BCBFF] to-[#2684FF]">Next Car</span>
            </h2>

            <p className="text-base text-[#A8B7CC] max-w-xl leading-relaxed">
              Explore thousands of verified vehicles from certified dealers near you. Transparent pricing, complete inspection reports, and easy financing options.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1C64E3] shadow-[0_0_25px_rgba(38,132,255,0.5)] transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Explore Inventory</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services/buy-a-car"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-[#F5F8FF] bg-[#061426]/60 hover:bg-[#2684FF]/20 border border-[rgba(107,203,255,0.3)] hover:border-[#6BCBFF] transition-all duration-300"
              >
                <span>Buyer's Guide</span>
              </Link>
            </div>
          </div>

          {/* Right Automotive Photography (Panel 2 Banner Sedan) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(107,203,255,0.2)] shadow-2xl group">
              <img
                src="/banner_sedan.jpg"
                alt="Luxury German Sedan"
                className="w-full h-64 sm:h-72 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061426]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-[#061426]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[rgba(107,203,255,0.2)]">
                <div>
                  <span className="text-[#A8B7CC] text-[10px] block">Special Spotlight</span>
                  <span className="font-bold text-[#6BCBFF]">Audi A8 L Quattro</span>
                </div>
                <span className="font-extrabold text-white text-sm">Certified</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Banner;