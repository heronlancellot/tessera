import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/shared/utils/supabaseAdmin"
import crypto from "crypto"
import { logger } from "@/shared/utils/logger"

function generateApiKey(): string {
  // Generate a secure random API key (32 bytes = 64 hex chars)
  return "tsr_" + crypto.randomBytes(32).toString("hex")
}

function hashApiKey(apiKey: string): string {
  // SHA-256 hash for storage
  return crypto.createHash("sha256").update(apiKey).digest("hex")
}

function calculateExpirationDate(days: number | null): string | null {
  if (days === null) return null
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + days)
  return expirationDate.toISOString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, expirationDays } = body

    if (!userId || !name) {
      return NextResponse.json({ message: "Missing userId or name" }, { status: 400 })
    }

    // Verify user exists
    const { data: userExists, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", userId)
      .single()

    if (userError || !userExists) {
      logger.error("User not found", { userId, error: userError })
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Generate API key
    const apiKey = generateApiKey()
    const keyHash = hashApiKey(apiKey)
    const keyPrefix = apiKey.substring(0, 12)
    const expiresAt = calculateExpirationDate(expirationDays ?? null)

    // Store in database (using admin client to bypass RLS)
    const { data, error } = await supabaseAdmin
      .from("api_keys")
      .insert({
        user_id: userId,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        name: name,
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (error) {
      logger.error("Failed to create API key", {
        error,
        code: error.code,
        message: error.message,
      })
      return NextResponse.json({ message: "Failed to create API key", error: error.message }, { status: 500 })
    }

    // Return the full key (only time it's shown!)
    return NextResponse.json({
      id: data.id,
      name: data.name,
      key: apiKey,
      key_prefix: data.key_prefix,
      created_at: data.created_at,
      expires_at: data.expires_at,
    })
  } catch (error) {
    logger.error("API error creating key", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
