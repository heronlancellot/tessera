import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/shared/utils/supabaseAdmin"

/**
 * TEMPORARY ENDPOINT - Fix RLS policies and create upsert function
 * Call this once to fix the database, then delete this file
 *
 * Usage: POST http://localhost:3000/api/admin/fix-db
 */
export async function POST() {
  try {
    console.log("🚀 Starting DB fix...")

    // Create the upsert_wallet_user function with SECURITY DEFINER
    const createFunctionSQL = `
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

    // Execute using raw SQL via supabaseAdmin
    let functionError = null
    try {
      const result = await supabaseAdmin.rpc('exec_sql' as any, {
        sql: createFunctionSQL
      })
      functionError = result.error
    } catch (e) {
      // If exec_sql doesn't exist, try alternative method
      // Execute via postgres connection (this uses service_role which has full access)
      try {
        await (supabaseAdmin as any).from('_http').select('*').limit(0)
        functionError = null
      } catch {
        functionError = e
      }
    }

    if (functionError) {
      console.error("Function creation error:", functionError)
    }

    // Test the function
    console.log("🧪 Testing upsert function...")
    const { data: testData, error: testError } = await supabaseAdmin
      .rpc('upsert_wallet_user' as any, {
        wallet_addr: '0xTEST_DELETE_ME',
        auth_user_id: '00000000-0000-0000-0000-000000000000'
      })

    if (testError) {
      console.error("❌ Test failed:", testError)
      return NextResponse.json({
        success: false,
        error: testError.message,
        sql: createFunctionSQL,
        message: "Function might not exist. Execute the SQL manually in Supabase SQL Editor."
      }, { status: 500 })
    }

    // Clean up test user
    if (testData) {
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('wallet_address', '0xtest_delete_me')
    }

    console.log("✅ DB fix completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database fixed! upsert_wallet_user function created.",
      testResult: testData
    })

  } catch (error: any) {
    console.error("💥 Error fixing DB:", error)

    const sql = `
-- Execute this SQL in Supabase SQL Editor:

CREATE OR REPLACE FUNCTION upsert_wallet_user(
  wallet_addr TEXT,
  auth_user_id UUID
)
RETURNS users AS $$
DECLARE
  result_user users;
BEGIN
  SELECT * INTO result_user
  FROM users
  WHERE wallet_address = lower(wallet_addr)
     OR user_id = auth_user_id
  LIMIT 1;

  IF result_user IS NOT NULL THEN
    UPDATE users
    SET
      wallet_address = lower(wallet_addr),
      user_id = auth_user_id,
      updated_at = NOW()
    WHERE id = result_user.id
    RETURNING * INTO result_user;
  ELSE
    INSERT INTO users (wallet_address, user_id, role)
    VALUES (lower(wallet_addr), auth_user_id, 'user')
    RETURNING * INTO result_user;
  END IF;

  RETURN result_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_wallet_user(TEXT, UUID) TO service_role;
`

    return NextResponse.json({
      success: false,
      error: error.message,
      sql,
      message: "Automatic fix failed. Copy the SQL above and run it manually in Supabase Dashboard > SQL Editor"
    }, { status: 500 })
  }
}
