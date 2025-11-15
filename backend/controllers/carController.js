import mongoose from 'mongoose';
import Car from '../models/Car.js';
import { calculatePagination } from '../utils/pagination.js';

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res, next) => {
  try {
    let query = { isActive: true };
    let sortBy = {};
    
    // Build query based on filters
    const {
      search,
      category,
      location,
      fuelType,
      transmission,
      priceMin,
      priceMax,
      year,
      seatingCapacity,
      features,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
      userId
    } = req.query;

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = { $in: category.split(',') };
    if (location) query.location = new RegExp(location, 'i');
    if (fuelType) query.fuelType = { $in: fuelType.split(',') };
    if (transmission) query.transmission = { $in: transmission.split(',') };
    if (seatingCapacity) query.seatingCapacity = { $gte: parseInt(seatingCapacity) };
    if (year) query.year = { $gte: parseInt(year) };
    
    // Price range
    if (priceMin || priceMax) {
      query.pricePerDay = {};
      if (priceMin) query.pricePerDay.$gte = parseFloat(priceMin);
      if (priceMax) query.pricePerDay.$lte = parseFloat(priceMax);
    }

    // Features
    if (features) {
      const featuresArray = features.split(',');
      query.features = { $in: featuresArray };
    }

    // User-specific cars (admin)
    if (userId) {
      query.addedBy = userId;
    }

    // Sorting
    if (sort === 'price') {
      sortBy.pricePerDay = order === 'desc' ? -1 : 1;
    } else if (sort === 'year') {
      sortBy.year = order === 'desc' ? -1 : 1;
    } else if (sort === 'rating') {
      sortBy['ratings.average'] = order === 'desc' ? -1 : 1;
    } else {
      sortBy[sort] = order === 'desc' ? -1 : 1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const cars = await Car.find(query)
      .populate('addedBy', 'firstName lastName email')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Car.countDocuments(query);
    const pagination = calculatePagination(page, limitNum, total);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      pagination,
      data: cars
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cars'
    });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
export const getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('addedBy', 'firstName lastName email');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching car'
    });
  }
};

// @desc    Get available cars for specific dates
// @route   GET /api/cars/available
// @access  Public
export const getAvailableCars = async (req, res, next) => {
  try {
    const { startDate, endDate, location } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Check for overlapping bookings
    const overlapQuery = {
      $or: [
        {
          'bookingPeriod.startDate': { $lte: new Date(endDate) },
          'bookingPeriod.endDate': { $gte: new Date(startDate) }
        }
      ],
      status: { $in: ['Confirmed', 'Active'] }
    };

    // Get cars with existing bookings in the date range
    const Booking = require('../models/Booking.js');
    const bookedCarIds = await Booking.distinct('car', {
      $or: [
        {
          'bookingPeriod.startDate': { $lte: new Date(endDate) },
          'bookingPeriod.endDate': { $gte: new Date(startDate) }
        }
      ],
      status: { $in: ['Pending', 'Confirmed', 'Active'] }
    });

    // Build availability query
    let query = {
      isActive: true,
      isAvailable: true,
      _id: { $nin: bookedCarIds }
    };

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    const cars = await Car.find(query)
      .populate('addedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    console.error('Get available cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching available cars'
    });
  }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Private (Admin only)
export const createCar = async (req, res, next) => {
  try {
    const carData = {
      ...req.body,
      addedBy: req.user._id || req.user.id
    };

    // Validate required fields
    const requiredFields = [
      'brand', 'model', 'year', 'category', 'type', 'pricePerDay',
      'fuelType', 'transmission', 'seatingCapacity', 'doors', 'location'
    ];

    const missingFields = requiredFields.filter(field => !carData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Create car
    const car = await Car.create(carData);

    // Populate the addedBy field
    await car.populate('addedBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating car'
    });
  }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private (Admin only)
export const updateCar = async (req, res, next) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Remove fields that shouldn't be updated directly
    const { _id, addedBy, createdAt, updatedAt, ...updateData } = req.body;

    car = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('addedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating car'
    });
  }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private (Admin only)
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check if car has active bookings
    const Booking = mongoose.model('Booking');
    const activeBookings = await Booking.countDocuments({
      car: req.params.id,
      status: { $in: ['Confirmed', 'Active'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete car with active bookings'
      });
    }

    // Soft delete by setting isActive to false (bypass validation)
    await Car.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting car'
    });
  }
};

