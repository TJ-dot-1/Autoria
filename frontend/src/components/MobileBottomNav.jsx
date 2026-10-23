import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiHeart, FiPlusCircle, FiUser } from 'react-icons/fi';
import { getFavorites } from '../utils/favorites';
import { useAuth } from '../contexts/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setFavoriteCount(getFavorites().length);
    };
    updateCount();
    window.addEventListener('autoria_favorites_updated', updateCount);
    return () => window.removeEventListener('autoria_favorites_updated', updateCount);
  }, []);

  const navItems = [
    { label: 'Home', path: '/', icon: FiHome },
    { label: 'Search', path: '/cars', icon: FiSearch },
    { label: 'Sell Car', path: '/services/sell-your-car', icon: FiPlusCircle },
    { 
      label: 'Garage', 
      path: '/my-inquiries', 
      icon: FiHeart,
      badge: favoriteCount > 0 ? favoriteCount : null
    },
    { 
      label: isAuthenticated ? 'Profile' : 'Sign In', 
      path: isAuthenticated ? '/dashboard' : '/login', 
      icon: FiUser 
    },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 py-2 bg-[#061426]/90 backdrop-blur-xl border-t border-[rgba(107,203,255,0.15)] shadow-[0_-8px_25px_rgba(0,0,0,0.5)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-[#6BCBFF]' 
                  : 'text-[#A8B7CC] hover:text-[#F5F8FF]'
              }`}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(107,203,255,0.8)]' : ''
                  }`} 
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#2684FF] text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(38,132,255,0.8)]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium tracking-tight mt-1 ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-4 h-1 rounded-full bg-[#6BCBFF] shadow-[0_0_8px_#6BCBFF]" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
