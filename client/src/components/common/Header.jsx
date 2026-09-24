import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, Store, Lock, Menu, X, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFilters } from '../../context/FilterContext';

const Header = ({ onNavigate, currentPage, onOpenTrackOrder }) => {
  const { totalItemsCount, openDrawer } = useCart();
  const { category, setCategory, searchQuery, setSearchQuery } = useFilters();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'All', name: 'All Catalog' },
    { id: 'Womens', name: "Women's Wear" },
    { id: 'Mens', name: "Men's Apparel" },
    { id: 'Innerwear', name: 'Innerwear' },
    { id: 'Bangles', name: 'Bangles & Accessories' },
    { id: 'DailyWear', name: 'Daily Wear & Fabrics' },
  ];

  const handleCategoryClick = (catId) => {
    setCategory(catId);
    setMobileMenuOpen(false);
    if (currentPage !== 'shop') {
      onNavigate('shop');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (currentPage !== 'shop') {
      onNavigate('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
      {/* Top Banner: Zero Cost & Store Promise */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 text-amber-100 text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>100% Direct NPCI UPI Payments • Zero Payment Gateway Surcharge • Store Pickup Available</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-amber-200">
          <button
            onClick={onOpenTrackOrder}
            className="hover:text-amber-100 underline flex items-center gap-1 font-semibold"
          >
            <Truck className="w-3.5 h-3.5 text-amber-300" />
            <span>Track Order by Phone</span>
          </button>
          <span>•</span>
          <span>📞 Walk-in Store: 10:30 AM - 9:30 PM</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-800 to-red-950 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Store className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="block text-xl font-bold tracking-tight text-gray-900 leading-tight">
              Mahati <span className="text-red-800">Textile Center</span>
            </span>
            <span className="block text-[11px] text-gray-500 font-medium tracking-wide uppercase">
              Retail • Wholesale • Handlooms
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md mx-4 relative items-center"
        >
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sarees, kurtas, bangles, towels..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
          />
        </form>

        {/* Action Buttons: Track Order, Cart & Admin */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              currentPage === 'shop'
                ? 'bg-red-50 text-red-800'
                : 'text-gray-700 hover:text-red-800 hover:bg-gray-50'
            }`}
          >
            Catalog
          </button>

          {/* Track Order Button */}
          <button
            onClick={onOpenTrackOrder}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-800 hover:bg-red-50 transition flex items-center gap-1.5 border border-slate-200 sm:border-transparent"
            title="Track orders by 10-digit mobile number"
          >
            <Truck className="w-4 h-4 text-red-700" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={openDrawer}
            className="relative p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 transition flex items-center gap-2 font-medium text-sm"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Admin Login / Dashboard link */}
          <button
            onClick={() => onNavigate('admin')}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-red-800 hover:bg-gray-50 transition"
            title="Merchant & Walk-In POS Portal"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop & Mobile Swipeable) */}
      <nav className="border-t border-rose-100/70 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-red-800 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </form>

          {/* Mobile Track Order shortcut */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrackOrder();
            }}
            className="w-full py-2.5 px-3 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Truck className="w-4 h-4 text-red-700" />
            <span>Track Order (By Phone Number)</span>
          </button>

          <div className="font-semibold text-xs text-gray-400 uppercase tracking-wider pt-1">
            Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`text-left px-3 py-2 text-xs rounded-lg font-medium transition ${
                  category === cat.id
                    ? 'bg-red-800 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
