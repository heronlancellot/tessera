# Tessera

> AI agent gateway for paywalled content using x402 protocol and cryptocurrency micropayments

Tessera enables AI agents to autonomously access premium content from publishers using blockchain-based micropayments. Publishers integrate via API endpoints, and AI agents pay per article using USDC on Avalanche Fuji testnet.

## Overview

**The Problem:** Traditional paywalls create friction for AI agents accessing premium content. Subscriptions don't make sense for one-time article access.

**The Solution:** Tessera provides a gateway that:
- Allows AI agents to preview content for free
- Handles automatic micropayments (typically $0.05-$0.50 per article)
- Delivers full content after payment verification
- Tracks analytics and usage for publishers

## Architecture


```
┌─────────────────┐
│   AI Agent      │  (research-agent example)
│   + SDK         │
└────────┬────────┘
         │ 1. Request preview (free)
         │ 2. Pay with USDC signature
         │ 3. Receive full content
         ↓
┌─────────────────┐
│   Gateway       │  (Express + x402 middleware)
│  (port 3001)    │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
         ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Supabase    │  │  Thirdweb    │  │  Publisher   │
│  (pricing    │  │  (payment    │  │  API         │
│   lookup)    │  │   settle)    │  │  (content)   │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Key Features

- **Preview System**: AI agents can preview pages to evaluate content before paying
- **x402 Payments**: Standard HTTP 402 Payment Required protocol with crypto micropayments
- **Dynamic Pricing**: Publishers configure prices per endpoint
- **Publisher Auth**: API key authentication for content delivery
- **EIP-3009**: Gasless USDC transfers using signature-based authorization

## Project Structure

```
tessera/
├── packages/
│   ├── gateway/          # Express server handling x402 payments
│   └── sdk/              # TypeScript SDK for AI agents
├── examples/
│   ├── publisher-server/ # Mock publisher API (simulates Medium)
│   └── research-agent/   # AI agent using OpenAI + Tessera SDK
└── backend/
    └── supabase/         # Database migrations and seed data
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase CLI
- Docker (for local Supabase)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Supabase (Database)

```bash
cd backend
npx supabase start # (or pnpm db:start)
```

This will output your local Supabase credentials. Copy the `API URL` and `anon key`.

### 3. Configure Gateway

```bash
cd packages/gateway
cp .env.example .env
```

Edit `.env` and fill in:

```env
PORT=3001
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your-anon-key-from-step-2

# Get these from Thirdweb Dashboard (https://thirdweb.com/dashboard)
THIRDWEB_SECRET_KEY=your-secret-key
THIRDWEB_SERVER_WALLET_ADDRESS=your-facilitator-address  # ERC4337 Smart Account
MERCHANT_WALLET_ADDRESS=your-merchant-wallet             # Where payments go

# Publisher API authentication
PUBLISHER_TESSERA_KEY=demo-tessera-key
```

**Thirdweb Setup:**
1. Go to [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create a project and get your Secret Key
3. In "Server Wallets", enable **ERC4337 Smart Account** on Avalanche Fuji
4. Copy the smart account address as `THIRDWEB_SERVER_WALLET_ADDRESS`
5. Send some AVAX testnet to that address for gas fees

### 4. Start Gateway

```bash
cd packages/gateway
pnpm dev
```

Gateway will run on `http://localhost:3001`

### 5. Start Publisher Server (Demo)

```bash
cd examples/publisher-server
pnpm dev
```

Publisher API will run on `http://localhost:8080`

### 6. Test with Research Agent

```bash
cd examples/research-agent
cp .env.example .env
```

Edit `.env`:

```env
AGENT_PRIVATE_KEY=your-wallet-private-key  # Wallet with USDC on Fuji
OPENAI_API_KEY=your-openai-api-key
GATEWAY_URL=http://localhost:3001
```

Run the agent:

```bash
pnpm start "Summarize this article: http://localhost:8080/article/ai-agents-2025"
```

Expected output:
```
🤖 Research Agent starting...
📄 Fetching preview (free)...
✅ Preview received - Title: "How AI Agents Are...", Price: $0.10
💰 Fetching full article (will pay with USDC)...
✅ Full article received (3359 chars)
📋 FINAL ANSWER: [AI-generated summary]
```

## How It Works

### 1. Preview Flow (Free)

```
Agent → GET /preview?url=http://publisher.com/article/123
      ← { title, preview, price, fetch_url }
```

Gateway scrapes the public page and returns a preview with pricing info.

### 2. Payment Flow

```
Agent → GET /fetch?url=http://publisher.com/article/123
      ← 402 Payment Required
         {
           "accepts": [{
             "payTo": "0x...",
             "amount": "100000",  // $0.10 in USDC (6 decimals)
             "extra": { /* EIP-3009 params */ }
           }]
         }

Agent signs EIP-3009 TransferWithAuthorization
Agent → GET /fetch?url=...
        Headers: { "X-Payment": "base64-encoded-signature" }

Gateway verifies signature with Thirdweb
Gateway calls Publisher API with X-Tessera-Key
Gateway converts HTML → Markdown

Agent ← 200 OK { url, markdown, title, publisher, price, paid: true }
```

## API Endpoints

### Gateway API

- `GET /preview?url={url}` - Free content preview
- `GET /fetch?url={url}` - Paid content fetch (requires x402 payment)

### Publisher Integration

Publishers expose an API endpoint (e.g., `/tessera/articles/:id`) that:
1. Validates `X-Tessera-Key` header
2. Returns article content as JSON with `title` and `content` (HTML)

See [examples/publisher-server](examples/publisher-server) for reference implementation.

## License

MIT
