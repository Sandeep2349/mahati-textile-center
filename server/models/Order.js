import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  variantAttributes: {
    type: Map,
    of: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const customerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^[6-9]\d{9}$/,
  },
  whatsappNumber: {
    type: String,
    trim: true,
    match: /^[6-9]\d{9}$/,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{6}$/,
  },
}, { _id: false });

const billingSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['UPI_DIRECT', 'COD', 'COUNTER_CASH'],
    default: 'UPI_DIRECT',
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING_VERIFICATION', 'VERIFIED', 'FAILED'],
    default: 'PENDING_VERIFICATION',
  },
  upiUtrNumber: {
    type: String,
    trim: true,
    match: /^\d{12}$/,
    validate: {
      validator: function (value) {
        if (this.method === 'UPI_DIRECT' && this.status === 'VERIFIED') {
          return /^\d{12}$/.test(value);
        }
        return true;
      },
      message: 'UPI UTR number must be exactly 12 digits for verified UPI payments',
    },
  },
  receiptScreenshotUrl: {
    type: String,
    trim: true,
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  customer: {
    type: customerSchema,
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function (items) {
        return items.length > 0;
      },
      message: 'Order must have at least one item',
    },
  },
  billing: {
    type: billingSchema,
    required: true,
  },
  payment: {
    type: paymentSchema,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['RECEIVED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'RECEIVED',
    index: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  isWalkIn: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
orderSchema.index({ 'payment.upiUtrNumber': 1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1, 'payment.status': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `MTC-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Method to verify payment and decrement stock
orderSchema.methods.verifyPayment = async function (utrNumber, verifiedBy) {
  this.payment.upiUtrNumber = utrNumber;
  this.payment.status = 'VERIFIED';
  this.payment.verifiedAt = new Date();
  this.payment.verifiedBy = verifiedBy;
  this.orderStatus = 'CONFIRMED';

  // Decrement stock for each item
  const Product = mongoose.model('Product');
  for (const item of this.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      const variant = product.variants.find(v =>
        Object.entries(item.variantAttributes).every(([key, value]) => v.attributes.get(key) === value)
      );
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
      await product.save();
    }
  }

  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

export default Order;