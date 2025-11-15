/**
 * Enhanced scroll to top utility function
 * @param {boolean} smooth - Whether to use smooth scrolling animation
 * @param {number} delay - Delay in milliseconds before scrolling
 */
export const scrollToTop = (smooth = true, delay = 0) => {
    const performScroll = () => {
        // Force scroll to top regardless of current position
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
        
        // Fallback for browsers that don't support smooth scrolling
        if (!smooth) {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    };
    
    if (delay > 0) {
        setTimeout(performScroll, delay);
    } else {
        performScroll();
    }
};

/**
 * Enhanced navigation helper that scrolls to top before navigating
 * @param {function} navigate - React Router's navigate function
 * @param {string} path - Path to navigate to
 * @param {boolean} smooth - Whether to use smooth scrolling
 * @param {number} delay - Delay in milliseconds before scrolling
 */
export const navigateWithScrollToTop = (navigate, path, smooth = true, delay = 0) => {
    scrollToTop(smooth, delay);
    setTimeout(() => navigate(path), smooth ? 100 : 0);
};

/**
 * Scroll to top with retry mechanism for better reliability
 * @param {boolean} smooth - Whether to use smooth scrolling animation
 * @param {number} maxRetries - Maximum number of retry attempts
 */
export const scrollToTopWithRetry = (smooth = true, maxRetries = 3) => {
    let attempts = 0;
    
    const attemptScroll = () => {
        // Always scroll to absolute top
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        if (smooth) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
        
        // Check if we're at the top, retry if not
        attempts++;
        if (attempts < maxRetries && (window.pageYOffset > 10 || document.documentElement.scrollTop > 10)) {
            setTimeout(attemptScroll, 50);
        }
    };
    
    attemptScroll();
};