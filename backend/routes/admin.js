import express from 'express';
import mongoose from 'mongoose';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getSystemHealth,
  getSettings,
  updateSettings,
  updateAdminProfile
} from '../controllers/adminController.js';

const router = express.Router();

// Dashboard Statistics
router.get('/dashboard', authenticateAdmin, getDashboardStats);

// User Management Routes
router.get('/users', authenticateAdmin, getUsers);
router.get('/users/:id', authenticateAdmin, getUserById);
router.put('/users/:id', authenticateAdmin, updateUser);
router.delete('/users/:id', authenticateAdmin, deleteUser);
router.get('/users/stats/overview', authenticateAdmin, getUserStats);

// System Health
router.get('/health', authenticateAdmin, getSystemHealth);

// Settings Routes
router.get('/settings', authenticateAdmin, getSettings);
router.put('/settings', authenticateAdmin, updateSettings);
router.put('/profile', authenticateAdmin, updateAdminProfile);

// Test endpoint to check car availability
router.get('/test-availability', authenticateAdmin, async (req, res) => {
  try {
    const { carId } = req.query;
    
    let cars;
    if (carId) {
      cars = await Car.findById(carId);
    } else {
      cars = await Car.find().limit(5);
    }
    
    // Get bookings for each car
    const carsWithBookings = [];
    const carsArray = Array.isArray(cars) ? cars : [cars];
    
    for (const car of carsArray) {
      const activeBookings = await Booking.find({
        car: car._id,
        status: { $in: ['Confirmed', 'Active'] }
      }).populate('car', 'brand model');
      
      carsWithBookings.push({
        car: {
          _id: car._id,
          brand: car.brand,
          model: car.model,
          isAvailable: car.isAvailable
        },
        activeBookings: activeBookings.map(booking => ({
          _id: booking._id,
          status: booking.status,
          startDate: booking.bookingPeriod.startDate,
          endDate: booking.bookingPeriod.endDate
        }))
      });
    }

    res.status(200).json({
      success: true,
      data: carsWithBookings
    });
  } catch (error) {
    console.error('Test availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error testing availability'
    });
  }
});

// Force update car availability using direct database update
router.put('/force-update-availability/:carId', authenticateAdmin, async (req, res) => {
  try {
    const { carId } = req.params;
    
    // Check for active bookings using MongoDB aggregation
    const activeBookingsCount = await Booking.countDocuments({
      car: new mongoose.Types.ObjectId(carId),
      status: { $in: ['Confirmed', 'Active'] }
    });

    const newAvailability = activeBookingsCount === 0;
    
    // Use updateOne to avoid Mongoose validation
    const result = await Car.updateOne(
      { _id: carId },
      { $set: { isAvailable: newAvailability } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Get updated car info
    const updatedCar = await Car.findById(carId).select('brand model isAvailable');

    res.status(200).json({
      success: true,
      data: {
        car: {
          _id: updatedCar._id,
          brand: updatedCar.brand,
          model: updatedCar.model,
          isAvailable: updatedCar.isAvailable
        },
        activeBookings: activeBookingsCount,
        updated: true
      },
      message: `Car availability updated to ${newAvailability ? 'Available' : 'Unavailable'}`
    });
  } catch (error) {
    console.error('Force update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating availability'
    });
  }
});

// Fix all car availability based on existing bookings
router.post('/fix-all-availability', authenticateAdmin, async (req, res) => {
  try {
    // Get all cars
    const cars = await Car.find().select('_id brand model');
    const results = [];

    for (const car of cars) {
      // Check for active bookings
      const activeBookingsCount = await Booking.countDocuments({
        car: car._id,
        status: { $in: ['Confirmed', 'Active'] }
      });

      const newAvailability = activeBookingsCount === 0;

      // Update car availability
      await Car.updateOne(
        { _id: car._id },
        { $set: { isAvailable: newAvailability } }
      );

      results.push({
        car: {
          _id: car._id,
          brand: car.brand,
          model: car.model
        },
        previousAvailability: car.isAvailable,
        newAvailability,
        activeBookings: activeBookingsCount
      });
    }

    res.status(200).json({
      success: true,
      data: results,
      message: `Updated availability for ${results.length} cars`
    });
  } catch (error) {
    console.error('Fix all availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fixing availability'
    });
  }
});

// Create a real booking to test the flow
router.post('/create-test-booking/:carId', authenticateAdmin, async (req, res) => {
  try {
    const { carId } = req.params;
    
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Create a test booking
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

    const testBooking = new Booking({
      car: carId,
      bookingPeriod: {
        startDate,
        endDate
      },
      pickupLocation: 'Test Location',
      returnLocation: 'Test Location',
      pricing: {
        dailyRate: car.pricePerDay,
        totalDays: 1,
        subtotal: car.pricePerDay,
        taxes: car.pricePerDay * 0.08,
        totalAmount: car.pricePerDay * 1.08,
        currency: 'KES'
      },
      payment: {
        method: 'Cash',
        status: 'Paid'
      },
      driver: {
        firstName: 'Test',
        lastName: 'Customer',
        phone: '+254700000000',
        email: 'test@example.com',
        driversLicense: {
          number: 'TEST123456',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      },
      status: 'Confirmed'
    });

    await testBooking.save();

    // Force update car availability to unavailable
    await Car.updateOne(
      { _id: carId },
      { $set: { isAvailable: false } }
    );

    res.status(201).json({
      success: true,
      data: {
        booking: testBooking,
        car: {
          _id: car._id,
          brand: car.brand,
          model: car.model,
          isAvailable: false
        }
      },
      message: 'Test booking created and car availability set to Unavailable'
    });
  } catch (error) {
    console.error('Create test booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating test booking'
    });
  }
});

// Reset car availability
router.post('/reset-availability/:carId', authenticateAdmin, async (req, res) => {
  try {
    const { carId } = req.params;
    
    // Set car back to available using direct update
    const result = await Car.updateOne(
      { _id: carId },
      { $set: { isAvailable: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    const updatedCar = await Car.findById(carId).select('brand model isAvailable');

    res.status(200).json({
      success: true,
      data: {
        car: {
          _id: updatedCar._id,
          brand: updatedCar.brand,
          model: updatedCar.model,
          isAvailable: updatedCar.isAvailable
        }
      },
      message: 'Car availability reset to Available'
    });
  } catch (error) {
    console.error('Reset availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting availability'
    });
  }
});

export default router;