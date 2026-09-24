import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { PackageOpen } from 'lucide-react';

const ProductGrid = ({ products, loading, onSelectProduct, onResetFilters }) => {
  if (loading) {
    return <LoadingSpinner text="Fetching handloom & textile catalog..." />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-8 max-w-md mx-auto shadow-xs">
        <div className="w-14 h-14 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No textiles match your filter</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Try clearing size or price filters to explore our full inventory.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
