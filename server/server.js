import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import uploadRoutes from './routes/upload.js';
import Product from './models/Product.js';
import User from './models/User.js';
import { sampleProducts } from './data/sampleProducts.js';

// Load environment variables
dotenv.config();

// Auto-seed if database is completely empty on boot
const autoSeedIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding initial product catalog...');
      await Product.insertMany(sampleProducts);
      console.log(`\x1b[32m✔ Auto-seeded ${sampleProducts.length} initial products!\x1b[0m`);
    }
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
      console.log(`⚡ No admin account detected. Auto-creating default administrator: "${username}"...`);
      const admin = new User({
        username,
        password,
        name: 'Mahati Store Manager',
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log(`\x1b[32m✔ Administrator (${username}) created successfully!\x1b[0m`);
    }
  } catch (err) {
    console.warn('Auto-seed check notice:', err.message);
  }
};

// Connect to MongoDB
connectDB().then(() => {
  autoSeedIfEmpty();
});

const app = express();

// Middleware: CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      // Always allow local development and Vercel domains
      if (
        process.env.NODE_ENV !== 'production' ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      if (process.env.CLIENT_URL) {
        const allowed = process.env.CLIENT_URL.split(',').map((o) => o.trim().replace(/\/$/, ''));
        if (allowed.includes(origin.replace(/\/$/, ''))) {
          return callback(null, true);
        }
      }
      // Fallback for public client access
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  let productCount = 0;
  try {
    if (isDbConnected) {
      productCount = await Product.countDocuments();
    }
  } catch {
    // ignore
  }

  res.status(200).json({
    status: 'online',
    database: isDbConnected ? 'connected' : 'disconnected',
    productsCount: productCount,
    store: process.env.STORE_NAME || 'Mahati Textile Center',
    currency: 'INR (₹)',
    paymentGatewayCost: '0.00 (Zero MDR NPCI UPI)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.send('Mahati Textile Center Zero-Cost MERN Backend API is running.');
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[36m====================================================\x1b[0m`);
  console.log(`\x1b[32m✔ Mahati Textile Center API Server running on port ${PORT}\x1b[0m`);
  console.log(`\x1b[33m✔ Mode: ${process.env.NODE_ENV || 'development'}\x1b[0m`);
  console.log(`\x1b[35m✔ NPCI UPI VPA: ${process.env.STORE_UPI_VPA || 'mahatitextiles@upi'}\x1b[0m`);
  console.log(`\x1b[36m====================================================\x1b[0m`);
});

export default app;
