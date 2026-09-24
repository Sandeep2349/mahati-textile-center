/**
 * Format a number into Indian Rupee currency format (₹).
 * @param {number} amount
 * @returns {string} e.g. "₹1,499"
 */
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date string into readable Indian standard format
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format 10-digit Indian phone number
 * @param {string} phone
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone;
};
