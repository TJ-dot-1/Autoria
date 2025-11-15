import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.jsx';

// SVG Icon Components (moved outside to avoid render-time creation)
const SearchIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const MenuIcon = ({ open, scrolled, isHome }) => (
    <div className="w-6 h-6 flex flex-col justify-center space-y-1">
        <span className={`block h-0.5 w-full transition-all duration-300 ${
            open
                ? 'rotate-45 translate-y-1.5 bg-[var(--text-primary)]'
                : scrolled || !isHome
                    ? 'bg-[var(--text-primary)]'
                    : 'bg-white'
        }`}></span>
        <span className={`block h-0.5 w-full transition-all duration-300 ${
            open
                ? 'opacity-0'
                : scrolled || !isHome
                    ? 'bg-[var(--text-primary)]'
                    : 'bg-white'
        }`}></span>
        <span className={`block h-0.5 w-full transition-all duration-300 ${
            open
                ? '-rotate-45 -translate-y-1.5 bg-[var(--text-primary)]'
                : scrolled || !isHome
                    ? 'bg-[var(--text-primary)]'
                    : 'bg-white'
        }`}></span>
    </div>
);

const CarIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

const ThemeToggleIcon = ({ isDark, className = "w-5 h-5" }) => (
    isDark ? (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ) : (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    )
);

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toggleTheme, isDark } = useTheme();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        if (open) {
            setOpen(false);
        }
    }, [location.pathname, open]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (open && !event.target.closest('.navbar-content')) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [open]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/cars?q=${encodeURIComponent(searchQuery)}`);
            setOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogin = () => {
        navigate('/owner');
        setOpen(false);
    };

    const menuLinks = [
        { name: "Home", path: "/" },
        { name: "Cars", path: "/cars" },
        { name: "Services", path: "/services" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" }
    ];

    const isHomePage = location.pathname === '/';

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-content ${
                scrolled
                    ? 'shadow-lg backdrop-blur-sm'
                    : isHomePage
                        ? 'bg-transparent'
                        : 'shadow-md'
            }`} style={{
                backgroundColor: scrolled ? 'var(--bg-primary)' : (isHomePage ? 'transparent' : 'var(--bg-primary)'),
                opacity: scrolled ? 0.95 : 1
            }}>
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center z-50 group"
                        >
                            <div className={`w-10 h-10 rounded-lg shadow-md border-2 transition-all duration-300 ${
                                scrolled || !isHomePage
                                    ? 'border-[var(--border-color)] bg-white'
                                    : 'border-white/30 bg-white/10 backdrop-blur-sm'
                            }`}>
                                <img
                                    src="/auto.png"
                                    alt="Autoria Logo"
                                    className="w-full h-full rounded-lg object-contain p-1"
                                />
                            </div>
                            <span className={`ml-2 text-xl font-bold transition-all duration-300 ${
                                scrolled || !isHomePage
                                    ? 'text-[var(--text-primary)]'
                                    : 'text-white'
                            } group-hover:text-primary-light`}>
                                Autoria
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-8">
                            {menuLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className={`font-medium transition-all duration-300 hover:text-primary relative ${
                                        location.pathname === link.path
                                            ? 'text-primary font-semibold'
                                            : scrolled || !isHomePage
                                                ? 'text-[var(--text-primary)]'
                                                : 'text-white'
                                    }`}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary rounded-full"></span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Search & Auth */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-6">
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="relative">
                                <div className={`relative transition-all duration-300 ${
                                    isSearchFocused ? 'scale-105' : 'scale-100'
                                }`}>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        placeholder="Search cars..."
                                        className={`w-64 px-4 py-2 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                                            scrolled || !isHomePage
                                                ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                                                : 'border-white/30 bg-white/20 text-white placeholder-white/70 backdrop-blur-sm'
                                        }`}
                                    />
                                    <button
                                        type="submit"
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                            scrolled || !isHomePage
                                                ? 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                                                : 'text-white hover:text-gray-200'
                                        }`}
                                    >
                                        <SearchIcon />
                                    </button>
                                </div>
                            </form>

                            {/* Auth Buttons */}
                            <div className="flex items-center space-x-4">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                                        scrolled || !isHomePage
                                            ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            : 'text-white hover:bg-white/20'
                                    }`}
                                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                                >
                                    <ThemeToggleIcon isDark={isDark} />
                                </button>

                                <button
                                    onClick={handleLogin}
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                                        scrolled || !isHomePage
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                                            : 'bg-white dark:bg-gray-800 text-primary dark:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg'
                                    }`}
                                >
                                    Login
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className={`lg:hidden p-2 rounded-md transition-all duration-300 z-50 ${
                                scrolled || !isHomePage 
                                    ? 'hover:bg-gray-100 text-gray-700' 
                                    : 'hover:bg-white/20 text-white'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(!open);
                            }}
                        >
                            <MenuIcon open={open} scrolled={scrolled} isHome={isHomePage} />
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`lg:hidden absolute left-0 right-0 bg-[var(--bg-primary)] shadow-xl transform transition-all duration-300 ease-in-out overflow-hidden ${
                        open ? 'translate-y-0 opacity-100 max-h-screen' : '-translate-y-4 opacity-0 max-h-0'
                    }`} style={{ borderTop: '1px solid var(--border-color)' }}>
                        <div className="py-6 px-4 space-y-4">
                            {menuLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className={`block py-3 px-4 font-medium transition-all duration-300 hover:text-primary hover:bg-[var(--bg-secondary)] rounded-lg transform hover:translate-x-2 ${
                                        location.pathname === link.path
                                            ? 'text-primary bg-[var(--bg-secondary)]'
                                            : 'text-[var(--text-primary)]'
                                    }`}
                                    onClick={() => setOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            
                            {/* Mobile Search */}
                            <div className="border-t border-[var(--border-color)] pt-4">
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full py-3 px-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                                        placeholder="Search cars..."
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <SearchIcon />
                                    </button>
                                </form>
                            </div>
                            
                            {/* Mobile Auth Buttons */}
                            <div className="flex flex-col space-y-3 pt-4">
                                {/* Mobile Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="w-full py-3 flex items-center justify-center space-x-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--bg-primary)] transition-all duration-300"
                                >
                                    <ThemeToggleIcon isDark={isDark} />
                                    <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
                                </button>

                                <button
                                    onClick={handleLogin}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Login to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from being hidden under fixed navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;