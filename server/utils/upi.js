/**
 * Generates an NPCI-compliant UPI URI for zero-cost, zero-MDR direct peer-to-merchant payment.
 *
 * @param {Object} params
 * @param {string} params.vpa - UPI Virtual Payment Address (e.g., 'mahatitextiles@upi')
 * @param {string} params.name - Merchant / Payee Display Name (e.g., 'Mahati Textile Center')
 * @param {number} params.amount - Total amount payable in INR
 * @param {string} params.orderNumber - Unique order number or transaction note reference
 * @returns {string} Fully encoded upi://pay URI
 */
export const generateUpiUri = ({
  vpa = process.env.STORE_UPI_VPA || 'mahatitextiles@upi',
  name = process.env.STORE_NAME || 'Mahati Textile Center',
  amount,
  orderNumber,
}) => {
  if (!amount || amount <= 0) {
    throw new Error('Valid payable amount is required for UPI payment');
  }

  const encodedName = encodeURIComponent(name);
  const formattedAmount = Number(amount).toFixed(2);
  const note = encodeURIComponent(`MTC_Order_${orderNumber || 'SALE'}`);

  return `upi://pay?pa=${vpa}&pn=${encodedName}&am=${formattedAmount}&tn=${note}&cu=INR`;
};

/**
 * Validates a 12-digit UPI UTR (Unique Transaction Reference) bank number.
 * @param {string} utr
 * @returns {boolean}
 */
export const isValidUtr = (utr) => {
  if (!utr) return false;
  return /^\d{12}$/.test(String(utr).trim());
};
