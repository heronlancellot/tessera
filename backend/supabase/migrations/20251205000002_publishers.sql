-- Tessera Migration 002: Publishers & Revenue Splits
-- Opt-in partners with x402 endpoints and royalty distribution

-- ============================================
-- PUBLISHERS TABLE
-- Opt-in partners with x402 endpoints
-- ============================================
CREATE TABLE publishers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  logo_url TEXT,

  -- x402 Integration
  x402_endpoint TEXT NOT NULL,

  -- Payout (wallet opcional - se NULL, Tessera guarda e paga depois)
  wallet_address TEXT,

  -- Default Pricing (can be overridden per article)
  default_price_usd DECIMAL(10, 4) NOT NULL DEFAULT 0.25,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_publishers_domain ON publishers(domain);
CREATE INDEX idx_publishers_active ON publishers(is_active) WHERE is_active = TRUE;

CREATE TRIGGER publishers_updated_at
  BEFORE UPDATE ON publishers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE publishers IS 'Opt-in partners exposing x402 endpoints';
COMMENT ON COLUMN publishers.x402_endpoint IS 'Publisher endpoint that accepts x402 payments';

-- ============================================
-- REVENUE_SPLITS TABLE
-- Royalty distribution (like NFTs)
-- ============================================
CREATE TYPE split_recipient_type AS ENUM ('publisher', 'author', 'affiliate', 'platform', 'custom');

CREATE TABLE revenue_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publisher_id UUID NOT NULL REFERENCES publishers(id) ON DELETE CASCADE,

  -- Recipient
  recipient_type split_recipient_type NOT NULL,
  recipient_wallet TEXT NOT NULL,
  recipient_name TEXT,

  -- Share (must sum to 1.0 per publisher/article)
  share_percent DECIMAL(5, 4) NOT NULL CHECK (share_percent > 0 AND share_percent <= 1),

  -- Scope (NULL = applies to all articles from this publisher)
  article_url TEXT,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revenue_splits_publisher ON revenue_splits(publisher_id);
CREATE INDEX idx_revenue_splits_article ON revenue_splits(article_url) WHERE article_url IS NOT NULL;
CREATE INDEX idx_revenue_splits_wallet ON revenue_splits(recipient_wallet);

COMMENT ON TABLE revenue_splits IS 'Revenue distribution rules (royalties)';
COMMENT ON COLUMN revenue_splits.share_percent IS '0.25 = 25% of payment';
COMMENT ON COLUMN revenue_splits.article_url IS 'NULL = default split for all publisher articles';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_splits ENABLE ROW LEVEL SECURITY;

-- Publishers: public read (active only), admin write
CREATE POLICY publishers_select_active ON publishers
  FOR SELECT USING (is_active = TRUE);

-- Revenue splits: public read, admin write
CREATE POLICY revenue_splits_select_all ON revenue_splits
  FOR SELECT USING (is_active = TRUE);

-- ============================================
-- SEED: Tessera platform fee (always 5%)
-- This ensures Tessera always gets a cut
-- ============================================
-- Note: Run this manually after creating a publisher
-- INSERT INTO revenue_splits (publisher_id, recipient_type, recipient_wallet, recipient_name, share_percent)
-- VALUES ('<publisher_id>', 'platform', '0xTesseraWallet', 'Tessera Platform Fee', 0.05);

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
  AND table_name IN ('publishers', 'revenue_splits');

  IF table_count = 2 THEN
    RAISE NOTICE '✅ Migration 002 successful! Publisher tables created (publishers, revenue_splits)';
  ELSE
    RAISE WARNING '⚠️ Migration 002 incomplete. Expected 2 tables, found %', table_count;
  END IF;
END $$;
