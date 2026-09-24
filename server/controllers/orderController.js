import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { generateUpiUri, isValidUtr } from '../utils/upi.js';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp.js';

/**
 * Helper to decrement product variant stock
 */
const decrementStockForItems = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    // Find variant by matching attributes
    const targetAttrs = item.variantAttributes instanceof Map
      ? Object.fromEntries(item.variantAttributes)
      : item.variantAttributes || {};

    const variant = product.variants.find((v) => {
      const vAttrs = v.attributes instanceof Map
        ? Object.fromEntries(v.attributes)
        : v.attributes || {};

      const targetKeys = Object.keys(targetAttrs);
      if (targetKeys.length === 0) return true; // fallback if no attributes specified

      return targetKeys.every(
        (key) => String(vAttrs[key] || '').toLowerCase() === String(targetAttrs[key] || '').toLowerCase()
      );
    });

    if (variant) {
      variant.stock = Math.max(0, variant.stock - item.quantity);
      await product.save();
    }
  }
};

/**
 * @desc    Create new customer order (Zero-cost UPI / COD)
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req, res) => {
  try {
    const { customer, items, billing, payment, notes } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Order items cannot be empty' });
    }

    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.pinCode) {
      return res.status(400).json({ success: false, message: 'Customer details are incomplete' });
    }

    // Validate UTR if provided at time of creation
    if (payment?.upiUtrNumber && !isValidUtr(payment.upiUtrNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UPI UTR reference. Must be exactly 12 numeric digits.',
      });
    }

    // Calculate or verify billing
    const calculatedSubtotal = items.reduce((sum, it) => sum + (Number(it.unitPrice) * Number(it.quantity)), 0);
    const deliveryFee = billing?.deliveryFee !== undefined ? Number(billing.deliveryFee) : 0;
    const totalAmount = calculatedSubtotal + deliveryFee;

    // Generate unique order number
    const count = await Order.countDocuments();
    const orderNumber = `MTC-${String(count + 1).padStart(4, '0')}`;

    const newOrder = new Order({
      orderNumber,
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        whatsappNumber: customer.whatsappNumber ? customer.whatsappNumber.trim() : customer.phone.trim(),
        address: customer.address.trim(),
        landmark: customer.landmark ? customer.landmark.trim() : '',
        pinCode: customer.pinCode.trim(),
      },
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        variantAttributes: item.variantAttributes || {},
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity,
      })),
      billing: {
        subtotal: calculatedSubtotal,
        deliveryFee,
        totalAmount,
      },
      payment: {
        method: payment?.method || 'UPI_DIRECT',
        status: payment?.upiUtrNumber ? 'PENDING_VERIFICATION' : 'PENDING_VERIFICATION',
        upiUtrNumber: payment?.upiUtrNumber || undefined,
        receiptScreenshotUrl: payment?.receiptScreenshotUrl || undefined,
      },
      orderStatus: 'RECEIVED',
      notes: notes || '',
      isWalkIn: false,
    });

    const savedOrder = await newOrder.save();

    // Generate dynamic UPI URI
    const upiUri = generateUpiUri({
      amount: savedOrder.billing.totalAmount,
      orderNumber: savedOrder.orderNumber,
    });

    // Generate WhatsApp deep link fallback
    const whatsappUrl = generateWhatsAppOrderUrl(savedOrder);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder,
      upiUri,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to place order',
    });
  }
};

/**
 * @desc    Get all orders with filters (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getOrders = async (req, res) => {
  try {
    const { status, paymentStatus, isWalkIn, search } = req.query;

    const filter = {};

    if (status && status !== 'ALL') {
      filter.orderStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      filter['payment.status'] = paymentStatus;
    }

    if (isWalkIn !== undefined) {
      filter.isWalkIn = isWalkIn === 'true';
    }

    if (search && search.trim()) {
      filter.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { 'customer.fullName': { $regex: search.trim(), $options: 'i' } },
        { 'customer.phone': { $regex: search.trim(), $options: 'i' } },
        { 'payment.upiUtrNumber': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name category images');

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * @desc    Get single order by ID or orderNumber
 * @route   GET /api/orders/:id
 * @access  Public (for order status lookup) / Admin
 */
