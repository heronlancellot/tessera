"use client"

import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react"
import { LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/dropdown-menu"
import { useState } from "react"
import { dropdownVariants, buttonHoverVariants } from "@/shared/utils/animations"
import { useRouter } from "next/navigation"

export function WalletButton() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  if (!account) return null

  const truncatedAddress = `${account.address.slice(0, 6)}...${account.address.slice(-4)}`

  const handleDisconnect = () => {
    if (wallet) {
      disconnect(wallet)
      router.push("/")
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="flex items-center gap-2 h-9 px-3 bg-card border rounded-lg hover:bg-accent transition-colors cursor-pointer"
          whileHover="hover"
          whileTap="tap"
          variants={buttonHoverVariants}
        >
          <div className="size-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
          <span className="text-sm font-medium">{truncatedAddress}</span>
        </motion.button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {open && (
          <DropdownMenuContent align="end" className="w-48" asChild forceMount>
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="cursor-pointer"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDisconnect}
              >
                <LogOut className="mr-2 size-4" />
                Disconnect
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}
