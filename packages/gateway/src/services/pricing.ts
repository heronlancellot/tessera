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
    wallet_address: string | null
    contract_address: string | null
  }
}

/**
 * Normalize URL and path for consistent comparison
 * Removes www., converts to lowercase, removes leading slashes from paths
 */
function normalizeUrl(websiteUrl: string, pathSlug: string): string {
  let normalized = websiteUrl

  try {
    const urlObj = new URL(websiteUrl)
    // Normalize: protocol + hostname (lowercase, remove www)
    normalized = `${urlObj.protocol}//${urlObj.hostname.toLowerCase().replace(/^www\./, '')}`
  } catch (e) {
    // If invalid URL, keep original
  }

  // Normalize path/slug (remove leading slash)
  let normalizedPath = pathSlug.trim()
  if (normalizedPath.startsWith('/')) {
    normalizedPath = normalizedPath.slice(1)
  }

  return `${normalized}/${normalizedPath}`
}

/**
 * Get endpoint info by hostname and optional path (for slug matching)
 * Returns null if publisher not found (not integrated with Tessera)
 * 
 * Matching logic:
 * - website must match hostname (with https://)
 * - slug from path must match publisher slug
 */
export async function getEndpointByHostname(
  url: URL,
): Promise<EndpointInfo | null> {
  const websiteUrl = url.origin
  const fullUrlPath = url.pathname

  // STEP 1: Get all active publishers first
  const { data: allActivePublishers, error: pubError } = await supabase
    .from('publishers')
    .select('id, name, slug, website, wallet_address, contract_address')
    .eq('is_active', true)

  if (pubError) {
    console.error(`[getEndpointByHostname] Error fetching active publishers:`, pubError)
    return null
  }

  if (!allActivePublishers || allActivePublishers.length === 0) {
    console.log(`[getEndpointByHostname] No active publishers found`)
    return null
  }

  // STEP 2: Compare website + /slug (from DB) with websiteUrl + /pathSlug (from URL)
  const requestFullPath = normalizeUrl(websiteUrl, fullUrlPath)

  const publishers = allActivePublishers.find((pub) => {
    if (!pub.website || !pub.slug) return false

    const dbFullPath = normalizeUrl(pub.website, pub.slug)
    const matches = dbFullPath === requestFullPath

    if (matches) {
      console.log(`[getEndpointByHostname] ✅ Found matching publisher: ${pub.name}`)
      console.log(`  DB path: ${dbFullPath}`)
      console.log(`  Request: ${requestFullPath}`)
    }

    return matches
  })

  if (!publishers) {
    console.warn(`[getEndpointByHostname] ❌ No matching publisher found for: ${requestFullPath}`)
    console.log(`[getEndpointByHostname] Available publishers:\n  ${
      allActivePublishers
        .map(pub => `${pub.name}: ${normalizeUrl(pub.website, pub.slug || '')}`)
        .join('\n  ')
    }`)

    return null
  }

  // Now get active endpoint for this publisher
  console.log(`[getEndpointByHostname] Buscando endpoint para publisher_id: ${publishers.id}`)

  const { data: endpoint, error: endpointError } = await supabase
    .from('endpoints')
    .select('id, path, price_usd')
    .eq('publisher_id', publishers.id)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  console.log(`[getEndpointByHostname] Query result:`, { endpoint, error: endpointError })

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
      slug: publishers.slug,
      wallet_address: publishers.wallet_address,
      contract_address: publishers.contract_address
    }
  }
}

/**
 * Legacy function - get just the price
 * Returns null if publisher not integrated
 */
export async function getPrice(hostname: string): Promise<number | null> {
  const endpoint = await getEndpointByHostname(new URL(hostname))
  return endpoint ? endpoint.price_usd : null
}
