/**
 * Normalize gateway URL to ensure it has a protocol
 * Handles cases where URL is provided without http:// or https://
 */
function normalizeGatewayUrl(url: string): string {
  // If already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // For localhost or 127.0.0.1, default to http
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return `http://${url}`
  }
  
  // For production domains, default to https
  return `https://${url}`
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
