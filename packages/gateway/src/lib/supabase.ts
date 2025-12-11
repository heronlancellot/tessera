/**
 * Supabase Client for Gateway
 *
 * Connects to Supabase to query publishers, endpoints, api_keys, etc.
 */

import { createClient } from '@supabase/supabase-js'

// Get Supabase configuration from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate that required environment variables are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase configuration incomplete. Check your .env file.')
}

// Validate Supabase URL format (allow localhost for development)
const isProduction = process.env.NODE_ENV === 'production'
const supabaseUrlPattern = /^https:\/\/[a-z0-9]+\.supabase\.co$/
const isLocalhost = SUPABASE_URL.includes('localhost') || SUPABASE_URL.includes('127.0.0.1')

if (isProduction && !supabaseUrlPattern.test(SUPABASE_URL)) {
  throw new Error('Invalid Supabase URL for production.')
}

if (isProduction && isLocalhost) {
  throw new Error('Cannot use localhost Supabase in production.')
}

// Create Supabase client
// Use service role for admin operations (bypasses RLS)
// Use anon key for public operations (respects RLS)
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

// Service role client for admin operations (bypasses RLS)
export const supabase = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : supabaseAnon

// Export anon client for public operations if needed
export { supabaseAnon }
