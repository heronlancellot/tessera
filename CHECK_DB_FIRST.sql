-- ============================================
-- 🔍 EXECUTE PRIMEIRO PARA VER O QUE JÁ EXISTE
-- ============================================
-- Cole no Supabase SQL Editor e veja os resultados
-- ============================================

-- 1. Ver todas as políticas da tabela users
SELECT
  policyname,
  cmd as command,
  qual as using_expression,
  with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- 2. Ver se a função upsert_wallet_user existe
SELECT
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'upsert_wallet_user';

-- 3. Ver um exemplo de usuário (se existir)
SELECT id, wallet_address, user_id, role, created_at
FROM users
LIMIT 1;
