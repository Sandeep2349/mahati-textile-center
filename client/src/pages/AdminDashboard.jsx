import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderQueue from '../components/admin/OrderQueue';
import WalkInPOS from '../components/admin/WalkInPOS';
import ProductManager from '../components/admin/ProductManager';
import {
  Store,
  LogOut,
  ClipboardList,
  ShoppingCart,
  ExternalLink,
  ShieldCheck,
  Package,
} from 'lucide-react';

const AdminDashboard = ({ onBackToStore }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'pos' | 'products'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-800 flex items-center justify-center text-amber-300 font-bold shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-wide">
                  Mahati Textile Center
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-amber-300 border border-amber-500/30 uppercase">
                  Admin Console
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as: <span className="text-slate-200 font-semibold">{user?.name || user?.username || 'Store Manager'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Storefront</span>
            </button>

            <button
              onClick={logout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar (Desktop & Tablet) */}
        <div className="hidden sm:block bg-slate-950/80 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-red-400" />
              <span>Live Order Verification Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('pos')}
              className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'pos'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span>Walk-In Counter POS (Instant Stock Sync)</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Catalog & Add Products</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full space-y-4 sm:space-y-6 pb-24 sm:pb-8">
        {/* Architecture Status Strip */}
        <div className="bg-gradient-to-r from-red-900/10 via-amber-900/10 to-emerald-900/10 border border-slate-200 rounded-2xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Mobile Store Management:</span>
            <span className="hidden sm:inline">100% Zero Ongoing Cost ($0 / ₹0) • Native NPCI UPI Direct</span>
            <span className="sm:hidden text-[11px]">Zero Cost Store Active</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-500">
            <span>Payment Fees: <strong className="text-emerald-700">₹0</strong></span>
            <span>•</span>
            <span>MongoDB: <strong className="text-emerald-700">Online</strong></span>
          </div>
        </div>

        {/* Tab View */}
        {activeTab === 'orders' && <OrderQueue />}
        {activeTab === 'pos' && <WalkInPOS />}
        {activeTab === 'products' && <ProductManager />}
      </main>

      {/* Mobile Bottom Navigation Bar (Phone-First for Store Owner) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 py-2 shadow-2xl">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'orders'
              ? 'text-red-400 font-bold bg-slate-800/80'
              : 'text-slate-400 font-medium'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px]">Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('pos')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'pos'
              ? 'text-amber-400 font-bold bg-slate-800/80'
              : 'text-slate-400 font-medium'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px]">Counter POS</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'products'
              ? 'text-emerald-400 font-bold bg-slate-800/80'
              : 'text-slate-400 font-medium'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px]">Products</span>
        </button>

        <button
          onClick={onBackToStore}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition font-medium"
        >
          <ExternalLink className="w-5 h-5" />
          <span className="text-[10px]">Storefront</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminDashboard;
