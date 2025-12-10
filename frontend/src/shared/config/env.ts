/**
 * Normalize gateway URL to ensure it has a protocol
 * Handles cases where URL is provided without http:// or https://
 */
function normalizeGatewayUrl(url: string): string {
  let normalized = url

  // If already has protocol, use as is
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    // Keep as is
  } else if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) {
    // For localhost or 127.0.0.1, default to http
    normalized = `http://${normalized}`
  } else {
    // For production domains, default to https
    normalized = `https://${normalized}`
  }

  // Remove trailing slash to prevent double slashes in URLs
  return normalized.replace(/\/$/, '')
}

// Environment variables configuration
export const env = {
  // Thirdweb
  thirdwebClientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,

  // Gateway (Railway/Vercel) - normalized to always have protocol
  gatewayUrl: normalizeGatewayUrl(
    process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.tessera.dev'
  ),

  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const

// Validate required environment variables
if (!env.thirdwebClientId) {
  throw new Error('Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID')
}

if (!env.supabase.url || !env.supabase.anonKey) {
  throw new Error('Missing Supabase configuration')
}
