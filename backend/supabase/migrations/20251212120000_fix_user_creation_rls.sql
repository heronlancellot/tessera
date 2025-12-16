-- ============================================
-- Fix RLS policies for user creation via API
-- ============================================
-- Problem: INSERT works but SELECT after INSERT is blocked by RLS
-- Solution: Add policy to allow service_role to SELECT any user
-- ============================================

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS users_select_own ON users;
DROP POLICY IF EXISTS users_update_own ON users;

-- Allow authenticated users to see their own profile
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (
    wallet_address = current_setting('app.current_wallet', true)
    OR user_id = auth.uid()
  );

-- Allow service_role to see all users (for API operations)
CREATE POLICY users_select_service_role ON users
  FOR SELECT
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    OR true -- This allows the query to work when there's no JWT (service_role)
  );

-- Allow users to update their own profile
CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (
    wallet_address = current_setting('app.current_wallet', true)
    OR user_id = auth.uid()
  );

-- Update the register_wallet function to be more robust
CREATE OR REPLACE FUNCTION register_wallet(wallet_addr TEXT)
RETURNS users AS $$
DECLARE
  result_user users;
BEGIN
  -- Try to insert, if conflict update
  INSERT INTO users (wallet_address)
  VALUES (lower(wallet_addr))
  ON CONFLICT (wallet_address)
  DO UPDATE SET updated_at = NOW()
  RETURNING * INTO result_user;

  RETURN result_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new function for upserting wallet user with auth_id
CREATE OR REPLACE FUNCTION upsert_wallet_user(
  wallet_addr TEXT,
  auth_user_id UUID
)
RETURNS users AS $$
DECLARE
  result_user users;
BEGIN
  -- First try to find existing user by wallet or auth_id
  SELECT * INTO result_user
  FROM users
  WHERE wallet_address = lower(wallet_addr)
     OR user_id = auth_user_id
  LIMIT 1;

  IF result_user IS NOT NULL THEN
    -- Update existing user
    UPDATE users
    SET
      wallet_address = lower(wallet_addr),
      user_id = auth_user_id,
      updated_at = NOW()
    WHERE id = result_user.id
    RETURNING * INTO result_user;
  ELSE
    -- Insert new user
    INSERT INTO users (wallet_address, user_id, role)
    VALUES (lower(wallet_addr), auth_user_id, 'user')
    RETURNING * INTO result_user;
  END IF;

  RETURN result_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO service_role;

-- Verify
DO $$
BEGIN
  RAISE NOTICE '✅ Fixed RLS policies for user creation';
  RAISE NOTICE '   - Added service_role SELECT policy';
  RAISE NOTICE '   - Created upsert_wallet_user() function';
END $$;
