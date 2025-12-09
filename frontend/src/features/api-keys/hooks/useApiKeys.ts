"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiKey, ExpirationOption, EXPIRATION_OPTIONS } from "@/shared/types/api-key"
import { apiKeysService } from "@/shared/services/apiKeysService"
import { authService } from "@/shared/services/authService"
import { logger } from "@/shared/utils/logger"
import { toast } from "@/shared/utils/toast"

interface UseApiKeysOptions {
  walletAddress?: string
}

export function useApiKeys({ walletAddress }: UseApiKeysOptions) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Load user and keys
  useEffect(() => {
    async function loadUserAndKeys() {
      if (!walletAddress) return

      setIsLoading(true)
      try {
        const user = await authService.getUserByWallet(walletAddress)
        if (user) {
          setCurrentUserId(user.id)
          const keys = await apiKeysService.listKeys(user.id)

          const transformedKeys: ApiKey[] = keys.map((key) => ({
            id: key.id,
            name: key.name,
            token: key.key_prefix + "...",
            expiresAt: key.expires_at,
            lastUsed: key.last_used_at || null,
            created: key.created_at ? new Date(key.created_at).toLocaleDateString() : "Unknown",
          }))

          setApiKeys(transformedKeys)
        }
      } catch (error) {
        logger.error("Failed to load API keys", error, {
          showToast: true,
          toastMessage: "Failed to load API keys",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndKeys()
  }, [walletAddress])

  const createKey = useCallback(
    async (name: string, expiration: ExpirationOption) => {
      if (!name.trim() || !currentUserId) return null

      const loadingToast = toast.loading("Creating API key...")

      try {
        const expirationDays = EXPIRATION_OPTIONS.find((opt) => opt.value === expiration)?.days
        const result = await apiKeysService.createKey(currentUserId, name, expirationDays)

        const newKey: ApiKey = {
          id: result.id,
          name: result.name,
          token: result.key, // Full token - will be shown once in modal
          expiresAt: result.expires_at,
          lastUsed: null,
          created: "just now",
        }

        setApiKeys((prev) => [newKey, ...prev])
        toast.dismiss(loadingToast)
        return newKey
      } catch (error) {
        toast.dismiss(loadingToast)
        logger.error("Failed to create API key", error, {
          showToast: true,
          toastMessage: "Failed to create API key",
        })
        return null
      }
    },
    [currentUserId]
  )

  const deleteKey = useCallback(async (id: string) => {
    try {
      await apiKeysService.deleteKey(id)
      setApiKeys((prev) => prev.filter((key) => key.id !== id))
      toast.success("API key deleted successfully")
      return true
    } catch (error) {
      logger.error("Failed to delete API key", error, {
        showToast: true,
        toastMessage: "Failed to delete API key",
      })
      return false
    }
  }, [])

  // Replace full token with prefix only (after user has seen it once)
  const hideFullToken = useCallback((id: string) => {
    setApiKeys((prev) =>
      prev.map((key) => {
        if (key.id === id && key.token.startsWith("tsr_")) {
          // Extract prefix (first 12 chars: "tsr_" + 8 chars)
          const prefix = key.token.substring(0, 12)
          return {
            ...key,
            token: prefix + "...",
          }
        }
        return key
      })
    )
  }, [])

  return {
    apiKeys,
    isLoading,
    currentUserId,
    createKey,
    deleteKey,
    hideFullToken,
  }
}
