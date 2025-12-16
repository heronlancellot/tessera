"use client"

import { useState, useEffect, useCallback } from "react"
import { publishersAdminService, type PublisherAdmin, type PublisherStatus } from "@/shared/services/publishersAdminService"
import { logger } from "@/shared/utils/logger"
import { toast } from "@/shared/utils/toast"

interface UsePublishersAdminOptions {
  status?: PublisherStatus
  is_active?: boolean
}

export function usePublishersAdmin(filters?: UsePublishersAdminOptions) {
  const [publishers, setPublishers] = useState<PublisherAdmin[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadPublishers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await publishersAdminService.listPublishers(filters)
      setPublishers(response.publishers)
    } catch (error) {
      logger.error("Failed to load publishers", error, {
        showToast: true,
        toastMessage: "Failed to load publishers",
      })
      setPublishers([])
    } finally {
      setIsLoading(false)
    }
  }, [filters?.status, filters?.is_active])

  useEffect(() => {
    loadPublishers()
  }, [loadPublishers])

  const approvePublisher = useCallback(
    async (id: string, contractAddress?: string) => {
      const loadingToast = toast.loading("Approving publisher...")
      try {
        const updated = await publishersAdminService.approvePublisher(id, contractAddress)
        setPublishers((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        )
        toast.dismiss(loadingToast)
        toast.success("Publisher approved successfully")
        return updated
      } catch (error) {
        toast.dismiss(loadingToast)
        logger.error("Failed to approve publisher", error, {
          showToast: true,
          toastMessage: "Failed to approve publisher",
        })
        return null
      }
    },
    []
  )

  const rejectPublisher = useCallback(async (id: string) => {
    const loadingToast = toast.loading("Rejecting publisher...")
    try {
      const updated = await publishersAdminService.rejectPublisher(id)
      setPublishers((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      )
      toast.dismiss(loadingToast)
      toast.success("Publisher rejected")
      return updated
    } catch (error) {
      toast.dismiss(loadingToast)
      logger.error("Failed to reject publisher", error, {
        showToast: true,
        toastMessage: "Failed to reject publisher",
      })
      return null
    }
  }, [])

  return {
    publishers,
    isLoading,
    approvePublisher,
    rejectPublisher,
    refresh: loadPublishers,
  }
}
