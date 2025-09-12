import mongoose from "mongoose";
import config from "./config.js";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!config.db.uri) {
    const message = "MONGODB_URI is not set in environment variables";
    if (config.debug.isDevelopment) {
      console.error(message);
    }
    throw new Error(message);
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (config.debug.isDevelopment) {
      console.log("Connecting to MongoDB...");
    }
    
    // If the SRV URI does not include a database path, allow providing it via MONGO_DB_NAME
    const connectionOptions = {
      ...config.db.options,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      ...(process.env.MONGO_DB_NAME ? { dbName: process.env.MONGO_DB_NAME } : {}),
    };

    cached.promise = mongoose.connect(config.db.uri, connectionOptions).then((mongoose) => {
      if (config.debug.isDevelopment) {
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      }
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // reset on failure
    if (config.debug.isDevelopment) {
      console.error("Database connection error:", err?.message || err);
      if (err?.reason?.code) {
        console.error("Mongo error code:", err.reason.code);
      }
    }
    throw err;
  }

  return cached.conn;
}

export default connectDB;
