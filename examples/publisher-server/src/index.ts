/**
 * Publisher Server - Simulates Medium
 *
 * This server emulates how Medium would provide API endpoints
 * to Tessera after making a partnership agreement.
 */

import express from 'express'
import cors from 'cors'

const app = express()
// Use PORT from environment (Vercel provides this) or default to 8080 for local dev
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

// Simulates: Medium provides this endpoint to Tessera partners
app.get('/tessera/articles/:id', (req, res) => {
  const { id } = req.params

  // Simulate authentication (in real scenario, Tessera would have a secret key)
  const tesseraKey = req.headers['x-tessera-key']
  const validKey = process.env.PUBLISHER_TESSERA_KEY || 'demo-tessera-key-for-publisher-auth'

  if (!tesseraKey) {
    return res.status(401).json({ error: 'Missing X-Tessera-Key header' })
  }

  if (tesseraKey !== validKey) {
    return res.status(401).json({ error: 'Invalid X-Tessera-Key' })
  }

  // Return premium article content (no paywall for Tessera partners)
  res.json({
    id,
    title: 'How AI Agents Are Transforming Content Consumption',
    subtitle: 'The rise of autonomous agents and blockchain-based micropayments',
    author: {
      name: 'Jane Doe',
      avatar: 'https://miro.medium.com/v2/resize:fill:88:88/1*dmbNkD5D-u45r44go_cf0g.png',
      bio: 'Tech journalist covering AI and Web3'
    },
    publisher: 'Medium',
    published_at: '2025-01-07T10:00:00Z',
    read_time_minutes: 8,
    tags: ['AI', 'Blockchain', 'Web3', 'Content Economy'],
    featured_image: 'https://miro.medium.com/v2/resize:fit:1400/1*example.jpg',
    content: `
      <article>
        <h1>How AI Agents Are Transforming Content Consumption</h1>

        <p class="lead">
          Artificial intelligence agents are revolutionizing how we access and consume premium content.
          With blockchain-based micropayments, AI agents can now autonomously pay for articles,
          research papers, and other digital content without human intervention.
        </p>

        <h2>The Problem with Traditional Paywalls</h2>
        <p>
          For decades, publishers have struggled with the paywall dilemma. Hard paywalls block
          potential readers, while soft paywalls are easily bypassed. Subscription fatigue has
          set in, with users unwilling to maintain dozens of monthly subscriptions for occasional
          access to premium content.
        </p>

        <h2>Enter AI Agents and Micropayments</h2>
        <p>
          AI agents change this dynamic entirely. These autonomous software programs can:
        </p>
        <ul>
          <li>Browse the web looking for relevant information</li>
          <li>Evaluate content quality through previews</li>
          <li>Make payment decisions based on relevance and budget</li>
          <li>Process cryptocurrency micropayments instantly</li>
          <li>Aggregate information from multiple sources</li>
        </ul>

        <h2>How It Works: The Tessera Model</h2>
        <p>
          Platforms like Tessera are pioneering this new content economy. Here's the flow:
        </p>
        <ol>
          <li>Publishers partner with Tessera and provide API endpoints</li>
          <li>AI agents query Tessera's gateway for content previews</li>
          <li>Agents evaluate if content is worth the price (typically $0.05-$0.50)</li>
          <li>Agents authorize USDC payment via EIP-3009 signature</li>
          <li>Tessera settles payment and delivers full content</li>
          <li>Publishers receive their share automatically</li>
        </ol>

        <h2>Benefits for Publishers</h2>
        <p>
          This model offers several advantages over traditional paywalls:
        </p>
        <ul>
          <li><strong>Instant Revenue:</strong> Get paid per article, not per subscription</li>
          <li><strong>Global Reach:</strong> AI agents access content worldwide without friction</li>
          <li><strong>Fair Pricing:</strong> Charge based on content value, not access time</li>
          <li><strong>No Subscription Management:</strong> Tessera handles payments and compliance</li>
          <li><strong>Analytics:</strong> Understand which content AI systems value most</li>
        </ul>

        <h2>The Future of Content Monetization</h2>
        <p>
          As AI agents become more prevalent, content consumption patterns will shift dramatically.
          Instead of humans subscribing to dozens of publications, AI agents will act as intelligent
          intermediaries, paying only for content that matches their users' needs.
        </p>

        <p>
          This creates a more efficient market where quality content is rewarded directly,
          and publishers can focus on creating value rather than managing subscription churn.
        </p>

        <h2>Getting Started</h2>
        <p>
          Publishers interested in partnering with platforms like Tessera can start by:
        </p>
        <ol>
          <li>Setting up API endpoints for premium content</li>
          <li>Defining pricing tiers ($0.05 for news, $0.50 for research, etc.)</li>
          <li>Integrating with payment gateways</li>
          <li>Monitoring agent access patterns and revenue</li>
        </ol>

        <blockquote>
          "The future of content isn't subscription-based or ad-supported. It's micropayments
          powered by AI agents that know what we need before we do." - Alex Chen, Digital Media Analyst
        </blockquote>

        <h2>Conclusion</h2>
        <p>
          The convergence of AI agents and blockchain-based micropayments represents a paradigm
          shift in content monetization. Publishers who embrace this model early will be
          well-positioned for the agent-driven content economy of tomorrow.
        </p>

        <p>
          As we move toward a world where AI agents handle more of our information gathering,
          systems like Tessera ensure that creators and publishers are fairly compensated for
          their work while maintaining the open, accessible nature of the web.
        </p>
      </article>
    `,
    word_count: 650,
    claps: 1247,
    responses: 43
  })
})

// Public article page (with paywall - for preview scraping)
app.get('/article/:id', (req, res) => {
  const { id } = req.params

  // Return HTML page with paywall
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>How AI Agents Are Transforming Content Consumption - Medium</title>
      <meta name="description" content="The rise of autonomous agents and blockchain-based micropayments">
    </head>
    <body>
      <article>
        <h1>How AI Agents Are Transforming Content Consumption</h1>
        <p class="subtitle">The rise of autonomous agents and blockchain-based micropayments</p>

        <div class="author">
          <span>Jane Doe</span> · 8 min read · Jan 7, 2025
        </div>

        <img src="https://miro.medium.com/v2/resize:fit:1400/1*example.jpg" alt="Featured image">

        <p>
          Artificial intelligence agents are revolutionizing how we access and consume premium content.
          With blockchain-based micropayments, AI agents can now autonomously pay for articles,
          research papers, and other digital content without human intervention.
        </p>

        <div class="paywall">
          <h2>Read the full story</h2>
          <p>Sign in to continue reading this premium content from Medium.</p>
          <button>Sign in</button>
          <button>Start free trial</button>
        </div>
      </article>
    </body>
    </html>
  `)
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    publisher: 'Medium (simulated)',
    message: 'Publisher API is running'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    publisher: 'Medium',
    message: 'Publisher API - Partner with Tessera',
    endpoints: [
      {
        path: '/tessera/articles/:id',
        method: 'GET',
        description: 'Get premium article content',
        auth: 'X-Tessera-Key header required'
      }
    ]
  })
})

// Only start server if not in Vercel (Vercel handles this automatically)
// In Vercel, export the app as a serverless function
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`📰 Publisher Server (Medium) running on http://localhost:${PORT}`)
    console.log(`📚 Endpoint: http://localhost:${PORT}/tessera/articles/:id`)
  })
}

// Export for Vercel serverless functions
export default app
