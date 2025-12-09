import { supabase } from "@/shared/utils/supabase"
import { logger } from "@/shared/utils/logger"

const isSupabaseConfigured = () => {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const authService = {
  /**
   * Cria ou atualiza usuário com wallet address
   * Chama API route que usa SERVICE_ROLE pra criar user em auth.users
   * Seta a session no Supabase client pra RLS funcionar
   */
  async upsertWalletUser(walletAddress: string) {
    if (!isSupabaseConfigured()) {
      logger.warn("Supabase not configured, skipping authentication")
      return null
    }

    const response = await fetch("/api/auth/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to authenticate wallet")
    }

    const data = await response.json()

    // Set session in Supabase client for RLS to work
    if (data.session?.access_token && data.session?.refresh_token) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
      logger.debug("Supabase session set successfully")
    }

    return data.user
  },

  /**
   * Busca usuário por wallet address
   */
  async getUserByWallet(walletAddress: string) {
    if (!isSupabaseConfigured()) return null

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress.toLowerCase())
      .is("deleted_at", null)
      .maybeSingle()

    if (error) throw error
    return data
  },

  /**
   * Atualiza perfil do usuário
   */
  async updateProfile(walletAddress: string, updates: { name?: string; email?: string; avatar_url?: string }) {
    if (!isSupabaseConfigured()) return null

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("wallet_address", walletAddress.toLowerCase())
      .select()
      .single()

    if (error) throw error
    return data
  },
}
