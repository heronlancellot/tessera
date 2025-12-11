-- Add RLS policy for admin to see all publishers (including pending)
-- Service role bypasses RLS automatically, but this migration documents the intent
-- The gateway will use service role key to list all publishers for admin panel

-- ============================================
-- NOTE: Service role bypasses RLS automatically
-- ============================================
-- When using SUPABASE_SERVICE_ROLE_KEY, all RLS policies are bypassed
-- This allows the gateway to see all publishers regardless of status or is_active
-- No additional policy needed for service role

-- ============================================
-- VERIFY
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Migration: Gateway will use service role to access all publishers';
  RAISE NOTICE '⚠️  Make sure SUPABASE_SERVICE_ROLE_KEY is set in gateway .env';
END $$;
