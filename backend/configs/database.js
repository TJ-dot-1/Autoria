import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Database connection error: MONGODB_URI environment variable is not defined.');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Don't exit process so Render health checks can still pass
    // process.exit(1);
  }
};

export default connectDatabase;