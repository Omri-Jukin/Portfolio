import { NextResponse } from "next/server";

const EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/ILS";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface ExchangeRatesResponse {
  rates: Record<string, number>;
  base: string;
  date: string;
}

// In-memory cache (shared across requests in the same process)
let cachedRates: Record<string, number> | null = null;
let cacheTimestamp: number = 0;

function getFallbackRates(): Record<string, number> {
  return {
    ILS: 1.0,
    USD: 0.274, // 1 ILS = 0.274 USD (approximately 3.65 ILS = 1 USD)
    EUR: 0.252, // 1 ILS = 0.252 EUR
  };
}

export async function GET() {
  try {
    // Return cached rates if still valid
    const now = Date.now();
    if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(cachedRates);
    }

    // Fetch from API
    const response = await fetch(EXCHANGE_RATE_API, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = (await response.json()) as ExchangeRatesResponse;

    // Filter to only keep ILS, USD, EUR
    cachedRates = {
      ILS: 1.0, // Base currency
      USD: data.rates.USD || 0.274,
      EUR: data.rates.EUR || 0.252,
    };
    cacheTimestamp = now;

    return NextResponse.json(cachedRates);
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    // Return cached rates if available, otherwise fallback rates
    if (cachedRates) {
      return NextResponse.json(cachedRates);
    }

    // Return fallback rates
    return NextResponse.json(getFallbackRates());
  }
}
