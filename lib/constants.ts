// Network Configuration
export const AVALANCHE_FUJI_CHAIN_ID = 43113;

// Token Addresses (Avalanche Fuji Testnet)
export const USDC_FUJI_ADDRESS = "0x5425890298aed601595a70AB815c96711a31Bc65" as `0x${string}`;

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
export const API_ENDPOINTS = {
  BASIC: `${API_BASE_URL}/api/basic`,
  PREMIUM: `${API_BASE_URL}/api/premium`,
} as const;

// Payment Amounts (USDC with 6 decimals)
export const PAYMENT_AMOUNTS = {
  BASIC: {
    amount: "10000", // $0.01 USDC
    bigInt: BigInt(10000),
  },
  PREMIUM: {
    amount: "150000", // $0.15 USDC
    bigInt: BigInt(150000),
  },
} as const;
