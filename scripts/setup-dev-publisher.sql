-- ===========================================
-- SETUP PUBLISHER LOCALHOST PARA DESENVOLVIMENTO
-- ===========================================
-- Este script insere um publisher "localhost" no banco de dados
-- para permitir testes locais com o publisher-server
--
-- Para executar este script:
-- 1. Acesse o Supabase Dashboard: https://bjuaxwdcsirvcjsoyxug.supabase.co
-- 2. Vá em SQL Editor
-- 3. Cole e execute este script
-- ===========================================

-- Inserir publisher localhost (se não existir)
INSERT INTO publishers (
  id,
  name,
  slug,
  website,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Localhost Dev Publisher',
  'localhost',
  'http://localhost:8080',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  website = EXCLUDED.website,
  is_active = EXCLUDED.is_active;

-- Inserir endpoint para o publisher localhost (se não existir)
INSERT INTO endpoints (
  id,
  publisher_id,
  path,
  method,
  name,
  description,
  price_usd,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'http://localhost:8080/tessera/articles/:id',
  'GET',
  'Local Dev Article',
  'Endpoint para testes locais - Publisher Server mock',
  0.01,
  true
)
ON CONFLICT (id) DO UPDATE SET
  path = EXCLUDED.path,
  method = EXCLUDED.method,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  is_active = EXCLUDED.is_active;

-- Verificar se foi inserido corretamente
SELECT
  p.name as publisher_name,
  p.slug,
  p.website,
  e.path as endpoint_path,
  e.price_usd
FROM publishers p
LEFT JOIN endpoints e ON e.publisher_id = p.id
WHERE p.slug = 'localhost';
