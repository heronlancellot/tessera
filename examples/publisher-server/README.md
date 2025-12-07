# Publisher Server Example

Mock publisher API simulating how Medium would integrate with Tessera.

## What It Does

Provides two endpoints:
1. **Public page** (`/article/:id`) - HTML with paywall (for preview scraping)
2. **Partner API** (`/tessera/articles/:id`) - Full content JSON (requires auth)

## Quick Start

```bash
pnpm install
pnpm dev
```

Runs on `http://localhost:8080`

## Endpoints

### `GET /article/:id`
Public HTML page with paywall. Gateway scrapes this for previews.

```bash
curl http://localhost:8080/article/ai-agents-2025
```

### `GET /tessera/articles/:id`
Partner API endpoint for Tessera Gateway.

**Headers:**
- `X-Tessera-Key: demo-tessera-key`

**Response:**
```json
{
  "id": "ai-agents-2025",
  "title": "How AI Agents Are Transforming...",
  "content": "<article>...</article>"
}
```

## Integration Pattern

Real publishers would:
1. Create `/tessera/articles/:id` endpoint
2. Validate `X-Tessera-Key` header
3. Return full content as JSON
4. Register endpoint + pricing in Tessera
