import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Car brand is required'],
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true,
    maxlength: [100, 'Model name cannot exceed 100 characters']
  },
  year: {
    type: Number,
    required: [true, 'Manufacturing year is required'],
    min: [1990, 'Year cannot be earlier than 1990'],
    max: [2030, 'Year cannot be later than 2030']
  },
  category: {
    type: String,
    required: [true, 'Car category is required'],
    enum: [
      'Economy',
      'Compact', 
      'Mid-size',
      'Full-size',
      'Luxury',
      'SUV',
      'Compact SUV',
      'Mid-size SUV',
      'Full-size SUV',
      'Electric',
      'Hybrid',
      'Sports',
      'Convertible',
      'Van',
      'Truck'
    ]
  },
  type: {
    type: String,
    required: [true, 'Car type is required'],
    enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Truck']
  },
  // Rental pricing
  pricePerDay: {
    type: Number,
    required: [true, 'Daily price is required'],
    min: [0, 'Price cannot be negative']
  },
  pricePerWeek: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  pricePerMonth: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  // Sales pricing and condition
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  condition: {
    type: String,
    enum: ['New', 'Used'],
    default: 'Used'
  },
  isForRent: {
    type: Boolean,
    default: true
  },
  isForSale: {
    type: Boolean,
    default: false
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG']
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['Manual', 'Automatic', 'CVT', 'Semi-Automatic']
  },
  seatingCapacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: [1, 'Must have at least 1 seat'],
    max: [15, 'Cannot have more than 15 seats']
  },
  doors: {
    type: Number,
    required: [true, 'Number of doors is required'],
    min: [2, 'Must have at least 2 doors'],
    max: [6, 'Cannot have more than 6 doors']
  },
  luggageCapacity: {
    type: Number,
    min: [0, 'Luggage capacity cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  features: [{
    type: String,
    enum: [
      'GPS Navigation',
      'Bluetooth',
      'USB Port',
      'Wireless Charging',
      'Backup Camera',
      'Parking Sensors',
      'Cruise Control',
      'Lane Departure Warning',
      'Collision Avoidance',
      'Blind Spot Monitoring',
      'Sunroof',
      'Leather Seats',
      'Heated Seats',
      'Cooled Seats',
      'Premium Audio',
      'Air Conditioning',
      'Automatic Climate Control',
      'Remote Start',
      'Keyless Entry',
      'Push Button Start',
      'Apple CarPlay',
      'Android Auto',
      'WiFi Hotspot',
      'Premium Sound System',
      'Rear Entertainment System'
    ]
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  mileage: {
    type: Number,
    min: [0, 'Mileage cannot be negative']
  },
  color: {
    exterior: {
      type: String,
      required: [true, 'Exterior color is required']
    },
    interior: String
  },
  engine: {
    type: {
      type: String,
      enum: ['V4', 'V6', 'V8', 'V10', 'V12', 'Flat-4', 'Flat-6', 'Rotary', 'Electric Motor']
    },
    displacement: Number, // in liters
    power: Number, // in horsepower
    torque: Number // in lb-ft
  },
  performance: {
    acceleration: {
      zeroToSixty: Number, // in seconds
      quarterMile: Number // in seconds
    },
    topSpeed: Number, // in mph
    fuelEconomy: {
      city: Number, // mpg
      highway: Number, // mpg
      combined: Number // mpg
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative']
    }
  },
  availability: {
    monday: { start: String, end: String, available: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
    thursday: { start: String, end: String, available: { type: Boolean, default: true } },
    friday: { start: String, end: String, available: { type: Boolean, default: true } },
    saturday: { start: String, end: String, available: { type: Boolean, default: true } },
    sunday: { start: String, end: String, available: { type: Boolean, default: true } }
  },
  bookingRules: {
    minimumAge: {
      type: Number,
      default: 21
    },
    maximumAge: {
      type: Number,
      default: 75
    },
    minimumRental: {
      type: Number,
      default: 1, // minimum days
      min: [1, 'Minimum rental period is 1 day']
    },
    maximumRental: {
      type: Number,
      default: 30, // maximum days
      min: [1, 'Maximum rental period must be at least 1 day']
    },
    advanceBooking: {
      type: Number,
      default: 0, // days in advance
      min: [0, 'Advance booking days cannot be negative']
    },
    cancellationPolicy: {
      type: String,
      enum: ['Flexible', 'Moderate', 'Strict', 'Super Strict'],
      default: 'Moderate'
    }
  },
  maintenance: {
    lastService: Date,
    nextService: Date,
    mileageAtLastService: Number,
    status: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    records: [{
      date: Date,
      type: {
        type: String,
        enum: ['Routine', 'Repair', 'Inspection', 'Replacement']
      },
      description: String,
      cost: Number,
      provider: String
    }]
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for primary image
carSchema.virtual('primaryImage').get(function() {
  if (!this.images || !Array.isArray(this.images)) {
    return null;
  }
  const primaryImage = this.images.find(img => img.isPrimary);
  return primaryImage ? primaryImage.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for main image (for backward compatibility)
carSchema.virtual('image').get(function() {
  return this.primaryImage;
});

// Virtual for availability status
carSchema.virtual('isAvaliable').get(function() {
  return this.isAvailable;
});

// Indexes for better query performance
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ category: 1 });
carSchema.index({ location: 1 });
carSchema.index({ pricePerDay: 1 });
carSchema.index({ isAvailable: 1, isActive: 1 });
carSchema.index({ year: -1 });
carSchema.index({ ratings: -1 });

// Text index for search
carSchema.index({
  brand: 'text',
  model: 'text',
  category: 'text',
  location: 'text',
  'features': 'text'
});

const Car = mongoose.model('Car', carSchema);

export default Car;