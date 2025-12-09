# Tessera SDK

TypeScript SDK for AI agents to access paywalled content via x402 micropayments.

## ⚠️ Security Warning

**NEVER** hardcode private keys or API keys in your code. Always use environment variables:

```typescript
// ❌ DON'T - Keys will be exposed!
const client = new Tessera({
  privateKey: "0x1234..."
})

// ✅ DO - Keys stay secure
const client = new Tessera({
  privateKey: process.env.PRIVATE_KEY
})
```

**Server-Side Only**: This SDK should only be used in server-side code (Node.js). Using it in browser code will expose your private keys.

## Installation

```bash
pnpm add @tessera/sdk
# or
npm install @tessera/sdk
```

## Quick Start

```typescript
import { Tessera } from '@tessera/sdk'

// ✅ SECURE: Use environment variables
const client = new Tessera({
  gatewayUrl: process.env.GATEWAY_URL || 'http://localhost:3001',
  privateKey: process.env.AGENT_PRIVATE_KEY,  // From .env file
  apiKey: process.env.API_KEY                  // Optional
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
  gatewayUrl?: string,     // Gateway URL (default: http://localhost:3001)
  privateKey?: string,     // Wallet private key (0x...) - Required for fetch()
  apiKey?: string          // API key for authentication (optional)
})
```

**⚠️ Security Notes:**
- `privateKey` should **NEVER** be hardcoded - use `process.env.PRIVATE_KEY`
- `apiKey` is optional but recommended for production
- Both keys are stored as private properties and never logged

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

## Security

For detailed security information, see [SECURITY.md](./SECURITY.md).

**Key Points:**
- ✅ Keys are never hardcoded in the SDK
- ✅ Keys are passed as constructor parameters
- ✅ Private properties prevent accidental exposure
- ⚠️ You must handle keys securely in your application
- ⚠️ Never commit keys to version control

## Development

```bash
pnpm build  # Build SDK
pnpm dev    # Watch mode
pnpm test   # Run tests
```
