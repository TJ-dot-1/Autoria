import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, 
  FiHeart, 
  FiMenu, 
  FiX, 
  FiUser, 
  FiPlusCircle,
  FiBell,
  FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getFavorites } from '../utils/favorites.js';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpenMobile(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateFavs = () => {
      setFavoriteCount(getFavorites().length);
    };
    updateFavs();
    window.addEventListener('autoria_favorites_updated', updateFavs);
    return () => window.removeEventListener('autoria_favorites_updated', updateFavs);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpenMobile(false);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Cars', path: '/cars' },
    { name: 'Sell Your Car', path: '/services/sell-your-car' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-[#061426]/90 backdrop-blur-xl border-b border-[rgba(107,203,255,0.14)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-gradient-to-b from-[#061426]/95 via-[#061426]/60 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#2684FF]/20 to-[#6BCBFF]/10 border border-[#2684FF]/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(38,132,255,0.35)] group-hover:shadow-[0_0_22px_rgba(107,203,255,0.6)] group-hover:border-[#6BCBFF] transition-all duration-300">
                <img
                  src="/auto.png"
                  alt="Autoria Logo"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-[#6BCBFF] transition-colors">
                  Autoria
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#6BCBFF]/80 font-semibold -mt-1">
                  Motors
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-[#6BCBFF] bg-[#2684FF]/10 shadow-[inset_0_0_12px_rgba(38,132,255,0.2)]'
                        : 'text-[#A8B7CC] hover:text-[#F5F8FF] hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#2684FF] to-[#6BCBFF] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Search Bar & User Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cars, brands..."
                    className="w-56 xl:w-64 pl-10 pr-4 py-2 rounded-full text-xs font-medium bg-[#0B1D33]/90 text-[#F5F8FF] placeholder-[#A8B7CC]/60 border border-[rgba(107,203,255,0.18)] focus:border-[#2684FF] focus:w-72 focus:shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all duration-300"
                  />
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B7CC] w-4 h-4" />
                </div>
              </form>

              {/* Favorites Button */}
              <Link
                to="/my-inquiries"
                title="View Favorites / Inquiries"
                className="relative p-2.5 rounded-full text-[#A8B7CC] hover:text-[#6BCBFF] bg-[#0B1D33]/70 hover:bg-[#2684FF]/15 border border-[rgba(107,203,255,0.16)] transition-all duration-200"
              >
                <FiHeart className="w-4 h-4" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2684FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(38,132,255,0.8)]">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              {/* List / Sell Car CTA */}
              <Link
                to={isAuthenticated ? "/admin/add-car" : "/login?mode=register&redirect=/admin/add-car"}
                className="hidden xl:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#6BCBFF] bg-[#2684FF]/10 hover:bg-[#2684FF]/20 border border-[#2684FF]/40 shadow-[0_0_12px_rgba(38,132,255,0.2)] transition-all"
              >
                <FiPlusCircle className="w-3.5 h-3.5" />
                <span>List Your Car</span>
              </Link>

              {/* Auth / Account Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1D33] border border-[rgba(107,203,255,0.2)] text-xs text-[#F5F8FF] hover:border-[#6BCBFF] transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#2684FF]/30 text-[#6BCBFF] flex items-center justify-center font-bold text-xs">
                      {user?.firstName ? user.firstName[0] : 'U'}
                    </div>
                    <span className="font-medium max-w-[100px] truncate">
                      {user?.firstName || 'Dashboard'}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs text-[#A8B7CC] hover:text-red-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#2684FF] to-[#1754B8] hover:from-[#3B92FF] hover:to-[#1F63D6] shadow-[0_0_16px_rgba(38,132,255,0.4)] transition-all"
                >
                  <FiUser className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Header Icons: Search toggle, Notifications, Hamburger */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
                aria-label="Toggle search"
                className="p-2.5 rounded-xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.15)] text-[#A8B7CC] hover:text-white"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              <Link
                to="/my-inquiries"
                aria-label="Favorites"
                className="relative p-2.5 rounded-xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.15)] text-[#A8B7CC] hover:text-[#6BCBFF]"
              >
                <FiHeart className="w-5 h-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2684FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(38,132,255,0.8)]">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation menu"
                className="p-2.5 rounded-xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.15)] text-[#A8B7CC] hover:text-[#6BCBFF]"
              >
                {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Input Overlay */}
          {isSearchOpenMobile && (
            <div className="lg:hidden pb-4 pt-1 animate-fadeIn">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search car make, model, category..."
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm bg-[#0B1D33] text-white placeholder-[#A8B7CC]/60 border border-[#2684FF] shadow-[0_0_15px_rgba(38,132,255,0.3)] focus:outline-none"
                />
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6BCBFF] w-4 h-4" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#2684FF] text-white text-xs font-semibold rounded-lg shadow"
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer / Slide-Over Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed top-20 right-0 bottom-0 w-80 max-w-full bg-[#061426] border-l border-[rgba(107,203,255,0.15)] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(107,203,255,0.12)]">
                <span className="text-xs uppercase tracking-wider text-[#A8B7CC] font-semibold">
                  Navigation
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30">
                  Autoria AutoHub
                </span>
              </div>

              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-[#2684FF]/15 text-[#6BCBFF] border border-[#2684FF]/30'
                        : 'text-[#F5F8FF] hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    <FiChevronRight className="w-4 h-4 text-[#A8B7CC]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom drawer actions */}
            <div className="pt-6 border-t border-[rgba(107,203,255,0.12)] space-y-3">
              <Link
                to={isAuthenticated ? "/admin/add-car" : "/login?mode=register&redirect=/admin/add-car"}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.4)]"
              >
                <FiPlusCircle className="w-4 h-4" />
                <span>List Your Car For Sale</span>
              </Link>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-[#F5F8FF] bg-[#0B1D33] border border-[rgba(107,203,255,0.2)]"
                  >
                    <FiUser className="w-4 h-4 text-[#6BCBFF]" />
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full py-2 text-xs text-red-400 hover:text-red-300 text-center"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-[#F5F8FF] bg-[#0B1D33] border border-[rgba(107,203,255,0.2)]"
                >
                  <FiUser className="w-4 h-4 text-[#6BCBFF]" />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;