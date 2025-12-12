"use client"

import { useState, useEffect } from "react"
import { useActiveAccount } from "thirdweb/react"
import { authService } from "@/shared/services/authService"
import type { Tables } from "@/shared/types/database"

export type User = Tables<"users">

export function useUser() {
  const account = useActiveAccount()
  const walletAddress = account?.address
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadUser() {
      if (!walletAddress) {
        setUser(null)
        return
      }

      setIsLoading(true)
      try {
        const userData = await authService.getUserByWallet(walletAddress)
        setUser(userData ? (userData as User) : null)
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [walletAddress])

  return {
    data: user,
    isLoading,
    isAdmin: user?.role === "admin",
    isPublisher: user?.role === "publisher",
  }
}
