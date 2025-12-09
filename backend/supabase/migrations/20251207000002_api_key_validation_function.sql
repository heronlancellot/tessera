-- API Key Validation Function
-- Secure function to validate API keys without exposing sensitive data
-- Uses SECURITY DEFINER to bypass RLS safely

CREATE OR REPLACE FUNCTION validate_api_key(p_key_hash TEXT)
RETURNS TABLE (
  user_id UUID,
  api_key_id UUID,
  is_valid BOOLEAN,
  expires_at TIMESTAMPTZ,
  rate_limit INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ak.user_id,
    ak.id AS api_key_id,
    ak.is_active
      AND (ak.expires_at IS NULL OR ak.expires_at > NOW())
      AND ak.deleted_at IS NULL AS is_valid,
    ak.expires_at,
    ak.rate_limit
  FROM api_keys ak
  WHERE ak.key_hash = p_key_hash
  LIMIT 1;
END;
$$;

-- Grant execute permission to anon users (for gateway validation)
GRANT EXECUTE ON FUNCTION validate_api_key(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION validate_api_key(TEXT) TO authenticated;

COMMENT ON FUNCTION validate_api_key(TEXT) IS
  'Validates API key by hash. Returns user_id and validation status without exposing sensitive data.';
