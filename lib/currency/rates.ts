/**
 * Currency conversion rates (base: USD = 1.0)
 * Rates are approximate and should be updated periodically
 * For production, consider using a currency conversion API
 */
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,
  ILS: 3.65, // Israeli Shekel (approximate rate)
  EUR: 0.92,
};

/**
 * Convert amount from one currency to another
 * @param amount Amount in source currency
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = CURRENCY_RATES[fromCurrency] || 1.0;
  const toRate = CURRENCY_RATES[toCurrency] || 1.0;

  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
}

/**
 * Format currency amount with proper symbol and formatting
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  currencyMapping: Record<
    string,
    { symbol: string; code: string; name: string }
  >
): string {
  const currency = currencyMapping[currencyCode];
  const symbol = currency?.symbol || "$";

  // Format number with locale-specific formatting
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  return `${symbol}${formatted}`;
}
