import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';
import { carsAPI } from '../utils/api';
import BookingForm from '../components/BookingForm';
// animation helpers not used here

const CarDetails = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
    const [car, setCar] = useState(null);
    const [error, setError] = useState('');
    const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';

    useEffect(() => {
        const fetchCar = async () => {
            try {
                setIsLoading(true);
                setError('');
                const response = await carsAPI.getById(id);
                
                if (response.success) {
                    setCar(response.data);
                } else {
                    setError('Car not found');
                }
            } catch (error) {
                console.error('Error fetching car:', error);
                setError('Failed to load car details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCar();
        }
    }, [id]);

    const currency = import.meta.env.VITE_CURRENCY || 'KSh';

    // API host for image URLs
    const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/i, '').replace(/\/$/, '');

    const getImageSrc = (img) => {
        if (!img) return PLACEHOLDER_IMAGE;
        // If img is an object with url
        const src = typeof img === 'string' ? img : (img.url || img.secure_url || img.path);
        if (!src) return PLACEHOLDER_IMAGE;
        // If already an absolute URL, use it
        if (/^https?:\/\//i.test(src)) return src;
        // Ensure leading slash
        const path = src.startsWith('/') ? src : `/${src}`;
        return `${API_HOST}${path}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p
                        className="text-[var(--text-secondary)]"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Loading car details...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border-color)]">
                        <svg className="w-12 h-12 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.692-2.565M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Car Not Found</h2>
                    <p className="text-[var(--text-secondary)] mb-6">{error || "The car you're looking for doesn't exist."}</p>
                    <Link
                        to="/"
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                        onClick={() => scrollToTop()}
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Normalize common fields (support both camelCase and snake_case from different sources)
    const pricePerDay = car.pricePerDay ?? car.price_per_day ?? car.price;
    const seatingCapacity = car.seatingCapacity ?? car.seating_capacity ?? car.seating_capacity;
    const fuelType = car.fuelType ?? car.fuel_type ?? car.fuel;
    const transmission = car.transmission ?? car.transmission;

    // Handle car images from the API or legacy/local data
    const carImages = (car.images && car.images.length > 0)
        ? car.images.map(img => getImageSrc(img))
        : [getImageSrc(car.primaryImage || car.image || car.imageUrl || null)];

    // If only one image, duplicate it for gallery effect
    const displayImages = carImages.length > 1 ? carImages : [...carImages, ...carImages, ...carImages];

    const getCategoryColor = (category) => {
        const colors = {
            'SUV': 'bg-blue-100 text-blue-800',
            'Sedan': 'bg-green-100 text-green-800',
            'Hatchback': 'bg-purple-100 text-purple-800',
            'Luxury': 'bg-yellow-100 text-yellow-800',
            'Sports': 'bg-red-100 text-red-800',
            'Electric': 'bg-emerald-100 text-emerald-800',
            'Van': 'bg-orange-100 text-orange-800',
            'Compact': 'bg-indigo-100 text-indigo-800',
            'Mid-size': 'bg-pink-100 text-pink-800',
            'Full-size': 'bg-teal-100 text-teal-800',
            'Hybrid': 'bg-green-100 text-green-800',
            'Convertible': 'bg-orange-100 text-orange-800',
            'Truck': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getFuelTypeIcon = (fuelType) => {
        const icons = {
            'Gasoline': '⛽',
            'Diesel': '🛢️',
            'Electric': '⚡',
            'Hybrid': '🔋',
            'CNG': '💨',
            'LPG': '💨',
            'Plug-in Hybrid': '🔋'
        };
        return icons[fuelType] || '⛽';
    };

    return (
        <motion.div
            className="min-h-screen bg-[var(--bg-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Breadcrumb */}
            <motion.div
                className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center space-x-2 text-sm">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link to="/" className="text-primary hover:text-primary-dark transition-colors" onClick={() => scrollToTop()}>Home</Link>
                        </motion.div>
                        <motion.span
                            className="text-[var(--text-secondary)]"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            /
                        </motion.span>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link to="/cars" className="text-primary hover:text-primary-dark transition-colors" onClick={() => scrollToTop()}>Cars</Link>
                        </motion.div>
                        <motion.span
                            className="text-[var(--text-secondary)]"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                            /
                        </motion.span>
                        <motion.span
                            className="text-[var(--text-secondary)]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {car.brand} {car.model}
                        </motion.span>
                    </nav>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images and Description */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-lg overflow-hidden mb-6 border border-[var(--border-color)]">
                            <div className="relative">
                                <motion.img
                                    key={selectedImage}
                                    src={displayImages[selectedImage]}
                                    alt={`${car.brand} ${car.model}`}
                                    crossOrigin="anonymous"
                                    className="w-full h-96 object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                                    }}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        car.isAvailable 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-red-500 text-white'
                                    }`}>
                                        {car.isAvailable ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${getCategoryColor(car.category)}`}>
                                        {car.category}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Thumbnail Images */}
                            {displayImages.length > 1 && (
                                <div className="p-4 border-t">
                                    <div className="flex space-x-2 overflow-x-auto">
                                        {displayImages.map((image, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                                                    selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${car.brand} ${car.model} view ${index + 1}`}
                                                    crossOrigin="anonymous"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                                                    }}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Car Description */}
                        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-lg p-6 mb-6 border border-[var(--border-color)]">
                            <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Description</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {car.description || `The ${car.brand} ${car.model} is a ${car.category?.toLowerCase() || ''} vehicle that offers excellent performance and comfort. With ${seatingCapacity || 'N/A'} seats and ${fuelType ? fuelType.toLowerCase() : 'fuel'} engine, it's perfect for both city driving and long trips.`}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-lg p-6 border border-[var(--border-color)]">
                            <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Features & Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-3 text-[var(--text-primary)]">Basic Info</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-secondary)]">Brand:</span>
                                            <span className="font-medium text-[var(--text-primary)]">{car.brand}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-secondary)]">Model:</span>
                                            <span className="font-medium text-[var(--text-primary)]">{car.model}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-secondary)]">Year:</span>
                                            <span className="font-medium text-[var(--text-primary)]">{car.year}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-secondary)]">Location:</span>
                                            <span className="font-medium text-[var(--text-primary)]">{car.location}</span>
                                        </div>
                                        {car.mileage && (
                                            <div className="flex justify-between">
                                                <span className="text-[var(--text-secondary)]">Mileage:</span>
                                                <span className="font-medium text-[var(--text-primary)]">{car.mileage} miles</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3 text-[var(--text-primary)]">Specifications</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{getFuelTypeIcon(fuelType)}</span>
                                                <span className="text-[var(--text-secondary)]">Fuel Type:</span>
                                            </div>
                                            <span className="font-medium text-[var(--text-primary)]">{fuelType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-secondary)]">Transmission:</span>
                                            <span className="font-medium text-[var(--text-primary)]">{transmission}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-secondary)]">Seating:</span>
                                            <span className="font-medium text-[var(--text-primary)]">{seatingCapacity} seats</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-secondary)]">Doors:</span>
                                            <span className="font-medium text-[var(--text-primary)]">{car.doors}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-secondary)]">Category:</span>
                                            <span className="font-medium text-[var(--text-primary)]">{car.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Features List */}
                            {car.features && car.features.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-semibold mb-3 text-[var(--text-primary)]">Features</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {car.features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-lg p-6 sticky top-6 border border-[var(--border-color)]">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">{car.brand} {car.model}</h2>
                                <p className="text-[var(--text-secondary)]">{car.year} • {car.location}</p>
                                {car.color && car.color.exterior && (
                                    <p className="text-[var(--text-secondary)] text-sm mt-1">Color: {car.color.exterior}</p>
                                )}
                            </div>

                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold text-primary">
                                    {currency}{pricePerDay ? Number(pricePerDay).toLocaleString() : ''}
                                </span>
                                <span className="text-[var(--text-secondary)] text-lg"> / day</span>
                                {car.pricePerWeek && (
                                    <div className="text-sm text-[var(--text-secondary)] mt-1">
                                        {currency}{car.pricePerWeek?.toLocaleString()} / week
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span>Insurance Included</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>AC Included</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <motion.button
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                                        car.isAvailable
                                            ? 'bg-primary text-white hover:bg-primary-dark'
                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border-color)]'
                                    }`}
                                    disabled={!car.isAvailable}
                                    onClick={() => {
                                        if (car.isAvailable) {
                                            setIsBookingFormOpen(true);
                                        }
                                    }}
                                    whileHover={car.isAvailable ? { scale: 1.02 } : {}}
                                    whileTap={car.isAvailable ? { scale: 0.98 } : {}}
                                >
                                    {car.isAvailable ? 'Rent Now' : 'Not Available'}
                                </motion.button>
                                <motion.button
                                    className="w-full py-3 px-6 border-2 border-[var(--border-color)] rounded-lg font-semibold text-[var(--text-primary)] hover:border-primary hover:text-primary transition-colors bg-[var(--bg-primary)]"
                                    onClick={() => {
                                        // Make a phone call
                                        window.location.href = 'tel:0706667129';
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Contact Owner
                                </motion.button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
                                <div className="text-center text-sm text-[var(--text-secondary)] mb-2">
                                    Need help booking?
                                </div>
                                <Link
                                    to="/faq"
                                    className="block w-full py-2 text-primary hover:text-primary-dark transition-colors text-sm text-center"
                                    onClick={() => scrollToTop()}
                                >
                                    View FAQ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Booking Form Modal */}
            <BookingForm
                car={car}
                isOpen={isBookingFormOpen}
                onClose={() => setIsBookingFormOpen(false)}
                onSuccess={() => {
                    // Handle successful booking submission
                    console.log('Booking submitted successfully');
                }}
            />
        </motion.div>
    );
};

export default CarDetails;
