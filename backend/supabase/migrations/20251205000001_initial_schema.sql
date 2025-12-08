-- Tessera Migration 001: Core Tables
-- Users, API Keys

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- Shared by all tables with updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- USERS TABLE (Profile)
-- Wallet = obrigatório | Social = opcional
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Auth: wallet é obrigatório, social é opcional
  wallet_address TEXT NOT NULL UNIQUE,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Profile
  name TEXT,
  avatar_url TEXT,
  email TEXT,

  -- Lifecycle
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_auth ON users(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_users_active ON users(deleted_at) WHERE deleted_at IS NULL;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE users IS 'Developer accounts - wallet required, social optional';
COMMENT ON COLUMN users.wallet_address IS 'Avalanche C-Chain address (0x...) - PRIMARY identity';
COMMENT ON COLUMN users.user_id IS 'Supabase Auth user (optional, for social login)';

-- ============================================
-- API_KEYS TABLE
-- Authentication tokens for SDK access
-- ============================================
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Key data
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default Key',

  -- Config
  rate_limit INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,

  -- Tracking
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(key_hash, is_active) WHERE is_active = TRUE;

COMMENT ON TABLE api_keys IS 'API authentication keys (tsr_ak_...)';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA256 hash - never store raw key';
COMMENT ON COLUMN api_keys.rate_limit IS 'Max requests per hour (default 100)';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users: can see own profile (by wallet or auth.uid)
CREATE POLICY users_select_own ON users
  FOR SELECT USING (
    wallet_address = current_setting('app.current_wallet', true)
    OR user_id = auth.uid()
  );

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (
    wallet_address = current_setting('app.current_wallet', true)
    OR user_id = auth.uid()
  );

-- API Keys: user's own keys
CREATE POLICY api_keys_all_own ON api_keys
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
         OR user_id = auth.uid()
    )
  );

-- ============================================
-- VERIFY MIGRATION
-- ============================================
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('users', 'api_keys');

  IF table_count = 2 THEN
    RAISE NOTICE '✅ Migration 001 successful! Core tables created (users, api_keys)';
  ELSE
    RAISE WARNING '⚠️ Migration 001 incomplete. Expected 2 tables, found %', table_count;
  END IF;
END $$;
