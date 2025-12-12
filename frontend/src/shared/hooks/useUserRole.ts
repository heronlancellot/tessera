"use client"

import { useState, useEffect } from "react"
import { useActiveAccount } from "thirdweb/react"
import { supabase } from "@/shared/utils/supabase"

export type UserRole = "user" | "admin" | "publisher"

export function useUserRole() {
  const account = useActiveAccount()
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserRole() {
      if (!account?.address) {
        console.log("No account address")
        setRole(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        console.log("Checking role for wallet:", account.address)

        // Query user by wallet address (case-insensitive comparison)
        const { data, error: queryError } = await supabase
          .from("users")
          .select("role")
          .ilike("wallet_address", account.address)
          .single()

        if (queryError) {
          console.error("Error fetching user role:", queryError)
          setError(queryError.message)
          setRole(null)
        } else {
          // The column name in the database is 'role', not 'user_role'
          setRole(data?.role || "user")
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        setRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [account?.address])

  return {
    role,
    isAdmin: role === "admin",
    isPublisher: role === "publisher",
    isLoading,
    error,
  }
}
