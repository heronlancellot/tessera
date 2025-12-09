# Tessera Gateway

Express server handling x402 payments and content delivery for AI agents.

## Quick Start

```bash
pnpm install
cp .env.example .env  # Edit with your credentials
pnpm dev
```

Runs on `http://localhost:3001`

## Environment Variables

```env
PORT=3001
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your-anon-key
THIRDWEB_SECRET_KEY=your-secret-key
THIRDWEB_SERVER_WALLET_ADDRESS=0x...  # ERC4337 Smart Account
MERCHANT_WALLET_ADDRESS=0x...
PUBLISHER_TESSERA_KEY=demo-tessera-key
```

Get Thirdweb credentials: [thirdweb.com/dashboard](https://thirdweb.com/dashboard)

## Endpoints

### `GET /preview?url={url}`
Free content preview with pricing.

### `GET /fetch?url={url}`
Paid content fetch via x402 protocol.

**Flow:**
1. First request → 402 Payment Required
2. Agent signs payment
3. Second request with `X-Payment` header → 200 OK + content

## How It Works

1. Query Supabase for publisher/endpoint by hostname
2. Validate USDC payment via Thirdweb x402
3. Call publisher API with `X-Tessera-Key`
4. Convert HTML → Markdown
5. Return content

## Development

```bash
pnpm dev    # Watch mode
pnpm build  # Build
pnpm start  # Production
```

See [Root README](../../README.md) for full documentation.
