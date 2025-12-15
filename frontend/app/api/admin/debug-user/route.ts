import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/shared/utils/supabaseAdmin"

/**
 * Debug endpoint - Check if user exists and function works
 * Usage: GET /api/admin/debug-user?wallet=0x...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json({ error: "Missing wallet parameter" }, { status: 400 })
    }

    const normalizedWallet = wallet.toLowerCase()

    console.log("🔍 Debugging user:", normalizedWallet)

    // 1. Check if function exists
    const { data: functions, error: funcError } = await supabaseAdmin
      .rpc('upsert_wallet_user' as any, {
        wallet_addr: '0xTEST_FUNCTION_CHECK',
        auth_user_id: '00000000-0000-0000-0000-000000000000'
      })

    const functionExists = !funcError || funcError.code !== 'PGRST202' // PGRST202 = function not found

    // Clean up test
    if (functions) {
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('wallet_address', '0xtest_function_check')
    }

    // 2. Check if user exists in public.users
    const { data: publicUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('wallet_address', normalizedWallet)
      .maybeSingle()

    // 3. Check if user exists in auth.users
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = authUsers?.users.find(
      u => u.user_metadata?.wallet_address?.toLowerCase() === normalizedWallet
    )

    // 4. Try to call the function for this wallet
    let functionTestResult = null
    let functionTestError = null
    if (authUser) {
      const { data, error } = await supabaseAdmin
        .rpc('upsert_wallet_user' as any, {
          wallet_addr: normalizedWallet,
          auth_user_id: authUser.id
        })
      functionTestResult = data
      functionTestError = error
    }

    return NextResponse.json({
      debug: {
        wallet: normalizedWallet,
        functionExists,
        functionError: funcError?.message,
        publicUserExists: !!publicUser,
        publicUser: publicUser,
        authUserExists: !!authUser,
        authUserId: authUser?.id,
        functionTestResult,
        functionTestError: functionTestError?.message,
        userError: userError?.message,
      },
      diagnosis: {
        sqlExecuted: functionExists,
        userInPublicTable: !!publicUser,
        userInAuthTable: !!authUser,
        canCreateUser: functionExists && !!authUser,
      },
      nextSteps: !functionExists
        ? ["❌ Execute o SQL em FIX_DB_NOW.sql no Supabase SQL Editor"]
        : !authUser
        ? ["⚠️ User não encontrado em auth.users - reconecte a wallet"]
        : !publicUser && functionTestError
        ? ["❌ Função existe mas falhou:", functionTestError.message]
        : !publicUser
        ? ["✅ Tudo pronto! Função criou/vai criar o user automaticamente"]
        : ["✅ Tudo ok! User existe e função funciona"]
    })

  } catch (error: any) {
    console.error("Debug error:", error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
