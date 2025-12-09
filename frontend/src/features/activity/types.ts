import { Database } from "@/shared/types/database"

export type RequestStatus = Database["public"]["Enums"]["request_status"]
export type RequestType = Database["public"]["Enums"]["request_type"]

export interface ActivityRequest {
  id: string
  url: string
  requestType: RequestType
  status: RequestStatus
  amountUsd: number
  createdAt: string
  responseTimeMs: number | null
  errorMessage: string | null
  apiKeyName?: string
}

export type FilterType = "all" | RequestType
export type FilterStatus = "all" | RequestStatus
