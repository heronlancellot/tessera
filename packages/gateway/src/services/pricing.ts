/**
 * Get price and endpoint info for a publisher
 */

import { supabase } from '../lib/supabase.js'

export interface EndpointInfo {
  id: string
  path: string
  price_usd: number
  publisher: {
    id: string
    name: string
    slug: string
  }
}

/**
 * Get endpoint info by hostname
 * Returns null if publisher not found (not integrated with Tessera)
 */
export async function getEndpointByHostname(
  hostname: string
): Promise<EndpointInfo | null> {
  // Normalize hostname (remove www., port, protocol)
  const normalizedHost = hostname
    .replace(/^www\./, '')
    .replace(/:\d+$/, '') // Remove port
    .toLowerCase()

  // Query Supabase for publisher + endpoint
  // Match by slug (exact) or website URL (contains hostname)
  const { data, error } = await supabase
    .from('endpoints')
    .select(
      `
      id,
      path,
      price_usd,
      publishers!inner(id, name, slug, website)
    `
    )
    .eq('is_active', true)
    .eq('publishers.is_active', true)
    .or(`slug.eq.${normalizedHost},website.ilike.%${normalizedHost}%`, { referencedTable: 'publishers' })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    console.log(`Publisher not found for hostname: ${normalizedHost}`)
    return null
  }

  // Transform the response to match EndpointInfo type
  return {
    id: data.id,
    path: data.path,
    price_usd: data.price_usd,
    publisher: Array.isArray(data.publishers) ? data.publishers[0] : data.publishers
  } as EndpointInfo
}

/**
 * Legacy function - get just the price
 * Returns null if publisher not integrated
 */
export async function getPrice(hostname: string): Promise<number | null> {
  const endpoint = await getEndpointByHostname(hostname)
  return endpoint ? endpoint.price_usd : null
}
