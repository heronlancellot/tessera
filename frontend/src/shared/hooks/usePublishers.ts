"use client"

import { useState, useEffect } from "react"
import { Publisher } from "@/shared/types/publisher"
import { publisherService } from "@/shared/services/publisherService"
import { authService } from "@/shared/services/authService"
import { logger } from "@/shared/utils/logger"

interface UsePublishersOptions {
  walletAddress?: string
}

export function usePublishers(options?: UsePublishersOptions) {
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [requestCounts, setRequestCounts] = useState<Map<string, number>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPublishers() {
      setIsLoading(true)
      try {
        const data = await publisherService.getActivePublishers()
        setPublishers(data)

        // Se tiver wallet, busca os counts
        if (options?.walletAddress) {
          const user = await authService.getUserByWallet(options.walletAddress)
          if (user) {
            const counts = await publisherService.getRequestCountsByPublisher(user.id)
            setRequestCounts(counts)
          }
        }
      } catch (error) {
        logger.error("Failed to load publishers", error, {
          showToast: false,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPublishers()
  }, [options?.walletAddress])

  return {
    publishers,
    requestCounts,
    isLoading,
  }
}
