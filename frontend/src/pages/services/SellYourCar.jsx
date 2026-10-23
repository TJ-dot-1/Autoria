import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiCamera, 
  FiUsers, 
  FiDollarSign, 
  FiShield, 
  FiTrendingUp, 
  FiHelpCircle,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const SellYourCar = () => {
  const { isAuthenticated } = useAuth();

  const benefits = [
    { icon: FiCamera, title: 'Effortless Listing', description: 'Upload verified photos, define vehicle specs, and go live in front of active buyers.' },
    { icon: FiUsers, title: 'Verified Audience', description: 'Reach thousands of serious car buyers and vetted dealerships looking for inventory.' },
    { icon: FiDollarSign, title: 'Max Market Value', description: 'Our automated market valuation guides help you price for fast and profitable sales.' },
    { icon: FiShield, title: 'Secure Transactions', description: 'Buyer verification and safe communication channels protect you against fraud.' },
    { icon: FiTrendingUp, title: 'Seller Analytics', description: 'Track listing impressions, inquiry rates, and buyer engagement live.' },
    { icon: FiHelpCircle, title: 'Dedicated Support', description: 'Our automotive marketplace specialists are on hand to guide pricing and paperwork.' },
  ];

  return (
    <div className="min-h-screen bg-[#061426] text-[#F5F8FF] pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2684FF]/10 text-[#6BCBFF] text-xs font-semibold border border-[#2684FF]/30 mb-4">
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>Trusted Seller Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Sell Your Car at <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6BCBFF] to-[#2684FF]">Top Value</span>
          </h1>

          <p className="text-base text-[#A8B7CC] leading-relaxed">
            Connect with pre-qualified buyers and verified dealerships across the nation. Fast turnaround, transparent escrow, and zero hidden seller fees.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg hover:border-[#6BCBFF]/40 hover:shadow-[0_0_20px_rgba(38,132,255,0.2)] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2684FF]/25 to-[#6BCBFF]/10 border border-[#2684FF]/40 text-[#6BCBFF] flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(38,132,255,0.3)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-[#A8B7CC] leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0B1D33] via-[#0D2440] to-[#07192F] border border-[rgba(107,203,255,0.22)] shadow-2xl text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white">Ready to list your vehicle?</h2>
          <p className="text-xs text-[#A8B7CC] max-w-md mx-auto">
            Submit your car details now or access your dealer portal to manage active inventory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/admin/add-car" : "/login?mode=register&redirect=/admin/add-car"}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_25px_rgba(38,132,255,0.5)] transform hover:-translate-y-0.5 transition-all"
            >
              <span>{isAuthenticated ? "List Your Car Now" : "Register to List Your Car"}</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login?redirect=/admin/add-car"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold text-[#F5F8FF] bg-[#061426] border border-[rgba(107,203,255,0.25)] hover:border-[#6BCBFF] transition-all"
              >
                <span>Existing Seller Sign-In</span>
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/admin/manage-cars"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold text-[#F5F8FF] bg-[#061426] border border-[rgba(107,203,255,0.25)] hover:border-[#6BCBFF] transition-all"
              >
                <span>View My Fleet</span>
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellYourCar;
