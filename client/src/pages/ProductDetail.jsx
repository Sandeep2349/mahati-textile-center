import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import VariantPicker from '../components/products/VariantPicker';
import { formatINR } from '../utils/formatters';
import {
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  Store,
  ChevronLeft,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

const ProductDetail = ({ product, onBack, onNavigateToShop }) => {
  const { addToCart } = useCart();

  // Selected variant state (defaults to first active variant)
  const [selectedVariant, setSelectedVariant] = useState(() => {
    if (!product || !product.variants || product.variants.length === 0) return null;
    return product.variants.find((v) => v.stock > 0) || product.variants[0];
  });

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (product) {
      const initialVar = product.variants?.find((v) => v.stock > 0) || product.variants?.[0];
      setSelectedVariant(initialVar);
      setActiveImage(
        (product.images && product.images[0]) ||
        (initialVar?.images && initialVar?.images[0]) ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      );
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-base font-bold text-slate-800">Product not found</h2>
        <button
          onClick={onNavigateToShop}
          className="mt-4 px-4 py-2 bg-red-800 text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const storePhone = import.meta.env.VITE_STORE_PHONE || '919912565482';
  const cleanPhone = storePhone.replace(/\D/g, '');
  const whatsAppInquiryUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello Mahati Textile Center, I have an inquiry about "${product.name}" (SKU: ${selectedVariant?.sku || ''}). Is this ready for immediate counter pickup or shipping?`
  )}`;

  const images = [
    ...(product.images || []),
    ...(selectedVariant?.images || []),
  ].filter(Boolean);

  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 font-semibold text-red-800 hover:text-red-950 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5">
          <span>Catalog</span>
          <span>/</span>
          <span className="font-semibold text-slate-700">{product.category}</span>
          <span>/</span>
          <span>{product.subCategory}</span>
        </div>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/5 w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.category === 'Bangles' && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-black/75 backdrop-blur-xs text-amber-300 font-bold text-xs rounded-full shadow-md">
                Handcrafted Glass Bangles
              </span>
            )}
          </div>

          {/* Thumbnail List */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    activeImage === img ? 'border-red-800 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Attributes & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider">
              {product.category} • {product.subCategory}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Dynamic Variant Picker */}
          <div className="pt-2 border-t border-slate-100">
            <VariantPicker
              product={product}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-600 hover:text-red-800 disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  disabled={!selectedVariant || quantity >= selectedVariant.stock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-slate-600 hover:text-red-800 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Shopping Bag'}</span>
              </button>

              <a
                href={whatsAppInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>

            {addedToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Item added to your bag! Opening cart...</span>
              </div>
            )}
          </div>

          {/* Store Guarantees */}
          <div className="border-t border-slate-100 pt-5 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <ShieldCheck className="w-4 h-4 text-red-800 shrink-0" />
              <span>0% Surcharge NPCI UPI with 12-digit UTR confirmation</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <Store className="w-4 h-4 text-red-800 shrink-0" />
              <span>Available for physical store pickup & counter sales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
