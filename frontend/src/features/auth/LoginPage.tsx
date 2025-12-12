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
        <div className="flex items-center justify-between pb-6 sm:pb-7 md:pb-8">
          <div className="pl-4 pt-6 sm:pl-8 sm:pt-7 md:pl-12 md:pt-8">
            <Link
              href="/"
              className="group flex items-center gap-1.5 font-be-vietnam text-xs font-medium uppercase tracking-wide text-white transition-all hover:opacity-80 sm:gap-2 sm:text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 sm:h-4 sm:w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 md:px-8">
        <motion.div
          className="space-y-6 text-center sm:space-y-7 md:space-y-8"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.15 }}
        >
          {/* Logo Section */}
          <motion.div
            className="mb-8 flex flex-col items-center justify-center gap-3 sm:mb-10 sm:flex-row sm:gap-4 md:mb-12"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-end gap-1.5 sm:gap-2">
              <span className="font-besley text-[48px] italic leading-none text-white sm:text-[60px] md:text-[72px]">
                paper
              </span>
              <span className="font-be-vietnam text-[48px] font-extrabold leading-none text-white sm:text-[60px] md:text-[72px]">
                lab.
              </span>
            </div>
            <Image
              src="/PaperLabLogo.png"
              alt="PaperLab Mascot"
              width={144}
              height={144}
              unoptimized
              className="h-[100px] w-[100px] object-contain sm:h-[120px] sm:w-[120px] md:h-[144px] md:w-[144px]"
            />
          </motion.div>

          {/* Title & Subtitle */}
          <motion.div
            className="space-y-3 sm:space-y-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="font-be-vietnam text-[32px] font-bold text-white sm:text-[40px] md:text-[48px]">
              AI Agent Gateway
            </h1>
            <p className="font-be-vietnam text-[15px] font-light text-white/80 sm:text-[16px] md:text-[18px]">
              Connect your wallet to access the dashboard
            </p>
          </motion.div>

          {/* Connect Button */}
          <motion.div
            className="mt-8 sm:mt-10 md:mt-12"
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
