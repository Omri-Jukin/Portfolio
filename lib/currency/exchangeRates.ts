/**
 * Dynamic currency exchange rate fetching
 * Uses a free API service to get real-time exchange rates
 */

const EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/ILS";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface ExchangeRatesResponse {
  rates: Record<string, number>;
  base: string;
  date: string;
}

let cachedRates: Record<string, number> | null = null;
let cacheTimestamp: number = 0;

/**
 * Fetch exchange rates dynamically from API
 * Falls back to cached rates if API fails
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Return cached rates if still valid
  const now = Date.now();
  if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await fetch(EXCHANGE_RATE_API, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = (await response.json()) as ExchangeRatesResponse;

    // Store rates with ILS as base (1 ILS = X other currency)
    // The API returns rates with ILS as base, so we can use them directly
    cachedRates = data.rates;
    cacheTimestamp = now;

    // Ensure ILS is 1.0 (base currency)
    cachedRates.ILS = 1.0;

    return cachedRates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);

    // Return cached rates if available, otherwise fallback rates
    if (cachedRates) {
      return cachedRates;
    }

    // Fallback rates (ILS as base = 1.0)
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
    EUR: 0.252, // 1 ILS = 0.252 EUR
    GBP: 0.217, // 1 ILS = 0.217 GBP
    CAD: 0.37,
    AUD: 0.417,
    JPY: 41.0,
    CHF: 0.241,
    CNY: 1.97,
    INR: 22.8,
    BRL: 1.36,
    MXN: 4.66,
    ZAR: 5.07,
    SEK: 2.88,
    NOK: 2.96,
    DKK: 1.89,
    PLN: 1.1,
    RUB: 24.7,
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
