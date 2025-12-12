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
import { motion } from "framer-motion"
import { AnimatedBackground } from "@/features/landing/components/AnimatedBackground"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

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
    <div className="min-h-screen bg-[#141619]">
      <AnimatedBackground />

      {/* Header with back button - same spacing as LandingHeader */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between pb-8">
          <div className="pl-12 pt-8">
            <Link
              href="/"
              className="group flex items-center gap-2 font-be-vietnam text-sm font-medium uppercase tracking-wide text-white transition-all hover:opacity-80"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-8">
        <motion.div
          className="text-center space-y-8"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.15 }}
        >
          {/* Logo Section */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-12"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-end gap-2">
              <span className="font-besley text-[72px] italic leading-none text-white">
                paper
              </span>
              <span className="font-be-vietnam text-[72px] font-extrabold leading-none text-white">
                lab.
              </span>
            </div>
            <Image
              src="/PaperLabLogo.png"
              alt="PaperLab Mascot"
              width={144}
              height={144}
              unoptimized
              className="object-contain"
            />
          </motion.div>

          {/* Title & Subtitle */}
          <motion.div
            className="space-y-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="font-be-vietnam text-[48px] font-bold text-white">
              AI Agent Gateway
            </h1>
            <p className="font-be-vietnam text-[18px] font-light text-white/80">
              Connect your wallet to access the dashboard
            </p>
          </motion.div>

          {/* Connect Button */}
          <motion.div
            className="mt-12"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(210, 171, 103, 0.4), 0 0 60px rgba(75, 118, 121, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
              className="inline-block"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(210, 171, 103, 0.2))',
              }}
            >
              <ConnectButton
                client={client}
                chain={avalancheFuji}
                wallets={wallets}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
