-- Tessera Seed Data
-- Example publisher for demo/testing

-- ============================================
-- DEMO PUBLISHER: Medium
-- ============================================
INSERT INTO publishers (name, slug, logo_url, website) VALUES
  ('Medium', 'medium', 'https://miro.medium.com/v2/resize:fill:152:152/1*sHhtYhaCe2Uc3IU0IgKwIQ.png', 'https://medium.com');

-- Demo endpoints (paywalled articles)
INSERT INTO endpoints (publisher_id, path, method, name, description, price_usd) VALUES
  (
    (SELECT id FROM publishers WHERE slug = 'medium'),
    '/articles/*',
    'GET',
    'Read Article',
    'Access to premium Medium articles',
    0.10
  );

-- ============================================
-- DEMO USER (for testing)
-- ============================================
INSERT INTO users (wallet_address, name, email) VALUES
  ('0xDemoWallet1234567890abcdef1234567890abcdef', 'Demo Developer', 'demo@tessera.dev');

-- Demo agent
INSERT INTO agents (user_id, agent_id, name, description, budget_limit_usd) VALUES
  (
    (SELECT id FROM users WHERE wallet_address = '0xDemoWallet1234567890abcdef1234567890abcdef'),
    'demo-agent-001',
    'Demo Research Agent',
    'Agent for testing article access',
    10.00
  );
