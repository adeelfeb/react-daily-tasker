import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    const message = "MONGODB_URI is not set in environment variables";
    if (process.env.NODE_ENV !== "production") {
      console.error(message);
    }
    throw new Error(message);
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Connecting to MongoDB...");
    }
    
    // If the SRV URI does not include a database path, allow providing it via MONGO_DB_NAME
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      ...(process.env.MONGO_DB_NAME ? { dbName: process.env.MONGO_DB_NAME } : {}),
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, connectionOptions).then((mongoose) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      }
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // reset on failure
    if (process.env.NODE_ENV !== "production") {
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
