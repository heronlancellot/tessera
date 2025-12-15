/**
 * Script to fix RLS policies and create upsert function
 * Run with: npx tsx scripts/fix-rls-policies.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixRLSPolicies() {
  console.log('🚀 Fixing RLS policies and creating functions...\n')

  // Step 1: Drop and recreate policies
  console.log('1️⃣ Dropping old policies...')
  try {
    await supabase.rpc('exec_sql', {
      query: `
        DROP POLICY IF EXISTS users_select_own ON users;
        DROP POLICY IF EXISTS users_select_service_role ON users;
        DROP POLICY IF EXISTS users_update_own ON users;
      `
    })
  } catch {
    // Ignore if exec_sql doesn't exist, we'll use direct SQL
  }

  // Step 2: Create new policies
  console.log('2️⃣ Creating new policies...')

  const policies = `
    -- Allow authenticated users to see their own profile
    CREATE POLICY users_select_own ON users
      FOR SELECT
      USING (
        wallet_address = current_setting('app.current_wallet', true)
        OR user_id = auth.uid()
      );

    -- Allow users to update their own profile
    CREATE POLICY users_update_own ON users
      FOR UPDATE
      USING (
        wallet_address = current_setting('app.current_wallet', true)
        OR user_id = auth.uid()
      );
  `

  // Step 3: Create upsert function
  console.log('3️⃣ Creating upsert_wallet_user function...')

  const createFunction = `
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
  `

  try {
    // Execute via SQL Editor API (requires admin access)
    const { data, error } = await supabase.rpc('exec_sql' as any, {
      query: policies + createFunction
    })

    if (error) {
      console.error('❌ Error via RPC, trying direct execution...')

      // Alternative: Execute via postgres connection
      // This requires the postgres connection string
      console.log('\n📋 SQL to execute manually in Supabase SQL Editor:\n')
      console.log(policies + createFunction)
      console.log('\n')
      console.log('Copy the SQL above and run it in Supabase Dashboard > SQL Editor')
      return
    }

    console.log('✅ Policies and function created successfully!')

  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\n📋 Execute this SQL manually in Supabase SQL Editor:\n')
    console.log(policies + createFunction)
  }

  // Test the function
  console.log('\n4️⃣ Testing upsert function...')
  const testWallet = '0xtest123'
  const testAuthId = '00000000-0000-0000-0000-000000000000'

  const { data: testUser, error: testError } = await supabase
    .rpc('upsert_wallet_user' as any, {
      wallet_addr: testWallet,
      auth_user_id: testAuthId
    })

  if (testError) {
    console.error('❌ Test failed:', testError)
  } else {
    console.log('✅ Test passed! User created:', testUser)

    // Clean up test user
    await supabase
      .from('users')
      .delete()
      .eq('wallet_address', testWallet.toLowerCase())
    console.log('🧹 Cleaned up test user')
  }

  console.log('\n✨ All done!')
}

fixRLSPolicies().catch(console.error)
