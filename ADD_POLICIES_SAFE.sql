-- ============================================
-- 🛡️ SQL SEGURO - SÓ ADICIONA, NÃO REMOVE NADA
-- ============================================
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. CRIAR FUNÇÃO (sobrescreve se já existir - isso é seguro)
CREATE OR REPLACE FUNCTION upsert_wallet_user(
  wallet_addr TEXT,
  auth_user_id UUID
)
RETURNS users AS $$
DECLARE
  result_user users;
BEGIN
  -- Busca usuário existente por wallet ou auth_id
  SELECT * INTO result_user
  FROM users
  WHERE wallet_address = lower(wallet_addr)
     OR user_id = auth_user_id
  LIMIT 1;

  IF result_user IS NOT NULL THEN
    -- Atualiza usuário existente
    UPDATE users
    SET
      wallet_address = lower(wallet_addr),
      user_id = auth_user_id,
      updated_at = NOW()
    WHERE id = result_user.id
    RETURNING * INTO result_user;
  ELSE
    -- Cria novo usuário
    INSERT INTO users (wallet_address, user_id, role)
    VALUES (lower(wallet_addr), auth_user_id, 'user')
    RETURNING * INTO result_user;
  END IF;

  RETURN result_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. DAR PERMISSÕES PARA A FUNÇÃO
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO service_role;

-- 3. ADICIONAR POLÍTICA DE INSERT (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'users'
    AND policyname = 'users_insert_via_function'
  ) THEN
    CREATE POLICY users_insert_via_function ON users
      FOR INSERT
      WITH CHECK (true);
    RAISE NOTICE '✅ Política de INSERT criada';
  ELSE
    RAISE NOTICE '⚠️ Política de INSERT já existe';
  END IF;
END $$;

-- ✅ PRONTO! Agora teste reconectando a wallet
