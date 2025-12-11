import { env } from "@/shared/config/env"

export type PublisherStatus = "pending" | "approved" | "rejected"

export interface PublisherAdmin {
  id: string
  name: string
  slug: string
  website: string | null
  logo_url: string | null
  wallet_address: string | null
  contract_address: string | null
  status: PublisherStatus | null
  is_active: boolean | null
  submitted_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface PublishersListResponse {
  count: number
  publishers: PublisherAdmin[]
}

class PublishersAdminService {
  private baseUrl: string

  constructor() {
    this.baseUrl = env.gatewayUrl
  }

  /**
   * List all publishers with optional filters
   */
  async listPublishers(filters?: {
    status?: PublisherStatus
    is_active?: boolean
  }): Promise<PublishersListResponse> {
    const params = new URLSearchParams()
    
    if (filters?.status) {
      params.append("status", filters.status)
    }
    
    if (filters?.is_active !== undefined) {
      params.append("is_active", filters.is_active.toString())
    }

    const url = `${this.baseUrl}/public/publishers?${params.toString()}`
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to fetch publishers" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  /**
   * Get single publisher by ID
   */
  async getPublisher(id: string): Promise<PublisherAdmin> {
    const response = await fetch(`${this.baseUrl}/public/publishers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to fetch publisher" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  /**
   * Approve a publisher
   */
  async approvePublisher(id: string, contractAddress?: string): Promise<PublisherAdmin> {
    const response = await fetch(`${this.baseUrl}/public/publishers/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contract_address: contractAddress || null,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to approve publisher" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.publisher
  }

  /**
   * Reject a publisher
   */
  async rejectPublisher(id: string): Promise<PublisherAdmin> {
    const response = await fetch(`${this.baseUrl}/public/publishers/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to reject publisher" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.publisher
  }
}

export const publishersAdminService = new PublishersAdminService()
