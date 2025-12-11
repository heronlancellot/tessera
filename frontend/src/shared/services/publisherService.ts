import { supabase } from "@/shared/utils/supabase"
import { Publisher } from "@/shared/types/publisher"

export const publisherService = {
  async getActivePublishers(): Promise<Publisher[]> {
    const { data, error } = await supabase
      .from("publishers")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching publishers:", error)
      throw error
    }

    return data || []
  },

  async getRequestCountsByPublisher(userId: string): Promise<Map<string, number>> {
    const { data, error } = await supabase
      .from("requests")
      .select(`
        endpoint_id,
        endpoints!inner (
          publisher_id
        )
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching request counts:", error)
      return new Map()
    }

    // Conta requests por publisher_id
    const counts = new Map<string, number>()
    data?.forEach((req: any) => {
      const publisherId = req.endpoints?.publisher_id
      if (publisherId) {
        counts.set(publisherId, (counts.get(publisherId) || 0) + 1)
      }
    })

    return counts
  },

  async createPublisher (publisher: Publisher): Promise<Publisher> {
    const { data, error } = await supabase
      .from("publishers")
      .insert(publisher)
      .select()
      .single()

    if (error) throw error
    return data
  },


 async updatePublisher (publisher: Publisher): Promise<Publisher> {
    const { data, error } = await supabase
      .from("publishers")
      .update(publisher)
      .eq("id", publisher.id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletePublisher (id: string): Promise<void> {
    const { error } = await supabase
      .from("publishers")
      .delete()
      .eq("id", id)
    if (error) throw error
  },
  
}
