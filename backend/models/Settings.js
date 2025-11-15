import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  general: {
    companyName: {
      type: String,
      default: 'Autoria Car Rental'
    },
    supportEmail: {
      type: String,
      default: 'support@autoria.com'
    },
    companyPhone: {
      type: String,
      default: '+254 700 000 000'
    },
    websiteUrl: {
      type: String,
      default: 'https://autoria.com'
    },
    companyAddress: {
      type: String,
      default: 'Nairobi, Kenya'
    },
    timezone: {
      type: String,
      default: 'Africa/Nairobi'
    },
    currency: {
      type: String,
      default: 'KES'
    }
  },
  business: {
    operatingHours: {
      monday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      tuesday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      wednesday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      thursday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      friday: { open: { type: String, default: '08:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
      saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '16:00' }, closed: { type: Boolean, default: false } },
      sunday: { open: { type: String, default: '10:00' }, close: { type: String, default: '14:00' }, closed: { type: Boolean, default: true } }
    },
    minBookingDays: {
      type: Number,
      default: 1
    },
    maxBookingDays: {
      type: Number,
      default: 30
    },
    advanceBookingDays: {
      type: Number,
      default: 7
    },
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 24 hours before pickup'
    },
    lateFee: {
      type: Number,
      default: 50
    },
    gracePeriod: {
      type: Number,
      default: 30
    }
  },
  notifications: {
    emailNotifications: {
      newBooking: { type: Boolean, default: true },
      bookingConfirmation: { type: Boolean, default: true },
      bookingCancellation: { type: Boolean, default: true },
      paymentReceived: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true },
      userRegistration: { type: Boolean, default: false }
    },
    smsNotifications: {
      bookingReminders: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: false }
    },
    adminAlerts: {
      lowCarAvailability: { type: Boolean, default: true },
      paymentFailures: { type: Boolean, default: true },
      systemErrors: { type: Boolean, default: true },
      newUserRegistration: { type: Boolean, default: true }
    }
  },
  security: {
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireUppercase: { type: Boolean, default: true },
      requireLowercase: { type: Boolean, default: true },
      requireNumbers: { type: Boolean, default: true },
      requireSymbols: { type: Boolean, default: true },
      expirationDays: { type: Number, default: 90 }
    },
    sessionManagement: {
      sessionTimeout: { type: Number, default: 60 },
      maxConcurrentSessions: { type: Number, default: 3 },
      requireTwoFactor: { type: Boolean, default: false }
    },
    accessControl: {
      maxLoginAttempts: { type: Number, default: 5 },
      lockoutDuration: { type: Number, default: 30 },
      requireEmailVerification: { type: Boolean, default: true }
    }
  },
  payments: {
    acceptedMethods: [{
      type: String,
      enum: ['card', 'bank_transfer', 'mpesa', 'cash'],
      default: 'card'
    }],
    defaultPaymentMethod: {
      type: String,
      default: 'card'
    },
    depositRequired: {
      type: Boolean,
      default: true
    },
    depositPercentage: {
      type: Number,
      default: 25
    },
    autoRefund: {
      type: Boolean,
      default: true
    },
    processingFees: {
      card: { type: Number, default: 2.5 },
      bank_transfer: { type: Number, default: 0 },
      mpesa: { type: Number, default: 1.5 },
      cash: { type: Number, default: 0 }
    }
  },
  booking: {
    autoConfirm: {
      type: Boolean,
      default: false
    },
    requireDriverLicense: {
      type: Boolean,
      default: true
    },
    requireInsurance: {
      type: Boolean,
      default: true
    },
    minDriverAge: {
      type: Number,
      default: 21
    },
    maxDriverAge: {
      type: Number,
      default: 75
    },
    allowOvernightBookings: {
      type: Boolean,
      default: true
    },
    bufferTime: {
      type: Number,
      default: 30
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.index({});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;