import React, { useState, useEffect } from 'react';
import { fetchOrders, verifyOrderPayment, updateOrderStatus } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import { isValidUtr } from '../../utils/validators';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Package,
  Check,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

const OrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('PENDING_VERIFICATION');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);
  const [utrInputs, setUtrInputs] = useState({});
  const [actionMessage, setActionMessage] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (paymentFilter !== 'ALL') params.paymentStatus = paymentFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await fetchOrders(params);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter]);

  const handleVerify = async (orderId) => {
    const utr = utrInputs[orderId];
    if (!utr || !isValidUtr(utr)) {
      alert('Please enter a valid 12-digit numeric UPI UTR number');
      return;
    }

    try {
      setVerifyingId(orderId);
      const res = await verifyOrderPayment(orderId, utr);
      if (res.data.success) {
        setActionMessage({
          type: 'success',
          text: `Payment verified & stock decremented for order!`,
        });
        setTimeout(() => setActionMessage(null), 4000);
        loadOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-700">Payment:</span>
          <button
            onClick={() => setPaymentFilter('PENDING_VERIFICATION')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              paymentFilter === 'PENDING_VERIFICATION'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending Verification
          </button>
          <button
            onClick={() => setPaymentFilter('VERIFIED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              paymentFilter === 'VERIFIED'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Verified Paid
          </button>
          <button
            onClick={() => setPaymentFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              paymentFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Payments
          </button>
        </div>

        {/* Refresh & Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
              placeholder="Search Order No / Phone / UTR..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-800"
            />
          </div>
          <button
            onClick={loadOrders}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No orders found matching the filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPending = order.payment?.status === 'PENDING_VERIFICATION';
            const isVerified = order.payment?.status === 'VERIFIED';
            const currentUtr = utrInputs[order._id] !== undefined ? utrInputs[order._id] : order.payment?.upiUtrNumber || '';

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition hover:border-slate-300"
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-red-900">
                        {order.orderNumber}
                      </span>
                      {order.isWalkIn ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                          Walk-In Counter
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                          Online Web Order
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 mt-1 font-medium flex flex-wrap items-center gap-2">
                      <span>{order.customer?.fullName}</span>
                      <span>•</span>
                      <a
                        href={`tel:${order.customer?.phone}`}
                        className="text-red-700 hover:text-red-900 font-semibold underline flex items-center gap-1"
                        title="Call Customer"
                      >
                        📞 {order.customer?.phone}
                      </a>
                      {order.customer?.phone && (
                        <a
                          href={`https://wa.me/91${order.customer?.phone}?text=${encodeURIComponent(
                            `Namaste ${order.customer?.fullName || ''}, regarding your order ${order.orderNumber} at Mahati Textile Center:`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          💬 WhatsApp
                        </a>
                      )}
                      {order.customer?.address && (
                        <span className="text-slate-500 w-full sm:w-auto">
                          📍 {order.customer.address}, {order.customer.pinCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isVerified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isPending
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.payment?.status}
                    </span>

                    {/* Order Fulfillment Status Dropdown */}
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-red-800"
                    >
                      <option value="RECEIVED">RECEIVED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PACKED">PACKED</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="py-3 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
                      <div>
                        <span className="font-semibold text-slate-800">{item.productName}</span>
                        <div className="text-[11px] text-slate-500">
                          {item.variantAttributes &&
                            Object.entries(item.variantAttributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800">x{item.quantity}</span>
                        <div className="text-red-900 font-bold">{formatINR(item.subtotal)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Strip: Verification & Billing */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* UTR Verification Action */}
                  <div className="flex-1">
                    {isPending ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          maxLength={12}
                          value={currentUtr}
                          onChange={(e) =>
                            setUtrInputs({
                              ...utrInputs,
                              [order._id]: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          placeholder="Verify 12-digit UTR..."
                          className="w-full sm:w-48 px-3 py-2 text-xs font-mono bg-amber-50/50 border border-amber-300 rounded-xl focus:outline-none focus:border-amber-600"
                        />
                        <button
                          onClick={() => handleVerify(order._id)}
                          disabled={verifyingId === order._id || !isValidUtr(currentUtr)}
                          className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Mark Paid</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600 font-mono">
                        UTR Ref: <span className="font-bold text-slate-800">{order.payment?.upiUtrNumber || 'COUNTER'}</span>
                        {order.payment?.verifiedAt && (
                          <span className="text-[10px] text-slate-400 ml-2 block sm:inline">
                            (Verified: {formatDate(order.payment.verifiedAt)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className="text-xs text-slate-400 block -mb-1">Payable Total</span>
                    <span className="text-lg font-extrabold text-red-900">
                      {formatINR(order.billing?.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderQueue;
