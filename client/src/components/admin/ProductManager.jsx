import React, { useState, useEffect, useRef } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  uploadProductImage,
  checkUploadStatus,
} from '../../services/api';
import { formatINR } from '../../utils/formatters';
import {
  Plus,
  Package,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  Sparkles,
  Layers,
  RefreshCw,
  Edit2,
  Upload,
  Cloud,
  Image as ImageIcon,
  FileUp,
  Check,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Camera,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: 'Womens', label: "Women's Wear", subCategories: ['Sarees', 'Kurtis', 'Dress Materials', 'Nightwear'] },
  { id: 'Mens', label: "Men's Apparel", subCategories: ['Shirts', 'Trousers', 'Dhotis', 'Kurtas'] },
  { id: 'Innerwear', label: 'Innerwear', subCategories: ['Brassieres', 'Vests', 'Briefs'] },
  { id: 'Bangles', label: 'Bangles & Accessories', subCategories: ['Traditional Bangles', 'Metal Bangles', 'Bridal Sets'] },
  { id: 'DailyWear', label: 'Daily Wear & Fabrics', subCategories: ['Towels', 'Bedspreads', 'Lungis'] },
];

const PRESET_SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1596783049978-57775988e404?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
];

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Womens');
  const [subCategory, setSubCategory] = useState('Sarees');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_SAMPLE_IMAGES[0]);

  // Cloudinary image upload states
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Variants builder state
  const [variants, setVariants] = useState([
    {
      sku: 'SKU-001',
      size: 'Free Size',
      color: 'Red',
      price: 999,
      discountPrice: 799,
      stock: 20,
    },
  ]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setUploadingImage(true);
    setUploadError('');

    try {
      const res = await uploadProductImage(file);
      if (res.data.success && res.data.url) {
        setImageUrl(res.data.url);
        setCloudinaryConfigured(true);
        setFeedback({
          type: 'success',
          text: 'Image uploaded to Cloudinary successfully! (0% DB storage used)',
        });
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      const errMsg =
        err.response?.data?.message ||
        'Failed to upload image. Please verify Cloudinary credentials in server/.env.';
      setUploadError(errMsg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts();
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
    checkUploadStatus()
      .then((res) => {
        setCloudinaryConfigured(Boolean(res.data.configured));
      })
      .catch(() => {
        setCloudinaryConfigured(false);
      });
  }, []);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const catConfig = CATEGORY_OPTIONS.find((c) => c.id === newCat);
    if (catConfig && catConfig.subCategories.length > 0) {
      setSubCategory(catConfig.subCategories[0]);
    }

    // Set smart variant presets
    if (newCat === 'Bangles') {
      setVariants([
        { sku: 'BAN-2.4', size: '2.4', color: 'Ruby Red', price: 350, discountPrice: 299, stock: 25 },
        { sku: 'BAN-2.6', size: '2.6', color: 'Ruby Red', price: 350, discountPrice: 299, stock: 30 },
        { sku: 'BAN-2.8', size: '2.8', color: 'Ruby Red', price: 350, discountPrice: 299, stock: 20 },
      ]);
    } else if (newCat === 'Mens') {
      setVariants([
        { sku: 'MEN-M', size: 'M', color: 'White', price: 1499, discountPrice: 1199, stock: 15 },
        { sku: 'MEN-L', size: 'L', color: 'White', price: 1499, discountPrice: 1199, stock: 20 },
        { sku: 'MEN-XL', size: 'XL', color: 'White', price: 1599, discountPrice: 1299, stock: 12 },
      ]);
    } else if (newCat === 'Innerwear') {
      setVariants([
        { sku: 'INN-32B', size: '32B', color: 'Beige', price: 499, discountPrice: 399, stock: 20 },
        { sku: 'INN-34B', size: '34B', color: 'Beige', price: 499, discountPrice: 399, stock: 25 },
        { sku: 'INN-36C', size: '36C', color: 'Beige', price: 549, discountPrice: 449, stock: 15 },
      ]);
    } else {
      setVariants([
        { sku: `${newCat.slice(0, 3).toUpperCase()}-01`, size: 'Standard', color: 'Gold', price: 1999, discountPrice: 1599, stock: 15 },
      ]);
    }
  };

  const addVariantRow = () => {
    const nextNum = variants.length + 1;
    setVariants([
      ...variants,
      {
        sku: `${category.slice(0, 3).toUpperCase()}-${String(nextNum).padStart(2, '0')}`,
        size: 'Standard',
        color: 'Default',
        price: 999,
        discountPrice: 799,
        stock: 10,
      },
    ]);
  };

  const removeVariantRow = (index) => {
    if (variants.length <= 1) {
      alert('A product must have at least one variant.');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const resetForm = () => {
    setName('');
    setCategory('Womens');
    setSubCategory('Sarees');
    setDescription('');
    setImageUrl(PRESET_SAMPLE_IMAGES[0]);
    setVariants([
      {
        sku: 'SKU-001',
        size: 'Free Size',
        color: 'Red',
        price: 999,
        discountPrice: 799,
        stock: 20,
      },
    ]);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setName(product.name || '');
    setCategory(product.category || 'Womens');
    setSubCategory(product.subCategory || 'Sarees');
    setDescription(product.description || '');
    setImageUrl(product.images?.[0] || PRESET_SAMPLE_IMAGES[0]);
    setVariants(
      (product.variants || []).map((variant) => {
        const attributes =
          variant.attributes instanceof Map
            ? Object.fromEntries(variant.attributes)
            : variant.attributes || {};
        return {
          sku: variant.sku || '',
          size: attributes.size || '',
          color: attributes.color || '',
          price: variant.price ?? 0,
          discountPrice: variant.discountPrice ?? variant.price ?? 0,
          stock: variant.stock ?? 0,
        };
      })
    );
    setShowAddModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Product name is required');
      return;
    }

    try {
      setSubmitting(true);

      // Format variants payload
      const formattedVariants = variants.map((v) => ({
        sku: v.sku.trim().toUpperCase(),
        attributes: {
          size: v.size.trim(),
          color: v.color.trim(),
        },
        price: Number(v.price),
        discountPrice: v.discountPrice ? Number(v.discountPrice) : Number(v.price),
        stock: Number(v.stock),
        isActive: true,
      }));

      const payload = {
        name: name.trim(),
        category,
        subCategory,
        description: description.trim() || `${category} - ${subCategory} premium handloom collection.`,
        images: [imageUrl.trim()],
        hasVariants: true,
        variants: formattedVariants,
        isActive: true,
      };

      const res = editingProduct
        ? await updateProduct(editingProduct._id, payload)
        : await createProduct(payload);
      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: `Product "${name}" ${editingProduct ? 'updated' : 'added to catalog'} successfully!`,
        });
        setShowAddModal(false);
        setEditingProduct(null);
        resetForm();
        loadCatalog();
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, prodName) => {
    if (!window.confirm(`Are you sure you want to deactivate "${prodName}"?`)) return;

    try {
      const res = await deleteProduct(id);
      if (res.data.success) {
        setFeedback({ type: 'success', text: `Product deactivated successfully` });
        loadCatalog();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate product');
    }
  };

  const handleQuickStockUpdate = async (prodId, sku, currentStock) => {
    const newStockStr = window.prompt(`Update inventory stock for SKU: ${sku}`, currentStock);
    if (newStockStr === null) return;
    const newStock = Number(newStockStr);
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid non-negative number');
      return;
    }

    try {
      await updateStock(prodId, sku, { newStock });
      loadCatalog();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock');
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 text-red-800 rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Catalog & Inventory Management ({products.length} Products)
            </h2>
            <p className="text-xs text-slate-500">
              Add new textiles, manage sizes/attributes, and control stock levels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-800"
            />
          </div>

          <button
            onClick={loadCatalog}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Catalog Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading catalog...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No products found. Click "Add New Product" to populate your catalog.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Desktop & Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Variants & Stock</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prod) => {
                  const totalStock = prod.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
                  const minPrice = Math.min(...prod.variants.map((v) => v.discountPrice || v.price));

                  return (
                    <tr key={prod._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              (prod.images && prod.images[0]) ||
                              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={prod.name}
                            className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">
                              {prod.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                          {prod.category} • {prod.subCategory}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">
                              {prod.variants.length} Variants
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                totalStock > 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              Total Stock: {totalStock}
                            </span>
                          </div>

                          {/* Variant chips */}
                          <div className="flex flex-wrap gap-1">
                            {prod.variants.slice(0, 3).map((v) => {
                              const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
                              const label = attrs.size || v.sku;
                              return (
                                <button
                                  key={v.sku}
                                  onClick={() => handleQuickStockUpdate(prod._id, v.sku, v.stock)}
                                  className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono"
                                  title="Click to quickly adjust stock"
                                >
                                  <span>{label}:</span>
                                  <strong className="text-red-900">{v.stock}</strong>
                                  <Edit2 className="w-2.5 h-2.5 text-slate-400" />
                                </button>
                              );
                            })}
                            {prod.variants.length > 3 && (
                              <span className="text-[10px] text-slate-400">+{prod.variants.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-red-900">
                          {formatINR(minPrice)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className="p-1.5 mr-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id, prod.name)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Deactivate Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Smartphone Mobile Cards View (Optimized for Store Owner on Phone) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {filtered.map((prod) => {
              const totalStock = prod.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
              const minPrice = Math.min(...prod.variants.map((v) => v.discountPrice || v.price));

              return (
                <div key={prod._id} className="p-3.5 space-y-3">
                  <div className="flex gap-3 items-start">
                    <img
                      src={
                        (prod.images && prod.images[0]) ||
                        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={prod.name}
                      className="w-16 h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
                        {prod.category} • {prod.subCategory}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-extrabold text-red-900">{formatINR(minPrice)}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            totalStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Stock: {totalStock}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                        {prod.variants.length} variant(s) available
                      </span>
                    </div>
                  </div>

                  {/* Mobile Quick Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleEditProduct(prod)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit Stock / Price</span>
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id, prod.name)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition"
                      title="Deactivate Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl border border-slate-200 my-2 sm:my-8 max-h-[94vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 text-red-800 rounded-xl">
                    {editingProduct ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define product specifications, images, and diverse size variants
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Product Title / Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Traditional Mysore Silk Saree"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Department / Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800 font-medium"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sub-Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800 font-medium"
                  >
                    {CATEGORY_OPTIONS.find((c) => c.id === category)?.subCategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details on fabric, weave, care, or cultural occasions..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800"
                  />
                </div>

                {/* Cloudinary Image Uploader & Media Section */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Product Image</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        (Stored in Cloudinary CDN • 0% MongoDB Storage)
                      </span>
                    </label>

                    {/* Mode Toggle */}
                    <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                          imageMode === 'upload'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Cloud className="w-3 h-3 text-red-700" />
                        <span>Cloudinary Upload</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                          imageMode === 'url'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3 text-slate-500" />
                        <span>URL / Presets</span>
                      </button>
                    </div>
                  </div>

                  {imageMode === 'upload' ? (
                    <div className="space-y-2.5">
                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />

                      {/* Hidden Smartphone Camera Input */}
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />

                      {/* Dropzone or Preview */}
                      {uploadingImage ? (
                        <div className="border-2 border-dashed border-red-300 bg-red-50/40 rounded-2xl p-6 text-center space-y-2 animate-pulse">
                          <Loader2 className="w-8 h-8 text-red-700 animate-spin mx-auto" />
                          <div className="text-xs font-bold text-slate-800">
                            Uploading image to Cloudinary...
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Streaming to Cloudinary CDN with automatic WebP compression...
                          </p>
                        </div>
                      ) : imageUrl ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-4">
                          <img
                            src={imageUrl}
                            alt="Uploaded Preview"
                            className="w-20 h-24 object-cover rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs"
                          />
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              {imageUrl.includes('cloudinary.com') ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                                  <Cloud className="w-3 h-3" />
                                  <span>Hosted on Cloudinary CDN</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px]">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>Active Image Source</span>
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">
                                0% MongoDB storage consumed
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-500 font-mono truncate" title={imageUrl}>
                              {imageUrl}
                            </p>

                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                              <button
                                type="button"
                                onClick={() => cameraInputRef.current?.click()}
                                className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg font-semibold text-[11px] transition flex items-center gap-1 shadow-2xs"
                              >
                                <Camera className="w-3 h-3 text-amber-300" />
                                <span>Retake Photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px] transition flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3 text-red-700" />
                                <span>Browse Files</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                className="px-2 py-1 text-red-700 hover:text-red-900 text-[11px] font-semibold"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {/* Smartphone Quick Actions */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => cameraInputRef.current?.click()}
                              className="py-3 px-3 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
                            >
                              <Camera className="w-4 h-4 text-amber-300" />
                              <span>Take Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
                            >
                              <Upload className="w-4 h-4 text-slate-600" />
                              <span>Gallery / Files</span>
                            </button>
                          </div>

                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragOver(true);
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
                              isDragOver
                                ? 'border-red-600 bg-red-50/60 ring-2 ring-red-600/20'
                                : 'border-slate-300 hover:border-red-700 bg-slate-50 hover:bg-slate-100/60'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center">
                              <Upload className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block text-xs">
                                Click or Drag & Drop Product Image
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                Direct stream to Cloudinary CDN (0% MongoDB storage used)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Upload Error Alert */}
                      {uploadError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>{uploadError}</span>
                          </div>
                          {uploadError.includes('CLOUDINARY') || !cloudinaryConfigured ? (
                            <div className="text-[10px] text-slate-600 pt-1 border-t border-rose-200/60 space-y-1">
                              <p>
                                💡 <strong>To enable live Cloudinary uploads:</strong> Add your free credentials to <code className="bg-white px-1 py-0.5 rounded border">server/.env</code>:
                              </p>
                              <pre className="bg-slate-900 text-amber-200 p-2 rounded-lg text-[9px] font-mono overflow-x-auto">
{`CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`}
                              </pre>
                              <p>
                                (Sign up at <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="underline font-bold text-red-800">cloudinary.com</a> for 25,000 free monthly transformations).
                              </p>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Cloudinary Architecture Assurance Note */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-emerald-50/70 border border-emerald-200/60 p-2 rounded-xl">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Zero Database Storage:</strong> Image binary files are served via Cloudinary CDN. MongoDB Atlas only stores the clean URL, keeping your database footprint virtually 0 MB.
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Manual URL / Preset Selector */
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or Cloudinary URL"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800 text-[11px] font-mono"
                      />
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">Sample Presets:</span>
                        {PRESET_SAMPLE_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImageUrl(img)}
                            className={`w-8 h-8 rounded-lg overflow-hidden border-2 shrink-0 ${
                              imageUrl === img ? 'border-red-800' : 'border-transparent opacity-60'
                            }`}
                          >
                            <img src={img} alt="sample" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Variants Builder */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800">
                      Product Variants ({category} Specific)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {category === 'Bangles'
                        ? 'Set diameter sizes (2.4, 2.6, 2.8), color, and stock count.'
                        : category === 'Innerwear'
                        ? 'Set cup/chest sizes (e.g. 32B, 34B, 36C) and stock.'
                        : 'Define size (S, M, L, XL), color, price, and stock.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Variant</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 items-center text-[11px]"
                    >
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 block">SKU</label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                          className="w-full p-1 bg-white border border-slate-200 rounded font-mono uppercase text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 block">Size/Attr</label>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 block">Color/Type</label>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 block">Price (₹)</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs font-bold"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 block">Discount (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={v.discountPrice}
                          onChange={(e) => handleVariantChange(idx, 'discountPrice', e.target.value)}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs font-bold"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="text-[9px] font-bold text-slate-400 block">Stock</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs font-bold text-emerald-800"
                        />
                      </div>

                      <div className="col-span-1 text-center pt-3">
                        <button
                          type="button"
                          onClick={() => removeVariantRow(idx)}
                          className="text-slate-400 hover:text-red-700"
                          title="Remove variant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-red-800 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
