import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts'
import { avalancheFuji } from 'viem/chains'
import { toHex, type Hex } from 'viem'
import type {
  TesseraConfig,
  PreviewResponse,
  FetchResponse,
  PaymentRequirements,
  PaymentOption
} from './types.js'

const DEFAULT_BASE_URL = 'http://localhost:3001'

export class Tessera {
  private baseUrl: string
  private apiKey?: string
  private account?: PrivateKeyAccount

  constructor(config: TesseraConfig = {}) {
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL
    this.apiKey = config.apiKey

    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey as Hex)
    }
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
    const fetchUrl = `${this.baseUrl}/fetch?url=${encodeURIComponent(url)}`

    // First request - get payment requirements
    const initialResponse = await fetch(fetchUrl, {
      headers: this.buildHeaders()
    })

    // If 200, content was free or already paid
    if (initialResponse.ok) {
      return initialResponse.json() as Promise<FetchResponse>
    }

    // If 402, need to pay
    if (initialResponse.status === 402) {
      const requirements = (await initialResponse.json()) as PaymentRequirements

      // Select first payment option (should be USDC on Fuji)
      const paymentOption = requirements.accepts[0]
      if (!paymentOption) {
        throw new Error('No payment options available')
      }

      // Build and sign payment
      const paymentHeader = await this.buildPaymentHeader(paymentOption, requirements.x402Version)

      // Retry with payment
      const paidResponse = await fetch(fetchUrl, {
        headers: {
          ...this.buildHeaders(),
          'X-PAYMENT': paymentHeader
        }
      })

      if (!paidResponse.ok) {
        const error = await paidResponse.text()
        throw new Error(`Fetch failed after payment: ${paidResponse.status} - ${error}`)
      }

      return paidResponse.json() as Promise<FetchResponse>
    }

    throw new Error(`Fetch failed: ${initialResponse.status}`)
  }

  /**
   * Build payment header for x402 using EIP-3009 TransferWithAuthorization
   */
  private async buildPaymentHeader(
    paymentOption: PaymentOption,
    x402Version: number
  ): Promise<string> {
    if (!this.account) {
      throw new Error('Private key required for payments. Initialize Tessera with privateKey option.')
    }

    // Generate random nonce (32 bytes)
    const nonce = toHex(crypto.getRandomValues(new Uint8Array(32)))

    // Time window for authorization
    const now = Math.floor(Date.now() / 1000)
    const validAfter = BigInt(now - 86400) // 24h before
    const validBefore = BigInt(now + paymentOption.maxTimeoutSeconds)

    // Sign EIP-3009 TransferWithAuthorization
    const signature = await this.account.signTypedData({
      domain: {
        name: paymentOption.extra.name,
        version: paymentOption.extra.version,
        chainId: avalancheFuji.id,
        verifyingContract: paymentOption.asset as Hex
      },
      types: {
        TransferWithAuthorization: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'validAfter', type: 'uint256' },
          { name: 'validBefore', type: 'uint256' },
          { name: 'nonce', type: 'bytes32' }
        ]
      },
      primaryType: 'TransferWithAuthorization',
      message: {
        from: this.account.address,
        to: paymentOption.payTo as Hex,
        value: BigInt(paymentOption.maxAmountRequired),
        validAfter,
        validBefore,
        nonce
      }
    })

    // Build x402 payment payload
    const payload = {
      x402Version,
      scheme: paymentOption.scheme,
      network: paymentOption.network,
      payload: {
        signature,
        authorization: {
          from: this.account.address,
          to: paymentOption.payTo,
          value: paymentOption.maxAmountRequired,
          validAfter: validAfter.toString(),
          validBefore: validBefore.toString(),
          nonce
        }
      }
    }

    // Encode as base64
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
