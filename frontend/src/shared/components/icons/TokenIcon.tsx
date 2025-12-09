import { cn } from "@/shared/utils/utils"
import Image from "next/image"

interface TokenIconProps {
  symbol?: string
  src?: string
  className?: string
  size?: number
}

export function TokenIcon({ symbol = "USDC", src, className, size = 16 }: TokenIconProps) {
  const tokenSrc = src || "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"

  return (
    <Image
      src={tokenSrc}
      alt={symbol}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full", className)}
    />
  )
}
