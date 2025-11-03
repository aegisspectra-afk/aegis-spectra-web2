/**
 * Currency formatting utilities for Israeli Shekel (ILS)
 */

/**
 * Format a number as Israeli Shekel with proper locale formatting
 * @param amount - The amount to format
 * @returns Formatted string with ILS symbol
 */
export const fmtIls = (amount: number): string => {
  return `${amount.toLocaleString('he-IL')} ₪`;
};

/**
 * Parse a formatted ILS string back to a number
 * @param formatted - The formatted string (e.g., "1,234 ₪")
 * @returns The numeric value
 */
export const parseIls = (formatted: string): number => {
  const cleanString = formatted.replace(/[^\d.-]/g, '');
  return parseFloat(cleanString) || 0;
};

/**
 * Calculate total with tax (17% VAT)
 * @param amount - Base amount
 * @returns Amount with tax
 */
export const withTax = (amount: number): number => {
  return amount * 1.17;
};

/**
 * Calculate amount without tax
 * @param amount - Amount with tax
 * @returns Base amount without tax
 */
export const withoutTax = (amount: number): number => {
  return amount / 1.17;
};

/**
 * Format amount with tax
 * @param amount - Base amount
 * @returns Formatted string with tax
 */
export const fmtIlsWithTax = (amount: number): string => {
  return fmtIls(withTax(amount));
};

/**
 * Format amount without tax
 * @param amount - Amount with tax
 * @returns Formatted string without tax
 */
export const fmtIlsWithoutTax = (amount: number): string => {
  return fmtIls(withoutTax(amount));
};
