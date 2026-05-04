import mongoose from 'mongoose';

export async function connectDb(uri) {
  if (!uri) {
    return null;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose.connection;
}
