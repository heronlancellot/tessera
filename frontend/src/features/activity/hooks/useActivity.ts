"use client"

import { useState, useEffect, useCallback } from "react"
import type { ActivityRequest, FilterType, FilterStatus } from "../types"
import { activityService } from "@/shared/services/activityService"
import { authService } from "@/shared/services/authService"
import { logger } from "@/shared/utils/logger"

interface UseActivityOptions {
  walletAddress?: string
}

export function useActivity({ walletAddress }: UseActivityOptions) {
  const [requests, setRequests] = useState<ActivityRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Load user and requests
  useEffect(() => {
    async function loadUserAndRequests() {
      if (!walletAddress) return

      setIsLoading(true)
      try {
        const user = await authService.getUserByWallet(walletAddress)
        if (user) {
          setCurrentUserId(user.id)
          const data = await activityService.listRequests(user.id)

          const transformedRequests: ActivityRequest[] = data.map((req: any) => ({
            id: req.id,
            url: req.url,
            requestType: req.request_type,
            status: req.status || "pending",
            amountUsd: req.amount_usd,
            createdAt: req.created_at || new Date().toISOString(),
            responseTimeMs: req.response_time_ms,
            errorMessage: req.error_message,
            apiKeyName: req.api_keys?.name,
          }))

          setRequests(transformedRequests)
        }
      } catch (error) {
        logger.error("Failed to load activity requests", error, {
          showToast: true,
          toastMessage: "Failed to load activity",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndRequests()
  }, [walletAddress])

  const filterRequests = useCallback(
    (type: FilterType, status: FilterStatus) => {
      return requests.filter((req) => {
        const matchesType = type === "all" || req.requestType === type
        const matchesStatus = status === "all" || req.status === status
        return matchesType && matchesStatus
      })
    },
    [requests]
  )

  return {
    requests,
    isLoading,
    currentUserId,
    filterRequests,
  }
}
