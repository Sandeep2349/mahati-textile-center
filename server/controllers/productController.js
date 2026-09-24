import Product from '../models/Product.js';

/**
 * @desc    Get all active products with dynamic faceted filtering
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const { category, subCategory, size, minPrice, maxPrice, search, sort } = req.query;

    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (subCategory && subCategory !== 'All') {
      filter.subCategory = subCategory;
    }

    // Filter by size attribute inside variants Map
    if (size) {
      filter['variants.attributes.size'] = size;
    }

    // Text search in name or description
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { subCategory: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let query = Product.find(filter);

    // Sorting
    if (sort === 'price-asc') {
      query = query.sort({ 'variants.price': 1 });
    } else if (sort === 'price-desc') {
      query = query.sort({ 'variants.price': -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    let products = await query.exec();

    // In-memory price range filter for dynamic variant prices if minPrice or maxPrice given
    if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;

      products = products.filter(p => {
        const prices = p.variants.map(v => v.discountPrice || v.price);
        return prices.some(pr => pr >= min && pr <= max);
      });
    }

    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product details',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new product (Admin)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: saved,
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

/**
 * @desc    Update product by ID (Admin)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

/**
 * @desc    Soft delete or toggle product status (Admin)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete: set isActive to false
    product.isActive = false;
    await product.save();

    return res.json({
      success: true,
      message: 'Product deactivated successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate product',
    });
  }
};

/**
 * @desc    Update variant stock directly (Admin / POS)
 * @route   PATCH /api/products/:id/variants/:sku/stock
 * @access  Private/Admin
 */
export const updateVariantStock = async (req, res) => {
  try {
    const { id, sku } = req.params;
    const { stockDelta, newStock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const variant = product.variants.find(v => v.sku === sku);
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    if (newStock !== undefined) {
      variant.stock = Math.max(0, Number(newStock));
    } else if (stockDelta !== undefined) {
      variant.stock = Math.max(0, variant.stock + Number(stockDelta));
    }

    await product.save();

    return res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        productId: product._id,
        sku: variant.sku,
        stock: variant.stock,
      },
    });
  } catch (error) {
    console.error('Update stock error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update stock',
    });
  }
};
