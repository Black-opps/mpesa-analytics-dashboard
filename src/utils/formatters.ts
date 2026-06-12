// src/utils/formatters.ts

/**
 * Format currency for display
 */
export const formatCurrency = (
  amount: number,
  currency: string = "KES"
): string => {
  return `${currency} ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format compact currency (e.g., 1.2K, 3.4M)
 */
export const formatCompactCurrency = (
  amount: number,
  currency: string = "KES"
): string => {
  const formatter = new Intl.NumberFormat("en-KE", {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return `${currency} ${formatter.format(amount)}`;
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-KE");
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
