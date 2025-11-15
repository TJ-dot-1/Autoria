import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  hoverLiftVariants,
  getButtonHoverProps
} from '../utils/animations';

// Ripple effect for buttons
export const RippleButton = ({
  children,
  className = "",
  onClick,
  disabled = false,
  variant = "primary",
  size = "medium"
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    if (disabled) return;
    
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const baseClasses = "relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-primary text-white focus:ring-primary hover:bg-primary-dark",
    secondary: "bg-gray-200 text-gray-900 focus:ring-gray-500 hover:bg-gray-300",
    outline: "border-2 border-primary text-primary focus:ring-primary hover:bg-primary hover:text-white",
    danger: "bg-red-500 text-white focus:ring-red-500 hover:bg-red-600",
    success: "bg-green-500 text-white focus:ring-green-500 hover:bg-green-600"
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={(e) => {
        createRipple(e);
        onClick?.(e);
      }}
      disabled={disabled}
      {...getButtonHoverProps()}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

// Floating Action Button
export const FloatingActionButton = ({ 
  icon: Icon, 
  onClick, 
  position = "bottom-right",
  color = "primary",
  size = "medium",
  badge = null,
  tooltip = "",
  ...props 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-left": "top-4 left-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  };

  const colorClasses = {
    primary: "bg-primary hover:bg-primary-dark",
    secondary: "bg-gray-600 hover:bg-gray-700",
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600"
  };

  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-14 h-14",
    large: "w-16 h-16"
  };

  const iconSizes = {
    small: "w-5 h-5",
    medium: "w-6 h-6",
    large: "w-7 h-7"
  };

  return (
    <div className="relative">
      <motion.button
        className={`fixed ${positionClasses[position]} ${colorClasses[color]} ${sizeClasses[size]} rounded-full shadow-lg flex items-center justify-center text-white z-40`}
        onClick={onClick}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -5, 5, -5, 0],
        }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        {...props}
      >
        <Icon className={iconSizes[size]} />
        
        {badge && (
          <motion.span 
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            {badge}
          </motion.span>
        )}
      </motion.button>
      
      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {tooltip}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Interactive Card with hover effects
export const InteractiveCard = ({ 
  children, 
  className = "",
  variant = "default",
  onClick,
  disabled = false,
  ...props 
}) => {
  const variantClasses = {
    default: "bg-white hover:shadow-xl",
    elevated: "bg-white shadow-lg hover:shadow-2xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl",
    glass: "bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg"
  };

  return (
    <motion.div
      className={`${variantClasses[variant]} ${className} rounded-2xl transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
      variants={hoverLiftVariants}
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : { scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Notification/Toast Component
export const ToastNotification = ({ 
  message, 
  type = "info", 
  duration = 3000,
  onClose,
  show = false 
}) => {
  const [visible, setVisible] = useState(show);

  React.useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white"
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed top-4 right-4 ${typeClasses[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm`}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{icons[type]}</span>
            <span className="flex-1">{message}</span>
            <motion.button
              className="text-white/80 hover:text-white text-lg"
              onClick={() => {
                setVisible(false);
                onClose?.();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Progress Circle Component
export const AnimatedProgressCircle = ({ 
  percentage = 0, 
  size = 100, 
  strokeWidth = 8,
  color = "#3B82F6",
  backgroundColor = "#E5E7EB",
  showPercentage = true,
  animated = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={animated ? { strokeDashoffset: circumference } : {}}
          animate={{ strokeDashoffset }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      {showPercentage && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: animated ? 0.5 : 0 }}
        >
          <span className="text-lg font-bold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </motion.div>
      )}
    </div>
  );
};

// Tilt effect component
export const TiltEffect = ({ 
  children, 
  className = "", 
  tiltMaxAngleX = 15,
  tiltMaxAngleY = 15,
  perspective = 1000,
  ...props 
}) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * tiltMaxAngleX;
    const rotateY = ((centerX - x) / centerX) * tiltMaxAngleY;
    
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      className={`${className} cursor-pointer`}
      style={{ 
        perspective,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        rotateX: tilt.rotateX, 
        rotateY: tilt.rotateY 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Magnetic button effect
export const MagneticButton = ({ 
  children, 
  className = "", 
  onClick,
  strength = 0.3,
  ...props 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      setMousePosition({ x: deltaX, y: deltaY });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        x: mousePosition.x, 
        y: mousePosition.y 
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Typing animation component
export const TypingAnimation = ({ 
  text, 
  speed = 100, 
  className = "",
  showCursor = true,
  loop = false,
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (loop && currentIndex === text.length) {
      const timer = setTimeout(() => {
        setDisplayText("");
        setCurrentIndex(0);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, loop, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-current ml-1"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </span>
  );
};

// Search input with animation
export const AnimatedSearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = "",
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className={`relative ${className}`}
      animate={{ 
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <motion.svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ 
            rotate: isFocused ? 360 : 0,
            scale: isFocused ? 1.1 : 1 
          }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </motion.svg>
      </div>
      <motion.input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        whileFocus={{ 
          borderColor: "#3B82F6",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
        }}
        {...props}
      />
    </motion.div>
  );
};