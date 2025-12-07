-- Tessera Seed Data
-- Publishers and endpoints for demo/testing

-- ============================================
-- DEMO PUBLISHERS
-- ============================================
INSERT INTO publishers (name, slug, logo_url, website) VALUES
  ('Medium', 'medium', 'https://miro.medium.com/v2/resize:fill:152:152/1*sHhtYhaCe2Uc3IU0IgKwIQ.png', 'http://localhost:8080'),
  ('The New York Times', 'nytimes', 'https://www.nytimes.com/vi-assets/static-assets/favicon.ico', 'https://www.nytimes.com'),
  ('Reuters', 'reuters', 'https://www.reuters.com/pf/resources/images/reuters/favicon.ico', 'https://www.reuters.com'),
  ('Nature', 'nature', 'https://www.nature.com/static/images/favicons/nature/apple-touch-icon.png', 'https://www.nature.com');

-- Demo endpoints (simulating publisher partnership APIs)
INSERT INTO endpoints (publisher_id, path, method, name, description, price_usd) VALUES
  -- Medium (localhost:8080 - mock publisher API)
  (
    (SELECT id FROM publishers WHERE slug = 'medium'),
    'http://localhost:8080/tessera/articles/:id',
    'GET',
    'Premium Article',
    'Access to premium Medium articles via Tessera partnership',
    0.01
  ),
  -- NYT (future partnership - would be real API)
  (
    (SELECT id FROM publishers WHERE slug = 'nytimes'),
    'https://api.nytimes.com/tessera/content/:slug',
    'GET',
    'News Article',
    'Access to NYT premium content',
    0.25
  ),
  -- Reuters (future partnership)
  (
    (SELECT id FROM publishers WHERE slug = 'reuters'),
    'https://api.reuters.com/partners/tessera/article/:id',
    'GET',
    'News Article',
    'Access to Reuters premium content',
    0.15
  ),
  -- Nature (future partnership)
  (
    (SELECT id FROM publishers WHERE slug = 'nature'),
    'https://api.nature.com/tessera/articles/:doi',
    'GET',
    'Research Article',
    'Access to Nature research papers',
    0.50
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
