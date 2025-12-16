import { supabase } from "@/shared/utils/supabase"
import { Publisher } from "@/shared/types/publisher"
import { env } from "@/shared/config/env"

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

  /**
   * Get publisher by wallet address via Gateway API
   * This uses the gateway instead of calling Supabase directly from the frontend
   * Returns the publisher with contract_address for withdraw operations
   */
  async getPublisherByWalletAddress(walletAddress: string): Promise<Publisher | null> {
    if (!walletAddress) {
      console.error("Wallet address is required")
      return null
    }

    try {
      const normalizedAddress = walletAddress.toLowerCase()
      // Note: publishers routes are under /public/publishers in the gateway
      const url = `${env.gatewayUrl}/public/publishers/wallet/${encodeURIComponent(normalizedAddress)}`
      
      console.log("[publisherService] Fetching publisher from gateway:", url)
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("[publisherService] Response status:", response.status)

      if (!response.ok) {
        if (response.status === 404) {
          // Publisher not found - this is expected for users who aren't publishers
          console.log("[publisherService] Publisher not found for wallet:", normalizedAddress)
          return null
        }
        const errorData = await response.json().catch(() => ({}))
        console.error("[publisherService] Error fetching publisher:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        return null
      }

      const data = await response.json()
      console.log("[publisherService] Publisher found:", data.publisher?.id)
      return data.publisher || null
    } catch (error) {
      console.error("[publisherService] Network error fetching publisher:", error)
      return null
    }
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
