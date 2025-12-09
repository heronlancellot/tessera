-- Add request_type to requests table
-- Differentiates between preview (free) and fetch (paid) requests

CREATE TYPE request_type AS ENUM ('preview', 'fetch');

ALTER TABLE requests
  ADD COLUMN request_type request_type NOT NULL DEFAULT 'fetch';

-- Allow amount_usd to be 0 for preview requests
ALTER TABLE requests
  ALTER COLUMN amount_usd SET DEFAULT 0;

-- Add index for filtering by type
CREATE INDEX idx_requests_type ON requests(request_type);

COMMENT ON COLUMN requests.request_type IS 'Type of request: preview (free) or fetch (paid)';

-- Secure function to log requests (bypasses RLS safely)
CREATE OR REPLACE FUNCTION log_request(
  p_user_id UUID,
  p_api_key_id UUID,
  p_request_type request_type,
  p_url TEXT,
  p_endpoint_id UUID,
  p_amount_usd DECIMAL,
  p_tx_hash TEXT,
  p_status request_status,
  p_error_message TEXT,
  p_response_time_ms INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id UUID;
BEGIN
  INSERT INTO requests (
    user_id,
    api_key_id,
    request_type,
    url,
    endpoint_id,
    amount_usd,
    tx_hash,
    status,
    error_message,
    response_time_ms
  ) VALUES (
    p_user_id,
    p_api_key_id,
    p_request_type,
    p_url,
    p_endpoint_id,
    p_amount_usd,
    p_tx_hash,
    p_status,
    p_error_message,
    p_response_time_ms
  )
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$$;

-- Grant execute to anon (Gateway uses anon key)
GRANT EXECUTE ON FUNCTION log_request(UUID, UUID, request_type, TEXT, UUID, DECIMAL, TEXT, request_status, TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION log_request(UUID, UUID, request_type, TEXT, UUID, DECIMAL, TEXT, request_status, TEXT, INTEGER) TO authenticated;

COMMENT ON FUNCTION log_request IS 'Securely log Gateway requests without exposing RLS bypass to direct table access';
