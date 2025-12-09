"use client"

import { useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const account = useActiveAccount()
  const router = useRouter()

  useEffect(() => {
    if (!account) {
      router.push("/")
    }
  }, [account, router])

  if (!account) {
    return null
  }

  return <>{children}</>
}
