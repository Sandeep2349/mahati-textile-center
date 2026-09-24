/**
 * Formats order information into a clean WhatsApp deep link for zero-cost customer fallback.
 *
 * @param {Object} order - Full order object
 * @param {string} storePhone - Store phone number with country code (e.g. 919912565482)
 * @returns {string} wa.me URL with pre-encoded message
 */
export const generateWhatsAppOrderUrl = (order, storePhone = process.env.STORE_PHONE || '919912565482') => {
  const cleanPhone = storePhone.replace(/\D/g, '');

  const itemsList = (order.items || [])
    .map((item, idx) => {
      const variantDesc = item.variantAttributes
        ? Object.entries(item.variantAttributes)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
        : '';
      return `${idx + 1}. *${item.productName}*${variantDesc ? ` (${variantDesc})` : ''} x ${item.quantity} = ₹${item.subtotal}`;
    })
    .join('\n');

  const customer = order.customer || {};
  const billing = order.billing || {};
  const orderRef = order.orderNumber || 'Pending';
  const paymentStatus = order.payment?.status || 'PENDING_VERIFICATION';
  const utrNote = order.payment?.upiUtrNumber ? `\n*UTR / Bank Ref:* ${order.payment.upiUtrNumber}` : '';

  const text = 
`*New Order - Mahati Textile Center*
=============================
*Order No:* ${orderRef}
*Status:* ${paymentStatus}
${utrNote}

*Items:*
${itemsList}

-----------------------------
*Subtotal:* ₹${billing.subtotal || 0}
*Delivery Fee:* ₹${billing.deliveryFee || 0}
*Total Payable:* ₹${billing.totalAmount || 0}

*Customer Details:*
• *Name:* ${customer.fullName || ''}
• *Phone:* ${customer.phone || ''}
• *Address:* ${customer.address || ''}
${customer.landmark ? `• *Landmark:* ${customer.landmark}\n` : ''}• *Pincode:* ${customer.pinCode || ''}
=============================
Please confirm this order! Thank you for shopping with Mahati Textile Center.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};
