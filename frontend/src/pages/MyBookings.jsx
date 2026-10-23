import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFavorites, toggleFavorite } from '../utils/favorites';
import CarCard from './CarCard';
import { 
  FiHeart, 
  FiCalendar, 
  FiArrowRight, 
  FiTrash2, 
  FiCheckCircle, 
  FiClock, 
  FiInbox,
  FiSearch
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const MyBookings = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'inquiries'
  const [favorites, setFavorites] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFavorites();
    const handleUpdate = () => loadFavorites();
    window.addEventListener('autoria_favorites_updated', handleUpdate);
    return () => window.removeEventListener('autoria_favorites_updated', handleUpdate);
  }, []);

  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  const handleRemoveFavorite = (car) => {
    toggleFavorite(car);
    loadFavorites();
  };

  return (
    <div className="min-h-screen bg-[#061426] text-[#F5F8FF] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2684FF]/10 text-[#6BCBFF] text-xs font-semibold border border-[#2684FF]/30 mb-2">
              <FiHeart className="w-3.5 h-3.5 fill-[#6BCBFF]" />
              <span>Personal Garage &amp; Inquiries</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6BCBFF] to-[#2684FF]">Garage</span>
            </h1>
            <p className="text-sm text-[#A8B7CC] mt-1">
              Manage your saved vehicles, inquiries, and scheduled test drives.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-full bg-[#0B1D33] border border-[rgba(107,203,255,0.2)]">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-[#2684FF] text-white shadow-[0_0_15px_rgba(38,132,255,0.5)]'
                  : 'text-[#A8B7CC] hover:text-white'
              }`}
            >
              <FiHeart className="w-3.5 h-3.5" />
              <span>Saved Cars ({favorites.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-[#2684FF] text-white shadow-[0_0_15px_rgba(38,132,255,0.5)]'
                  : 'text-[#A8B7CC] hover:text-white'
              }`}
            >
              <FiCalendar className="w-3.5 h-3.5" />
              <span>Inquiries</span>
            </button>
          </div>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === 'favorites' && (
          <div>
            {favorites.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.15)] max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center mx-auto mb-4 border border-[#2684FF]/30">
                  <FiHeart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Saved Vehicles Yet</h3>
                <p className="text-sm text-[#A8B7CC] mb-6">
                  Browse the marketplace and click the heart icon on any vehicle to save it to your garage for easy comparison.
                </p>
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.4)]"
                >
                  <FiSearch className="w-4 h-4" />
                  <span>Discover Vehicles</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((car) => {
                  const carId = typeof car === 'string' ? car : car._id;
                  if (!car || typeof car !== 'object') return null;
                  return (
                    <div key={carId} className="relative group">
                      <CarCard car={car} />
                      <button
                        onClick={() => handleRemoveFavorite(car)}
                        className="absolute top-4 right-14 p-2 rounded-full bg-[#061426]/80 text-red-400 hover:text-red-300 border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        title="Remove from favorites"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-12 text-center rounded-3xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.15)]">
              <div className="w-16 h-16 rounded-2xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center mx-auto mb-4 border border-[#2684FF]/30">
                <FiInbox className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Active Inquiries</h3>
              <p className="text-sm text-[#A8B7CC] mb-6">
                When you inquire about a car or request a test drive, your communication history with dealerships will appear here.
              </p>
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.4)]"
              >
                <span>Browse Inventory Now</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;