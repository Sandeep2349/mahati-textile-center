import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  lookupOrders,
  verifyOrderPayment,
  updateOrderStatus,
  createWalkInSale,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Customer endpoints
router.post('/', createOrder);
router.get('/track/lookup', lookupOrders);
router.get('/:id', getOrderById);

// Admin-protected operations
router.get('/', protect, adminOnly, getOrders);
router.put('/:id/verify', protect, adminOnly, verifyOrderPayment);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.post('/walkin', protect, adminOnly, createWalkInSale);

export default router;
