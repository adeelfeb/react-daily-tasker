import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler, notFound } from "../middleware/errorHandler.js";
import connectDB from "../config/database.js";

// Import routes
import authRoutes from "../routes/auth.js";
import eventRoutes from "../routes/events.js";
import userRoutes from "../routes/users.js";

// Load environment variables (only in development)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// Handle favicon requests FIRST - before any middleware
app.get("/favicon.ico", (req, res) => {
  try {
    // Return a simple 204 No Content response
    res.setHeader("Content-Type", "image/x-icon");
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    res.status(204).end();
  } catch (error) {
    // Fallback if there's any error
    res.status(204).end();
  }
});

// Handle other common favicon requests
app.get("/favicon.png", (req, res) => {
  res.status(204).end();
});

app.get("/apple-touch-icon.png", (req, res) => {
  res.status(204).end();
});

// Middleware
// CORS configuration - Allow all origins for testing
// app.use(cors({
//   origin: "*", // Allow all origins for testing
//   credentials: false, // Set to false when using wildcard origin
//   optionsSuccessStatus: 200, // Some legacy browsers choke on 204
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
//   allowedHeaders: [
//     "Content-Type", 
//     "Authorization", 
//     "X-Requested-With",
//     "Accept",
//     "Origin",
//     "Access-Control-Request-Method",
//     "Access-Control-Request-Headers"
//   ],
//   exposedHeaders: [
//     "Content-Range", 
//     "X-Content-Range",
//     "Access-Control-Allow-Origin",
//     "Access-Control-Allow-Credentials"
//   ],
//   preflightContinue: false,
//   maxAge: 86400 // Cache preflight for 24 hours
// }));

// CORS configuration - Restrict to specific origins
const allowedOrigins = [
  "https://calander-frontend.vercel.app", // Your deployed frontend
  /^http:\/\/localhost:\d+$/, // Localhost with any port
  /^https:\/\/localhost:\d+$/, // HTTPS localhost with any port
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === "string") {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: [
    "Content-Range", 
    "X-Content-Range",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials"
  ],
  preflightContinue: false,
  maxAge: 86400 // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "86400");
  res.sendStatus(200);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration - optimized for cross-origin and serverless
app.use(session({
  secret: process.env.SESSION_SECRET || "your-super-secret-session-key",
  resave: false,
  saveUninitialized: false,
  // Use memory store for serverless (sessions won't persist across function invocations)
  // In production, consider using Redis or another external store
  cookie: {
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-site cookies for production
    domain: process.env.NODE_ENV === "production" ? undefined : undefined, // Let browser handle domain
  },
  // Additional session options for serverless
  name: "sessionId", // Custom session name
  rolling: true, // Reset expiration on activity
}));

// Database connection check middleware - serverless optimized
const checkDatabaseConnection = async (req, res, next) => {
  // Skip database check for public endpoints
  if (req.path === "/api/events/public" || req.path === "/api/test" || req.path === "/api/cors-test") {
    return next();
  }
  
  try {
    // Connect to database using cached connection
    await connectDB();
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Database connection error:", error.message);
    }
    return res.status(503).json({
      success: false,
      message: "Database connection not available. Please try again later."
    });
  }
};

// Public events endpoint (no database required)
app.get("/api/events/public", (req, res) => {
  res.json({
    success: true,
    message: "Public events endpoint - database connection required for full functionality",
    data: [],
    count: 0
  });
});

// Routes
app.use("/api/auth", checkDatabaseConnection, authRoutes);
app.use("/api/events", checkDatabaseConnection, eventRoutes);
app.use("/api/users", checkDatabaseConnection, userRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    let dbStatus = "disconnected";
    try {
      await connectDB();
      dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    } catch (error) {
      dbStatus = "error";
    }
    
    res.json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      database: dbStatus
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      database: "unknown"
    });
  }
});

// Simple test endpoint (no database required)
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working",
    origin: req.headers.origin || "No origin header",
    timestamp: new Date().toISOString()
  });
});

// Environment debug endpoint (development only)
app.get("/api/debug", async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: "Not found" });
  }
  
  let dbInfo = {
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || "Not connected"
  };
  
  try {
    await connectDB();
    dbInfo.readyState = mongoose.connection.readyState;
    dbInfo.host = mongoose.connection.host || "Not connected";
  } catch (error) {
    dbInfo.error = error.message;
  }
  
  res.json({
    success: true,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set",
      FRONTEND_URL: process.env.FRONTEND_URL || "Not set",
      JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set"
    },
    database: dbInfo,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - simple response without database dependency
app.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      message: "Event Calendar API",
      version: "1.0.0",
      status: "running",
      FRONTEND_URL: process.env.FRONTEND_URL
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Event Calendar API",
      status: "running"
    });
  }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
  });
}

// Export app for Vercel
export default app;
