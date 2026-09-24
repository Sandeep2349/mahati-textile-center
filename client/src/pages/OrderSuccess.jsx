import React from 'react';
import { CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { formatINR, formatDate } from '../utils/formatters';

const OrderSuccess = ({ order, onContinueShopping }) => {
  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h2 className="text-base font-bold text-slate-800">No active order found</h2>
        <button
          onClick={onContinueShopping}
          className="mt-4 px-4 py-2 bg-red-800 text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const storePhone = import.meta.env.VITE_STORE_PHONE || '919912565482';
  const cleanPhone = storePhone.replace(/\D/g, '');

  const whatsAppSlipText = 
`*Order Slip - Mahati Textile Center*
=============================
*Order No:* ${order.orderNumber}
*Status:* ${order.payment?.status || 'PENDING_VERIFICATION'}
*UTR Ref:* ${order.payment?.upiUtrNumber || 'Direct Payment'}
*Total Amount:* ${formatINR(order.billing?.totalAmount)}

*Customer:* ${order.customer?.fullName} (${order.customer?.phone})
*Address:* ${order.customer?.address}, ${order.customer?.pinCode}
=============================
I have placed this order on the website and provided the UTR. Please confirm!`;

  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsAppSlipText)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Badge */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Thank You for Shopping Local!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Order Reference:{' '}
            <span className="font-mono font-bold text-slate-800 text-sm">
              {order.orderNumber}
            </span>
          </p>
        </div>

        {/* Status Callout */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 max-w-md mx-auto text-left flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block">Status: PENDING VERIFICATION</span>
            Your 12-digit UTR (<span className="font-mono font-bold">{order.payment?.upiUtrNumber}</span>) has been recorded. Store counter staff is matching the payment and will pack your items shortly.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order Slip to WhatsApp</span>
          </a>

          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Itemized Receipt Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
          Order Summary & Delivery Location
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-700 block mb-1">Customer Delivery To:</span>
            <p className="text-slate-800 font-bold">{order.customer?.fullName}</p>
            <p className="text-slate-600">📞 {order.customer?.phone}</p>
            <p className="text-slate-600 mt-1">📍 {order.customer?.address}</p>
            <p className="text-slate-600">PIN: {order.customer?.pinCode}</p>
          </div>

          <div>
            <span className="font-semibold text-slate-700 block mb-1">Payment Details:</span>
            <p className="text-slate-800 font-bold">NPCI UPI Direct (0% MDR)</p>
            <p className="text-slate-600 font-mono">UTR: {order.payment?.upiUtrNumber}</p>
            <p className="text-slate-600">Date: {formatDate(order.createdAt)}</p>
            <p className="text-red-900 font-extrabold text-sm mt-1">
              Total Amount: {formatINR(order.billing?.totalAmount)}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-xl">
              <div>
                <span className="font-bold text-slate-800">{item.productName}</span>
                <span className="text-slate-500 ml-2">x{item.quantity}</span>
              </div>
              <span className="font-bold text-red-900">{formatINR(item.subtotal)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
