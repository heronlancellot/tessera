/**
 * x402 Payment Middleware using Thirdweb
 *
 * Uses the same pattern as app/api/premium/route.ts
 */

import { settlePayment, facilitator } from 'thirdweb/x402'
import { createThirdwebClient } from 'thirdweb'
import { avalancheFuji } from 'thirdweb/chains'

// USDC on Avalanche Fuji testnet
const USDC_FUJI_ADDRESS = '0x5425890298aed601595a70AB815c96711a31Bc65'

// Lazy-initialized client and facilitator
let _client: ReturnType<typeof createThirdwebClient> | null = null
let _facilitator: ReturnType<typeof facilitator> | null = null

function getClient() {
  if (!_client) {
    _client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY!
    })
  }
  return _client
}

function getFacilitator() {
  if (!_facilitator) {
    _facilitator = facilitator({
      client: getClient(),
      serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET_ADDRESS!
    })
  }
  return _facilitator
}

export interface PaymentReceipt {
  success: boolean
  transaction: string
  network: string
  payer: string
}

export interface SettleResult {
  status: number
  responseBody?: unknown
  responseHeaders?: Record<string, string>
  paymentReceipt?: PaymentReceipt
}

/**
 * Settle a payment using Thirdweb x402
 * Returns the settlement result with status
 * 
 * @param paymentData - The x402 payment data from client
 * @param resourceUrl - The URL of the resource being accessed
 * @param priceUsd - The price in USD
 * @param payTo - Optional wallet address to receive payment. If not provided, uses MERCHANT_WALLET_ADDRESS
 */
export async function settleX402Payment(
  paymentData: string | null,
  resourceUrl: string,
  priceUsd: number,
  payTo?: string | null
): Promise<SettleResult> {
  // Use publisher's wallet address if provided, otherwise fallback to merchant wallet
  const recipientAddress = payTo || process.env.MERCHANT_WALLET_ADDRESS!

  if (!recipientAddress) {
    throw new Error('No payment recipient address available. Set MERCHANT_WALLET_ADDRESS or provide payTo parameter.')
  }
  
  const result = await settlePayment({
    resourceUrl,
    method: 'GET',
    paymentData,
    payTo: recipientAddress,
    network: avalancheFuji,
    price: {
      amount: usdToUsdc(priceUsd).toString(),
      asset: {
        address: USDC_FUJI_ADDRESS
      }
    },
    facilitator: getFacilitator()
  })

  return result as SettleResult
}

/**
 * Check if we have the required env vars for x402
 */
export function isX402Configured(): boolean {
  return !!(
    process.env.THIRDWEB_SECRET_KEY &&
    process.env.THIRDWEB_SERVER_WALLET_ADDRESS &&
    process.env.MERCHANT_WALLET_ADDRESS
  )
}

/**
 * Convert USD to USDC atomic units (6 decimals)
 */
function usdToUsdc(usd: number): bigint {
  return BigInt(Math.round(usd * 1_000_000))
}
