import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHeart, 
  FiMapPin, 
  FiCalendar, 
  FiCpu, 
  FiArrowRight,
  FiZap,
  FiCheck
} from 'react-icons/fi';
import { isFavorite, toggleFavorite } from '../utils/favorites.js';

const CarCard = ({ car, layout = 'grid', isMobile = false }) => {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (car?._id) {
      setFavorite(isFavorite(car._id));
    }
  }, [car?._id]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(car);
    setFavorite(newState);
  };

  // Format currency
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Inquire for Price';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format mileage
  const formatMileage = (mileage) => {
    if (!mileage && mileage !== 0) return null;
    return `${new Intl.NumberFormat('en-US').format(mileage)} km`;
  };

  // Resolve Image URL
  const getCarImage = (car) => {
    const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/i, '').replace(/\/$/, '');
    const PLACEHOLDER = '/auto.png';

    const extractUrl = (item) => {
      if (!item) return null;
      if (typeof item === 'string') return item;
      return item.url || item.secure_url || item.path || null;
    };

    let candidate = null;
    if (car?.images && Array.isArray(car.images) && car.images.length > 0) {
      candidate = extractUrl(car.images.find(img => img.isPrimary) || car.images[0]);
    } else if (car?.image) {
      candidate = extractUrl(car.image);
    }

    if (!candidate) return PLACEHOLDER;
    if (/^https?:\/\//i.test(candidate)) return candidate;
    return `${API_HOST}${candidate.startsWith('/') ? '' : '/'}${candidate}`;
  };

  const price = car.salePrice || car.pricePerDay || car.price || null;
  const isHorizontal = layout === 'horizontal';

  if (isHorizontal) {
    // AutoHub Panel 4 horizontal card layout
    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl overflow-hidden bg-[#0B1D33]/85 hover:bg-[#0E243F] border border-[rgba(107,203,255,0.14)] hover:border-[rgba(107,203,255,0.35)] shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_30px_rgba(38,132,255,0.2)] transition-all duration-300"
      >
        <Link to={`/cars/${car._id}`} className="flex flex-col sm:flex-row items-center">
          {/* Car Image container */}
          <div className="relative w-full sm:w-56 h-48 sm:h-36 flex-shrink-0 bg-[#061426] overflow-hidden">
            <img
              src={getCarImage(car)}
              alt={`${car.brand} ${car.model}`}
              loading="lazy"
              crossOrigin="anonymous"
              onError={(e) => { e.currentTarget.src = '/auto.png'; }}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
            />
            {/* Condition Badge */}
            <div className="absolute top-2.5 left-2.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                car.condition === 'New' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/40'
              }`}>
                {car.condition || 'Used'}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 p-4 w-full flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#6BCBFF] transition-colors leading-snug">
                  {car.brand} {car.model}
                </h3>
                <div className="text-xs text-[#A8B7CC] mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{car.year}</span>
                  <span>•</span>
                  <span>{car.type || car.category}</span>
                  {car.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 truncate max-w-[120px]">
                        <FiMapPin className="w-3 h-3 text-[#6BCBFF]" />
                        {car.location}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Heart Favorite button */}
              <button
                onClick={handleFavoriteClick}
                aria-label="Add to favorites"
                className={`p-2 rounded-full border transition-all ${
                  favorite 
                    ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                    : 'bg-[#061426]/70 border-[rgba(107,203,255,0.2)] text-[#A8B7CC] hover:text-white hover:border-[#6BCBFF]'
                }`}
              >
                <FiHeart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Price & Specs bottom row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(107,203,255,0.1)]">
              <div className="text-lg font-black text-white">
                {formatPrice(price)}
                {car.isForRent && !car.salePrice && (
                  <span className="text-xs font-normal text-[#A8B7CC] ml-1">/day</span>
                )}
              </div>

              <span className="text-xs font-semibold text-[#6BCBFF] flex items-center gap-1 hover:underline">
                View Details <FiArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // AutoHub Panel 2 Grid Card Layout
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group rounded-2xl overflow-hidden bg-[#0B1D33]/80 hover:bg-[#0E243F] border border-[rgba(107,203,255,0.16)] hover:border-[rgba(107,203,255,0.4)] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_35px_rgba(38,132,255,0.25)] flex flex-col justify-between transition-all duration-300"
    >
      <div>
        {/* Photo Container */}
        <div className="relative h-52 w-full bg-[#061426] overflow-hidden">
          <Link to={`/cars/${car._id}`}>
            <img
              src={getCarImage(car)}
              alt={`${car.brand} ${car.model}`}
              loading="lazy"
              crossOrigin="anonymous"
              onError={(e) => { e.currentTarget.src = '/auto.png'; }}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md ${
              car.condition === 'New' 
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' 
                : 'bg-[#2684FF]/25 text-[#6BCBFF] border border-[#2684FF]/40'
            }`}>
              {car.condition || 'Verified'}
            </span>

            {car.isPopular && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 backdrop-blur-md">
                <FiZap className="w-2.5 h-2.5" />
                Popular
              </span>
            )}
          </div>

          {/* Heart Button */}
          <button
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
              favorite 
                ? 'bg-red-500/25 border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]' 
                : 'bg-[#061426]/70 border-[rgba(107,203,255,0.25)] text-[#A8B7CC] hover:text-white hover:border-[#6BCBFF]'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Body Type Pill */}
          <div className="absolute bottom-3 left-3">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#061426]/85 backdrop-blur-md text-[#A8B7CC] border border-[rgba(107,203,255,0.15)]">
              {car.type || car.category || 'Sedan'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Title & Year */}
          <Link to={`/cars/${car._id}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-[#6BCBFF] transition-colors leading-snug line-clamp-1">
              {car.brand} {car.model}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1.5 text-xs text-[#A8B7CC] mt-1 mb-4">
            <FiCalendar className="w-3.5 h-3.5 text-[#6BCBFF]" />
            <span>{car.year}</span>
            {car.location && (
              <>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-0.5 truncate">
                  <FiMapPin className="w-3.5 h-3.5 text-[#6BCBFF]" />
                  {car.location}
                </span>
              </>
            )}
          </div>

          {/* Specs Tiles */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#061426]/60 border border-[rgba(107,203,255,0.1)] text-xs mb-4">
            <div className="text-[#A8B7CC] truncate">
              <span className="text-[10px] text-[#6BCBFF] block uppercase tracking-wider">Transmission</span>
              <span className="font-semibold text-white">{car.transmission || 'Automatic'}</span>
            </div>
            <div className="text-[#A8B7CC] truncate">
              <span className="text-[10px] text-[#6BCBFF] block uppercase tracking-wider">Fuel</span>
              <span className="font-semibold text-white">{car.fuelType || 'Gasoline'}</span>
            </div>
            {formatMileage(car.mileage) && (
              <div className="text-[#A8B7CC] truncate col-span-2 pt-1 border-t border-[rgba(107,203,255,0.06)]">
                <span className="text-[10px] text-[#6BCBFF] block uppercase tracking-wider">Mileage</span>
                <span className="font-semibold text-white">{formatMileage(car.mileage)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Price & View CTA */}
      <div className="px-5 pb-5 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(107,203,255,0.12)]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#A8B7CC] block font-medium">Price</span>
            <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5F8FF] to-[#6BCBFF]">
              {formatPrice(price)}
              {car.isForRent && !car.salePrice && (
                <span className="text-xs font-normal text-[#A8B7CC] ml-1">/day</span>
              )}
            </div>
          </div>

          <Link
            to={`/cars/${car._id}`}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#2684FF]/20 hover:bg-[#2684FF] border border-[#2684FF]/40 text-[#6BCBFF] hover:text-white group-hover:shadow-[0_0_15px_rgba(38,132,255,0.5)] transition-all duration-300"
            title="View Vehicle Details"
          >
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
