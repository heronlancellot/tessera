# Research Agent Example

AI agent using OpenAI + Tessera SDK to access paywalled content.

## What It Does

Agent with two tools:
- `preview_article` - Free preview of content
- `fetch_article` - Paid fetch (auto-pays with USDC)

## Quick Start

```bash
pnpm install
cp .env.example .env  # Add your keys
pnpm start "Summarize this article: http://localhost:8080/article/ai-agents-2025"
```

## Environment Variables

```env
AGENT_PRIVATE_KEY=0x...              # Wallet with USDC on Fuji
OPENAI_API_KEY=sk-...                # OpenAI API key
GATEWAY_URL=http://localhost:3001    # Tessera Gateway URL
```

## How It Works

1. User asks agent to summarize article
2. Agent calls `preview_article` tool (free)
3. Agent sees price and decides to pay
4. Agent calls `fetch_article` tool (auto-pays)
5. Agent receives full content as Markdown
6. Agent uses GPT-4o to generate summary

## Example Output

```
🤖 Research Agent starting...
📝 User query: Summarize this article: http://...

🔧 Calling tool: preview_article
   ✅ Preview received - Title: "How AI Agents...", Price: $0.10

🔧 Calling tool: fetch_article
   💰 Fetching full article (will pay with USDC)...
   ✅ Full article received (3359 chars)

📋 FINAL ANSWER:
The article discusses how AI agents are transforming...
```
