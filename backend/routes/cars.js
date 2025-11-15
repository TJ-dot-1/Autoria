import express from 'express';
import {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getAvailableCars,
  toggleCarAvailability,
  getNewCarsForSale,
  getUsedCarsForSale
} from '../controllers/carController.js';
import { protect, authorize } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (accessible without authentication)
router.get('/', optionalAuth, getCars);
router.get('/available', getAvailableCars);
router.get('/new-cars', optionalAuth, getNewCarsForSale);
router.get('/used-cars', optionalAuth, getUsedCarsForSale);
// Specific car ID route must come after specific routes
router.get('/:id', optionalAuth, getCar);

// Admin-only routes
router.post('/', protect, authorize('admin'), createCar);
router.put('/:id', protect, authorize('admin'), updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);
router.put('/:id/availability', protect, authorize('admin'), toggleCarAvailability);

export default router;