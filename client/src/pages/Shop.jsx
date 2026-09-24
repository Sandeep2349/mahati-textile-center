import React, { useState } from 'react';
import ProductFilters from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';
import { useFilters } from '../context/FilterContext';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

const Shop = ({ products, loading, onSelectProduct }) => {
  const {
    category,
    selectedSize,
    searchQuery,
    priceRange,
    resetFilters,
    setCategory,
    setSelectedSize,
    setSearchQuery,
  } = useFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter products locally or display server queried list
  const filteredProducts = products.filter((p) => {
    // Category check
    if (category !== 'All' && p.category !== category) return false;

    // Size check
    if (selectedSize) {
      const hasSize = p.variants.some((v) => {
        const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
        return String(attrs.size || '').toLowerCase() === selectedSize.toLowerCase();
      });
      if (!hasSize) return false;
    }

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subCategory.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchSub && !matchDesc) return false;
    }

    // Price range check
    const lowestPrice = Math.min(...p.variants.map((v) => v.discountPrice || v.price));
    if (lowestPrice > priceRange.max) return false;

    return true;
  });

  const hasActiveFilters =
    category !== 'All' || !!selectedSize || !!searchQuery || priceRange.max < 10000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Mobile Filter Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Textile Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredProducts.length} items in store inventory
          </p>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex-1 py-2 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-red-800" />
            <span>Filter Catalog {hasActiveFilters ? '(Active)' : ''}</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Applied:</span>

          {category !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-900 font-semibold">
              Category: {category}
              <button onClick={() => setCategory('All')}>
                <X className="w-3 h-3 hover:text-red-700" />
              </button>
            </span>
          )}

          {selectedSize && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-900 font-semibold">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize('')}>
                <X className="w-3 h-3 hover:text-red-700" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-semibold">
              Keyword: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3 hover:text-red-700" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-red-800 hover:underline font-bold ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28">
          <ProductFilters />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden col-span-12">
            <ProductFilters />
          </div>
        )}

        {/* Products Grid (9 cols) */}
        <main className="col-span-12 lg:col-span-9">
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onSelectProduct={onSelectProduct}
            onResetFilters={resetFilters}
          />
        </main>
      </div>
    </div>
  );
};

export default Shop;
