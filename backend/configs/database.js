import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const CANONICAL_ATLAS_URI = 'mongodb+srv://josiejosiah89_db_user:b0XjXBF9GTa7nr27@autoria1.twgne8u.mongodb.net/autoria?retryWrites=true&w=majority';

export const dbState = {
  isConnected: false,
  lastError: null,
  lastConnectedAt: null,
  activeHost: null,
  reconnectAttempts: 0
};

export const getEffectiveMongoUri = () => {
  const envUri = (process.env.MONGODB_URI || '').trim();
  // If no URI, or if it points to the deprecated cluster0, or if it's localhost in production
  if (!envUri) return CANONICAL_ATLAS_URI;
  if (envUri.includes('cluster0.ubwwtjr.mongodb.net')) return CANONICAL_ATLAS_URI;
  if (process.env.NODE_ENV === 'production' && (envUri.includes('127.0.0.1') || envUri.includes('localhost'))) {
    return CANONICAL_ATLAS_URI;
  }
  return envUri;
};

// Set up connection event listeners once
let listenersInitialized = false;
const initListeners = () => {
  if (listenersInitialized) return;
  listenersInitialized = true;

  mongoose.connection.on('connected', () => {
    dbState.isConnected = true;
    dbState.lastError = null;
    dbState.lastConnectedAt = new Date().toISOString();
    dbState.activeHost = mongoose.connection.host;
    console.log(`[Database] MongoDB connected successfully to ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    dbState.isConnected = false;
    dbState.lastError = err.message;
    console.error(`[Database] MongoDB connection error: ${err.message}`);
    scheduleReconnect();
  });

  mongoose.connection.on('disconnected', () => {
    dbState.isConnected = false;
    console.warn('[Database] MongoDB disconnected');
    scheduleReconnect();
  });
};

let reconnectTimer = null;
export const scheduleReconnect = () => {
  if (reconnectTimer || mongoose.connection.readyState === 1) return;
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    if (mongoose.connection.readyState !== 1) {
      console.log('[Database] Attempting automatic reconnection to MongoDB...');
      await connectDatabase();
    }
  }, 8000);
};

export const connectDatabase = async () => {
  initListeners();
  
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = getEffectiveMongoUri();
  
  // Mask credentials for safe logging
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log(`[Database] Connecting to MongoDB: ${maskedUri}`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    dbState.isConnected = true;
    dbState.lastError = null;
    dbState.lastConnectedAt = new Date().toISOString();
    dbState.activeHost = mongoose.connection.host;
    console.log('[Database] Database connected successfully');
  } catch (error) {
    dbState.isConnected = false;
    dbState.lastError = error.message;
    console.error('[Database] Database connection error:', error.message);
    scheduleReconnect();
  }
};

export default connectDatabase;