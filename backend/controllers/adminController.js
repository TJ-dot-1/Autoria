import mongoose from 'mongoose';
import User from '../models/User.js';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import Settings from '../models/Settings.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const period = req.query.period || '30d';
    const days = (period === '7d' || period === 'week') 
      ? 7 
      : (period === '90d' || period === 'quarter') 
      ? 90 
      : (period === '365d' || period === 'year' || period === '1y') 
      ? 365 
      : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get basic counts
    const [
      totalUsers,
      activeUsers,
      totalCars,
      availableCars,
      unavailableCars,
      totalBookings,
      activeBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Car.countDocuments({ isActive: true }),
      Car.countDocuments({ isActive: true, isAvailable: true }),
      Car.countDocuments({ isActive: true, isAvailable: false }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Active' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Cancelled' })
    ]);

    // Calculate revenue
    const revenueData = await Booking.aggregate([
      {
        $match: {
          status: 'Completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.totalAmount' },
          avgBookingValue: { $avg: '$pricing.totalAmount' }
        }
      }
    ]);

    // Query recent cars for marketplace activity feed
    const [recentCars, recentUsers, recentSales, recentBookings] = await Promise.all([
      Car.find({ isActive: true })
        .populate('addedBy', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .limit(10),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5),
      Booking.find({ status: 'Completed' })
        .populate('car', 'brand model year salePrice primaryImage')
        .populate('user', 'firstName lastName email')
        .sort({ updatedAt: -1 })
        .limit(5),
      Booking.find()
        .populate('user', 'firstName lastName email phone')
        .populate('car', 'brand model year condition isForSale salePrice pricePerDay primaryImage images location isAvailable category')
        .sort({ createdAt: -1 })
        .limit(20)
    ]);

    // Build real-time car selling marketplace activities
    const recentActivities = [];

    recentCars.forEach((car) => {
      const price = car.salePrice || (car.pricePerDay ? car.pricePerDay * 30 : 0);
      recentActivities.push({
        id: `car-${car._id}`,
        type: 'car_listed',
        action: 'Vehicle Listed for Sale',
        title: `${car.year ? `${car.year} ` : ''}${car.brand} ${car.model}`,
        description: `Listed at KES ${Number(price).toLocaleString()}`,
        time: car.createdAt,
        badge: car.condition || (car.isAvailable !== false ? 'Available' : 'Reserved'),
        badgeColor: 'emerald',
        image: car.primaryImage || (car.images?.[0]?.url) || '/hero_sports_car.jpg',
        carId: car._id,
        price: price,
        seller: car.addedBy ? `${car.addedBy.firstName || ''} ${car.addedBy.lastName || ''}`.trim() : 'Showroom'
      });
    });

    recentSales.forEach((sale) => {
      recentActivities.push({
        id: `sale-${sale._id}`,
        type: 'car_sold',
        action: 'Vehicle Sold / Deal Closed',
        title: `${sale.car?.year ? `${sale.car.year} ` : ''}${sale.car?.brand || 'Vehicle'} ${sale.car?.model || ''}`,
        description: `Closed deal with ${sale.user?.firstName || 'Buyer'} for KES ${Number(sale.pricing?.totalAmount || sale.car?.salePrice || 0).toLocaleString()}`,
        time: sale.updatedAt || sale.createdAt,
        badge: 'Sold',
        badgeColor: 'blue',
        image: sale.car?.primaryImage || '/hero_sports_car.jpg',
        price: sale.pricing?.totalAmount || sale.car?.salePrice || 0
      });
    });

    recentUsers.forEach((u) => {
      recentActivities.push({
        id: `user-${u._id}`,
        type: 'user_joined',
        action: 'Member Registered',
        title: `${u.firstName || 'New'} ${u.lastName || 'User'}`,
        description: `Joined Autoria community as ${u.role === 'admin' ? 'Administrator' : 'Buyer / Seller'}`,
        time: u.createdAt,
        badge: u.role === 'admin' ? 'Admin' : 'Member',
        badgeColor: 'purple'
      });
    });

    recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers || totalUsers
      },
      cars: {
        total: totalCars,
        available: availableCars,
        unavailable: unavailableCars
      },
      sales: {
        totalDeals: completedBookings,
        activeNegotiations: activeBookings,
        inquiriesCount: totalBookings,
        totalVolume: revenueData[0]?.totalRevenue || 0,
        averagePrice: revenueData[0]?.avgBookingValue || 0
      },
      inquiries: {
        total: totalBookings,
        active: activeBookings,
        completed: completedBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings
      },
      bookings: {
        total: totalBookings,
        active: activeBookings,
        completed: completedBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings
      },
      revenue: {
        total: revenueData[0]?.totalRevenue || 0,
        average: revenueData[0]?.avgBookingValue || 0
      },
      recentActivities: recentActivities,
      recentBookings: recentBookings
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard statistics'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, sort = 'createdAt', order = 'desc' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

    const users = await User.find(query)
      .select('-password')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, isActive, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, role, isActive, phone, address },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate user
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/stats/overview
// @access  Private (Admin)
export const getUserStats = async (req, res, next) => {
  try {
    const period = req.query.period || '30d';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const [
      totalUsers,
      newUsersPeriod,
      activeUsers,
      userRoles
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const stats = {
      total: totalUsers,
      new: newUsersPeriod,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      roles: userRoles.reduce((acc, role) => {
        acc[role._id] = role.count;
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user statistics'
    });
  }
};

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private (Admin)
export const getSystemHealth = async (req, res, next) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        connected: dbStatus === 'connected'
      },
      memory: {
        used: process.memoryUsage().heapUsed / 1024 / 1024,
        total: process.memoryUsage().heapTotal / 1024 / 1024,
        rss: process.memoryUsage().rss / 1024 / 1024
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    };

    res.status(200).json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking system health'
    });
  }
};

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
export const getSettings = async (req, res, next) => {
  try {
    // Try to get existing settings
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching settings'
    });
  }
};

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    const updatedSettings = req.body;

    // Find existing settings or create new one
    let settings = await Settings.findOne();
    
    if (!settings) {
      // If no settings exist, create new settings with provided data
      settings = new Settings(updatedSettings);
      await settings.save();
    } else {
      // Handle complete settings replacement for simplicity and reliability
      // Clear existing sections and update with new data
      const sections = ['general', 'business', 'notifications', 'security', 'payments', 'booking'];
      
      sections.forEach(section => {
        if (updatedSettings[section]) {
          settings[section] = updatedSettings[section];
        }
      });
      
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating settings'
    });
  }
};

