import React, { useState, useEffect, useRef } from 'react'
import Title from '../../components/Title'
import { bookingsAPI } from '../../utils/api'

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null

  const getAvailabilityStatus = (booking) => {
    // Enhanced availability logic with more detailed status
    const carAvailable = booking.car?.isAvailable !== false
    const hasActiveBooking = ['Confirmed', 'Active'].includes(booking.status)

    if (hasActiveBooking) {
      return {
        status: 'Booked',
        color: 'text-red-600',
        bg: 'bg-red-100',
        icon: '🚫',
        description: `In use until ${formatDate(booking.bookingPeriod?.endDate)}`
      }
    } else if (carAvailable) {
      return {
        status: 'Available',
        color: 'text-green-600',
        bg: 'bg-green-100',
        icon: '✅',
        description: 'Ready for booking'
      }
    } else {
      return {
        status: 'Unavailable',
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        icon: '⏸️',
        description: 'Temporarily unavailable'
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      case 'Completed':
        return 'bg-blue-100 text-blue-800'
      case 'Active':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const availability = getAvailabilityStatus(booking)

  const handleCallCustomer = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`
    }
  }

  const handleEmailCustomer = (email) => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Regarding your car booking&body=Hello,`
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <p className="text-sm text-gray-600 mt-1">Booking #{booking.bookingNumber || 'N/A'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Booking Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-semibold text-green-600">KSh {booking.pricing?.totalAmount?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{booking.pricing?.totalDays || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(booking.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">🚗</span>
                  Car Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Vehicle:</span>
                    <span className="font-semibold">{booking.car?.brand} {booking.car?.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Year:</span>
                    <span>{booking.car?.year || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Color:</span>
                    <span>{booking.car?.color || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{booking.car?.location || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Car Availability:</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${availability.color}`}>{availability.icon}</span>
                      <div>
                        <div className={`text-sm font-medium ${availability.color}`}>{availability.status}</div>
                        <div className="text-xs text-gray-500">{availability.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">👤</span>
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p className="text-lg font-semibold">
                      {booking.driver?.firstName} {booking.driver?.lastName}
                    </p>
                  </div>
                  {booking.driver?.phone && (
                    <div>
                      <span className="font-medium">Phone:</span>
                      <div className="flex items-center space-x-2">
                        <p className="font-mono text-blue-600">{booking.driver.phone}</p>
                        <button
                          onClick={() => handleCallCustomer(booking.driver.phone)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                          title="Call"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  {(booking.driver?.email || booking.user?.email) && (
                    <div>
                      <span className="font-medium">Email:</span>
                      <div className="flex items-center space-x-2">
                        <p className="truncate max-w-xs text-blue-600">{booking.driver?.email || booking.user?.email}</p>
                        <button
                          onClick={() => handleEmailCustomer(booking.driver?.email || booking.user?.email)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                          title="Email"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">📅</span>
                  Booking Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Pickup Date:</span>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{formatDate(booking.bookingPeriod?.startDate)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.bookingPeriod?.startDate).toLocaleTimeString('en-KE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Return Date:</span>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">{formatDate(booking.bookingPeriod?.endDate)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.bookingPeriod?.endDate).toLocaleTimeString('en-KE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Pickup Location:</span>
                    <span className="text-right">{booking.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Return Location:</span>
                    <span className="text-right">{booking.returnLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button
              onClick={() => {/* handleEditBooking(booking) */}}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Booking
            </button>
            <button
              onClick={() => {/* handleDeleteBooking(booking._id) */}}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Cancel Booking
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ManageBookings = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [animationStates, setAnimationStates] = useState(new Map())
  const [bulkSelected, setBulkSelected] = useState(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const intervalRef = useRef(null)

  // Audio context for notifications
  const audioContextRef = useRef(null)

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioContextRef.current
  }

  const playNotificationSound = (type) => {
    if (!soundEnabled) return

    try {
      const audioContext = initAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different frequencies for different notification types
      if (type === 'available') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
      } else if (type === 'unavailable') {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2)
      }

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log('Audio notification not available:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll()
      setBookings(response.data || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    }
  }

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchBookings()
      }, 30000) // Refresh every 30 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [autoRefresh])

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings()
  }, [])

  // Enhanced availability tracking with animations
  const trackAvailabilityChange = (bookingId, type) => {
    setAnimationStates(prev => new Map(prev.set(bookingId, type)))
    
    // Play sound notification
    playNotificationSound(type)

    // Show visual notification
    // Clear animation after 3 seconds
    setTimeout(() => {
      setAnimationStates(prev => {
        const newMap = new Map(prev)
        newMap.delete(bookingId)
        return newMap
      })
    }, 3000)
  }

  // Bulk selection handlers
  const toggleBulkSelection = (bookingId) => {
    const newSelection = new Set(bulkSelected)
    if (newSelection.has(bookingId)) {
      newSelection.delete(bookingId)
    } else {
      newSelection.add(bookingId)
    }
    setBulkSelected(newSelection)
    setShowBulkActions(newSelection.size > 0)
  }

  const selectAllVisible = () => {
    const visibleIds = new Set(filteredBookings.map(b => b._id))
    setBulkSelected(visibleIds)
    setShowBulkActions(visibleIds.size > 0)
  }

  const clearSelection = () => {
    setBulkSelected(new Set())
    setShowBulkActions(false)
  }

  // Bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (bulkSelected.size === 0) return

    const promises = Array.from(bulkSelected).map(async (bookingId) => {
      const booking = bookings.find(b => b._id === bookingId)
      const oldStatus = booking?.status
      
      try {
        await bookingsAPI.updateStatus(bookingId, newStatus)
        const changeType = (oldStatus === 'Pending' || oldStatus === null) && (newStatus === 'Confirmed' || newStatus === 'Active') ? 'unavailable' : 'available'
        trackAvailabilityChange(bookingId, changeType)
      } catch (err) {
        console.error(`Failed to update booking ${bookingId}:`, err)
      }
    })

    try {
      await Promise.all(promises)
      fetchBookings()
      clearSelection()
      alert(`Successfully updated ${bulkSelected.size} bookings to ${newStatus}`)
    } catch (error) {
      alert('Some bookings failed to update. Please try again.')
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.user ? `${booking.user.firstName || ''} ${booking.user.lastName || ''} ${booking.user.email || ''}`.trim() : '';
    const driverName = booking.driver ? `${booking.driver.firstName || ''} ${booking.driver.lastName || ''}`.trim() : '';
    const matchesSearch =
      (booking.car && booking.car.brand && booking.car.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.car && booking.car.model && booking.car.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customerName && customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (driverName && driverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.driver?.phone && booking.driver.phone.includes(searchQuery))
    
    const matchesStatus = filterStatus === 'all' || booking.status?.toLowerCase() === filterStatus.toLowerCase()
    
    const bookingDate = new Date(booking.bookingPeriod?.startDate || booking.startDate)
    const today = new Date()
    
    let matchesDate = true
    if (filterDate === 'today') {
      matchesDate = bookingDate.toDateString() === today.toDateString()
    } else if (filterDate === 'upcoming') {
      matchesDate = bookingDate >= today
    } else if (filterDate === 'past') {
      matchesDate = bookingDate < today
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleStatusChange = async (bookingId, newStatus) => {
    const booking = bookings.find(b => b._id === bookingId)
    const oldStatus = booking?.status
    
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus)
      
      // Track availability changes with enhanced feedback
      if (oldStatus && oldStatus !== newStatus) {
        const changeType = (oldStatus === 'Pending' || oldStatus === null) && (newStatus === 'Confirmed' || newStatus === 'Active') 
          ? 'unavailable' 
          : 'available'
        trackAvailabilityChange(bookingId, changeType)
      }
      
      // Refresh bookings list
      fetchBookings()
    } catch (err) {
      alert('Failed to update booking status: ' + err.message)
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancel(bookingId, 'Cancelled by admin')
        // Refresh bookings list
        fetchBookings()
      } catch (err) {
        alert('Failed to cancel booking: ' + err.message)
      }
    }
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking)
    setShowEditModal(true)
  }

  const handleCallCustomer = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`
    }
  }

  const handleEmailCustomer = (email) => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Regarding your car booking&body=Hello,`
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      case 'Completed':
        return 'bg-blue-100 text-blue-800'
      case 'Active':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityStatus = (booking) => {
    // Enhanced availability logic with more detailed status
    const carAvailable = booking.car?.isAvailable !== false
    const hasActiveBooking = ['Confirmed', 'Active'].includes(booking.status)
    
    if (hasActiveBooking) {
      return { 
        status: 'Booked', 
        color: 'text-red-600', 
        bg: 'bg-red-100', 
        icon: '🚫',
        description: `In use until ${formatDate(booking.bookingPeriod?.endDate)}`
      }
    } else if (carAvailable) {
      return { 
        status: 'Available', 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        icon: '✅',
        description: 'Ready for booking'
      }
    } else {
      return { 
        status: 'Unavailable', 
        color: 'text-orange-600', 
        bg: 'bg-orange-100', 
        icon: '⏸️',
        description: 'Temporarily unavailable'
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Enhanced Animation Component
  const AnimatedAvailabilityIndicator = ({ booking, availability }) => {
    const animationType = animationStates.get(booking._id)
    const isAnimating = animationType !== undefined

    return (
      <div className={`transition-all duration-500 transform ${
        isAnimating ? 'scale-110 animate-pulse' : 'scale-100'
      } ${
        animationType === 'available' 
          ? 'bg-green-100 border-l-4 border-green-500 shadow-lg' 
          : animationType === 'unavailable'
          ? 'bg-red-100 border-l-4 border-red-500 shadow-lg'
          : ''
      }`}>
        <div className="flex items-center space-x-2">
          <span className={`text-lg ${isAnimating ? 'animate-bounce' : ''}`}>
            {availability.icon}
          </span>
          <div>
            <div className={`text-sm font-medium ${availability.color} ${isAnimating ? 'animate-pulse' : ''}`}>
              {availability.status}
            </div>
            <div className="text-xs text-gray-500">
              {availability.description}
            </div>
            {isAnimating && (
              <div className="text-xs text-blue-600 font-medium animate-pulse">
                🔄 Status changed!
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null

    const availability = getAvailabilityStatus(booking)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <p className="text-sm text-gray-600 mt-1">Booking #{booking.bookingNumber || 'N/A'}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Booking Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Booking Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-semibold text-green-600">KSh {booking.pricing?.totalAmount?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{booking.pricing?.totalDays || 0} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Created:</span>
                      <span>{formatDate(booking.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">🚗</span>
                    Car Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Vehicle:</span>
                      <span className="font-semibold">{booking.car?.brand} {booking.car?.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Year:</span>
                      <span>{booking.car?.year || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Color:</span>
                      <span>{booking.car?.color || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Location:</span>
                      <span>{booking.car?.location || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Car Availability:</span>
                      <AnimatedAvailabilityIndicator booking={booking} availability={availability} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">👤</span>
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p className="text-lg font-semibold">
                        {booking.driver?.firstName} {booking.driver?.lastName}
                      </p>
                    </div>
                    {booking.driver?.phone && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono text-blue-600">{booking.driver.phone}</p>
                          <button
                            onClick={() => handleCallCustomer(booking.driver.phone)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            title="Call"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    {(booking.driver?.email || booking.user?.email) && (
                      <div>
                        <span className="font-medium">Email:</span>
                        <div className="flex items-center space-x-2">
                          <p className="truncate max-w-xs text-blue-600">{booking.driver?.email || booking.user?.email}</p>
                          <button
                            onClick={() => handleEmailCustomer(booking.driver?.email || booking.user?.email)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            title="Email"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2">📅</span>
                    Booking Schedule
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pickup Date:</span>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{formatDate(booking.bookingPeriod?.startDate)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.bookingPeriod?.startDate).toLocaleTimeString('en-KE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Return Date:</span>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">{formatDate(booking.bookingPeriod?.endDate)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.bookingPeriod?.endDate).toLocaleTimeString('en-KE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Pickup Location:</span>
                      <span className="text-right">{booking.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Return Location:</span>
                      <span className="text-right">{booking.returnLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6 pt-6 border-t">
              <button
                onClick={() => handleEditBooking(booking)}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Booking
              </button>
              <button
                onClick={() => handleDeleteBooking(booking._id)}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Cancel Booking
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const BookingEditModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Booking</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Edit Booking Feature</h3>
              <p className="text-gray-600 mb-6">This feature would allow editing booking details, dates, and customer information.</p>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Title 
        title="Manage Bookings" 
        subtitle="View and manage all car rental bookings with enhanced availability tracking"
      />

      {/* Enhanced Controls */}
      <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm p-6 border border-[var(--border-color)]">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by car, customer, phone..."
                className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Bookings', value: bookings.length, color: 'bg-blue-500', icon: '📊' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, color: 'bg-yellow-500', icon: '⏳' },
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'Confirmed').length, color: 'bg-green-500', icon: '✅' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'Completed').length, color: 'bg-purple-500', icon: '🎉' }
          ].map((stat, index) => (
            <div key={index} className="bg-[var(--bg-secondary)] rounded-xl p-4 hover:bg-[var(--bg-primary)] transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color} mr-3`}>
                  <span className="text-white text-lg">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Settings */}
        <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t">
          <div className="flex gap-4 items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Sound notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Auto-refresh (30s)</span>
            </label>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {bulkSelected.size} booking{bulkSelected.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('Confirmed')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Confirm All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Cancelled')}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Cancel All
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={bulkSelected.size === filteredBookings.length && filteredBookings.length > 0}
                    onChange={bulkSelected.size === filteredBookings.length ? clearSelection : selectAllVisible}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => {
                const availability = getAvailabilityStatus(booking)
                const isAnimating = animationStates.has(booking._id)
                const isSelected = bulkSelected.has(booking._id)
                
                return (
                  <tr key={booking._id} className={`hover:bg-gray-50 transition-all duration-300 ${
                    isAnimating ? 'bg-blue-50 border-l-4 border-blue-500 shadow-lg transform scale-[1.01]' : ''
                  } ${isSelected ? 'bg-blue-50' : ''}`}>
                    {/* Bulk Selection */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleBulkSelection(booking._id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>

                    {/* Car & Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={booking.car?.primaryImage || '/placeholder-car.jpg'}
                          alt={booking.car?.brand || 'Car'}
                          className={`w-12 h-12 rounded-lg object-cover mr-4 ${isAnimating ? 'animate-pulse' : ''}`}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.car?.brand || 'Unknown'} {booking.car?.model || ''}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.driver?.firstName && booking.driver?.lastName
                              ? `${booking.driver.firstName} ${booking.driver.lastName}`
                              : booking.user?.firstName && booking.user?.lastName
                              ? `${booking.user.firstName} ${booking.user.lastName}`
                              : booking.user?.email || 'Guest User'
                            }
                          </div>
                          {isAnimating && (
                            <div className="text-xs text-blue-600 font-medium animate-pulse">
                              🔄 Status just changed!
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Car Availability */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AnimatedAvailabilityIndicator booking={booking} availability={availability} />
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {booking.driver?.phone && (
                          <div className="text-sm text-gray-900 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-mono">{booking.driver.phone}</span>
                          </div>
                        )}
                        {(booking.driver?.email || booking.user?.email) && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate max-w-xs">{booking.driver?.email || booking.user?.email}</span>
                          </div>
                        )}
                        {!booking.driver?.phone && !booking.driver?.email && !booking.user?.email && (
                          <div className="text-sm text-gray-400">No contact info</div>
                        )}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <span className="text-green-600 mr-2">📅</span>
                          <span className="font-medium">{formatDate(booking.bookingPeriod?.startDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-red-600 mr-2">📅</span>
                          <span className="font-medium">{formatDate(booking.bookingPeriod?.endDate)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status || 'Pending'}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(booking.status)} focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 hover:shadow-md`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        KSh {booking.pricing?.totalAmount?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.pricing?.totalDays || 0} days
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-primary hover:text-primary-dark p-1 rounded transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                          title="Edit Booking"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {booking.driver?.phone && (
                          <button
                            onClick={() => handleCallCustomer(booking.driver.phone)}
                            className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                            title="Call Customer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                        )}
                        {(booking.driver?.email || booking.user?.email) && (
                          <button
                            onClick={() => handleEmailCustomer(booking.driver?.email || booking.user?.email)}
                            className="text-orange-600 hover:text-orange-700 p-1 rounded transition-colors"
                            title="Email Customer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                          title="Cancel Booking"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all' || filterDate !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No bookings have been made yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedBooking(null)
          }}
        />
      )}

      {showEditModal && (
        <BookingEditModal
          onClose={() => {
            setShowEditModal(false)
            setSelectedBooking(null)
          }}
        />
      )}
    </div>
  )
}

export default ManageBookings