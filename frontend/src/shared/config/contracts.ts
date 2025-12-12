/**
 * Smart contract configuration
 */

// Token address (USDC on Avalanche Fuji testnet)
// TODO: Update with actual USDC address or your token
export const TOKEN_ADDRESS = "0x5425890298aed601595a70AB815c96711a31Bc65" // USDC Fuji

// Devs wallet address for fee splitting
// TODO: Update with actual devs wallet address
export const DEVS_ADDRESS = process.env.NEXT_PUBLIC_DEV_ADDRESS || "0x0000000000000000000000000000000000000000" // Replace with actual address

// Basis points (100 bps = 1%)
// Total must be <= 10000 (100%)
export const DEFAULT_PUBLISHER_BPS = 7000 // 70% for publisher
export const DEFAULT_DEVS_BPS = 3000 // 30% for devs
