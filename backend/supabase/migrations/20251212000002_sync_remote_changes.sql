drop extension if exists "pg_net";

create type "public"."publisher_status" as enum ('pending', 'approved', 'rejected');

alter table "public"."publishers" add column "contract_address" text;

alter table "public"."publishers" add column "status" public.publisher_status default 'pending'::public.publisher_status;

alter table "public"."publishers" add column "submitted_at" timestamp with time zone default now();

alter table "public"."publishers" add column "wallet_address" text;

CREATE INDEX idx_publishers_status ON public.publishers USING btree (status);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id uuid)
 RETURNS TABLE(total_requests bigint, total_spent numeric, success_rate numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COALESCE(SUM(amount_usd), 0),
    CASE
      WHEN COUNT(*) > 0
      THEN ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC * 100), 2)
      ELSE 0
    END
  FROM requests
  WHERE requests.user_id = p_user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_request(p_user_id uuid, p_api_key_id uuid, p_request_type public.request_type, p_url text, p_endpoint_id uuid, p_amount_usd numeric, p_tx_hash text, p_status public.request_status, p_error_message text, p_response_time_ms integer)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.register_wallet(wallet_addr text)
 RETURNS public.users
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  INSERT INTO users (wallet_address)
  VALUES (lower(wallet_addr))
  ON CONFLICT (wallet_address) DO UPDATE
    SET updated_at = NOW()
  RETURNING *;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.validate_api_key(p_key_hash text)
 RETURNS TABLE(user_id uuid, api_key_id uuid, is_valid boolean, expires_at timestamp with time zone, rate_limit integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;


  create policy "publishers_insert_authenticated"
  on "public"."publishers"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "publishers_select_pending"
  on "public"."publishers"
  as permissive
  for select
  to authenticated
using ((status = 'pending'::public.publisher_status));




