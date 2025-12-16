-- ===========================================
-- CORRIGIR PATH DO ENDPOINT LOCALHOST
-- ===========================================
-- Este script corrige o path do endpoint localhost
-- de /api/content/:slug para /tessera/articles/:id
-- ===========================================

-- Atualizar o path do endpoint localhost
UPDATE endpoints
SET 
  path = 'http://localhost:8080/tessera/articles/:id',
  description = 'Endpoint para testes locais - Publisher Server mock (corrigido)'
WHERE 
  publisher_id = '00000000-0000-0000-0000-000000000001'
  AND path LIKE '%/api/content%';

-- Verificar se foi atualizado corretamente
SELECT
  p.name as publisher_name,
  p.slug,
  p.website,
  e.path as endpoint_path,
  e.price_usd,
  e.is_active
FROM publishers p
LEFT JOIN endpoints e ON e.publisher_id = p.id
WHERE p.slug = 'localhost';