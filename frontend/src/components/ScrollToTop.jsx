import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        const scrollToTop = () => {
            // Force immediate scroll to top
            window.scrollTo(0, 0)
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
            
            // Smooth scroll as fallback
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }

        // Small delay to ensure DOM is ready
        const timer = setTimeout(scrollToTop, 50)
        
        return () => clearTimeout(timer)
    }, [pathname])

    return null
}

export default ScrollToTop