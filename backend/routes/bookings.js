import express from 'express';
import { createBooking, getBookings, updateBookingStatus, cancelBooking, getBooking } from '../controllers/bookingController.js';
import { authenticateAdmin, protect } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings (Admin only)
router.get('/', authenticateAdmin, getBookings);

// Get single booking (Admin only)
router.get('/:id', authenticateAdmin, getBooking);

// Create new booking
router.post('/', createBooking);

// Update booking status (Admin only)
router.put('/:id/status', authenticateAdmin, updateBookingStatus);

// Cancel booking (User or Admin)
router.put('/:id/cancel', protect, cancelBooking);

export default router;