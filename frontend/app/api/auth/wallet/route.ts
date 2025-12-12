import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/shared/utils/supabaseAdmin"
import { logger } from "@/shared/utils/logger"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    const normalizedAddress = walletAddress.toLowerCase()
    console.log("normalizedAddress", normalizedAddress)

    // Check if user already exists in auth.users by wallet address metadata
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    console.log("existingUsers", existingUsers)
    const existingAuthUser = existingUsers?.users.find(
      (u) => { console.log("u", u); return u.user_metadata?.wallet_address.toLowerCase() === normalizedAddress}
    )


    console.log("existingAuthUser", existingAuthUser)

    let authUser = existingAuthUser

    if (!authUser) {
      console.log("Creating new user")
      // Create new user in auth.users
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: `${normalizedAddress}@wallet.tessera.local`,
        email_confirm: true,
        user_metadata: {
          wallet_address: normalizedAddress,
          auth_type: "wallet",
        },
      })

      if (createError) {
        // If user already exists with this email, try to find them
        if (createError.message?.includes("already") || createError.code === "email_exists") {
          const { data: userByEmail } = await supabaseAdmin.auth.admin.listUsers()
          authUser = userByEmail?.users.find(u => u.email === `${normalizedAddress}@wallet.tessera.local`)

          if (!authUser) {
            logger.error("Failed to create auth user and couldn't find existing", createError)
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
          }
          logger.debug("Found existing auth user by email", { id: authUser.id })
        } else {
          logger.error("Failed to create auth user", { error: createError, code: createError.code, message: createError.message })
          return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
        }
      } else {
        authUser = newUser.user
        logger.debug("Created new auth user", { id: authUser.id })
      }
    }

    // First, try to find existing user in public.users by wallet_address
    let { data: existingPublicUser } = await supabaseAdmin
      .from("users")
      .select()
      .eq("wallet_address", normalizedAddress)
      .maybeSingle()

    // If not found by wallet, try by user_id
    if (!existingPublicUser) {
      const result = await supabaseAdmin
        .from("users")
        .select()
        .eq("user_id", authUser.id)
        .maybeSingle()
      existingPublicUser = result.data
    }

    let publicUser

    if (existingPublicUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          user_id: authUser.id,
          wallet_address: normalizedAddress,
        })
        .eq("id", existingPublicUser.id)
        .select()
        .single()

      if (updateError) {
        logger.error("Failed to update public user", {
          error: updateError,
          code: updateError.code,
          message: updateError.message,
          existingUserId: existingPublicUser.id
        })
        return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
      }

      publicUser = updatedUser
    } else {
      // Insert new user
      logger.debug("Creating new public user", { authUserId: authUser.id, walletAddress: normalizedAddress })
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          user_id: authUser.id,
          wallet_address: normalizedAddress,
          role: "user",
        })
        .select()
        .single()

      if (insertError) {
        logger.error("Failed to insert public user", {
          error: insertError,
          code: insertError.code,
          message: insertError.message,
          authUserId: authUser.id,
          walletAddress: normalizedAddress
        })
        return NextResponse.json({ error: "Failed to create user data", details: insertError.message }, { status: 500 })
      }

      publicUser = newUser
      logger.debug("Public user created successfully", { userId: publicUser.id })
    }

    // Generate a session for the user using a custom JWT
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: authUser.email!,
    })

    if (sessionError) {
      logger.error("Failed to generate link", sessionError)
    }

    // Extract token from the magic link URL to create a session
    let accessToken = null
    let refreshToken = null

    if (sessionData?.properties?.hashed_token) {
      // Verify the token to get a proper session
      const { data: verifyData, error: verifyError } = await supabaseAdmin.auth.admin.getUserById(authUser.id)

      if (!verifyError && verifyData) {
        // Generate session tokens directly
        const { data: { session }, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
          email: authUser.email!,
          password: normalizedAddress, // Use wallet address as password
        }).catch(() => ({ data: { session: null }, error: { message: "Password not set" } }))

        if (session) {
          accessToken = session.access_token
          refreshToken = session.refresh_token
        }
      }
    }

    // If we couldn't get a session via password, the user needs to set one
    // For now, we'll update the user to have a password based on wallet address
    if (!accessToken) {
      // Set password for the user
      await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
        password: normalizedAddress,
      })

    //   // Now sign in with the password
      const { data: { session }, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email: authUser.email!,
        password: normalizedAddress,
      })

      if (signInError) {
        logger.error("Failed to sign in user", signInError)
        return NextResponse.json({
          user: publicUser,
          authUser: {
            id: authUser.id,
            email: authUser.email,
          },
        })
      }

      accessToken = session?.access_token
      refreshToken = session?.refresh_token
    }

    return NextResponse.json({
      user: publicUser,
      authUser: {
        id: authUser.id,
        email: authUser.email,
      },
      session: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    })
  } catch (error) {
    logger.error("Wallet auth error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
