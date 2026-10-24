import express from 'express';
import {
  getCars,
  getMyCars,
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

// Specific routes before :id
router.get('/my-cars', protect, getMyCars);
router.get('/available', getAvailableCars);
router.get('/new-cars', optionalAuth, getNewCarsForSale);
router.get('/used-cars', optionalAuth, getUsedCarsForSale);

// Public car catalog routes
router.get('/', optionalAuth, getCars);
// Specific car ID route must come after specific routes
router.get('/:id', optionalAuth, getCar);

// Car management routes (accessible by authenticated users; owners manage their cars, admin manages all)
router.post('/', protect, createCar);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);
router.put('/:id/availability', protect, toggleCarAvailability);

export default router;