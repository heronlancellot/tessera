export interface TesseraConfig {
  /** Gateway base URL */
  baseUrl?: string
  /** API key for authentication */
  apiKey?: string
  /** Private key for signing x402 payments */
  privateKey?: string
}

export interface PreviewResponse {
  url: string
  title: string
  preview: string
  price: number
  publisher: string
  fetch_url: string
}

export interface FetchResponse {
  url: string
  markdown: string
  publisher: string
  fetched_at: string
}

export interface PaymentRequirements {
  x402Version: number
  accepts: PaymentOption[]
  error: string | null
}

export interface PaymentOption {
  scheme: string
  network: string
  maxAmountRequired: string
  resource: string
  description: string
  mimeType: string
  payTo: string
  maxTimeoutSeconds: number
  asset: string
  extra: {
    name: string
    version: string
  }
}
