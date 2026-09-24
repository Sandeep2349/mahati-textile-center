import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { formatINR } from '../../utils/formatters';

const ProductFilters = () => {
  const {
    category,
    setCategory,
    selectedSize,
    setSelectedSize,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    resetFilters,
  } = useFilters();

  const categories = [
    { id: 'All', label: 'All Catalog' },
    { id: 'Womens', label: "Women's Wear (Sarees/Kurtis)" },
    { id: 'Mens', label: "Men's Apparel (Shirts/Dhotis)" },
    { id: 'Innerwear', label: 'Innerwear (Bras/Vests)' },
    { id: 'Bangles', label: 'Bangles (Glass/Metal)' },
    { id: 'DailyWear', label: 'Daily Wear (Towels/Beds)' },
  ];

  // Specific sizes relevant to categories
  const bangleSizes = ['2.4', '2.6', '2.8'];
  const apparelSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const innerwearSizes = ['32B', '34B', '36C'];
  const homeSizes = ['Single', 'Double', 'Free Size'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-red-800" />
          <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
            Filter Catalog
          </h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-slate-400 hover:text-red-700 p-1 rounded-md transition flex items-center gap-1 text-[11px] font-medium"
          title="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort Option */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-red-800"
        >
          <option value="newest">Featured & Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category Facets */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Department
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setSelectedSize('');
              }}
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
                category === cat.id
                  ? 'bg-red-800 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Attribute Filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700">
            Attribute / Size
          </label>
          {selectedSize && (
            <button
              onClick={() => setSelectedSize('')}
              className="text-[10px] text-red-700 hover:underline"
            >
              Clear Size
            </button>
          )}
        </div>

        {/* Bangle Diameters */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Bangle Diameters
          </span>
          <div className="flex flex-wrap gap-1.5">
            {bangleSizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                  selectedSize === sz
                    ? 'bg-red-800 text-white border-red-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Apparel Sizes */}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pt-1">
            Apparel Sizes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {apparelSizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                  selectedSize === sz
                    ? 'bg-red-800 text-white border-red-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Innerwear & Home Sizes */}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pt-1">
            Innerwear & Bedsheets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[...innerwearSizes, ...homeSizes].map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition ${
                  selectedSize === sz
                    ? 'bg-red-800 text-white border-red-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Max Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          <span>Max Price</span>
          <span className="text-red-900 font-bold">{formatINR(priceRange.max)}</span>
        </div>
        <input
          type="range"
          min="300"
          max="10000"
          step="100"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
          className="w-full accent-red-800 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹300</span>
          <span>₹10,000+</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
