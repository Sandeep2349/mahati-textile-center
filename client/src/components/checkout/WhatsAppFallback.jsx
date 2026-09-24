import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const WhatsAppFallback = ({ customer, items, totalAmount, subtotal, deliveryFee, orderNumber = 'DIRECT-INQUIRY' }) => {
  const storePhone = import.meta.env.VITE_STORE_PHONE || '919912565482';
  const cleanPhone = storePhone.replace(/\D/g, '');

  const buildWhatsAppUrl = () => {
    const itemsList = (items || [])
      .map((item, idx) => {
        const variantDesc = item.variantAttributes
          ? Object.entries(item.variantAttributes)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ')
          : '';
        return `${idx + 1}. *${item.productName}*${variantDesc ? ` (${variantDesc})` : ''} x ${item.quantity} = ${formatINR(item.subtotal)}`;
      })
      .join('\n');

    const customerName = customer?.fullName || 'Valued Customer';
    const phone = customer?.phone || 'Not provided';
    const address = customer?.address || 'Store Pickup Requested';
    const pin = customer?.pinCode ? ` - ${customer.pinCode}` : '';

    const text = 
`*New Order - Mahati Textile Center*
=============================
*Order Ref:* ${orderNumber}
*Mode:* WhatsApp Direct Order

*Itemized Products:*
${itemsList || 'Cart items'}

-----------------------------
*Subtotal:* ${formatINR(subtotal || 0)}
*Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee || 0)}
*Total Value:* ${formatINR(totalAmount || 0)}

*Shipping Address:*
• *Name:* ${customerName}
• *Phone:* ${phone}
• *Address:* ${address}${pin}
=============================
Please confirm stock availability and send UPI payment confirmation!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 text-emerald-950 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-950">
            Zero-Cost WhatsApp Direct Order
          </h4>
          <p className="text-xs text-emerald-800">
            Prefer ordering directly via chat? Send this pre-formatted order summary to our store manager.
          </p>
        </div>
      </div>

      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
      >
        <span>Send Order to Store on WhatsApp</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

export default WhatsAppFallback;
