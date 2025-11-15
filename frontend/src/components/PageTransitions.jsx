import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  // Enhanced page variants for different page types
  const getPageVariants = () => {
    const pathname = location.pathname;
    
    // Different transition types for different pages
    if (pathname.includes('/car/')) {
      // Car details pages get a slide in effect
      return {
        initial: {
          opacity: 0,
          x: 100,
          scale: 0.95,
        },
        in: {
          opacity: 1,
          x: 0,
          scale: 1,
        },
        out: {
          opacity: 0,
          x: -100,
          scale: 0.95,
        },
      };
    } else if (pathname.includes('/admin/')) {
      // Admin pages get a slide down effect
      return {
        initial: {
          opacity: 0,
          y: -50,
          scale: 0.98,
        },
        in: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
        out: {
          opacity: 0,
          y: 50,
          scale: 0.98,
        },
      };
    } else if (pathname.includes('/dashboard')) {
      // Dashboard gets a bounce effect
      return {
        initial: {
          opacity: 0,
          scale: 0.8,
          rotateX: -15,
        },
        in: {
          opacity: 1,
          scale: 1,
          rotateX: 0,
        },
        out: {
          opacity: 0,
          scale: 0.8,
          rotateX: 15,
        },
      };
    } else {
      // Default fade and slide up
      return {
        initial: {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        in: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
        out: {
          opacity: 0,
          y: -30,
          scale: 0.95,
        },
      };
    }
  };

  // Enhanced page transition with different easings
  const getPageTransition = () => {
    const pathname = location.pathname;
    
    if (pathname.includes('/car/')) {
      return {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      };
    } else if (pathname.includes('/admin/')) {
      return {
        type: 'tween',
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.8,
      };
    } else if (pathname.includes('/dashboard')) {
      return {
        type: 'spring',
        stiffness: 200,
        damping: 25,
        duration: 0.7,
      };
    } else {
      return {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5,
      };
    }
  };

  const variants = getPageVariants();
  const transition = getPageTransition();

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;