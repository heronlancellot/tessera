import type {
  TesseraConfig,
  PreviewResponse,
  FetchResponse,
  PaymentRequirements
} from './types.js'

const DEFAULT_BASE_URL = 'http://localhost:3001'

export class Tessera {
  private baseUrl: string
  private apiKey?: string
  private privateKey?: string

  constructor(config: TesseraConfig = {}) {
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL
    this.apiKey = config.apiKey
    this.privateKey = config.privateKey
  }

  /**
   * Get a preview of paywalled content (free)
   */
  async preview(url: string): Promise<PreviewResponse> {
    const response = await fetch(
      `${this.baseUrl}/preview?url=${encodeURIComponent(url)}`,
      {
        headers: this.buildHeaders()
      }
    )

    if (!response.ok) {
      throw new Error(`Preview failed: ${response.status}`)
    }

    return response.json() as Promise<PreviewResponse>
  }

  /**
   * Fetch full content (requires payment)
   * Automatically handles x402 payment flow
   */
  async fetch(url: string): Promise<FetchResponse> {
    // First request - get payment requirements
    const initialResponse = await fetch(
      `${this.baseUrl}/fetch?url=${encodeURIComponent(url)}`,
      {
        headers: this.buildHeaders()
      }
    )

    // If 200, content was free or already paid
    if (initialResponse.ok) {
      return initialResponse.json() as Promise<FetchResponse>
    }

    // If 402, need to pay
    if (initialResponse.status === 402) {
      const requirements = (await initialResponse.json()) as PaymentRequirements

      // Build and sign payment
      const paymentHeader = await this.buildPaymentHeader(requirements)

      // Retry with payment
      const paidResponse = await fetch(
        `${this.baseUrl}/fetch?url=${encodeURIComponent(url)}`,
        {
          headers: {
            ...this.buildHeaders(),
            'X-PAYMENT': paymentHeader
          }
        }
      )

      if (!paidResponse.ok) {
        throw new Error(`Fetch failed after payment: ${paidResponse.status}`)
      }

      return paidResponse.json() as Promise<FetchResponse>
    }

    throw new Error(`Fetch failed: ${initialResponse.status}`)
  }

  /**
   * Build payment header for x402
   * TODO: Implement actual signing with privateKey
   */
  private async buildPaymentHeader(
    requirements: PaymentRequirements
  ): Promise<string> {
    if (!this.privateKey) {
      throw new Error('Private key required for payments')
    }

    const paymentOption = requirements.accepts[0]
    if (!paymentOption) {
      throw new Error('No payment options available')
    }

    // TODO: Sign the payment with ethers/viem
    // For now, return a placeholder that will fail verification
    // This needs proper implementation with:
    // 1. Create EIP-3009 transferWithAuthorization signature
    // 2. Build payment payload
    // 3. Base64 encode

    const payload = {
      x402Version: 1,
      scheme: paymentOption.scheme,
      network: paymentOption.network,
      payload: {
        // EIP-3009 signature fields go here
        signature: 'TODO_IMPLEMENT_SIGNING'
      }
    }

    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }
}
