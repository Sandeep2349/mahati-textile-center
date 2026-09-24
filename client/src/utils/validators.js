/**
 * Validates 12-digit UPI UTR (Unique Transaction Reference) bank number.
 * @param {string} utr
 * @returns {boolean}
 */
export const isValidUtr = (utr) => {
  if (!utr) return false;
  return /^\d{12}$/.test(String(utr).trim());
};

/**
 * Validates Indian 10-digit mobile number starting with 6, 7, 8, or 9.
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const clean = String(phone).replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(clean);
};

/**
 * Validates Indian 6-digit postal PIN code.
 * @param {string} pinCode
 * @returns {boolean}
 */
export const isValidPinCode = (pinCode) => {
  if (!pinCode) return false;
  return /^\d{6}$/.test(String(pinCode).trim());
};
