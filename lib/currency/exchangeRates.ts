/**
 * Dynamic currency exchange rate fetching
 * Fetches from server-side API route to avoid CSP issues
 */

/**
 * Fetch exchange rates dynamically from API
 * Uses server-side API route to avoid CSP violations
 * Falls back to cached rates if API fails
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch("/api/currency/rates", {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Currency API returned ${response.status}`);
    }

    const rates = (await response.json()) as Record<string, number>;
    return rates;
  } catch {
    // Return fallback rates on error
    return getFallbackRates();
  }
}

/**
 * Get fallback exchange rates (ILS as base)
 * These are approximate rates and should be updated periodically
 */
function getFallbackRates(): Record<string, number> {
  // ILS is the base (1.0), all other rates are relative to ILS
  return {
    ILS: 1.0,
    USD: 0.274, // 1 ILS = 0.274 USD (approximately 3.65 ILS = 1 USD)
    EUR: 0.252, // 1 ILS = 0.252 EUR (approximately 3.97 ILS = 1 EUR)
  };
}

/**
 * Convert amount from one currency to another using fetched rates
 * @param amount Amount in source currency
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @param rates Exchange rates (ILS as base)
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || 1.0;

  // Both rates are relative to ILS, so convert through ILS
  // amount_in_ILS = amount / fromRate
  // result = amount_in_ILS * toRate
  const amountInILS = amount / fromRate;
  return amountInILS * toRate;
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
  const symbol = currency?.symbol || "₪";

  // Format number with locale-specific formatting
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  return `${symbol}${formatted}`;
}
