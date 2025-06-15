// lib/dbConnect.js
import mongoose from 'mongoose';

let cached = global.mongoose; 
// In a serverless environment, `global` persists between lambda invocations.
// If you’re not in a serverless context you can just use a module‐scoped variable.

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('🟢 Reusing existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    const opts = {
      bufferCommands: false,
      // you can add more options here
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('🟢 MongoDB connected');
        return mongooseInstance;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
