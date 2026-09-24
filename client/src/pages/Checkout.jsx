import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import OrderForm from '../components/checkout/OrderForm';
import UpiCheckout from '../components/checkout/UpiCheckout';
import WhatsAppFallback from '../components/checkout/WhatsAppFallback';
import { createOrder as apiCreateOrder } from '../services/api';
import { formatINR } from '../utils/formatters';
import { isValidPhone, isValidPinCode, isValidUtr } from '../utils/validators';
import { ShieldCheck, ShoppingBag, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const Checkout = ({ onOrderSuccess, onBackToShop }) => {
  const { items, subtotal, deliveryFee, totalAmount, clearCart } = useCart();

  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    whatsappNumber: '',
    address: '',
    landmark: '',
    pinCode: '',
  });

  const [utrNumber, setUtrNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Your bag is empty</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Add textiles from our catalog before checking out.
        </p>
        <button
          onClick={onBackToShop}
          className="px-5 py-2.5 bg-red-800 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customer.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!isValidPhone(customer.phone)) newErrors.phone = 'Valid 10-digit mobile number required';
    if (!customer.address.trim()) newErrors.address = 'Delivery address is required';
    if (!isValidPinCode(customer.pinCode)) newErrors.pinCode = 'Valid 6-digit PIN code required';
    if (!isValidUtr(utrNumber)) newErrors.utr = 'Please enter valid 12-digit transaction UTR number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customer: {
          fullName: customer.fullName.trim(),
          phone: customer.phone.trim(),
          whatsappNumber: customer.whatsappNumber.trim() || customer.phone.trim(),
          address: customer.address.trim(),
          landmark: customer.landmark.trim(),
          pinCode: customer.pinCode.trim(),
        },
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.productName,
          variantAttributes: it.variantAttributes,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
        })),
        billing: {
          subtotal,
          deliveryFee,
          totalAmount,
        },
        payment: {
          method: 'UPI_DIRECT',
          upiUtrNumber: utrNumber.trim(),
        },
      };

      const res = await apiCreateOrder(payload);
      if (res.data.success) {
        const createdOrder = res.data.data;

        // Auto-save to device memory so customer can track without login
        try {
          const existing = JSON.parse(localStorage.getItem('mtc_saved_recent_orders') || '[]');
          const updated = [
            {
              orderNumber: createdOrder.orderNumber,
              createdAt: createdOrder.createdAt,
              totalAmount: createdOrder.billing?.totalAmount,
              customerPhone: createdOrder.customer?.phone,
              customerName: createdOrder.customer?.fullName,
            },
            ...existing.filter((o) => o.orderNumber !== createdOrder.orderNumber),
          ].slice(0, 10);
          localStorage.setItem('mtc_saved_recent_orders', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save order to device storage:', e);
        }

        clearCart();
        onOrderSuccess(createdOrder);
      }
    } catch (err) {
      console.error('Submit order error:', err);
      setSubmitError(err.response?.data?.message || 'Failed to place order. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToShop}
            className="text-xs text-red-800 hover:text-red-950 font-semibold flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Zero-Fee UPI Checkout
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>₹0 Payment Surcharge Guaranteed</span>
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main Grid: Form & Payments (7 cols) + Order Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form & UPI (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <OrderForm
            customer={customer}
            onChange={handleCustomerChange}
            errors={errors}
          />

          <UpiCheckout
            totalAmount={totalAmount}
            utrNumber={utrNumber}
            onUtrChange={(val) => {
              setUtrNumber(val);
              if (errors.utr) setErrors((prev) => ({ ...prev, utr: '' }));
            }}
            error={errors.utr}
          />

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-red-800 via-red-800 to-red-900 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 transform active:scale-98"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{submitting ? 'Verifying & Submitting...' : `Confirm Order with 12-Digit UTR (${formatINR(totalAmount)})`}</span>
          </button>

          {/* WhatsApp Fallback Component */}
          <WhatsAppFallback
            customer={customer}
            items={items}
            totalAmount={totalAmount}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
          />
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 sticky top-28">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide pb-3 border-b border-slate-100">
            Order Invoice Summary ({items.length} Items)
          </h3>

          {/* Itemized List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.sku} className="flex gap-3 text-xs">
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={item.productName}
                  className="w-14 h-16 object-cover rounded-lg bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{item.productName}</h4>
                  <div className="text-[11px] text-slate-500 font-mono">SKU: {item.sku}</div>
                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-1 mt-0.5">
                    {item.variantAttributes &&
                      Object.entries(item.variantAttributes).map(([k, v]) => (
                        <span key={k} className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">
                          {k}: {v}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-500 block">x{item.quantity}</span>
                  <span className="font-bold text-red-900">{formatINR(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Catalog Subtotal</span>
              <span className="font-semibold text-slate-800">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span className="font-semibold text-slate-800">
                {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Gateway Commission</span>
              <span className="text-emerald-700 font-bold">₹0.00 (0% MDR)</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-3 border-t border-slate-100">
              <span>Net Amount Payable</span>
              <span className="text-red-900 text-base">{formatINR(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
