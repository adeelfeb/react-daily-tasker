import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB already connected (cached)");
    }
    return cached.conn;
  }

  if (!cached.promise) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Connecting to MongoDB...");
    }
    
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }).then((mongoose) => {
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
      console.error("Database connection error:", err.message);
    }
    throw err;
  }

  return cached.conn;
}

export default connectDB;
