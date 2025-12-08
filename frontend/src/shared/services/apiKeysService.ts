import { supabase } from "@/shared/utils/supabase"

export const apiKeysService = {
  /**
   * Lista todas as API keys do usuário (somente ativas)
   */
  async listKeys(userId: string) {
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Cria uma nova API key
   * Retorna a key completa (só disponível nesse momento!)
   */
  async createKey(userId: string, name: string, expirationDays?: number | null) {
    const response = await fetch("/api/keys/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, expirationDays }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create API key")
    }

    return response.json()
  },

  /**
   * Revoga uma API key (soft delete)
   * Mantém o histórico de requests para auditoria
   */
  async deleteKey(keyId: string) {
    const { error } = await supabase
      .from("api_keys")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", keyId)

    if (error) throw error
  },

  /**
   * Atualiza nome da API key
   */
  async updateKeyName(keyId: string, name: string) {
    const { data, error } = await supabase
      .from("api_keys")
      .update({ name })
      .eq("id", keyId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
