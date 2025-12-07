/**
 * SDK Test Script
 *
 * Prerequisites:
 * 1. Gateway running on localhost:3001
 * 2. Agent wallet with USDC on Avalanche Fuji testnet
 *
 * Usage:
 * Create test/.env with AGENT_PRIVATE_KEY=0x...
 * Then run: pnpm test
 */

import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Tessera } from '../src/index.js'

// Load .env from test folder
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '.env') })

const AGENT_PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY

if (!AGENT_PRIVATE_KEY) {
  console.error('Missing AGENT_PRIVATE_KEY env var')
  process.exit(1)
}

async function main() {
  console.log('Initializing Tessera SDK...\n')

  const tessera = new Tessera({
    baseUrl: 'http://localhost:3001',
    privateKey: AGENT_PRIVATE_KEY
  })

  const testUrl = 'https://example.com'

  // Test 1: Preview (free)
  console.log('1. Testing preview (free)...')
  try {
    const preview = await tessera.preview(testUrl)
    console.log('   Title:', preview.title)
    console.log('   Preview:', preview.preview.slice(0, 100) + '...')
    console.log('   Price: $' + preview.price)
    console.log('   Publisher:', preview.publisher)
    console.log('   ✅ Preview successful!\n')
  } catch (error) {
    console.error('   ❌ Preview failed:', error)
    process.exit(1)
  }

  // Test 2: Fetch (paid)
  console.log('2. Testing fetch (paid via x402)...')
  try {
    const content = await tessera.fetch(testUrl)
    console.log('   URL:', content.url)
    console.log('   Markdown:', content.markdown.slice(0, 100) + '...')
    console.log('   Publisher:', content.publisher)
    console.log('   Fetched at:', content.fetched_at)
    console.log('   ✅ Fetch successful! Payment was processed.\n')
  } catch (error) {
    console.error('   ❌ Fetch failed:', error)
    process.exit(1)
  }

  console.log('All tests passed! 🎉')
}

main().catch(console.error)
