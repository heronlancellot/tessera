// Environment variables configuration
export const env = {
  // Thirdweb
  thirdwebClientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,

  // Gateway (Railway/Vercel)
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.tessera.dev',

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
