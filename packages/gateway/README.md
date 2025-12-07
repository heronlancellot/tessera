# Tessera Gateway

**The bridge between AI agents and premium content.** Tessera Gateway enables publishers to monetize their paywalled content through automatic cryptocurrency micropayments using the x402 protocol.

## What is Tessera Gateway?

Tessera Gateway is an HTTP 402-compliant payment gateway that:

- ✅ Accepts x402 payment requests from AI agents
- ✅ Verifies USDC payments on Avalanche via Thirdweb
- ✅ Scrapes and converts paywalled content to clean markdown
- ✅ Returns content only after successful payment settlement

Publishers get paid. Agents get content. Zero human interaction required.

## Architecture

```
┌──────────────┐
│   AI Agent   │
│  (via SDK)   │
└──────┬───────┘
       │ GET /fetch?url=...
       ▼
┌──────────────────┐
│ Tessera Gateway  │
│                  │
│ ┌──────────────┐ │
│ │   Preview    │ │ ──▶ Free (no payment)
│ │   /preview   │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │    Fetch     │ │
│ │    /fetch    │ │
│ └──────┬───────┘ │
│        │         │
│   ┌────▼────┐    │
│   │  x402   │    │ ──▶ Verify payment via Thirdweb
│   │ Verify  │    │
│   └────┬────┘    │
│        │         │
│   ┌────▼────┐    │
│   │ Scraper │    │ ──▶ Fetch & clean HTML
│   └────┬────┘    │
│        │         │
│   ┌────▼────┐    │
│   │Convert  │    │ ──▶ HTML → Markdown
│   └─────────┘    │
└──────────────────┘
```

## Installation

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- Thirdweb account ([thirdweb.com](https://thirdweb.com))
- Avalanche wallet for receiving payments

### Setup

1. **Clone and install:**
   ```bash
   cd packages/gateway
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```bash
   PORT=3001

   # Thirdweb x402 Configuration
   THIRDWEB_SECRET_KEY=your_secret_key_here
   THIRDWEB_SERVER_WALLET_ADDRESS=0x...  # Your server wallet
   MERCHANT_WALLET_ADDRESS=0x...         # Where payments go
   ```

3. **Start the gateway:**
   ```bash
   pnpm dev  # Development mode with auto-reload
   # or
   pnpm build && pnpm start  # Production mode
   ```

Gateway will be running on `http://localhost:3001`

## API Endpoints

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-07T01:23:45.678Z"
}
```

### `GET /preview?url=<URL>`

Get a free preview of content (no payment required).

**Query Parameters:**
- `url` - The URL to preview (URL-encoded)

**Response (200 OK):**
```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "preview": "First ~200 characters of content...",
  "price": 0.10,
  "publisher": "example.com",
  "fetch_url": "/fetch?url=..."
}
```

### `GET /fetch?url=<URL>`

Fetch full content (requires x402 payment).

**Query Parameters:**
- `url` - The URL to fetch (URL-encoded)

**Headers:**
- `X-PAYMENT` - x402 payment header (base64-encoded payment payload)

**Flow:**

1. **First request (no payment):**
   ```bash
   curl http://localhost:3001/fetch?url=https://example.com/article
   ```

   **Response (402 Payment Required):**
   ```json
   {
     "x402Version": 1,
     "accepts": [{
       "scheme": "exact",
       "network": "eip155:43113",
       "maxAmountRequired": "100000",
       "resource": "http://localhost:3001/fetch?url=...",
       "payTo": "0x...",
       "asset": "0x5425890298aed601595a70AB815c96711a31Bc65",
       "maxTimeoutSeconds": 86400,
       "extra": {
         "name": "USD Coin",
         "version": "2"
       }
     }]
   }
   ```

2. **Second request (with payment):**
   ```bash
   curl -H "X-PAYMENT: <base64-payment-payload>" \
        http://localhost:3001/fetch?url=https://example.com/article
   ```

   **Response (200 OK):**
   ```json
   {
     "url": "https://example.com/article",
     "markdown": "# Article Title\n\nFull article content in markdown...",
     "publisher": "example.com",
     "fetched_at": "2025-12-07T01:23:45.678Z"
   }
   ```

## Payment Flow

```
Agent                Gateway              Thirdweb x402
  │                     │                      │
  ├─ GET /fetch ───────>│                      │
  │                     │                      │
  │<─── 402 + details ──┤                      │
  │                     │                      │
  │ (signs payment)     │                      │
  │                     │                      │
  ├─ GET + X-PAYMENT ───>│                      │
  │                     ├─ settlePayment() ───>│
  │                     │                      │
  │                     │                      │ (verifies signature)
  │                     │                      │ (executes USDC transfer)
  │                     │                      │
  │                     │<─── verified ────────┤
  │                     │ (scrapes content)    │
  │                     │ (converts to MD)     │
  │<─── 200 + content ──┤                      │
