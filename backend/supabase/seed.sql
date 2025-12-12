-- Tessera Seed Data
-- Publishers and endpoints for demo/testing

-- ============================================
-- DEMO PUBLISHERS
-- ============================================
INSERT INTO publishers (name, slug, logo_url, website, wallet_address, status, is_active) VALUES
  ('Medium', 'medium', 'https://miro.medium.com/v2/resize:fill:152:152/1*sHhtYhaCe2Uc3IU0IgKwIQ.png', 'http://localhost:8080', '0x1234567890123456789012345678901234567890', 'pending', true),
  ('The New York Times', 'nytimes', 'https://static01.nyt.com/images/icons/t_logo_291_black.png', 'https://www.nytimes.com', '0x2345678901234567890123456789012345678901', 'pending', true),
  ('Reuters', 'reuters', 'https://static.wikia.nocookie.net/logopedia/images/5/53/Reuters_2008_vertical.svg/revision/latest?cb=20240525053744', 'https://www.reuters.com', '0x3456789012345678901234567890123456789012', 'pending', true),
  ('Nature', 'nature', 'https://www.nature.com/static/images/favicons/nature/apple-touch-icon.png', 'https://www.nature.com', '0x4567890123456789012345678901234567890123', 'pending', true);

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

