import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const ProductCard = ({ product, onSelectProduct }) => {
  if (!product) return null;

  // Compute lowest effective price and regular price from active variants
  const activeVariants = (product.variants || []).filter((v) => v.isActive !== false);
  const minPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => v.discountPrice || v.price))
    : 0;

  const originalPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => v.price))
    : 0;

  const hasDiscount = minPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - minPrice) / originalPrice) * 100)
    : 0;

  // Extract distinct sizes for quick preview
  const sizes = Array.from(
    new Set(
      activeVariants
        .map((v) => {
          const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
          return attrs.size;
        })
        .filter(Boolean)
    )
  );

  const mainImage =
    (product.images && product.images[0]) ||
    (activeVariants[0]?.images && activeVariants[0]?.images[0]) ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1 relative"
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 w-full bg-slate-100 overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5 bg-red-700 text-white font-bold text-[11px] px-2 py-0.5 rounded-full shadow-md">
            {discountPercent}% OFF
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
          {product.category} • {product.subCategory}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 backdrop-blur-xs text-slate-800 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-red-700" />
            View Options
          </span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-red-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Size Chips Preview */}
          {sizes.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-medium">Sizes:</span>
              {sizes.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {s}
                </span>
              ))}
              {sizes.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  +{sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block -mb-0.5">Starting at</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-red-900">
                {formatINR(minPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs line-through text-slate-400">
                  {formatINR(originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="p-2 rounded-xl bg-red-50 text-red-800 hover:bg-red-800 hover:text-white transition group/btn shadow-xs"
            aria-label="Add to cart or view variants"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