```

## Configuration

### Environment Variables

| Variable                          | Description                                    | Required |
|-----------------------------------|------------------------------------------------|----------|
| `PORT`                            | Server port                                    | No (3001)|
| `THIRDWEB_SECRET_KEY`             | Thirdweb API secret key                        | Yes      |
| `THIRDWEB_SERVER_WALLET_ADDRESS`  | Thirdweb server wallet address                 | Yes      |
| `MERCHANT_WALLET_ADDRESS`         | Address to receive USDC payments               | Yes      |

### Pricing Configuration

Edit `src/services/pricing.ts`:

```typescript
const DEFAULT_PRICES: Record<string, number> = {
  'medium.com': 0.10,   // $0.10 per article
  'nature.com': 0.50,   // $0.50 per article
  'nytimes.com': 0.25,  // $0.25 per article
}

const FALLBACK_PRICE = 0.10  // Default price
```

**Future:** Prices will be fetched from Supabase database per publisher configuration.

## Project Structure

```
packages/gateway/
├── src/
│   ├── index.ts              # Express server entry point
│   ├── routes/
│   │   ├── preview.ts        # GET /preview endpoint
│   │   └── fetch.ts          # GET /fetch endpoint (x402)
│   ├── services/
│   │   ├── scraper.ts        # HTML fetching
│   │   ├── converter.ts      # HTML → Markdown
│   │   └── pricing.ts        # Price lookup
│   └── middleware/
│       └── x402.ts           # Thirdweb x402 payment verification
├── .env.example
├── package.json
└── tsconfig.json
```

## Security

- ✅ **Payment verification:** All payments verified via Thirdweb x402 facilitator
- ✅ **Signature validation:** EIP-3009 signatures validated on-chain
- ✅ **No direct wallet access:** Server wallet only signs facilitator transactions
- ✅ **Environment isolation:** Sensitive keys in `.env` (gitignored)
- ⚠️  **CORS:** Currently allows all origins (configure for production)

## Troubleshooting

**Gateway won't start - "Missing THIRDWEB_SECRET_KEY"**
- Create `.env` file from `.env.example`
- Add your Thirdweb secret key from [thirdweb.com/dashboard](https://thirdweb.com/dashboard)

**402 responses but payment fails**
- Check `MERCHANT_WALLET_ADDRESS` is NOT `0x0000...`
- Verify `THIRDWEB_SERVER_WALLET_ADDRESS` matches your Thirdweb account
- Ensure server wallet has enough Fuji AVAX for gas fees

**Content not scraping correctly**
- Some sites block programmatic access (403/429 errors)
- Current scraper is basic - consider integrating Firecrawl for production

**"ERC20: transfer to the zero address" error**
- `MERCHANT_WALLET_ADDRESS` is set to zero address
- Update `.env` with valid wallet address

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode (auto-reload)
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## Deploying to Production

1. **Build the gateway:**
   ```bash
   pnpm build
   ```

2. **Set production environment variables**

3. **Run with PM2 or similar:**
   ```bash
   pm2 start dist/index.js --name tessera-gateway
   ```

4. **Expose via reverse proxy (nginx):**
   ```nginx
   location /api/ {
     proxy_pass http://localhost:3001/;
   }
   ```

## Learn More

- [Thirdweb x402 Documentation](https://portal.thirdweb.com/payments/x402)
- [HTTP 402 Payment Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)
- [x402 Protocol Specification](https://github.com/coinbase/x402)
- [Tessera SDK](../sdk/README.md)

## License

Apache 2.0
