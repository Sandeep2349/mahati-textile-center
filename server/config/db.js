import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`\x1b[32m✔ MongoDB Connected successfully: ${conn.connection.host}\x1b[0m`);
    return conn;
  } catch (error) {
    console.error(`\x1b[31m✖ MongoDB Connection Error: ${error.message}\x1b[0m`);
    console.warn('\x1b[33m⚠ Ensure MongoDB is running or configure MONGODB_URI in server/.env with your MongoDB Atlas free cluster connection string.\x1b[0m');
    // In production or when strictly required, we might exit, but in development keep server responsive
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;