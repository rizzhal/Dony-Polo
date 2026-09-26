import mongoose from 'mongoose';

let cached = globalThis.__dpvn_mongoose;
if (!cached) cached = globalThis.__dpvn_mongoose = { conn: null, promise: null };

export default async function connectDb() {
  if (cached.conn) return cached.conn;
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) throw new Error('MONGODB_URI is not configured. Add it to .env.local.');
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
