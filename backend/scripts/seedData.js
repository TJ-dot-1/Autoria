import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';

dotenv.config();

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123',
    phone: '+1234567890',
    role: 'user',
    dateOfBirth: new Date('1990-01-15'),
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'Password123',
    phone: '+1234567891',
    role: 'user',
    dateOfBirth: new Date('1992-05-20'),
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@autoria.com',
    password: 'admin123',
    phone: '+1234567892',
    role: 'admin',
    isActive: true,
    isEmailVerified: true
  }
];

const sampleCars = [
  {
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    category: 'Mid-size',
    type: 'Sedan',
    pricePerDay: 45,
    pricePerWeek: 280,
    pricePerMonth: 1200,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seatingCapacity: 5,
    doors: 4,
    luggageCapacity: 2,
    location: 'Downtown Office',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning'],
    images: [{
      url: '/uploads/cars/car-1763063644802-28089825.jpg',
      caption: 'Toyota Camry Front View',
      isPrimary: true
    }],
    color: {
      exterior: 'White',
      interior: 'Black'
    },
    engine: {
      type: 'V4',
      displacement: 2.5,
      power: 203,
      torque: 184
    },
    performance: {
      acceleration: {
        zeroToSixty: 8.4
      },
      topSpeed: 135,
      fuelEconomy: {
        city: 28,
        highway: 39,
        combined: 32
      }
    },
    isAvailable: true,
    isPopular: true,
    mileage: 25000
  },
  {
    brand: 'Honda',
    model: 'CR-V',
    year: 2023,
    category: 'SUV',
    type: 'SUV',
    pricePerDay: 55,
    pricePerWeek: 350,
    pricePerMonth: 1400,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seatingCapacity: 5,
    doors: 4,
    luggageCapacity: 4,
    location: 'Airport Branch',
    address: {
      street: '456 Airport Rd',
      city: 'New York',
      state: 'NY',
      zipCode: '11430',
      country: 'USA'
    },
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning', 'Remote Start'],
    images: [{
      url: '/uploads/cars/car-1763065991367-691024656.jpg',
      caption: 'Honda CR-V Side View',
      isPrimary: true
    }],
    color: {
      exterior: 'Silver',
      interior: 'Gray'
    },
    engine: {
      type: 'V4',
      displacement: 1.5,
      power: 190,
      torque: 179
    },
    performance: {
      acceleration: {
        zeroToSixty: 8.2
      },
      topSpeed: 125,
      fuelEconomy: {
        city: 28,
        highway: 34,
        combined: 30
      }
    },
    isAvailable: true,
    isPopular: true,
    mileage: 15000
  },
  {
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    category: 'Electric',
    type: 'Sedan',
    pricePerDay: 75,
    pricePerWeek: 450,
    pricePerMonth: 1800,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    doors: 4,
    luggageCapacity: 2,
    location: 'Tech District',
    address: {
      street: '789 Tech Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    },
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning', 'Premium Audio', 'Wireless Charging'],
    images: [{
      url: '/uploads/cars/car-1763066334737-745166483.jpg',
      caption: 'Tesla Model 3 Front View',
      isPrimary: true
    }],
    color: {
      exterior: 'Red',
      interior: 'Black'
    },
    engine: {
      type: 'Electric Motor',
      power: 283,
      torque: 317
    },
    performance: {
      acceleration: {
        zeroToSixty: 5.8
      },
      topSpeed: 140,
      fuelEconomy: {
        city: 134,
        highway: 126,
        combined: 131
      }
    },
    isAvailable: true,
    isPopular: false,
    mileage: 8000
  },
  {
    brand: 'BMW',
    model: 'X5',
    year: 2022,
    category: 'Luxury',
    type: 'SUV',
    pricePerDay: 95,
    pricePerWeek: 600,
    pricePerMonth: 2400,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seatingCapacity: 7,
    doors: 4,
    luggageCapacity: 5,
    location: 'Luxury Branch',
    address: {
      street: '321 Luxury Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
      country: 'USA'
    },
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning', 'Premium Audio', 'Leather Seats', 'Heated Seats'],
    images: [{
      url: '/uploads/cars/car-1763066446008-378204993.jpg',
      caption: 'BMW X5 Side View',
      isPrimary: true
    }],
    color: {
      exterior: 'Black',
      interior: 'Black'
    },
    engine: {
      type: 'V6',
      displacement: 3.0,
      power: 335,
      torque: 330
    },
    performance: {
      acceleration: {
        zeroToSixty: 5.3
      },
      topSpeed: 130,
      fuelEconomy: {
        city: 23,
        highway: 29,
        combined: 25
      }
    },
    isAvailable: true,
    isPopular: true,
    mileage: 20000
  },
  {
    brand: 'Ford',
    model: 'Mustang',
    year: 2023,
    category: 'Sports',
    type: 'Coupe',
    pricePerDay: 85,
    pricePerWeek: 520,
    pricePerMonth: 2000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seatingCapacity: 4,
    doors: 2,
    luggageCapacity: 1,
    location: 'Sports Branch',
    address: {
      street: '654 Speed Way',
      city: 'New York',
      state: 'NY',
      zipCode: '10004',
      country: 'USA'
    },
    features: ['GPS Navigation', 'Bluetooth', 'USB Port', 'Backup Camera', 'Air Conditioning', 'Premium Audio'],
    images: [{
      url: '/uploads/cars/car-1763057892003-587830213.jpg',
      caption: 'Ford Mustang Front View',
      isPrimary: true
    }],
    color: {
      exterior: 'Blue',
      interior: 'Black'
    },
    engine: {
      type: 'V8',
      displacement: 5.0,
      power: 450,
      torque: 410
    },
    performance: {
      acceleration: {
        zeroToSixty: 4.2
      },
      topSpeed: 155,
      fuelEconomy: {
        city: 16,
        highway: 25,
        combined: 19
      }
    },
    isAvailable: true,
    isPopular: false,
    mileage: 12000
  }
];

const sampleBookings = [
  {
    // bookingNumber will be auto-generated
    user: null, // Will be set after users are created
    car: null, // Will be set after cars are created
    bookingPeriod: {
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-18')
    },
    pickupLocation: 'Downtown Office',
    returnLocation: 'Downtown Office',
    pricing: {
      dailyRate: 45,
      totalDays: 3,
      subtotal: 135,
      taxes: 13.50,
      totalAmount: 148.50
    },
    payment: {
      method: 'Credit Card',
      status: 'Paid',
      paidAt: new Date('2024-01-14')
    },
    driver: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      email: 'john.doe@example.com',
      driversLicense: {
        number: 'DL123456789',
        state: 'NY',
        expiryDate: new Date('2026-12-31')
      }
    },
    status: 'Completed'
  }
];

