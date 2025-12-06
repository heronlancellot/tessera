-- Tessera Migration 002: Publishers & Endpoints
-- Providers and their monetized API routes

-- ============================================
-- PUBLISHERS TABLE
-- API providers (OpenAI, Anthropic, etc)
-- ============================================
CREATE TABLE publishers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_publishers_slug ON publishers(slug);
CREATE INDEX idx_publishers_active ON publishers(is_active) WHERE is_active = TRUE;

CREATE TRIGGER publishers_updated_at
  BEFORE UPDATE ON publishers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE publishers IS 'API providers (OpenAI, Anthropic, etc)';

-- ============================================
-- ENDPOINTS TABLE
-- Individual monetized routes per publisher
-- ============================================
CREATE TABLE endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publisher_id UUID NOT NULL REFERENCES publishers(id) ON DELETE CASCADE,

  -- Route info
  path TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'POST',
  name TEXT NOT NULL,
  description TEXT,

  -- x402 pricing
  price_usd DECIMAL(10, 6) NOT NULL,
  x402_resource TEXT,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(publisher_id, path, method)
);

CREATE INDEX idx_endpoints_publisher ON endpoints(publisher_id);
CREATE INDEX idx_endpoints_active ON endpoints(is_active) WHERE is_active = TRUE;

CREATE TRIGGER endpoints_updated_at
  BEFORE UPDATE ON endpoints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE endpoints IS 'Monetized API routes per publisher';
COMMENT ON COLUMN endpoints.price_usd IS 'Price per request in USD';
COMMENT ON COLUMN endpoints.x402_resource IS 'x402 payment resource identifier';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;

-- Public read for active publishers/endpoints
CREATE POLICY publishers_select_active ON publishers
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY endpoints_select_active ON endpoints
  FOR SELECT USING (is_active = TRUE);

-- ============================================
-- VERIFY
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 002: publishers & endpoints created';
END $$;
