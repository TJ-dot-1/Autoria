import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car is required for booking']
  },
  bookingPeriod: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    actualPickupDate: Date,
    actualReturnDate: Date
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required']
  },
  returnLocation: {
    type: String,
    required: [true, 'Return location is required']
  },
  pricing: {
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: [0, 'Rate cannot be negative']
    },
    totalDays: {
      type: Number,
      required: [true, 'Total days is required'],
      min: [1, 'Minimum booking is 1 day']
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative']
    },
    taxes: {
      type: Number,
      default: 0,
      min: [0, 'Taxes cannot be negative']
    },
    fees: {
      airport: { type: Number, default: 0 },
      toll: { type: Number, default: 0 },
      parking: { type: Number, default: 0 },
      cleaning: { type: Number, default: 0 },
      lateReturn: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'KSh', 'KES']
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash'],
      required: [true, 'Payment method is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Partial Refund'],
      default: 'Pending'
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative']
    },
    refundDate: Date,
    refundReason: String
  },
  driver: {
    firstName: {
      type: String,
      required: [true, 'Driver first name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Driver last name is required']
    },
    dateOfBirth: Date,
    phone: {
      type: String,
      required: [true, 'Driver phone number is required']
    },
    email: {
      type: String,
      required: [true, 'Driver email is required']
    },
    driversLicense: {
      number: {
        type: String,
        required: [true, 'Driver license number is required']
      },
      state: String,
      expiryDate: {
        type: Date,
        required: [true, 'Driver license expiry date is required']
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    isSameAsBooker: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: [
      'Pending',
      'Confirmed', 
      'In Progress',
      'Active',
      'Completed',
      'Cancelled',
      'No Show'
    ],
    default: 'Pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed', 
        'In Progress',
        'Active',
        'Completed',
        'Cancelled',
        'No Show'
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  conditionReports: {
    pickup: {
      photos: [String],
      notes: String,
      fuelLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
      },
      mileage: Number,
      inspectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: Date
    },
    return: {
      photos: [String],
      notes: String,
      fuelLevel: {
        type: Number,
        min: 0,
        max: 100
      },
      mileage: Number,
      damageReported: Boolean,
      damageDescription: String,
      damageCost: Number,
      inspectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: Date
    }
  },
  insurance: {
    provider: String,
    policyNumber: String,
    coverage: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium', 'Full Coverage']
    },
    deductible: {
      type: Number,
      default: 0,
      min: [0, 'Deductible cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  additionalServices: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: [0, 'Service price cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  modifications: [{
    type: {
      type: String,
      enum: ['Date Change', 'Duration Extension', 'Location Change', 'Service Addition', 'Other']
    },
    description: String,
    previousValue: String,
    newValue: String,
    additionalCost: {
      type: Number,
      default: 0,
      min: [0, 'Additional cost cannot be negative']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  communication: [{
    type: {
      type: String,
      enum: ['Email', 'SMS', 'Phone', 'In-App']
    },
    subject: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: String,
  internalNotes: String,
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative']
    },
    refundProcessed: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for booking duration in days
bookingSchema.virtual('duration').get(function() {
  if (this.bookingPeriod.startDate && this.bookingPeriod.endDate) {
    const timeDifference = this.bookingPeriod.endDate.getTime() - this.bookingPeriod.startDate.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }
  return 0;
});

// Virtual for total cost including additional services
bookingSchema.virtual('totalWithServices').get(function() {
  const servicesTotal = this.additionalServices.reduce((sum, service) => sum + service.price, 0);
  return this.pricing.totalAmount + servicesTotal;
});

// Virtual for current status
bookingSchema.virtual('currentStatus').get(function() {
  const now = new Date();
  
  if (this.status === 'Cancelled' || this.status === 'Completed') {
    return this.status;
  }
  
  if (now < this.bookingPeriod.startDate) {
    return 'Upcoming';
  }
  
  if (now >= this.bookingPeriod.startDate && now <= this.bookingPeriod.endDate) {
    return 'Active';
  }
  
  if (now > this.bookingPeriod.endDate) {
    return this.status === 'Completed' ? 'Completed' : 'Overdue';
  }
  
  return this.status;
});

// Pre-save middleware to generate booking number
bookingSchema.pre('save', function(next) {
  if (!this.bookingNumber) {
    const prefix = 'AUT';
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.bookingNumber = `${prefix}-${timestamp.slice(-6)}-${random}`;
  }
  next();
});

// Pre-save middleware to update status history
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const lastStatus = this.statusHistory[this.statusHistory.length - 1];
    if (!lastStatus || lastStatus.status !== this.status) {
      this.statusHistory.push({
        status: this.status,
        timestamp: new Date(),
        note: `Status changed to ${this.status}`
      });
    }
  }
  next();
});

// Indexes for better query performance
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ car: 1 });
bookingSchema.index({ 'bookingPeriod.startDate': 1 });
bookingSchema.index({ 'bookingPeriod.endDate': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;