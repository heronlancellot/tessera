/**
 * Get price for a publisher/URL
 *
 * TODO: Integrate with Supabase to fetch from endpoints table
 */

// Default prices per publisher (in USD)
const DEFAULT_PRICES: Record<string, number> = {
  'medium.com': 0.10,
  'nature.com': 0.50,
  'nytimes.com': 0.25,
  'wsj.com': 0.30,
}

const FALLBACK_PRICE = 0.10

export async function getPrice(hostname: string): Promise<number> {
  // TODO: Query Supabase endpoints table
  // For now, use hardcoded prices

  // Normalize hostname (remove www.)
  const normalizedHost = hostname.replace(/^www\./, '')

  return DEFAULT_PRICES[normalizedHost] ?? FALLBACK_PRICE
}
