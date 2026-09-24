import React, { useState, useEffect } from 'react';
import { lookupCustomerOrders } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Search,
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

const STATUS_CONFIG = {
  RECEIVED: {
    label: 'Order Placed (Awaiting Verification)',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: Clock,
    step: 1,
  },
  CONFIRMED: {
    label: 'Payment Verified & Confirmed',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: CheckCircle,
    step: 2,
  },
  PACKED: {
    label: 'Packed & Ready for Dispatch',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: Package,
    step: 3,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery / Ready for Pickup',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    icon: Truck,
    step: 4,
  },
  DELIVERED: {
    label: 'Delivered / Completed',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: CheckCircle,
    step: 5,
  },
  CANCELLED: {
    label: 'Order Cancelled',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    icon: AlertCircle,
    step: 0,
  },
};

const TrackOrderModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [recentSavedOrders, setRecentSavedOrders] = useState([]);

  // Load recent orders stored in device's localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mtc_saved_recent_orders');
      if (saved) {
        setRecentSavedOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading recent orders from storage:', e);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery !== undefined ? searchQuery : query).trim();
    if (!q) {
      setError('Please enter a 10-digit mobile number or order number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSearched(true);
      const res = await lookupCustomerOrders(q);
      if (res.data.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      console.error('Track order error:', err);
      setError(err.response?.data?.message || 'Could not fetch order details');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const storePhone = import.meta.env.VITE_STORE_PHONE || '919912565482';
  const cleanStorePhone = storePhone.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-900 rounded-2xl shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Track Order / My Purchases
              </h2>
              <p className="text-xs text-slate-500">
                Lookup with your <strong>10-digit mobile number</strong> or order reference (No password required)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-2"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter 10-digit Phone Number or Order ID (e.g. MTC-0001)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/10 transition"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Finding...' : 'Track'}</span>
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {/* Device Recent Order Shortcuts */}
          {recentSavedOrders.length > 0 && !searched && (
            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Recent on this device:</span>
              {recentSavedOrders.slice(0, 3).map((item) => (
                <button
                  key={item.orderNumber}
                  type="button"
                  onClick={() => {
                    setQuery(item.orderNumber);
                    handleSearch(item.orderNumber);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-800 border border-slate-200 rounded-lg text-[11px] font-mono font-semibold transition"
                >
                  {item.orderNumber} ({formatINR(item.totalAmount)})
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Results Container */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <div className="w-8 h-8 border-2 border-red-200 border-t-red-800 rounded-full animate-spin mx-auto" />
              <p>Searching order database...</p>
            </div>
          ) : searched && orders.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-12 h-12 bg-slate-200/60 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">No Orders Found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  We could not find any orders matching <strong>"{query}"</strong>. Please ensure the phone number matches the one given during checkout.
                </p>
              </div>
              <a
                href={`https://wa.me/${cleanStorePhone}?text=${encodeURIComponent(
                  `Hello Mahati Textile Center, I would like to check the status of my order under phone/reference: ${query}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask Store on WhatsApp</span>
              </a>
            </div>
          ) : (
            orders.map((ord) => {
              const statusInfo = STATUS_CONFIG[ord.orderStatus] || STATUS_CONFIG.RECEIVED;
              const StatusIcon = statusInfo.icon;
              const isVerified = ord.payment?.status === 'VERIFIED';

              const whatsAppOrderHelpUrl = `https://wa.me/${cleanStorePhone}?text=${encodeURIComponent(
                `Hello Mahati Textile Center, I am checking on my order *${ord.orderNumber}* placed under ${ord.customer?.fullName} (${ord.customer?.phone}). Could you provide a delivery update?`
              )}`;

              return (
                <div
                  key={ord._id}
                  className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-slate-300 transition"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-red-950">
                          {ord.orderNumber}
                        </span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs text-slate-500">
                          {formatDate(ord.createdAt)}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-0.5">
                        Delivering to: <strong className="text-slate-800">{ord.customer?.fullName}</strong> ({ord.customer?.phone})
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Payment & UTR Strip */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200/80 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-slate-500 block text-[10px]">Payment Verification</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {isVerified ? 'VERIFIED (Paid)' : 'PENDING COUNTER VERIFICATION'}
                        </span>
                      </div>
                    </div>

                    {ord.payment?.upiUtrNumber && (
                      <div className="font-mono text-[11px] text-slate-600">
                        UTR: <strong className="text-slate-800">{ord.payment.upiUtrNumber}</strong>
                      </div>
                    )}
                  </div>

                  {/* Items Ordered List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Purchased Items ({ord.items?.length || 0})
                    </span>
                    <div className="space-y-1.5">
                      {ord.items?.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200/60 text-xs"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <span className="font-bold text-slate-800 block truncate">
                              {it.productName}
                            </span>
                            <div className="text-[11px] text-slate-500 flex flex-wrap gap-1 mt-0.5">
                              {it.variantAttributes &&
                                Object.entries(it.variantAttributes).map(([k, v]) => (
                                  <span key={k} className="bg-slate-100 px-1 py-0.2 rounded text-[10px]">
                                    {k}: {v}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-slate-500 block text-[11px]">Qty: {it.quantity}</span>
                            <span className="font-bold text-red-900">{formatINR(it.subtotal)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                    <div>
                      <span className="text-xs text-slate-500 block -mb-0.5">Total Paid</span>
                      <span className="text-base font-extrabold text-red-950">
                        {formatINR(ord.billing?.totalAmount)}
                      </span>
                    </div>

                    <a
                      href={whatsAppOrderHelpUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Support for this Order</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Zero Cost Assurance Note */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>🔒 Instant lookup enabled • No passwords stored</span>
          <span className="text-emerald-700 font-semibold">100% Free Store Service</span>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
