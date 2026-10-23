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

// Car management routes (accessible by authenticated users; owners manage their cars, admin manages all)
router.post('/', protect, createCar);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);
router.put('/:id/availability', protect, toggleCarAvailability);

export default router;