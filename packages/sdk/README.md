# Tessera SDK

TypeScript SDK for AI agents to access paywalled content via x402 micropayments.

## Installation

```bash
pnpm add @tessera-sdk/sdk
```

## Quick Start

```typescript
import { Tessera } from '@tessera-sdk/sdk'

const client = new Tessera({
  baseUrl: 'http://localhost:3001',
  privateKey: process.env.AGENT_PRIVATE_KEY  // Wallet with USDC
})

// Preview (free)
const preview = await client.preview('http://publisher.com/article/123')
console.log(preview.title, preview.price)

// Fetch (paid)
const content = await client.fetch('http://publisher.com/article/123')
console.log(content.markdown)
```

## API

### `new Tessera(config)`

```typescript
const client = new Tessera({
  baseUrl: string,         // Gateway URL
  privateKey: string,      // Wallet private key (0x...)
  apiKey?: string          // Optional API key
})
```

### `client.preview(url)`

Get free preview of content.

**Returns:** `{ url, title, preview, price, publisher, fetch_url }`

### `client.fetch(url)`

Fetch full content (auto-pays with USDC).

**Returns:** `{ url, markdown, title, publisher, price, paid, fetched_at }`

## How It Works

1. Agent calls `fetch()` → Gateway returns 402 Payment Required
2. SDK signs EIP-3009 TransferWithAuthorization (USDC)
3. SDK retries with `X-Payment` header
4. Gateway validates + returns content as Markdown

## Payment Details

- **Token**: USDC on Avalanche Fuji (`0x5425890298aed601595a70AB815c96711a31Bc65`)
- **Method**: EIP-3009 signature-based transfer (gasless)
- **Prices**: $0.05-$0.50 per article

## Example

See [examples/research-agent](../../examples/research-agent) for agent implementation.

## Development

```bash
pnpm build  # Build SDK
```