// @desc    Toggle car availability
// @route   PUT /api/cars/:id/availability
// @access  Private (Admin only)
export const toggleCarAvailability = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Toggle availability
    car.isAvailable = !car.isAvailable;
    await car.save();

    res.status(200).json({
      success: true,
      data: {
        car,
        message: `Car is now ${car.isAvailable ? 'available' : 'unavailable'}`
      }
    });
  } catch (error) {
    console.error('Toggle car availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling car availability'
    });
  }
};

// @desc    Get new cars for sale
// @route   GET /api/cars/new-cars
// @access  Public
export const getNewCarsForSale = async (req, res, next) => {
  try {
    let query = {
      isActive: true,
      isForSale: true,
      condition: 'New'
    };
    let sortBy = {};
    
    // Build query based on filters
    const {
      search,
      category,
      location,
      fuelType,
      transmission,
      priceMin,
      priceMax,
      year,
      seatingCapacity,
      features,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = { $in: category.split(',') };
    if (location) query.location = new RegExp(location, 'i');
    if (fuelType) query.fuelType = { $in: fuelType.split(',') };
    if (transmission) query.transmission = { $in: transmission.split(',') };
    if (seatingCapacity) query.seatingCapacity = { $gte: parseInt(seatingCapacity) };
    if (year) query.year = { $gte: parseInt(year) };
    
    // Sale price range
    if (priceMin || priceMax) {
      query.salePrice = {};
      if (priceMin) query.salePrice.$gte = parseFloat(priceMin);
      if (priceMax) query.salePrice.$lte = parseFloat(priceMax);
    }

    // Features
    if (features) {
      const featuresArray = features.split(',');
      query.features = { $in: featuresArray };
    }

    // Sorting
    if (sort === 'price') {
      sortBy.salePrice = order === 'desc' ? -1 : 1;
    } else if (sort === 'year') {
      sortBy.year = order === 'desc' ? -1 : 1;
    } else if (sort === 'rating') {
      sortBy['ratings.average'] = order === 'desc' ? -1 : 1;
    } else {
      sortBy[sort] = order === 'desc' ? -1 : 1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const cars = await Car.find(query)
      .populate('addedBy', 'firstName lastName email')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Car.countDocuments(query);
    const pagination = calculatePagination(page, limitNum, total);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      pagination,
      data: cars
    });
  } catch (error) {
    console.error('Get new cars for sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching new cars for sale'
    });
  }
};

// @desc    Get used cars for sale
// @route   GET /api/cars/used-cars
// @access  Public
export const getUsedCarsForSale = async (req, res, next) => {
  try {
    let query = {
      isActive: true,
      isForSale: true,
      condition: 'Used'
    };
    let sortBy = {};
    
    // Build query based on filters
    const {
      search,
      category,
      location,
      fuelType,
      transmission,
      priceMin,
      priceMax,
      year,
      seatingCapacity,
      features,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = { $in: category.split(',') };
    if (location) query.location = new RegExp(location, 'i');
    if (fuelType) query.fuelType = { $in: fuelType.split(',') };
    if (transmission) query.transmission = { $in: transmission.split(',') };
    if (seatingCapacity) query.seatingCapacity = { $gte: parseInt(seatingCapacity) };
    if (year) query.year = { $gte: parseInt(year) };
    
    // Sale price range
    if (priceMin || priceMax) {
      query.salePrice = {};
      if (priceMin) query.salePrice.$gte = parseFloat(priceMin);
      if (priceMax) query.salePrice.$lte = parseFloat(priceMax);
    }

    // Features
    if (features) {
      const featuresArray = features.split(',');
      query.features = { $in: featuresArray };
    }

    // Sorting
    if (sort === 'price') {
      sortBy.salePrice = order === 'desc' ? -1 : 1;
    } else if (sort === 'year') {
      sortBy.year = order === 'desc' ? -1 : 1;
    } else if (sort === 'rating') {
      sortBy['ratings.average'] = order === 'desc' ? -1 : 1;
    } else {
      sortBy[sort] = order === 'desc' ? -1 : 1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const cars = await Car.find(query)
      .populate('addedBy', 'firstName lastName email')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Car.countDocuments(query);
    const pagination = calculatePagination(page, limitNum, total);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      pagination,
      data: cars
    });
  } catch (error) {
    console.error('Get used cars for sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching used cars for sale'
    });
  }
};