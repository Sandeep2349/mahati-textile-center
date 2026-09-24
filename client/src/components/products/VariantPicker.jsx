import React, { useMemo } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const VariantPicker = ({ product, selectedVariant, onSelectVariant }) => {
  if (!product || !product.variants || product.variants.length === 0) {
    return null;
  }

  // Extract all attribute keys across variants (e.g. ['size', 'color', 'pack', 'fabric', 'border'])
  const attributeKeys = useMemo(() => {
    const keys = new Set();
    product.variants.forEach((v) => {
      const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
      Object.keys(attrs).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [product]);

  // Current selected attributes as plain object
  const currentAttrs = useMemo(() => {
    if (!selectedVariant) return {};
    return selectedVariant.attributes instanceof Map
      ? Object.fromEntries(selectedVariant.attributes)
      : selectedVariant.attributes || {};
  }, [selectedVariant]);

  // Handle clicking an attribute option value
  const handleOptionClick = (attrKey, value) => {
    const nextTargetAttrs = { ...currentAttrs, [attrKey]: value };

    // Find closest or exact matching variant
    let matchedVariant = product.variants.find((v) => {
      const vAttrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
      return Object.entries(nextTargetAttrs).every(([k, val]) => vAttrs[k] === val);
    });

    // If no exact match, find first variant having this key=value
    if (!matchedVariant) {
      matchedVariant = product.variants.find((v) => {
        const vAttrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
        return vAttrs[attrKey] === value;
      });
    }

    if (matchedVariant) {
      onSelectVariant(matchedVariant);
    }
  };

  return (
    <div className="space-y-4 py-2">
      {attributeKeys.map((key) => {
        // Collect all distinct values for this attribute key
        const values = Array.from(
          new Set(
            product.variants
              .map((v) => {
                const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
                return attrs[key];
              })
              .filter(Boolean)
          )
        );

        if (values.length === 0) return null;

        const currentVal = currentAttrs[key];

        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 capitalize">
                Select {key}: <span className="text-red-700 font-bold">{currentVal || 'None'}</span>
              </span>
              {key.toLowerCase() === 'size' && product.category === 'Bangles' && (
                <span className="text-[11px] text-slate-500 italic">Diameter (2.4, 2.6, 2.8)</span>
              )}
              {key.toLowerCase() === 'size' && product.category === 'Innerwear' && (
                <span className="text-[11px] text-slate-500 italic">Band & Cup Size</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {values.map((val) => {
                const isSelected = currentVal === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleOptionClick(key, val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-red-800 text-white border-red-800 shadow-sm ring-2 ring-red-800/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{val}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Selected Variant Summary & Stock Indicator */}
      {selectedVariant && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs mt-3">
          <div>
            <div className="text-slate-500 text-[11px] font-mono">
              SKU: <span className="font-bold text-slate-700">{selectedVariant.sku}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-bold text-red-900">
                {formatINR(selectedVariant.discountPrice || selectedVariant.price)}
              </span>
              {selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.price && (
                <>
                  <span className="line-through text-slate-400 text-xs">
                    {formatINR(selectedVariant.price)}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    {Math.round(((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            {selectedVariant.stock > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                In Stock ({selectedVariant.stock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold">
                <AlertCircle className="w-3 h-3" />
                Out of Stock
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantPicker;
