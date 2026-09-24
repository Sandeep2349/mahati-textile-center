import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  attributes: {
    type: Map,
    of: String,
    required: true,
    // Dynamic attributes based on category:
    // Bangles: { size: "2.4", color: "Red", material: "Glass" }
    // Apparel: { size: "XL", color: "Navy", fabric: "Cotton" }
    // Innerwear: { size: "34B", pack: "Pack of 2" }
    // DailyWear: { size: "Single", color: "White", type: "Towel" }
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function (value) {
        return value <= this.price;
      },
      message: 'Discount price must be less than or equal to regular price',
    },
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  images: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  category: {
    type: String,
    required: true,
    enum: ['Mens', 'Womens', 'Innerwear', 'Bangles', 'DailyWear'],
    index: true,
  },
  subCategory: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: [{
    type: String,
    trim: true,
  }],
  hasVariants: {
    type: Boolean,
    default: true,
  },
  variants: [variantSchema],
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ 'variants.attributes.size': 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for effective price (discountPrice if available, else price)
productSchema.virtual('effectivePrice').get(function () {
  if (this.variants && this.variants.length > 0) {
    const activeVariants = this.variants.filter(v => v.isActive && v.stock > 0);
    if (activeVariants.length > 0) {
      const minPrice = Math.min(...activeVariants.map(v => v.discountPrice || v.price));
      return minPrice;
    }
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;