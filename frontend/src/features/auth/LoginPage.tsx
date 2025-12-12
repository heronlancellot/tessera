"use client"

import { createThirdwebClient } from "thirdweb"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { createWallet } from "thirdweb/wallets"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { avalancheFuji } from "thirdweb/chains"
import { authService } from "@/shared/services/authService"
import { logger } from "@/shared/utils/logger"
import { toast } from "@/shared/utils/toast"

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
})

// Configure wallets - apenas wallets Web3, sem login social
const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("com.trustwallet.app"),
]

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
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#545454' }}>
      <div className="text-center space-y-8 p-12">
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-end gap-1">
            <span
              className="text-white font-serif italic leading-none"
              style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '5rem', fontWeight: '400' }}
            >
              paper
            </span>
            <span
              className="text-white font-bold leading-none"
              style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: '5rem' }}
            >
              lab.
            </span>
          </div>
          <img
            src="/PaperLabLogo.png"
            alt="PaperLab Mascot"
            className="size-36 object-contain"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-4 mb-8">
          <p
            className="text-white text-3xl font-semibold"
            style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}
          >
            AI Agent Gateway
          </p>
          <p
            className="text-white/70 text-lg"
            style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}
          >
            Connect your wallet to access the dashboard
          </p>
        </div>

        {/* Connect Button - apenas wallets Web3, sem login social */}
        <div className="mt-8">
          <ConnectButton 
            client={client} 
            chain={avalancheFuji}
            wallets={wallets}
          />
        </div>

      </div>
    </div>
  )
}
