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

  console.log(`[getEndpointByHostname] Looking for publisher with hostname: ${normalizedHost}`)

  // First, find publisher by slug or website
  const { data: publishers, error: pubError } = await supabase
    .from('publishers')
    .select('id, name, slug, website')
    .eq('is_active', true)
    .or(`slug.eq.${normalizedHost},website.ilike.%${normalizedHost}%`)
    .limit(1)
    .maybeSingle()

  if (pubError || !publishers) {
    console.log(`[getEndpointByHostname] Publisher not found for hostname: ${normalizedHost}`)
    if (pubError) console.log(`[getEndpointByHostname] Error:`, pubError)

    // Check if publisher exists but is not active (for debugging)
    const { data: inactivePublisher } = await supabase
      .from('publishers')
      .select('id, name, slug, website, status, is_active')
      .or(`slug.eq.${normalizedHost},website.ilike.%${normalizedHost}%`)
      .limit(1)
      .maybeSingle()

    if (inactivePublisher) {
      console.log(`[getEndpointByHostname] Found INACTIVE publisher:`, inactivePublisher)
      console.log(`[getEndpointByHostname] Publisher needs to be approved first!`)
    }

    return null
  }

  console.log(`[getEndpointByHostname] Found publisher:`, publishers)

  // Now get active endpoint for this publisher
  const { data: endpoint, error: endpointError } = await supabase
    .from('endpoints')
    .select('id, path, price_usd')
    .eq('publisher_id', publishers.id)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (endpointError || !endpoint) {
    console.log(`[getEndpointByHostname] No active endpoint found for publisher ${publishers.name}`)
    return null
  }

  console.log(`[getEndpointByHostname] Found endpoint:`, endpoint)

  // Transform the response to match EndpointInfo type
  return {
    id: endpoint.id,
    path: endpoint.path,
    price_usd: endpoint.price_usd,
    publisher: {
      id: publishers.id,
      name: publishers.name,
      slug: publishers.slug
    }
  }
}

/**
 * Legacy function - get just the price
 * Returns null if publisher not integrated
 */
export async function getPrice(hostname: string): Promise<number | null> {
  const endpoint = await getEndpointByHostname(hostname)
  return endpoint ? endpoint.price_usd : null
}
