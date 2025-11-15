// Shared animation utilities and variants for Framer Motion
import { motion } from 'framer-motion';

// Page transition variants
export const pageTransitions = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Container variants for staggered animations
export const containerVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Item variants for list animations
export const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Card variants for grid layouts
export const cardVariants = {
  hidden: { 
    y: 50, 
    opacity: 0,
    scale: 0.9
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Button hover and tap variants
export const buttonVariants = {
  hover: {
    scale: 1.05,
    y: -2,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: { duration: 0.3 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Social media icon variants
export const socialVariants = {
  hidden: { 
    scale: 0, 
    opacity: 0,
    rotate: -180
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      delay: 0.1
    }
  },
  hover: { 
    scale: 1.1, 
    rotate: 5,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.9,
    rotate: 0,
    transition: { duration: 0.1 }
  }
};

// Floating animation for decorative elements
export const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse animation for badges and notifications
export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Loading spinner variants
export const spinVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Fade in animation variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Slide in from left variants
export const slideInLeftVariants = {
  hidden: { 
    x: -100, 
    opacity: 0 
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Slide in from right variants
export const slideInRightVariants = {
  hidden: { 
    x: 100, 
    opacity: 0 
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Slide in from bottom variants
export const slideInBottomVariants = {
  hidden: { 
    y: 100, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Scale animation variants
export const scaleVariants = {
  hidden: { 
    scale: 0, 
    opacity: 0 
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  }
};

// Heart beat animation for favorites
export const heartBeatVariants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2
    }
  }
};

// Shake animation for errors
export const shakeVariants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5
    }
  }
};

// Bounce animation for success states
export const bounceVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 300
    }
  }
};

// Gradient animation for text
export const gradientTextVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Hover lift effect for cards
export const hoverLiftVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Ripple effect for buttons
export const rippleVariants = {
  tap: (clickX, clickY) => ({
    scale: 0,
    opacity: 1,
    x: clickX - 50,
    y: clickY - 50,
    transition: {
      scale: { duration: 0.6 },
      opacity: { duration: 0.6 },
      x: { duration: 0.6 },
      y: { duration: 0.6 }
    }
  })
};

// Scroll reveal animation
export const scrollRevealVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Stagger container for lists
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Stagger items
export const staggerItem = {
  hidden: { 
    y: 30, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Page loader variants
export const pageLoaderVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Notification slide in/out
export const notificationVariants = {
  hidden: {
    x: "100%",
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Utility function to get random delay for staggered animations
export const getStaggerDelay = (index, baseDelay = 0.1) => {
  return index * baseDelay;
};

// Utility function for viewport-based animations
export const viewportConfig = {
  once: true,
  amount: 0.3
};

// Utility function for card hover effects
export const getCardHoverProps = () => ({
  whileHover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
});

// Utility function for button hover effects
export const getButtonHoverProps = () => ({
  whileHover: {
    scale: 1.05,
    y: -2,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: { duration: 0.3 }
  },
  whileTap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
});

// Reusable motion components with common configurations
export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
export const MotionImg = motion.img;
export const MotionButton = motion.button;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionP = motion.p;
export const MotionUl = motion.ul;
export const MotionLi = motion.li;

// Animation presets for different UI elements
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  slideLeft: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  slideRight: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 200, damping: 10 }
  }
};