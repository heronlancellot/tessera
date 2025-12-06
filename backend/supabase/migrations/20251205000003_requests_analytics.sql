-- Tessera Migration 003: Requests & Analytics
-- Payment logs and usage tracking

-- ============================================
-- REQUESTS TABLE
-- Payment logs and content access history
-- ============================================
CREATE TYPE request_status AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Who made the request
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  agent_id TEXT REFERENCES agents(agent_id) ON DELETE SET NULL,

  -- What was requested
  publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  source_domain TEXT NOT NULL,

  -- Payment
  tx_hash TEXT NOT NULL,
  amount_usd DECIMAL(10, 4) NOT NULL,

  -- Status
  status request_status DEFAULT 'pending',
  error_message TEXT,

  -- Metrics
  content_hash TEXT,
  response_time_ms INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_user ON requests(user_id);
CREATE INDEX idx_requests_agent ON requests(agent_id) WHERE agent_id IS NOT NULL;
CREATE INDEX idx_requests_publisher ON requests(publisher_id) WHERE publisher_id IS NOT NULL;
CREATE INDEX idx_requests_tx ON requests(tx_hash);
CREATE INDEX idx_requests_domain ON requests(source_domain);
CREATE INDEX idx_requests_created ON requests(created_at DESC);
CREATE INDEX idx_requests_user_created ON requests(user_id, created_at DESC);
CREATE INDEX idx_requests_status ON requests(status);

COMMENT ON TABLE requests IS 'Content requests and payment logs';

-- ============================================
-- USAGE_SUMMARY TABLE
-- Pre-aggregated stats for dashboard
-- ============================================
CREATE TABLE usage_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  -- Daily counts
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10, 4) DEFAULT 0,

  -- Breakdowns (JSONB for flexibility)
  requests_by_source JSONB,
  cost_by_source JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date)
);

CREATE INDEX idx_usage_summary_user_date ON usage_summary(user_id, date DESC);

COMMENT ON TABLE usage_summary IS 'Daily aggregated stats for fast dashboard queries';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_summary ENABLE ROW LEVEL SECURITY;

-- Requests: user's own requests (read-only via anon, write via service role)
CREATE POLICY requests_select_own ON requests
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
         OR user_id = auth.uid()
    )
  );

-- Usage Summary: user's own stats
CREATE POLICY usage_summary_select_own ON usage_summary
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
         OR user_id = auth.uid()
    )
  );

-- ============================================
-- HELPER FUNCTION: Get user stats
-- ============================================
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
  total_requests BIGINT,
  total_spent NUMERIC,
  avg_cost NUMERIC,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COALESCE(SUM(amount_usd), 0),
    COALESCE(AVG(amount_usd), 0),
    CASE
      WHEN COUNT(*) > 0
      THEN (COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC * 100)
      ELSE 0
    END
  FROM requests
  WHERE requests.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

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
  AND table_name IN ('requests', 'usage_summary');

  IF table_count = 2 THEN
    RAISE NOTICE '✅ Migration 003 successful! Analytics tables created (requests, usage_summary)';
  ELSE
    RAISE WARNING '⚠️ Migration 003 incomplete. Expected 2 tables, found %', table_count;
  END IF;
END $$;
