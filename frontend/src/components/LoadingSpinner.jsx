import React from 'react';
import { motion } from 'framer-motion';
import { spinVariants } from '../utils/animations';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Loading...', 
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
    green: 'border-green-500 border-t-transparent',
    blue: 'border-blue-500 border-t-transparent'
  };

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`border-4 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        variants={spinVariants}
        animate="animate"
      />
      {showText && (
        <motion.p
          className={`text-sm font-medium ${
            color === 'white' ? 'text-white' : 'text-gray-600'
          }`}
          animate={{ 
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;

// Specialized loading components for different contexts
export const PageLoader = ({ text = "Loading..." }) => (
  <motion.div 
    className="min-h-screen bg-gray-50 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <LoadingSpinner size="large" text={text} />
  </motion.div>
);

export const ButtonLoader = ({ color = 'white', size = 'small' }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <motion.div
      className={`${size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} border-2 ${color === 'white' ? 'border-white border-t-transparent' : 'border-primary border-t-transparent'} rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    />
  </motion.div>
);

export const SkeletonLoader = ({ 
  width = "100%", 
  height = "20px", 
  rounded = "md",
  className = "" 
}) => {
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full"
  };

  return (
    <motion.div
      className={`bg-gray-200 ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0.6 }}
      animate={{ 
        opacity: [0.6, 0.8, 0.6],
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />
  );
};

export const CardSkeleton = ({ count = 1 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <SkeletonLoader width="60px" height="60px" rounded="full" />
          <div className="flex-1">
            <SkeletonLoader width="60%" height="16px" />
            <SkeletonLoader width="40%" height="12px" className="mt-2" />
          </div>
        </div>
        <SkeletonLoader width="100%" height="20px" className="mb-2" />
        <SkeletonLoader width="80%" height="20px" className="mb-4" />
        <div className="flex space-x-2">
          <SkeletonLoader width="80px" height="32px" rounded="lg" />
          <SkeletonLoader width="80px" height="32px" rounded="lg" />
        </div>
      </motion.div>
    ))}
  </div>
);

export const ListLoader = ({ items = 5, showAvatar = true }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, index) => (
      <motion.div
        key={index}
        className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {showAvatar && (
          <SkeletonLoader width="40px" height="40px" rounded="full" />
        )}
        <div className="flex-1">
          <SkeletonLoader width="70%" height="16px" className="mb-1" />
          <SkeletonLoader width="50%" height="12px" />
        </div>
        <SkeletonLoader width="60px" height="24px" rounded="lg" />
      </motion.div>
    ))}
  </div>
);

export const ProgressLoader = ({ 
  progress = 0, 
  showPercentage = true, 
  animated = true,
  color = "primary",
  height = "h-2"
}) => {
  const colorClasses = {
    primary: "bg-primary",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500"
  };

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: "easeOut"
          }}
        />
      </div>
    </div>
  );
};