// @desc    Get performance data for charts
// @route   GET /api/admin/performance
// @access  Private (Admin)
export const getPerformanceData = async (req, res, next) => {
  try {
    const period = req.query.period || '30d';
    const days = (period === '7d' || period === 'week') 
      ? 7 
      : (period === '90d' || period === 'quarter') 
      ? 90 
      : (period === '365d' || period === 'year' || period === '1y') 
      ? 365 
      : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily booking and revenue data
    const dailyData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' },
          completedBookings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
            }
          },
          activeBookings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Active'] }, 1, 0]
            }
          },
          pendingBookings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Fill in missing dates with zero values
    const performanceData = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = dailyData.find(d => d._id === dateStr) || {
        _id: dateStr,
        bookings: 0,
        revenue: 0,
        completedBookings: 0,
        activeBookings: 0,
        pendingBookings: 0
      };

      performanceData.push({
        date: dateStr,
        bookings: dayData.bookings,
        revenue: dayData.revenue,
        completedBookings: dayData.completedBookings,
        activeBookings: dayData.activeBookings,
        pendingBookings: dayData.pendingBookings
      });
    }

    // Get top performing cars
    const topCars = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'Completed'
        }
      },
      {
        $group: {
          _id: '$car',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: '_id',
          as: 'carInfo'
        }
      },
      {
        $unwind: '$carInfo'
      },
      {
        $project: {
          car: { $concat: ['$carInfo.brand', ' ', '$carInfo.model'] },
          bookings: '$totalBookings',
          revenue: '$totalRevenue',
          image: '$carInfo.primaryImage'
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // If topCars from closed deals has fewer than 5, supplement with premium showroom inventory
    let finalTopCars = [...topCars];
    if (finalTopCars.length < 5) {
      const existingCarIds = finalTopCars.map(tc => tc._id);
      const topInventoryCars = await Car.find({ 
        isActive: true,
        ...(existingCarIds.length > 0 ? { _id: { $nin: existingCarIds } } : {})
      })
        .sort({ salePrice: -1, createdAt: -1 })
        .limit(5 - finalTopCars.length);

      topInventoryCars.forEach((c) => {
        const val = c.salePrice || (c.pricePerDay ? c.pricePerDay * 30 : 0);
        finalTopCars.push({
          car: `${c.year ? `${c.year} ` : ''}${c.brand} ${c.model}`,
          bookings: 0,
          inquiries: 0,
          revenue: val,
          image: c.primaryImage || (c.images?.[0]?.url) || null
        });
      });
    }

    // Get condition distribution (Foreign Used, Brand New, Local Used)
    const conditionDist = await Car.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: { $ifNull: ['$condition', 'Used'] }, count: { $sum: 1 } } }
    ]);

    const inventoryCondition = {
      used: 0,
      foreignUsed: 0,
      brandNew: 0
    };

    conditionDist.forEach((item) => {
      const key = String(item._id).toLowerCase();
      if (key.includes('brand') || key.includes('new')) inventoryCondition.brandNew += item.count;
      else if (key.includes('foreign') || key.includes('import')) inventoryCondition.foreignUsed += item.count;
      else inventoryCondition.used += item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        timeSeries: performanceData,
        topCars: finalTopCars,
        bookingStatus: bookingStatusData,
        inventoryCondition
      }
    });
  } catch (error) {
    console.error('Performance data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching performance data'
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
export const updateAdminProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, profileImage, bio } = req.body;

    // Only allow updating admin profile for current user
    const userId = req.user._id;

    const fieldsToUpdate = {};
    if (firstName !== undefined) fieldsToUpdate.firstName = firstName;
    if (lastName !== undefined) fieldsToUpdate.lastName = lastName;
    if (email !== undefined) fieldsToUpdate.email = email;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (profileImage !== undefined) fieldsToUpdate.profileImage = profileImage;
    if (bio !== undefined) fieldsToUpdate.bio = bio;

    const user = await User.findByIdAndUpdate(
      userId,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};