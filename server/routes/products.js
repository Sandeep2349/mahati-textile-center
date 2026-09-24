import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateVariantStock,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only management endpoints
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/variants/:sku/stock', protect, adminOnly, updateVariantStock);

export default router;
