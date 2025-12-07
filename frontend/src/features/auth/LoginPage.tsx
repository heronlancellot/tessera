"use client"

import { createThirdwebClient } from "thirdweb"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { avalancheFuji } from "thirdweb/chains"
import { authService } from "@/shared/services/authService"
import { logger } from "@/shared/utils/logger"
import { toast } from "@/shared/utils/toast"

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
})

export function LoginPage() {
  const account = useActiveAccount()
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    async function authenticateWallet() {
      if (!account) return
      if (isAuthenticating) return

      setIsAuthenticating(true)
      try {
        logger.debug("Authenticating wallet", { address: account.address })
        const user = await authService.upsertWalletUser(account.address)
        logger.debug("User authenticated", { user })
        toast.success("Welcome!", "Wallet connected successfully")
        router.push("/dashboard")
      } catch (error) {
        logger.error("Failed to authenticate wallet", error, {
          showToast: true,
          toastMessage: "Authentication failed",
        })
        // Deixa redirecionar mesmo com erro (para desenvolvimento)
        router.push("/dashboard")
      }
    }

    authenticateWallet()
  }, [account, isAuthenticating, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h1 className="text-4xl font-bold mb-2">Tessera</h1>
          <p className="text-muted-foreground">AI Agent Gateway</p>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your wallet to access the dashboard
          </p>
        </div>
        <ConnectButton client={client} chain={avalancheFuji} />
      </div>
    </div>
  )
}
