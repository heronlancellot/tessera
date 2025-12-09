-- Create function to register/update wallet users
-- This function bypasses RLS using SECURITY DEFINER
-- allowing wallet registration without authentication

CREATE OR REPLACE FUNCTION register_wallet(wallet_addr TEXT)
RETURNS users AS $$
  INSERT INTO users (wallet_address)
  VALUES (lower(wallet_addr))
  ON CONFLICT (wallet_address) DO UPDATE
    SET updated_at = NOW()
  RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Grant execute permission to anon users (for wallet connection)
GRANT EXECUTE ON FUNCTION register_wallet(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION register_wallet(TEXT) TO authenticated;
