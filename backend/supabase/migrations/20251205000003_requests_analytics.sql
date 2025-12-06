-- Tessera Migration 003: Requests & Analytics
-- Payment logs and usage view

-- ============================================
-- REQUESTS TABLE
-- Payment/request logs
-- ============================================
CREATE TYPE request_status AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Who
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  agent_id TEXT REFERENCES agents(agent_id) ON DELETE SET NULL,

  -- What
  endpoint_id UUID REFERENCES endpoints(id) ON DELETE SET NULL,
  url TEXT NOT NULL,

  -- Payment
  tx_hash TEXT,
  amount_usd DECIMAL(10, 6) NOT NULL,

  -- Status
  status request_status DEFAULT 'pending',
  error_message TEXT,
  response_time_ms INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_user ON requests(user_id);
CREATE INDEX idx_requests_agent ON requests(agent_id) WHERE agent_id IS NOT NULL;
CREATE INDEX idx_requests_endpoint ON requests(endpoint_id);
CREATE INDEX idx_requests_created ON requests(created_at DESC);
CREATE INDEX idx_requests_user_created ON requests(user_id, created_at DESC);
CREATE INDEX idx_requests_status ON requests(status);

COMMENT ON TABLE requests IS 'API request and payment logs';

-- ============================================
-- USAGE_SUMMARY VIEW
-- Aggregated stats (not a table!)
-- ============================================
CREATE VIEW usage_summary AS
SELECT
  r.user_id,
  r.agent_id,
  DATE(r.created_at) as date,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE r.status = 'completed') as successful_requests,
  COUNT(*) FILTER (WHERE r.status = 'failed') as failed_requests,
  COALESCE(SUM(r.amount_usd), 0) as total_spent_usd,
  p.slug as publisher_slug,
  e.name as endpoint_name
FROM requests r
LEFT JOIN endpoints e ON r.endpoint_id = e.id
LEFT JOIN publishers p ON e.publisher_id = p.id
GROUP BY r.user_id, r.agent_id, DATE(r.created_at), p.slug, e.name;

COMMENT ON VIEW usage_summary IS 'Aggregated usage stats - computed on demand';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY requests_select_own ON requests
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users
      WHERE wallet_address = current_setting('app.current_wallet', true)
         OR user_id = auth.uid()
    )
  );

-- ============================================
-- HELPER: Get user stats
-- ============================================
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
  total_requests BIGINT,
  total_spent NUMERIC,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COALESCE(SUM(amount_usd), 0),
    CASE
      WHEN COUNT(*) > 0
      THEN ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC * 100), 2)
      ELSE 0
    END
  FROM requests
  WHERE requests.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFY
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 003: requests table & usage_summary view created';
END $$;