export const getOrderById = async (req, res) => {
  try {
    let order;
    if (req.params.id.startsWith('MTC-')) {
      order = await Order.findOne({ orderNumber: req.params.id.toUpperCase() });
    } else {
      order = await Order.findById(req.params.id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const upiUri = generateUpiUri({
      amount: order.billing.totalAmount,
      orderNumber: order.orderNumber,
    });

    const whatsappUrl = generateWhatsAppOrderUrl(order);

    return res.json({
      success: true,
      data: order,
      upiUri,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
    });
  }
};

/**
 * @desc    Verify UPI UTR payment and decrement stock (Admin)
 * @route   PUT /api/orders/:id/verify
 * @access  Private/Admin
 */
export const verifyOrderPayment = async (req, res) => {
  try {
    const { utrNumber } = req.body;

    if (!utrNumber || !isValidUtr(utrNumber)) {
      return res.status(400).json({
        success: false,
        message: 'A valid 12-digit numeric UPI UTR is required to verify payment',
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.payment.status === 'VERIFIED') {
      return res.status(400).json({
        success: false,
        message: 'Order payment is already verified',
      });
    }

    // Decrement stock for all items
    await decrementStockForItems(order.items);

    // Update payment and order status
    order.payment.upiUtrNumber = String(utrNumber).trim();
    order.payment.status = 'VERIFIED';
    order.payment.verifiedAt = new Date();
    order.payment.verifiedBy = req.user._id;
    order.orderStatus = 'CONFIRMED';

    const updated = await order.save();

    return res.json({
      success: true,
      message: 'Payment verified and stock decremented successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment',
    });
  }
};

/**
 * @desc    Update order fulfillment status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['RECEIVED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    const updated = await order.save();

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
    });
  }
};

/**
 * @desc    Record a Walk-In POS sale (Admin / Cash Counter)
 *          Immediately decrements physical stock and records transaction
 * @route   POST /api/orders/walkin
 * @access  Private/Admin
 */
export const createWalkInSale = async (req, res) => {
  try {
    const { items, paymentMethod = 'COUNTER_CASH', customerName = 'Walk-In Customer', customerPhone = '9999999999', notes } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Sale must include at least one item' });
    }

    // Calculate total
    const subtotal = items.reduce((sum, it) => sum + (Number(it.unitPrice) * Number(it.quantity)), 0);

    const count = await Order.countDocuments();
    const orderNumber = `POS-${String(count + 1).padStart(4, '0')}`;

    // Decrement stock immediately
    await decrementStockForItems(items);

    const posOrder = new Order({
      orderNumber,
      customer: {
        fullName: customerName,
        phone: customerPhone,
        whatsappNumber: customerPhone,
        address: 'In-Store Counter Walk-In',
        landmark: 'Mahati Physical Store',
        pinCode: '500001',
      },
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        variantAttributes: item.variantAttributes || {},
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity,
      })),
      billing: {
        subtotal,
        deliveryFee: 0,
        totalAmount: subtotal,
      },
      payment: {
        method: paymentMethod, // 'COUNTER_CASH' or 'UPI_DIRECT'
        status: 'VERIFIED',
        verifiedAt: new Date(),
        verifiedBy: req.user._id,
      },
      orderStatus: 'DELIVERED',
      notes: notes || 'Direct Walk-In Counter POS Sale',
      isWalkIn: true,
    });

    const saved = await posOrder.save();

    return res.status(201).json({
      success: true,
      message: 'Walk-in sale completed and inventory synchronized',
      data: saved,
    });
  } catch (error) {
    console.error('Walk-in POS error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete walk-in sale',
    });
  }
};

/**
 * @desc    Lookup customer orders by 10-digit mobile number or order number (Zero-Login Tracking)
 * @route   GET /api/orders/track/lookup
 * @access  Public
 */
export const lookupOrders = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a 10-digit mobile number or order reference (e.g. MTC-0001)',
      });
    }

    const clean = query.trim();
    const isDigitsOnly = /^\d+$/.test(clean);

    let filter = {};

    if (isDigitsOnly && clean.length === 10) {
      filter = {
        $or: [
          { 'customer.phone': clean },
          { 'customer.whatsappNumber': clean },
        ],
      };
    } else if (clean.toUpperCase().startsWith('MTC-') || clean.toUpperCase().startsWith('POS-')) {
      filter = { orderNumber: clean.toUpperCase() };
    } else if (isDigitsOnly) {
      filter = {
        $or: [
          { 'customer.phone': { $regex: clean, $options: 'i' } },
          { 'payment.upiUtrNumber': clean },
        ],
      };
    } else {
      filter = {
        $or: [
          { orderNumber: { $regex: clean, $options: 'i' } },
          { 'customer.phone': { $regex: clean, $options: 'i' } },
          { 'customer.fullName': { $regex: clean, $options: 'i' } },
        ],
      };
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Lookup orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to look up orders',
      error: error.message,
    });
  }
};
