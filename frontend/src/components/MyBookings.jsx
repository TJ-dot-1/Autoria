import React, { useState, useEffect } from 'react'
import Title from '../components/Title'

const MyBookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchMyBookings = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            if (!response.ok) {
                throw new Error('Failed to fetch bookings')
            }
            
            const data = await response.json()
            setBookings(data)
        } catch (error) {
            console.error('Error fetching bookings:', error)
            setError('Failed to load your bookings. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyBookings()
    }, [])

    const getStatusColor = (status) => {
        const colors = {
            'confirmed': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'cancelled': 'bg-red-100 text-red-800',
            'completed': 'bg-blue-100 text-blue-800',
            'active': 'bg-emerald-100 text-emerald-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const calculateTotal = (pricePerDay, startDate, endDate) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        return (pricePerDay * days).toFixed(2)
    }

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return
        }

        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.ok) {
                fetchMyBookings() // Refresh the list
            } else {
                throw new Error('Failed to cancel booking')
            }
        } catch (error) {
            console.error('Error cancelling booking:', error)
            setError('Failed to cancel booking. Please try again.')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <Title title="My Bookings" subtitle="Your rental history and upcoming trips" />
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <Title title="My Bookings" subtitle="Your rental history and upcoming trips" />
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <div className="text-red-600 mb-4">{error}</div>
                        <button
                            onClick={fetchMyBookings}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <Title 
                    title="My Bookings" 
                    subtitle="Your rental history and upcoming trips"
                />

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            You haven't made any bookings yet. Start exploring our collection of premium vehicles and plan your next trip.
                        </p>
                        <button
                            onClick={() => window.location.href = '/cars'}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Browse Cars
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        {/* Car Info */}
                                        <div className="flex items-start space-x-4 flex-1">
                                            <img 
                                                src={booking.car?.images?.[0] || '/default-car.jpg'} 
                                                alt={`${booking.car?.make} ${booking.car?.model}`}
                                                className="w-20 h-20 object-cover rounded-xl"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {booking.car?.make} {booking.car?.model}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>Pickup: {formatDate(booking.startDate)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>Return: {formatDate(booking.endDate)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                        <span>Total: ${calculateTotal(booking.car?.pricePerDay, booking.startDate, booking.endDate)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{booking.pickupLocation}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col space-y-3 lg:items-end">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary mb-1">
                                                    ${booking.car?.pricePerDay}/day
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Booking #{booking.id}
                                                </div>
                                            </div>
                                            
                                            <div className="flex space-x-3">
                                                {booking.status === 'pending' || booking.status === 'confirmed' ? (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : null}
                                                
                                                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                {booking.specialRequests && (
                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyBookings