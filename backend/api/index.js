import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import { errorHandler, notFound } from "../middleware/errorHandler.js";
import connectDB from "../config/connectDB.js";
import config from "../config/config.js";

// Import routes
import authRoutes from "../routes/auth.js";
import eventRoutes from "../routes/events.js";
import userRoutes from "../routes/users.js";

// Connect to database on startup (for local development)
if (config.db.uri) {
  connectDB().catch(err => {
    if (config.debug.isDevelopment) {
      console.error("Failed to connect to database:", err.message);
    }
    // Don't exit in serverless environment
  });
} else {
  if (config.debug.isDevelopment) {
    console.warn("MONGODB_URI not found, database connection skipped");
  }
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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = config.cors.allowedOrigins.some(allowedOrigin => {
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
  credentials: config.cors.credentials,
  optionsSuccessStatus: config.cors.optionsSuccessStatus,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  exposedHeaders: config.cors.exposedHeaders,
  preflightContinue: config.cors.preflightContinue,
  maxAge: config.cors.maxAge,
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
app.use(session(config.session));

// Database connection check middleware - applied globally
const checkDatabaseConnection = async (req, res, next) => {
  // Skip database check only for true no-DB endpoints
  if (req.path === "/api/test" || req.path === "/api/cors-test") {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(503).json({
      success: false,
      message: "Database connection not available. Please try again later."
    });
  }
};

// Apply database connection middleware globally
app.use(checkDatabaseConnection);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

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
      NODE_ENV: config.server.nodeEnv,
      VERCEL: process.env.VERCEL,
      MONGODB_URI: config.db.uri ? "Set" : "Not set",
      FRONTEND_URL: config.server.frontendUrl,
      JWT_SECRET: config.jwt.secret ? "Set" : "Not set",
      CLOUDINARY_CLOUD_NAME: config.cloudinary.cloud_name ? "Set" : "Not set",
      CLOUDINARY_API_KEY: config.cloudinary.api_key ? "Set" : "Not set",
      CLOUDINARY_API_SECRET: config.cloudinary.api_secret ? "Set" : "Not set"
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
      FRONTEND_URL: config.server.frontendUrl,
      updated: new Date().toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
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
if (!config.debug.isProduction || !config.debug.isVercel) {
  app.listen(config.server.port, () => {
    console.log(`Server running in ${config.server.nodeEnv} mode on port ${config.server.port}`);
    console.log(`API Documentation: http://localhost:${config.server.port}`);
  });
}

// Export app for Vercel
export default app;
