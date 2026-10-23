import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { carsAPI } from '../utils/api';
import InquiryForm from '../components/InquiryForm';
import CarCard from './CarCard';
import { isFavorite, toggleFavorite } from '../utils/favorites';
import { 
  FiArrowLeft, 
  FiHeart, 
  FiShare2, 
  FiCheck, 
  FiStar, 
  FiMapPin, 
  FiCalendar, 
  FiPhone, 
  FiMail, 
  FiShield, 
  FiCheckCircle, 
  FiZap,
  FiActivity,
  FiCompass,
  FiAward
} from 'react-icons/fi';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [car, setCar] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    fetchCarDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await carsAPI.getById(id);
      
      if (response.success && response.data) {
        setCar(response.data);
        setIsFav(isFavorite(response.data._id));
        fetchRelated(response.data.category || response.data.brand);
      } else {
        setError('Vehicle listing not found.');
      }
    } catch (err) {
      console.error('Error fetching car:', err);
      setError('Unable to load car details.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelated = async (category) => {
    try {
      const res = await carsAPI.getAll({ limit: 4 });
      if (res.success && res.data) {
        setRelatedCars(res.data.filter(c => c._id !== id).slice(0, 4));
      }
    } catch (e) {
      console.error('Failed to load related cars', e);
    }
  };

  const handleToggleFavorite = () => {
    if (!car) return;
    const newState = toggleFavorite(car);
    setIsFav(newState);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.brand} ${car.model} on Autoria`,
          text: `Check out this ${car.year} ${car.brand} ${car.model} on Autoria!`,
          url: window.location.href,
        });
      } catch (e) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Resolve Image URLs
  const getImageSrc = (img) => {
    const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/i, '').replace(/\/$/, '');
    const PLACEHOLDER = '/auto.png';
    if (!img) return PLACEHOLDER;
    const src = typeof img === 'string' ? img : (img.url || img.secure_url || img.path);
    if (!src) return PLACEHOLDER;
    if (/^https?:\/\//i.test(src)) return src;
    return `${API_HOST}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#061426] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2684FF] border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_20px_rgba(38,132,255,0.4)]" />
          <p className="text-sm font-semibold text-[#6BCBFF] animate-pulse">Loading vehicle specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-[#061426] flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.15)] text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Vehicle Not Found</h2>
          <p className="text-sm text-[#A8B7CC] mb-6">{error || 'This listing may have been sold or removed.'}</p>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.4)]"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Browse Available Cars</span>
          </Link>
        </div>
      </div>
    );
  }

  // Format price
  const price = car.salePrice || car.pricePerDay || car.price || null;
  const formattedPrice = price 
    ? new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)
    : 'Price upon request';

  // Format images
  const galleryImages = (car.images && car.images.length > 0)
    ? car.images.map(img => getImageSrc(img))
    : [getImageSrc(car.primaryImage || car.image || null)];

  // Default features if empty
  const defaultFeatures = [
    'Dual-Zone Automatic Climate Control',
    'Bluetooth Wireless Connectivity',
    'Backup Camera with Guidelines',
    'Touchscreen Navigation Infotainment',
    'Keyless Entry & Push-Button Start',
    'Anti-lock Braking System (ABS)',
    'Electronic Stability Control',
    'Multi-function Steering Wheel'
  ];
  const featuresList = (car.features && car.features.length > 0) ? car.features : defaultFeatures;

  // Key performance specs tiles (AutoHub Panel 3 Style)
  const acceleration = car.performance?.acceleration?.zeroToSixty ? `${car.performance.acceleration.zeroToSixty}s` : '5.1s';
  const topSpeed = car.performance?.topSpeed ? `${car.performance.topSpeed} km/h` : '240 km/h';
  const power = car.engine?.power ? `${car.engine.power} HP` : (car.fuelType === 'Electric' ? '346 HP' : '280 HP');
  const mileageRange = car.fuelType === 'Electric' 
    ? '580 km' 
    : (car.mileage ? `${car.mileage.toLocaleString()} km` : '15,000 km');

  return (
    <div className="min-h-screen bg-[#061426] text-[#F5F8FF] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header Actions (AutoHub Panel 3 Top Bar) */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B1D33]/80 hover:bg-[#0B1D33] border border-[rgba(107,203,255,0.18)] text-[#A8B7CC] hover:text-white transition-all"
          >
            <FiArrowLeft className="w-4 h-4 text-[#6BCBFF]" />
            <span className="text-xs font-semibold">Back</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-xl border transition-all ${
                isFav
                  ? 'bg-red-500/25 border-red-500/60 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-[#0B1D33]/80 border-[rgba(107,203,255,0.18)] text-[#A8B7CC] hover:text-white hover:border-[#6BCBFF]'
              }`}
              title="Save to favorites"
            >
              <FiHeart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="relative p-2.5 rounded-xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.18)] text-[#A8B7CC] hover:text-[#6BCBFF] hover:border-[#6BCBFF] transition-all"
              title="Share listing"
            >
              <FiShare2 className="w-4 h-4" />
              {copiedShare && (
                <span className="absolute -bottom-8 right-0 px-2 py-1 bg-[#2684FF] text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Vehicle Header Info */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30">
                {car.year} Model
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {car.condition || 'Verified Quality'}
              </span>
              <span className="text-xs font-medium text-[#A8B7CC]">
                {car.type || car.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {car.brand} {car.model}
            </h1>

            {/* Star Rating Badge (AutoHub Panel 3) */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2684FF]/15 border border-[#2684FF]/30 text-amber-400 text-xs font-bold">
                <FiStar className="fill-amber-400 w-3.5 h-3.5" />
                <span>4.8</span>
                <span className="text-[#A8B7CC] font-normal ml-0.5">(120 Reviews)</span>
              </div>
              {car.location && (
                <span className="text-xs text-[#A8B7CC] flex items-center gap-1">
                  <FiMapPin className="text-[#6BCBFF] w-3.5 h-3.5" />
                  {car.location}
                </span>
              )}
            </div>
          </div>

          {/* Prominent Price Display */}
          <div className="text-left md:text-right">
            <span className="text-xs uppercase tracking-wider text-[#A8B7CC] block font-semibold">
              Marketplace Price
            </span>
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5F8FF] to-[#6BCBFF]">
              {formattedPrice}
            </div>
          </div>
        </div>

        {/* Gallery Showcase + Glowing Stage (AutoHub Panel 3 Image Stage) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0B1D33] to-[#061426] border border-[rgba(107,203,255,0.2)] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(38,132,255,0.15)] mb-8 p-4 sm:p-8">
          
          {/* Neon Ring Halo under the car (AutoHub Panel 3 Style) */}
          <div className="absolute inset-x-12 bottom-6 h-32 bg-gradient-to-t from-[#2684FF]/25 via-[#6BCBFF]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
          
          {/* Main Vehicle Image */}
          <div className="relative h-72 sm:h-96 md:h-[450px] w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={galleryImages[selectedImage]}
                alt={`${car.brand} ${car.model}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                onError={(e) => { e.currentTarget.src = '/auto.png'; }}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] z-10"
              />
            </AnimatePresence>
          </div>

          {/* Thumbnails strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4 overflow-x-auto py-2 z-20 relative">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                    selectedImage === idx
                      ? 'border-[#6BCBFF] shadow-[0_0_15px_rgba(107,203,255,0.6)] scale-105'
                      : 'border-[rgba(107,203,255,0.2)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4-Tile Key Specs Grid (AutoHub Panel 3 Exact Layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {/* Range / Fuel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.18)] text-center shadow-lg hover:border-[#6BCBFF]/40 transition-colors">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#A8B7CC] block mb-1">
              Range / Fuel
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {mileageRange}
            </div>
            <span className="text-[11px] text-[#6BCBFF] font-medium">{car.fuelType || 'Efficient'}</span>
          </div>

          {/* Top Speed */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.18)] text-center shadow-lg hover:border-[#6BCBFF]/40 transition-colors">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#A8B7CC] block mb-1">
              Top Speed
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {topSpeed}
            </div>
            <span className="text-[11px] text-[#6BCBFF] font-medium">Verified Spec</span>
          </div>

          {/* 0-100 km/h */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.18)] text-center shadow-lg hover:border-[#6BCBFF]/40 transition-colors">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#A8B7CC] block mb-1">
              0-100 km/h
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {acceleration}
            </div>
            <span className="text-[11px] text-[#6BCBFF] font-medium">Acceleration</span>
          </div>

          {/* Engine Power */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.18)] text-center shadow-lg hover:border-[#6BCBFF]/40 transition-colors">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#A8B7CC] block mb-1">
              Engine Power
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {power}
            </div>
            <span className="text-[11px] text-[#6BCBFF] font-medium">{car.engine?.type || 'Direct Drive'}</span>
          </div>
        </div>

        {/* Two-Column Content: Description & Features / Dealer Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About The Car */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)] shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6BCBFF]" />
                About The Car
              </h2>
              <p className="text-sm sm:text-base text-[#A8B7CC] leading-relaxed mb-6">
                {car.description || `Experience the ultimate fusion of automotive engineering, comfort, and state-of-the-art technology with this ${car.year} ${car.brand} ${car.model}. Impeccably maintained, thoroughly inspected, and ready for your immediate ownership or test drive.`}
              </p>

              {/* Glowing Checklist Features (AutoHub Panel 3 Style) */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Key Highlights &amp; Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuresList.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#061426]/70 border border-[rgba(107,203,255,0.1)] text-xs sm:text-sm text-[#F5F8FF]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(38,132,255,0.5)]">
                      <FiCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Matrix Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)] shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Full Technical Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#061426]/60 border border-[rgba(107,203,255,0.1)]">
                  <span className="text-[#A8B7CC] block mb-0.5">Transmission</span>
                  <span className="font-bold text-white text-sm">{car.transmission || 'Automatic'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#061426]/60 border border-[rgba(107,203,255,0.1)]">
                  <span className="text-[#A8B7CC] block mb-0.5">Fuel Type</span>
                  <span className="font-bold text-white text-sm">{car.fuelType || 'Gasoline'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#061426]/60 border border-[rgba(107,203,255,0.1)]">
                  <span className="text-[#A8B7CC] block mb-0.5">Seating Capacity</span>
                  <span className="font-bold text-white text-sm">{car.seatingCapacity || 5} Passengers</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#061426]/60 border border-[rgba(107,203,255,0.1)]">
                  <span className="text-[#A8B7CC] block mb-0.5">Doors</span>
                  <span className="font-bold text-white text-sm">{car.doors || 4} Doors</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#061426]/60 border border-[rgba(107,203,255,0.1)]">
                  <span className="text-[#A8B7CC] block mb-0.5">Exterior Color</span>
                  <span className="font-bold text-white text-sm">{car.color?.exterior || 'Midnight Blue'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#061426]/60 border border-[rgba(107,203,255,0.1)]">
                  <span className="text-[#A8B7CC] block mb-0.5">Location</span>
                  <span className="font-bold text-white text-sm">{car.location || 'Showroom'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Dealer & Action Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dealer & Purchase CTA Card */}
            <div className="sticky top-24 p-6 sm:p-7 rounded-3xl bg-[#0B1D33]/90 border border-[rgba(107,203,255,0.22)] shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(38,132,255,0.18)] backdrop-blur-xl space-y-6">
              
              <div>
                <span className="text-xs uppercase tracking-wider text-[#A8B7CC] block font-semibold mb-1">
                  Starting Price
                </span>
                <div className="text-3xl font-black text-white">
                  {formattedPrice}
                </div>
                <p className="text-[11px] text-[#6BCBFF] mt-1 flex items-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" />
                  No Hidden Brokerage Fees
                </p>
              </div>

              {/* Verified Seller Badge */}
              <div className="p-4 rounded-2xl bg-[#061426]/80 border border-[rgba(107,203,255,0.14)] flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2684FF] to-[#1255CC] text-white flex items-center justify-center font-bold text-lg shadow-[0_0_12px_rgba(38,132,255,0.5)]">
                  {car.brand ? car.brand[0] : 'A'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Autoria Certified Dealer
                    <FiAward className="text-[#6BCBFF] w-4 h-4" />
                  </h4>
                  <span className="text-xs text-[#A8B7CC]">Verified Partner</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setIsInquiryFormOpen(true)}
                  className="w-full py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1C64E3] shadow-[0_0_25px_rgba(38,132,255,0.5)] hover:shadow-[0_0_35px_rgba(38,132,255,0.7)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Check Availability &amp; Inquire
                </button>

                <a
                  href={`tel:+254700000000`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-semibold text-[#F5F8FF] bg-[#061426]/70 hover:bg-[#2684FF]/20 border border-[rgba(107,203,255,0.25)] hover:border-[#6BCBFF] transition-all"
                >
                  <FiPhone className="w-4 h-4 text-[#6BCBFF]" />
                  <span>Call Dealership Directly</span>
                </a>
              </div>

              {/* Peace of Mind Guarantee */}
              <div className="pt-4 border-t border-[rgba(107,203,255,0.12)] space-y-2 text-xs text-[#A8B7CC]">
                <div className="flex items-center gap-2">
                  <FiShield className="text-[#6BCBFF] w-4 h-4 flex-shrink-0" />
                  <span>7-Day Return / Inspection Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-[#6BCBFF] w-4 h-4 flex-shrink-0" />
                  <span>100% Clear Title &amp; Paperwork</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Related Vehicles Section */}
        {relatedCars.length > 0 && (
          <div className="pt-8 border-t border-[rgba(107,203,255,0.15)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Similar Available Vehicles
              </h2>
              <Link
                to="/cars"
                className="text-xs font-semibold text-[#6BCBFF] hover:underline"
              >
                View Inventory &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((related) => (
                <CarCard key={related._id} car={related} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Bottom CTA Bar (AutoHub Panel 3 Exact Feature) */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 px-4 py-3 bg-[#061426]/95 backdrop-blur-xl border-t border-[rgba(107,203,255,0.18)] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div>
            <span className="text-[10px] uppercase text-[#A8B7CC] block font-semibold">Starting Price</span>
            <div className="text-base font-black text-white truncate max-w-[140px]">
              {formattedPrice}
            </div>
          </div>

          <button
            onClick={() => setIsInquiryFormOpen(true)}
            className="flex-1 py-3 px-5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_15px_rgba(38,132,255,0.5)] text-center whitespace-nowrap"
          >
            Check Availability →
          </button>
        </div>
      </div>

      {/* Inquiry Form Modal */}
      {isInquiryFormOpen && (
        <InquiryForm
          car={car}
          isOpen={isInquiryFormOpen}
          onClose={() => setIsInquiryFormOpen(false)}
          onSuccess={() => {
            setIsInquiryFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default CarDetails;
