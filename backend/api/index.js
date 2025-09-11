import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import { errorHandler, notFound } from '../middleware/errorHandler.js';

// Import routes
import authRoutes from '../routes/auth.js';
import eventRoutes from '../routes/events.js';
import userRoutes from '../routes/users.js';

// Load environment variables
dotenv.config();

// Connect to database (with error handling for serverless)
connectDB().catch(err => {
  // Don't log errors in production to avoid exposing sensitive info
  if (process.env.NODE_ENV !== 'production') {
    console.error('Failed to connect to database:', err);
  }
  // Don't exit in serverless environment
});

const app = express();

// Handle favicon requests FIRST - before any middleware
app.get('/favicon.ico', (req, res) => {
  try {
    // Return a simple 204 No Content response
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.status(204).end();
  } catch (error) {
    // Fallback if there's any error
    res.status(204).end();
  }
});

// Handle other common favicon requests
app.get('/favicon.png', (req, res) => {
  res.status(204).end();
});

app.get('/apple-touch-icon.png', (req, res) => {
  res.status(204).end();
});

// Middleware
// Allow multiple origins via comma-separated FRONTEND_URL env
const allowedOrigins = (process.env.FRONTEND_URL || 'https://calander-frontend.vercel.app,https://calendar-frontend.vercel.app')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, favicon requests)
    if (!origin) return callback(null, true);
    
    // Log for debugging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('CORS request from origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log rejected origins for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('CORS rejected origin:', origin);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration - simplified for serverless
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
  resave: false,
  saveUninitialized: false,
  // Use memory store for serverless (sessions won't persist across function invocations)
  // In production, consider using Redis or another external store
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
  }
}));

// Database connection check middleware
const checkDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection not available. Please try again later.'
    });
  }
  next();
};

// Routes
app.use('/api/auth', checkDatabaseConnection, authRoutes);
app.use('/api/events', checkDatabaseConnection, eventRoutes);
app.use('/api/users', checkDatabaseConnection, userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      database: 'unknown'
    });
  }
});

// Simple test endpoint (no database required)
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working',
    origin: req.headers.origin || 'No origin header',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - simple response without database dependency
app.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Event Calendar API',
      version: '1.0.0',
      status: 'running'
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Event Calendar API',
      status: 'running'
    });
  }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
  });
}

// Export app for Vercel
export default app;
