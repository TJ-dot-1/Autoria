import mongoose from 'mongoose';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// Helper function to check for conflicting bookings
const checkConflictingBookings = async (carId, startDate, endDate, excludeBookingId = null) => {
  const query = {
    car: carId,
    status: { $in: ['Pending', 'Confirmed', 'Active'] }
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await Booking.find(query);

  for (const booking of conflictingBookings) {
    const bookingStart = new Date(booking.bookingPeriod.startDate);
    const bookingEnd = new Date(booking.bookingPeriod.endDate);
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    // Check for overlap
    if (newStart <= bookingEnd && newEnd >= bookingStart) {
      return booking;
    }
  }

  return null;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    const {
      car,
      bookingPeriod,
      pickupLocation,
      returnLocation,
      pricing,
      payment,
      driver,
      additionalServices
    } = req.body;

    // Validate driver age
    if (!driver.dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth is required'
      });
    }

    const birthDate = new Date(driver.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 21) {
      return res.status(400).json({
        success: false,
        message: 'You must be at least 21 years old to rent a car'
      });
    }

    // Check if car exists and is available
    const carDoc = await Car.findById(car);
    if (!carDoc) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await checkConflictingBookings(
      car,
      bookingPeriod.startDate,
      bookingPeriod.endDate
    );

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for the selected dates'
      });
    }

    // Create booking
    const booking = new Booking({
      car,
      bookingPeriod,
      pickupLocation,
      returnLocation,
      pricing,
      payment,
      driver,
      additionalServices,
      user: req.user ? req.user._id : null, // Allow guest bookings
      status: 'Pending',
      statusHistory: [{
        status: 'Pending',
        note: 'Booking created',
        timestamp: new Date()
      }]
    });

    await booking.save();

    // Update car availability for pending booking
    await updateCarAvailability(booking, null, 'Pending');

    // Populate the booking
    await booking.populate([
      { path: 'car', select: 'brand model primaryImage pricePerDay location' },
      { path: 'user', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking'
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin)
export const getBookings = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      status,
      car,
      startDate,
      endDate
    } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (car) {
      query.car = car;
    }

    if (startDate || endDate) {
      query['bookingPeriod.startDate'] = {};
      if (startDate) query['bookingPeriod.startDate'].$gte = new Date(startDate);
      if (endDate) query['bookingPeriod.startDate'].$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = { [sort]: req.query.order === 'asc' ? 1 : -1 };

    const bookings = await Booking.find(query)
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model primaryImage isAvailable')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1,
      nextPage: parseInt(page) < Math.ceil(total / parseInt(limit)) ? parseInt(page) + 1 : null,
      prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : null,
      from: skip + 1,
      to: Math.min(skip + parseInt(limit), total)
    };

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pagination,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('car', 'brand model primaryImage isAvailable');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    const isOwner = booking.user && booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking'
    });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const oldStatus = booking.status;
    booking.status = status;
    
    // Add to status history
    booking.statusHistory.push({
      status,
      note,
      updatedBy: req.user._id || req.user.id,
      timestamp: new Date()
    });

    await booking.save();

    // Update car availability based on status change
    await updateCarAvailability(booking, oldStatus, status);

    // Re-populate the booking with user and car info
    await booking.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'car', select: 'brand model primaryImage' }
    ]);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status'
    });
  }
};

// @desc    Cancel a booking (User or Admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User or Admin)
export const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    // Handle the case where booking.user might be null (guest booking)
    const isOwner = booking.user && booking.user.toString() === (req.user._id || req.user.id).toString();
    const isAdmin = req.user && req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    const oldStatus = booking.status;
    
    // Check if booking can be cancelled
    if (['Completed', 'Cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled as it is already ${booking.status.toLowerCase()}`
      });
    }

    // Update booking status
    booking.status = 'Cancelled';
    booking.cancellation = {
      reason: reason || 'Cancelled by user',
      refundAmount: 0, // Calculate based on policy
      refundProcessed: false,
      timestamp: new Date()
    };

    // Add to status history
    booking.statusHistory.push({
      status: 'Cancelled',
      note: reason || 'Booking cancelled',
      updatedBy: req.user._id || req.user.id,
      timestamp: new Date()
    });

    await booking.save();

    // Update car availability - car becomes available when booking is cancelled
    await updateCarAvailability(booking, oldStatus, 'Cancelled');

    // Re-populate the booking with user and car info
    await booking.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'car', select: 'brand model primaryImage isAvailable' }
    ]);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking'
    });
  }
};

// Helper function to update car availability
const updateCarAvailability = async (booking, oldStatus, newStatus) => {
  try {
    const car = await Car.findById(booking.car);
    if (!car) return;

    const wasAvailable = car.isAvailable;
    let shouldBeAvailable = true;

    // Check if there are other active bookings for this car
    const otherActiveBookings = await Booking.countDocuments({
      car: booking.car,
      _id: { $ne: booking._id },
      status: { $in: ['Confirmed', 'Active'] }
    });

    // If this booking change affects availability
    if (['Confirmed', 'Active'].includes(newStatus)) {
      // Booking becomes active - car should be unavailable
      shouldBeAvailable = false;
    } else if (['Cancelled', 'Completed'].includes(newStatus)) {
      // Booking is cancelled or completed - check if there are other active bookings
      shouldBeAvailable = otherActiveBookings === 0;
    }

    // Update car availability if it changed
    if (car.isAvailable !== shouldBeAvailable) {
      car.isAvailable = shouldBeAvailable;
      await car.save();
      console.log(`Car ${car.brand} ${car.model} availability updated to ${shouldBeAvailable ? 'Available' : 'Unavailable'}`);
    }
  } catch (error) {
    console.error('Update car availability error:', error);
  }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/admin/stats
// @access  Private (Admin)
export const getBookingStats = async (req, res, next) => {
  try {
    const period = req.query.period || '30d';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const [
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      totalRevenue,
      averageBookingValue,
      popularCars
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Active' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Cancelled' }),
      Booking.countDocuments({ status: 'Pending' }),
      
      Booking.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      
      Booking.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, average: { $avg: '$pricing.totalAmount' } } }
      ]),
      
      Booking.aggregate([
        { $group: { _id: '$car', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'cars',
            localField: '_id',
            foreignField: '_id',
            as: 'carDetails',
            pipeline: [
              { $project: { brand: 1, model: 1, primaryImage: 1 } }
            ]
          }
        },
        { $unwind: '$carDetails' }
      ])
    ]);

    const stats = {
      total: totalBookings,
      active: activeBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
      pending: pendingBookings,
      revenue: {
        total: totalRevenue[0]?.total || 0,
        average: averageBookingValue[0]?.average || 0
      },
      popularCars: popularCars.map(car => ({
        car: car.carDetails,
        bookings: car.count
      }))
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking statistics'
    });
  }
};