import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Banner from '../components/Banner';
import CarCard from './CarCard';
import { scrollToTopWithRetry } from '../utils/scrollToTop';
import { carsAPI } from '../utils/api';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiShield, 
  FiTruck, 
  FiAward, 
  FiClock,
  FiZap
} from 'react-icons/fi';
import { 
  SiTesla, 
  SiBmw, 
  SiMercedes, 
  SiAudi, 
  SiToyota, 
  SiFord, 
  SiHonda 
} from 'react-icons/si';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carsAPI.getAll({ limit: 8 });
      setFeaturedCars(response.data || []);
    } catch (err) {
      console.error('Failed to fetch featured cars:', err);
      setError('Failed to load featured cars');
    } finally {
      setLoading(false);
    }
  };

  // Popular Categories matching AutoHub Reference
  const categories = [
    { name: 'All', count: 'All Cars', icon: '⚡' },
    { name: 'SUV', count: 'Compact & Luxury', icon: '🚙' },
    { name: 'Sedan', count: 'Executive & City', icon: '🚗' },
    { name: 'Electric', count: 'Clean Performance', icon: '🔋' },
    { name: 'Coupe', count: 'Sports & Touring', icon: '🏎️' },
    { name: 'Hatchback', count: 'Urban & Agile', icon: '🚘' },
  ];

  // Featured Brands
  const featuredBrands = [
    { name: 'Tesla', icon: SiTesla, query: 'Tesla' },
    { name: 'BMW', icon: SiBmw, query: 'BMW' },
    { name: 'Mercedes', icon: SiMercedes, query: 'Mercedes' },
    { name: 'Audi', icon: SiAudi, query: 'Audi' },
    { name: 'Toyota', icon: SiToyota, query: 'Toyota' },
    { name: 'Ford', icon: SiFord, query: 'Ford' },
    { name: 'Honda', icon: SiHonda, query: 'Honda' },
  ];

  // Filter cars if a category is selected
  const displayCars = activeCategory === 'All' 
    ? featuredCars 
    : featuredCars.filter(car => 
        (car.type?.toLowerCase() === activeCategory.toLowerCase()) || 
        (car.category?.toLowerCase().includes(activeCategory.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-[#061426] text-[#F5F8FF]">
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Popular Categories Section (AutoHub Panel 2 Style) */}
      <section className="py-10 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6BCBFF] shadow-[0_0_8px_#6BCBFF]" />
              Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#A8B7CC] mt-0.5">
              Browse vehicle inventory tailored to your driving lifestyle
            </p>
          </div>
          <Link
            to="/cars"
            className="text-xs sm:text-sm font-semibold text-[#6BCBFF] hover:text-white flex items-center gap-1 group transition-colors"
          >
            <span>View All</span>
            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills Slider / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-300 ${
                  isActive
                    ? 'bg-[#2684FF]/20 border-[#6BCBFF] shadow-[0_0_20px_rgba(38,132,255,0.35)]'
                    : 'bg-[#0B1D33]/70 hover:bg-[#0B1D33] border-[rgba(107,203,255,0.14)] hover:border-[#6BCBFF]/40 shadow-[0_4px_15px_rgba(0,0,0,0.3)]'
                }`}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className={`text-sm font-bold ${isActive ? 'text-[#6BCBFF]' : 'text-white'}`}>
                  {cat.name}
                </div>
                <div className="text-[11px] text-[#A8B7CC] truncate mt-0.5">
                  {cat.count}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Brands Bar (AutoHub Panel 2 Style) */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#A8B7CC]">
            Featured Brands
          </h2>
          <Link
            to="/cars"
            className="text-xs font-semibold text-[#6BCBFF] hover:underline"
          >
            View All Brands &gt;
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {featuredBrands.map((brand) => {
            const Icon = brand.icon;
            return (
              <Link
                key={brand.name}
                to={`/cars?q=${encodeURIComponent(brand.query)}`}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#0B1D33]/60 hover:bg-[#0B1D33] border border-[rgba(107,203,255,0.12)] hover:border-[#6BCBFF]/50 shadow-md hover:shadow-[0_0_15px_rgba(38,132,255,0.25)] group transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-[#A8B7CC] group-hover:text-[#6BCBFF] group-hover:scale-110 transition-all duration-300" />
                <span className="text-xs font-medium text-[#A8B7CC] group-hover:text-white mt-2 transition-colors">
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Banner Spotlight */}
      <Banner />

      {/* 5. Featured Vehicles Section */}
      <section className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2684FF]/10 text-[#6BCBFF] text-xs font-semibold border border-[#2684FF]/30 mb-2">
              <FiZap className="w-3.5 h-3.5" />
              <span>Real Marketplace Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Featured Vehicles
            </h2>
            <p className="text-sm text-[#A8B7CC] mt-1">
              Top curated listings available for immediate inquiry and purchase
            </p>
          </div>

          <Link
            to="/cars"
            onClick={() => scrollToTopWithRetry(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#6BCBFF] bg-[#0B1D33] hover:bg-[#2684FF]/20 border border-[rgba(107,203,255,0.25)] hover:border-[#6BCBFF] shadow transition-all duration-300 self-start sm:self-auto"
          >
            <span>View All Cars</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Loading / Error / Cars Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div 
                key={n} 
                className="h-80 rounded-2xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.1)] animate-pulse flex flex-col justify-between p-4"
              >
                <div className="h-44 rounded-xl bg-white/5" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center rounded-2xl bg-[#0B1D33]/80 border border-red-500/30 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3">
              <FiZap className="w-6 h-6" />
            </div>
            <p className="text-white font-semibold mb-1">{error}</p>
            <p className="text-xs text-[#A8B7CC] mb-4">
              The service is connecting to the cloud database. If this persists, please ensure MongoDB Atlas allows connection from anywhere (0.0.0.0/0).
            </p>
            <button
              onClick={fetchFeaturedCars}
              className="px-5 py-2.5 bg-[#2684FF] hover:bg-[#1B6AD5] text-white text-xs font-semibold rounded-full shadow transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : displayCars.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.15)]">
            <p className="text-[#A8B7CC] text-base mb-4">No vehicles found in this category.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="px-5 py-2.5 rounded-full bg-[#2684FF] text-white text-xs font-semibold"
            >
              Show All Vehicles
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </motion.div>
        )}
      </section>

      {/* 6. Trust & Platform Advantages */}
      <section className="py-12 px-4 border-t border-[rgba(107,203,255,0.1)] bg-[#040E1B]/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0B1D33]/50 border border-[rgba(107,203,255,0.12)]">
              <div className="w-10 h-10 rounded-xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center mb-4 border border-[#2684FF]/30">
                <FiShield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">100% Inspected</h3>
              <p className="text-xs text-[#A8B7CC] leading-relaxed">
                Every vehicle undergoes a thorough multi-point mechanical inspection before listing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1D33]/50 border border-[rgba(107,203,255,0.12)]">
              <div className="w-10 h-10 rounded-xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center mb-4 border border-[#2684FF]/30">
                <FiAward className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Certified Dealers</h3>
              <p className="text-xs text-[#A8B7CC] leading-relaxed">
                Verified automotive dealers and vetted private sellers with genuine paperwork.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1D33]/50 border border-[rgba(107,203,255,0.12)]">
              <div className="w-10 h-10 rounded-xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center mb-4 border border-[#2684FF]/30">
                <FiClock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Instant Test Drives</h3>
              <p className="text-xs text-[#A8B7CC] leading-relaxed">
                Seamless booking and direct inquiries with vehicle owners without hidden broker fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1D33]/50 border border-[rgba(107,203,255,0.12)]">
              <div className="w-10 h-10 rounded-xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center mb-4 border border-[#2684FF]/30">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Financing Assistance</h3>
              <p className="text-xs text-[#A8B7CC] leading-relaxed">
                Flexible auto loans, competitive rates, and fast pre-approvals via top banking partners.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;