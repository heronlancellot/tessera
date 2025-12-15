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

  console.log(' STEP 1 allActivePublishers', allActivePublishers)

  // STEP 2: Compare website + /slug (from DB) with websiteUrl + /pathSlug (from URL)
  const publishers = allActivePublishers.find((pub) => {
    console.log(' STEP 2 pub', pub)
    if (!pub.website || !pub.slug) return false

    const databaseFullPathName = `${allActivePublishers[0].website + allActivePublishers[0].slug}`
    if(`${pub.website}${pub.slug}` !== databaseFullPathName) {
      console.log("STE 2.1 not matches", `${pub.website}${pub.slug}`, databaseFullPathName)
      return false
    }

    console.log("STE 2.2 matches", `${pub.website}${pub.slug}`, databaseFullPathName)
    return true
  })

  if (!publishers) {

    // Debug: Show all active publishers for comparison
    console.log(`[getEndpointByHostname] Active publishers in DB:`, 
      allActivePublishers.map(pub => {
        let dbBase = pub.website
        try {
          const urlObj = new URL(pub.website)
          dbBase = `${urlObj.protocol}//${urlObj.hostname.toLowerCase().replace(/^www\./, '')}`
        } catch (e) {
          // keep original
        }
        let dbSlug = pub.slug?.trim() || ''
        if (dbSlug.startsWith('/')) {
          dbSlug = dbSlug.slice(1)
        }
        const dbPath = `${dbBase}/${dbSlug}`
        return {
          name: pub.name,
          website: pub.website,
          websiteBase: dbBase,
          slug: pub.slug,
          slugNormalized: dbSlug,
          dbFullPath: dbPath,
          expected: fullUrlPath,
          matches: dbPath === fullUrlPath
        }
      })
    )

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
