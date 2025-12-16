-- Add UPDATE policy for publishers
-- Allows service role to update publisher status and contract address

-- Policy for UPDATE operations on publishers table
-- This allows the gateway (using service role) to approve/reject publishers
CREATE POLICY "publishers_update_service_role"
ON "public"."publishers"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Note: In production, you should restrict this policy further
-- For example, only allow updates to specific columns or by specific roles
-- This is a permissive policy for development purposes
