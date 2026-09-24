import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
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
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
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