// Connect to database
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Import data
const importData = async () => {
  try {
    await connectDatabase();

    console.log('🧹 Clearing existing data...');
    
    // Clear existing data
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();

    console.log('📝 Creating sample data...');

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create cars with the first user as addedBy
    const carsWithAddedBy = sampleCars.map(car => ({
      ...car,
      addedBy: createdUsers[0]._id
    }));
    
    const createdCars = await Car.insertMany(carsWithAddedBy);
    console.log(`✅ Created ${createdCars.length} cars`);

    // Create sample bookings
    const bookingWithRefs = {
      ...sampleBookings[0],
      user: createdUsers[0]._id,
      car: createdCars[0]._id
    };
    
    const createdBookings = await Booking.insertMany([bookingWithRefs]);
    console.log(`✅ Created ${createdBookings.length} bookings`);

    console.log('\n🎉 Sample data imported successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('👤 User: john.doe@example.com / password123');
    console.log('👤 User: jane.smith@example.com / password123');
    console.log('👑 Admin: admin@autoria.com / admin123');
    console.log('\n📊 Database Stats:');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`🚗 Cars: ${createdCars.length}`);
    console.log(`📅 Bookings: ${createdBookings.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDatabase();
    
    console.log('🗑️ Deleting all data...');
    
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();
    
    console.log('✅ All data deleted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Command line interface
if (process.argv[2] === '--import' || process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '--delete' || process.argv[2] === '-d') {
  deleteData();
} else {
  console.log(`
🎯 Autoria Database Seeding Script

Usage:
  node scripts/seedData.js --import    Import sample data
  node scripts/seedData.js --delete    Delete all data

Available Commands:
  --import, -i     Import sample data into the database
  --delete, -d     Delete all data from the database
  `);
}