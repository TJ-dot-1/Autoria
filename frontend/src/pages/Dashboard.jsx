import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { carsAPI, bookingsAPI, authAPI } from '../utils/api';
import { getFavorites, toggleFavorite } from '../utils/favorites';
import { 
  FiPlusCircle, 
  FiCalendar, 
  FiUsers, 
  FiTrendingUp, 
  FiClock, 
  FiArrowRight,
  FiShield,
  FiBox,
  FiHeart,
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiEdit3,
  FiExternalLink,
  FiTrash2,
  FiFileText,
  FiDollarSign,
  FiCompass,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'overview' | 'my-cars' | 'my-bookings' | 'favorites' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // State
  const [myCars, setMyCars] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Currency Formatter
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Inquire for Price';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Image Helper
  const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/i, '').replace(/\/$/, '');
  const getCarImage = (car) => {
    const extractUrl = (item) => {
      if (!item) return null;
      if (typeof item === 'string') return item;
      return item.url || item.secure_url || item.path || null;
    };
    let candidate = null;
    if (car?.images && Array.isArray(car.images) && car.images.length > 0) {
      candidate = extractUrl(car.images.find(img => img.isPrimary) || car.images[0]);
    }
    if (!candidate && car?.primaryImage) candidate = extractUrl(car.primaryImage);
    if (!candidate && car?.image) candidate = extractUrl(car.image);
    if (!candidate) return '/hero_sports_car.jpg';
    if (candidate.startsWith('http://') || candidate.startsWith('https://')) return candidate;
    return `${API_HOST}${candidate.startsWith('/') ? candidate : `/${candidate}`}`;
  };

  // Fetch Dashboard Data
  const loadDashboardData = async () => {
    try {
      setRefreshing(true);

      // 1. Load Cars
      try {
        const carsRes = await carsAPI.getAll({ limit: 100 });
        const allCars = carsRes?.data || [];
        // Filter cars added by this user (or show all if admin)
        const userCars = allCars.filter(car => {
          const addedById = typeof car.addedBy === 'object' ? car.addedBy?._id : car.addedBy;
          return addedById === user?._id || addedById === user?.id;
        });
        setMyCars(user?.role === 'admin' && userCars.length === 0 ? allCars.slice(0, 8) : userCars);
      } catch (err) {
        console.warn('Cars load warning:', err.message);
      }

      // 2. Load Bookings
      try {
        const bookingsRes = await bookingsAPI.getMyBookings();
        setMyBookings(bookingsRes?.data || []);
      } catch (err) {
        console.warn('Bookings load warning:', err.message);
      }

      // 3. Load Local Favorites
      setFavoritesList(getFavorites());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Sync profile state
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }

    // Listen for favorites update
    const handleFavUpdated = (e) => {
      setFavoritesList(e.detail?.list || getFavorites());
    };
    window.addEventListener('autoria_favorites_updated', handleFavUpdated);

    return () => {
      window.removeEventListener('autoria_favorites_updated', handleFavUpdated);
    };
  }, [user]);

  // Profile Save Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await authAPI.updateProfile({
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        phone: profileData.phone.trim() || undefined,
        bio: profileData.bio.trim()
      });

      if (res?.data) {
        updateUser(res.data);
        toast.success('Profile details updated successfully');
      } else {
        toast.success('Profile saved');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this inquiry / booking?')) return;
    try {
      await bookingsAPI.cancel(bookingId, 'User requested cancellation from dashboard');
      toast.success('Inquiry cancelled');
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel inquiry');
    }
  };

  // Remove from favorites
  const handleRemoveFavorite = (car) => {
    toggleFavorite(car);
    setFavoritesList(getFavorites());
    toast.success('Vehicle removed from saved wishlist');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061426] flex flex-col items-center justify-center p-8 text-white">
        <div className="w-12 h-12 border-4 border-[#2684FF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#A8B7CC]">Loading your Autoria portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061426] text-[#F5F8FF] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Cinematic User Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#0B1D33] via-[#0E2644] to-[#0B1D33] border border-[rgba(107,203,255,0.22)] shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(38,132,255,0.2)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* User Avatar with Glowing Badge */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#2684FF] to-[#1255CC] p-0.5 shadow-[0_0_20px_rgba(38,132,255,0.5)]">
                <div className="w-full h-full rounded-2xl bg-[#0B1D33] flex items-center justify-center text-xl sm:text-2xl font-black text-[#6BCBFF]">
                  {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0B1D33] flex items-center justify-center shadow-[0_0_8px_#10B981]" title="Active Account">
                <FiCheckCircle className="w-3 h-3 text-white" />
              </span>
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  user?.role === 'admin' 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span>{user?.role === 'admin' ? 'Administrator' : 'Registered Member & Seller'}</span>
                </span>
                <span className="text-[11px] text-[#A8B7CC] bg-white/5 px-2.5 py-0.5 rounded-full">
                  Verified Member
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {user?.firstName} {user?.lastName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#A8B7CC] mt-1">
                <span className="flex items-center gap-1.5">
                  <FiMail className="w-3.5 h-3.5 text-[#6BCBFF]" />
                  {user?.email}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <FiPhone className="w-3.5 h-3.5 text-emerald-400" />
                    {user?.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              title="Refresh dashboard data"
              className="p-3 rounded-full bg-[#061426] hover:bg-white/10 border border-[rgba(107,203,255,0.2)] text-[#A8B7CC] hover:text-white transition-all"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#6BCBFF]' : ''}`} />
            </button>

            <Link
              to="/admin/add-car"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1F63D6] shadow-[0_0_20px_rgba(38,132,255,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span>List a Car</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 transition-all"
              >
                <FiSettings className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: My Listed Cars */}
        <div 
          onClick={() => setActiveTab('my-cars')}
          className="p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg hover:border-[#6BCBFF]/40 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2684FF] to-[#1255CC] flex items-center justify-center text-white shadow">
              <FiBox className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30">
              Active
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-0.5 group-hover:text-[#6BCBFF] transition-colors">
            {myCars.length}
          </div>
          <p className="text-xs text-[#A8B7CC] font-medium">My Listed Vehicles</p>
        </div>

        {/* Metric 2: Bookings / Inquiries */}
        <div 
          onClick={() => setActiveTab('my-bookings')}
          className="p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg hover:border-emerald-500/40 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow">
              <FiCalendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Inquiries
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-0.5 group-hover:text-emerald-400 transition-colors">
            {myBookings.length}
          </div>
          <p className="text-xs text-[#A8B7CC] font-medium">Test Drives &amp; Inquiries</p>
        </div>

        {/* Metric 3: Saved Favorites */}
        <div 
          onClick={() => setActiveTab('favorites')}
          className="p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg hover:border-rose-500/40 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center text-white shadow">
              <FiHeart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Wishlist
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-0.5 group-hover:text-rose-400 transition-colors">
            {favoritesList.length}
          </div>
          <p className="text-xs text-[#A8B7CC] font-medium">Saved Vehicles</p>
        </div>

        {/* Metric 4: Account Rating & Verification */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg hover:border-amber-500/40 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-white shadow">
              <FiShield className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Verified
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-0.5 group-hover:text-amber-400 transition-colors">
            100%
          </div>
          <p className="text-xs text-[#A8B7CC] font-medium">Trust &amp; Seller Score</p>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[rgba(107,203,255,0.15)] pb-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: FiCompass },
          { id: 'my-cars', label: `My Vehicles (${myCars.length})`, icon: FiBox },
          { id: 'my-bookings', label: `Inquiries (${myBookings.length})`, icon: FiCalendar },
          { id: 'favorites', label: `Saved Wishlist (${favoritesList.length})`, icon: FiHeart },
          { id: 'profile', label: 'Profile & Settings', icon: FiUser },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold whitespace-nowrap rounded-t-xl transition-all border-b-2 ${
                isActive
                  ? 'text-[#6BCBFF] border-[#6BCBFF] bg-[#0B1D33]/80'
                  : 'text-[#A8B7CC] border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div
            key="tab-overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Quick Actions Grid */}
            <div className="p-6 rounded-3xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)] shadow-xl">
              <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6BCBFF]" />
                <span>Marketplace Actions &amp; Services</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/admin/add-car"
                  className="flex flex-col justify-between p-4 rounded-2xl bg-[#061426]/70 hover:bg-[#061426] border border-[rgba(107,203,255,0.14)] hover:border-[#6BCBFF] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center mb-3 border border-[#2684FF]/30">
                    <FiPlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#6BCBFF] transition-colors flex items-center justify-between">
                      <span>List a Vehicle</span>
                      <FiArrowRight className="w-3.5 h-3.5 text-[#A8B7CC] group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-[11px] text-[#A8B7CC] mt-1">
                      Post your car for immediate sale or daily rental inquiry
                    </p>
                  </div>
                </Link>

                <Link
                  to="/cars"
                  className="flex flex-col justify-between p-4 rounded-2xl bg-[#061426]/70 hover:bg-[#061426] border border-[rgba(107,203,255,0.14)] hover:border-emerald-400 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
                    <FiCompass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                      <span>Browse Inventory</span>
                      <FiArrowRight className="w-3.5 h-3.5 text-[#A8B7CC] group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-[11px] text-[#A8B7CC] mt-1">
                      Discover verified sedans, luxury SUVs, and sports cars
                    </p>
                  </div>
                </Link>

                <Link
                  to="/services/vehicle-inspection"
                  className="flex flex-col justify-between p-4 rounded-2xl bg-[#061426]/70 hover:bg-[#061426] border border-[rgba(107,203,255,0.14)] hover:border-purple-400 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 border border-purple-500/30">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
                      <span>Vehicle Inspection</span>
                      <FiArrowRight className="w-3.5 h-3.5 text-[#A8B7CC] group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-[11px] text-[#A8B7CC] mt-1">
                      Schedule a certified 200-point mechanical evaluation
                    </p>
                  </div>
                </Link>

                <Link
                  to="/services/car-financing"
                  className="flex flex-col justify-between p-4 rounded-2xl bg-[#061426]/70 hover:bg-[#061426] border border-[rgba(107,203,255,0.14)] hover:border-amber-400 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/30">
                    <FiDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                      <span>Car Financing</span>
                      <FiArrowRight className="w-3.5 h-3.5 text-[#A8B7CC] group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-[11px] text-[#A8B7CC] mt-1">
                      Calculate repayments and get fast loan pre-approvals
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Split Section: Recent Listings vs Recent Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: My Listings Preview (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)] shadow-xl space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FiBox className="w-4 h-4 text-[#6BCBFF]" />
                    <span>My Listed Cars</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('my-cars')}
                    className="text-xs font-semibold text-[#6BCBFF] hover:underline"
                  >
                    View All ({myCars.length})
                  </button>
                </div>

                {myCars.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#061426]/50 border border-[rgba(107,203,255,0.1)]">
                    <div className="w-12 h-12 rounded-2xl bg-[#2684FF]/10 text-[#6BCBFF] flex items-center justify-center mx-auto mb-3">
                      <FiBox className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">No vehicles listed yet</h3>
                    <p className="text-xs text-[#A8B7CC] mb-4">
                      Turn your car into cash or rental income. Reach thousands of verified buyers!
                    </p>
                    <Link
                      to="/admin/add-car"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#2684FF] hover:bg-[#1B6AD5] transition-all"
                    >
                      <FiPlusCircle className="w-3.5 h-3.5" />
                      <span>List Your First Car</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myCars.slice(0, 3).map((car) => (
                      <div 
                        key={car._id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#061426]/70 border border-[rgba(107,203,255,0.12)] hover:border-[#6BCBFF]/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={getCarImage(car)}
                            alt={`${car.brand} ${car.model}`}
                            className="w-14 h-12 rounded-xl object-cover bg-white/5 border border-white/10"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white">
                              {car.brand} {car.model} ({car.year})
                            </h4>
                            <span className="text-[11px] text-[#A8B7CC] block">
                              {car.type || car.category} &bull; {car.transmission || 'Automatic'}
                            </span>
                            <span className="text-xs font-bold text-[#6BCBFF]">
                              {formatPrice(car.salePrice || car.pricePerDay)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/cars/${car._id}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6BCBFF] bg-[#2684FF]/15 hover:bg-[#2684FF]/30 border border-[#2684FF]/30 transition-all"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Recent Inquiries / Bookings Preview (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)] shadow-xl space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-emerald-400" />
                    <span>My Inquiries &amp; Test Drives</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('my-bookings')}
                    className="text-xs font-semibold text-[#6BCBFF] hover:underline"
                  >
                    View All ({myBookings.length})
                  </button>
                </div>

                {myBookings.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#061426]/50 border border-[rgba(107,203,255,0.1)]">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <FiCalendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">No active inquiries</h3>
                    <p className="text-xs text-[#A8B7CC] mb-4">
                      Interested in test driving a car? Inquire directly on any vehicle page.
                    </p>
                    <Link
                      to="/cars"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all"
                    >
                      <FiCompass className="w-3.5 h-3.5" />
                      <span>Find Cars to Inquire</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myBookings.slice(0, 3).map((b) => (
                      <div
                        key={b._id}
                        className="p-3.5 rounded-2xl bg-[#061426]/70 border border-[rgba(107,203,255,0.12)] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">
                            {b.car?.brand} {b.car?.model}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            b.status === 'Confirmed' || b.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : b.status === 'Cancelled' || b.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {b.status || 'Pending'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#A8B7CC] flex items-center justify-between">
                          <span>Date: {b.bookingPeriod?.startDate ? new Date(b.bookingPeriod.startDate).toLocaleDateString() : 'Immediate'}</span>
                          <span className="font-bold text-white">{formatPrice(b.pricing?.totalPrice || b.pricing?.dailyRate || 0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: MY VEHICLES */}
        {activeTab === 'my-cars' && (
          <motion.div
            key="tab-my-cars"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)]">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiBox className="w-5 h-5 text-[#6BCBFF]" />
                  <span>My Vehicle Inventory ({myCars.length})</span>
                </h2>
                <p className="text-xs text-[#A8B7CC] mt-0.5">
                  Vehicles you have published to the Autoria marketplace
                </p>
              </div>

              <Link
                to="/admin/add-car"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_15px_rgba(38,132,255,0.4)] self-start sm:self-auto"
              >
                <FiPlusCircle className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </Link>
            </div>

            {myCars.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0B1D33]/50 border border-[rgba(107,203,255,0.15)]">
                <div className="w-16 h-16 rounded-2xl bg-[#2684FF]/15 text-[#6BCBFF] flex items-center justify-center mx-auto mb-4 border border-[#2684FF]/30">
                  <FiBox className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No cars listed yet</h3>
                <p className="text-xs text-[#A8B7CC] max-w-md mx-auto mb-6">
                  Ready to sell or rent your car? You can post your vehicle with photo gallery, specs, and price in just a few clicks.
                </p>
                <Link
                  to="/admin/add-car"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.5)]"
                >
                  <FiPlusCircle className="w-4 h-4" />
                  <span>List Your Car Now</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCars.map((car) => (
                  <div
                    key={car._id}
                    className="rounded-3xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.15)] overflow-hidden shadow-xl hover:border-[#6BCBFF]/50 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Car Image with Status Badge */}
                      <div className="relative h-48 overflow-hidden bg-black/20">
                        <img
                          src={getCarImage(car)}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          car.isAvailable !== false
                            ? 'bg-emerald-500/80 text-white'
                            : 'bg-red-500/80 text-white'
                        }`}>
                          {car.isAvailable !== false ? 'Available' : 'Reserved'}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#061426]/80 text-[#6BCBFF] border border-[#6BCBFF]/30">
                          {car.category || car.type || 'Sedan'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-white">
                            {car.brand} {car.model}
                          </h3>
                          <span className="text-xs text-[#A8B7CC] font-semibold">
                            {car.year}
                          </span>
                        </div>

                        <div className="text-xs text-[#A8B7CC] flex items-center gap-3">
                          <span>{car.transmission || 'Automatic'}</span>
                          <span>&bull;</span>
                          <span>{car.fuelType || 'Gasoline'}</span>
                          {car.location && (
                            <>
                              <span>&bull;</span>
                              <span className="truncate">{car.location}</span>
                            </>
                          )}
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-white/5">
                          <span className="text-xs text-[#A8B7CC]">Market Price:</span>
                          <span className="text-sm font-black text-[#6BCBFF]">
                            {formatPrice(car.salePrice || car.pricePerDay)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0 flex items-center gap-2">
                      <Link
                        to={`/cars/${car._id}`}
                        className="flex-1 text-center py-2 rounded-xl text-xs font-bold text-[#6BCBFF] bg-[#2684FF]/15 hover:bg-[#2684FF]/25 border border-[#2684FF]/30 transition-all"
                      >
                        View Listing
                      </Link>
                      <Link
                        to={`/admin/manage-cars`}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        title="Manage in car inventory"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: MY INQUIRIES & BOOKINGS */}
        {activeTab === 'my-bookings' && (
          <motion.div
            key="tab-my-bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-emerald-400" />
                  <span>My Test Drives &amp; Inquiries ({myBookings.length})</span>
                </h2>
                <p className="text-xs text-[#A8B7CC] mt-0.5">
                  Track the status of vehicle reservations, test drive appointments, and owner communications
                </p>
              </div>

              <Link
                to="/cars"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all self-start sm:self-auto"
              >
                <FiCompass className="w-3.5 h-3.5" />
                <span>Explore Cars to Inquire</span>
              </Link>
            </div>

            {myBookings.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0B1D33]/50 border border-[rgba(107,203,255,0.15)]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <FiCalendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No active inquiries found</h3>
                <p className="text-xs text-[#A8B7CC] max-w-md mx-auto mb-6">
                  Browse our verified car inventory and click "Schedule Test Drive" or "Inquire" to connect with owners.
                </p>
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.5)]"
                >
                  <FiCompass className="w-4 h-4" />
                  <span>Browse All Cars</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b) => (
                  <div
                    key={b._id}
                    className="p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#6BCBFF]/40 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {b.car && (
                        <img
                          src={getCarImage(b.car)}
                          alt={b.car.brand}
                          className="w-20 h-16 rounded-xl object-cover bg-white/5 border border-white/10 shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-white">
                            {b.car?.brand} {b.car?.model} ({b.car?.year || 2023})
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            b.status === 'Confirmed' || b.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : b.status === 'Cancelled' || b.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {b.status || 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-[#A8B7CC]">
                          Inquiry #{b.bookingNumber || b._id.slice(-6).toUpperCase()} &bull;{' '}
                          {b.bookingPeriod?.startDate ? new Date(b.bookingPeriod.startDate).toLocaleDateString() : 'Immediate'}{' '}
                          {b.pickupLocation && `at ${b.pickupLocation}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-[#A8B7CC] block uppercase tracking-wider">Estimated Amount</span>
                        <span className="text-sm font-black text-white">
                          {formatPrice(b.pricing?.totalPrice || b.pricing?.dailyRate || 0)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.car?._id && (
                          <Link
                            to={`/cars/${b.car._id}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6BCBFF] bg-[#2684FF]/20 hover:bg-[#2684FF]/30 border border-[#2684FF]/30 transition-all"
                          >
                            Car Details
                          </Link>
                        )}
                        {b.status !== 'Cancelled' && b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="p-2 rounded-lg text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all"
                            title="Cancel inquiry"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: SAVED FAVORITES */}
        {activeTab === 'favorites' && (
          <motion.div
            key="tab-favorites"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiHeart className="w-5 h-5 text-rose-400" />
                  <span>Saved Vehicles Wishlist ({favoritesList.length})</span>
                </h2>
                <p className="text-xs text-[#A8B7CC] mt-0.5">
                  Vehicles you marked with a heart for quick comparison and purchasing
                </p>
              </div>

              <Link
                to="/cars"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#2684FF] hover:bg-[#1B6AD5] transition-all self-start sm:self-auto"
              >
                <FiCompass className="w-3.5 h-3.5" />
                <span>Find More Cars</span>
              </Link>
            </div>

            {favoritesList.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0B1D33]/50 border border-[rgba(107,203,255,0.15)]">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
                  <FiHeart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Your wishlist is empty</h3>
                <p className="text-xs text-[#A8B7CC] max-w-md mx-auto mb-6">
                  Click the heart icon on any car card while browsing to save your dream vehicles right here.
                </p>
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.5)]"
                >
                  <FiCompass className="w-4 h-4" />
                  <span>Browse Cars Now</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritesList.map((car) => {
                  const carId = typeof car === 'string' ? car : car._id;
                  const carBrand = car?.brand || 'Autoria';
                  const carModel = car?.model || 'Vehicle';
                  return (
                    <div
                      key={carId}
                      className="rounded-3xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.15)] overflow-hidden shadow-xl hover:border-rose-500/50 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 overflow-hidden bg-black/20">
                          <img
                            src={getCarImage(car)}
                            alt={`${carBrand} ${carModel}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={() => handleRemoveFavorite(car)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-[#061426]/80 text-rose-400 hover:text-white hover:bg-rose-600 transition-all shadow"
                            title="Remove from favorites"
                          >
                            <FiHeart className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        <div className="p-5 space-y-2">
                          <h3 className="text-base font-bold text-white">
                            {carBrand} {carModel}
                          </h3>
                          <div className="pt-2 flex items-center justify-between border-t border-white/5">
                            <span className="text-xs text-[#A8B7CC]">Price:</span>
                            <span className="text-sm font-black text-[#6BCBFF]">
                              {formatPrice(car?.salePrice || car?.pricePerDay)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <Link
                          to={`/cars/${carId}`}
                          className="block w-full text-center py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow transition-all"
                        >
                          View Vehicle Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 5: PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <motion.div
            key="tab-profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.2)] shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-[#6BCBFF]" />
                <span>Personal &amp; Contact Details</span>
              </h2>
              <p className="text-xs text-[#A8B7CC] mb-6">
                Update the contact details that buyers and dealers use to reach you.
              </p>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A8B7CC] mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#061426] text-white border border-[rgba(107,203,255,0.2)] focus:outline-none focus:border-[#2684FF] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B7CC] mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#061426] text-white border border-[rgba(107,203,255,0.2)] focus:outline-none focus:border-[#2684FF] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1">
                    Email Address <span className="text-[#6B7D96] font-normal">(Primary account ID)</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#061426]/50 text-[#A8B7CC] border border-white/5 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1">
                    Phone Number <span className="text-[#6BCBFF] font-normal">(For buyer &amp; test drive WhatsApp/calls)</span>
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#061426] text-white border border-[rgba(107,203,255,0.2)] focus:outline-none focus:border-[#2684FF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1">
                    Seller Bio / Description
                  </label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell buyers a little about yourself or your dealership..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#061426] text-white border border-[rgba(107,203,255,0.2)] focus:outline-none focus:border-[#2684FF] transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1F63D6] shadow-[0_0_20px_rgba(38,132,255,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    {savingProfile ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiCheckCircle className="w-4 h-4" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default Dashboard;