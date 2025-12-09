import { supabase } from "@/shared/utils/supabase"

export const activityService = {
  /**
   * Lista todas as requisições do usuário
   */
  async listRequests(userId: string) {
    const { data, error } = await supabase
      .from("requests")
      .select(`
        *,
        api_keys (
          name
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },
}
