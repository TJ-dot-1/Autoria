import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import CarCard from './CarCard';
import { carsAPI } from '../utils/api';
import { 
  FiSearch, 
  FiSliders, 
  FiX, 
  FiGrid, 
  FiList, 
  FiChevronDown, 
  FiRotateCcw,
  FiFilter
} from 'react-icons/fi';

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || 'All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'horizontal'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync with URL query parameter changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
    const cond = searchParams.get('condition');
    if (cond && cond !== selectedCondition) {
      setSelectedCondition(cond);
    }
  }, [searchParams]);

  // Fetch cars from API
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { limit: 50 };
      const response = await carsAPI.getAll(params);
      setCars(response.data || []);
    } catch (err) {
      console.error('Fetch cars error:', err);
      setError(err.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Category filter tabs matching AutoHub Panel 4
  const categoryTabs = ['All', 'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Electric'];

  // Extract unique brands from real inventory
  const availableBrands = useMemo(() => {
    const brands = new Set(cars.map(c => c.brand).filter(Boolean));
    return ['All', ...Array.from(brands)];
  }, [cars]);

  // Filter & Sort cars client-side for immediate responsiveness
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Search query (brand, model, category, features)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesBrand = car.brand?.toLowerCase().includes(query);
        const matchesModel = car.model?.toLowerCase().includes(query);
        const matchesType = car.type?.toLowerCase().includes(query);
        const matchesCategory = car.category?.toLowerCase().includes(query);
        const matchesLocation = car.location?.toLowerCase().includes(query);
        if (!matchesBrand && !matchesModel && !matchesType && !matchesCategory && !matchesLocation) {
          return false;
        }
      }

      // Category tab filter
      if (selectedCategory !== 'All') {
        const cat = selectedCategory.toLowerCase();
        const matchesType = car.type?.toLowerCase() === cat;
        const matchesCategory = car.category?.toLowerCase().includes(cat);
        if (!matchesType && !matchesCategory) return false;
      }

      // Brand dropdown filter
      if (selectedBrand !== 'All') {
        if (car.brand?.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      }

      // Fuel dropdown filter
      if (selectedFuel !== 'All') {
        if (car.fuelType?.toLowerCase() !== selectedFuel.toLowerCase()) return false;
      }

      // Condition filter
      if (selectedCondition !== 'All') {
        if (car.condition?.toLowerCase() !== selectedCondition.toLowerCase()) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.pricePerDay || a.price || 0;
      const priceB = b.salePrice || b.pricePerDay || b.price || 0;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'year-new') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'year-old') return (a.year || 0) - (b.year || 0);
      // 'popular'
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [cars, searchQuery, selectedCategory, selectedBrand, selectedFuel, selectedCondition, sortBy]);

  // Clear all filters
  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedFuel('All');
    setSelectedCondition('All');
    setSortBy('popular');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedBrand !== 'All' || selectedFuel !== 'All' || selectedCondition !== 'All';

  return (
    <div className="min-h-screen bg-[#061426] text-[#F5F8FF] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section (AutoHub Panel 4 Style) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2684FF]/10 border border-[#2684FF]/30 text-[#6BCBFF] text-xs font-semibold mb-2">
              <FiFilter className="w-3.5 h-3.5" />
              <span>Explore Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6BCBFF] to-[#2684FF]">Car</span>
            </h1>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search make, model, city..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full text-base sm:text-xs font-medium bg-[#0B1D33]/90 text-white placeholder-[#A8B7CC]/60 border border-[rgba(107,203,255,0.2)] focus:border-[#2684FF] focus:shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all"
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6BCBFF] w-4 h-4" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8B7CC] hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Tabs (AutoHub Panel 4 Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categoryTabs.map((category) => {
            const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2684FF] text-white shadow-[0_0_16px_rgba(38,132,255,0.6)] border border-[#6BCBFF]'
                    : 'bg-[#0B1D33]/70 hover:bg-[#0B1D33] text-[#A8B7CC] hover:text-[#F5F8FF] border border-[rgba(107,203,255,0.15)] hover:border-[#6BCBFF]/40'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Filter Dropdowns Bar */}
        <div className="p-4 rounded-2xl bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.14)] shadow-lg mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Brand Filter */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-base sm:text-xs font-semibold bg-[#061426] text-[#F5F8FF] border border-[rgba(107,203,255,0.2)] focus:border-[#2684FF] cursor-pointer"
                >
                  <option value="All">Brand: All</option>
                  {availableBrands.filter(b => b !== 'All').map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8B7CC] w-3.5 h-3.5 pointer-events-none" />
              </div>

              {/* Fuel Type Filter */}
              <div className="relative">
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-base sm:text-xs font-semibold bg-[#061426] text-[#F5F8FF] border border-[rgba(107,203,255,0.2)] focus:border-[#2684FF] cursor-pointer"
                >
                  <option value="All">Fuel: All</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Diesel">Diesel</option>
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8B7CC] w-3.5 h-3.5 pointer-events-none" />
              </div>

              {/* Condition Filter */}
              <div className="relative">
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-base sm:text-xs font-semibold bg-[#061426] text-[#F5F8FF] border border-[rgba(107,203,255,0.2)] focus:border-[#2684FF] cursor-pointer"
                >
                  <option value="All">Condition: All</option>
                  <option value="New">Brand New</option>
                  <option value="Used">Certified Used</option>
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8B7CC] w-3.5 h-3.5 pointer-events-none" />
              </div>

              {/* Reset Action */}
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#6BCBFF] bg-[#2684FF]/10 hover:bg-[#2684FF]/20 border border-[#2684FF]/30 transition-all"
                >
                  <FiRotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Right Sort & View Controls */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Sort By Dropdown */}
              <div className="relative flex items-center gap-2">
                <span className="text-xs text-[#A8B7CC] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-semibold bg-[#061426] text-[#F5F8FF] border border-[rgba(107,203,255,0.2)] focus:border-[#2684FF] cursor-pointer"
                >
                  <option value="popular">Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year-new">Year: Newest First</option>
                  <option value="year-old">Year: Oldest First</option>
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8B7CC] w-3.5 h-3.5 pointer-events-none" />
              </div>

              {/* View Toggle (Grid / List) */}
              <div className="flex items-center rounded-xl bg-[#061426] p-1 border border-[rgba(107,203,255,0.15)]">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-[#2684FF] text-white shadow-[0_0_8px_rgba(38,132,255,0.6)]' 
                      : 'text-[#A8B7CC] hover:text-white'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('horizontal')}
                  title="List / Horizontal View (AutoHub Style)"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'horizontal' 
                      ? 'bg-[#2684FF] text-white shadow-[0_0_8px_rgba(38,132,255,0.6)]' 
                      : 'text-[#A8B7CC] hover:text-white'
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Results Count Line */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-white">
            <span className="text-[#6BCBFF] font-bold text-base">{filteredCars.length}</span> Cars Found
          </p>

          {selectedCategory !== 'All' && (
            <span className="text-xs text-[#A8B7CC]">
              Filtering by: <span className="text-[#6BCBFF] font-medium">{selectedCategory}</span>
            </span>
          )}
        </div>

        {/* Cars Inventory List / Grid */}
        {loading ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div 
                key={n} 
                className="h-72 rounded-2xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.12)] animate-pulse p-4"
              >
                <div className="h-40 rounded-xl bg-white/5 mb-4" />
                <div className="h-4 w-3/4 rounded bg-white/5 mb-2" />
                <div className="h-3 w-1/2 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center rounded-3xl bg-[#0B1D33]/80 border border-red-500/30">
            <p className="text-red-400 font-medium mb-3">{error}</p>
            <button
              onClick={fetchCars}
              className="px-5 py-2.5 bg-[#2684FF] text-white text-xs font-semibold rounded-full shadow"
            >
              Retry
            </button>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.15)] max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center mx-auto mb-4 border border-[#2684FF]/30">
              <FiSearch className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Cars Found</h3>
            <p className="text-sm text-[#A8B7CC] mb-6">
              We couldn't find any vehicles matching your current search and filter criteria. Try resetting your filters.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.4)]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4 max-w-4xl"
          }>
            {filteredCars.map((car) => (
              <CarCard 
                key={car._id} 
                car={car} 
                layout={viewMode}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Cars;