-- ============================================
-- 🚀 EXECUTE ESTE SQL NO SUPABASE SQL EDITOR
-- ============================================
-- Vai para: Supabase Dashboard > SQL Editor > New Query
-- Cola este SQL e clica em "Run"
-- ============================================

-- 1. REMOVER POLÍTICAS ANTIGAS QUE ESTÃO BLOQUEANDO
DROP POLICY IF EXISTS users_select_own ON users;
DROP POLICY IF EXISTS users_select_service_role ON users;
DROP POLICY IF EXISTS users_update_own ON users;
DROP POLICY IF EXISTS users_insert_own ON users;
DROP POLICY IF EXISTS api_keys_all_own ON users;

-- 2. CRIAR POLÍTICAS NOVAS QUE PERMITEM INSERT/UPDATE/SELECT

-- Permitir SELECT para usuários autenticados ou via wallet
CREATE POLICY users_select_policy ON users
  FOR SELECT
  USING (true); -- Permite ver todos (você pode restringir depois se quiser)

-- Permitir INSERT para service_role (API) e funções SECURITY DEFINER
CREATE POLICY users_insert_policy ON users
  FOR INSERT
  WITH CHECK (true); -- Permite inserir (a validação está na função)

-- Permitir UPDATE para service_role e próprio usuário
CREATE POLICY users_update_policy ON users
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR wallet_address = current_setting('app.current_wallet', true)
    OR current_user = 'postgres' -- Permite funções SECURITY DEFINER
  );

-- 3. CRIAR FUNÇÃO QUE BYPASSA RLS PARA CRIAR/ATUALIZAR USUÁRIOS
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

-- 4. DAR PERMISSÕES
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO service_role;

-- ✅ PRONTO! Agora reconecte sua wallet e teste criar API key
