import { Router, Request, Response } from 'express'
import type { Router as RouterType } from 'express'
import { fetchHtml } from '../services/scraper.js'
import { htmlToMarkdown } from '../services/converter.js'
import { getPrice } from '../services/pricing.js'
import { settleX402Payment, isX402Configured } from '../middleware/x402.js'

export const fetchRouter: RouterType = Router()

// GET /fetch?url=https://medium.com/article-xyz
fetchRouter.get('/', async (req: Request, res: Response) => {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Missing url parameter' })
    return
  }

  // Check if x402 is configured
  if (!isX402Configured()) {
    res.status(500).json({
      error: 'x402 not configured. Set THIRDWEB_SECRET_KEY, THIRDWEB_SERVER_WALLET_ADDRESS, MERCHANT_WALLET_ADDRESS'
    })
    return
  }

  try {
    const parsedUrl = new URL(url)
    const price = await getPrice(parsedUrl.hostname)

    // Get payment header
    const paymentData = req.headers['x-payment'] as string | null

    // Build resource URL for x402
    const resourceUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`

    // Settle payment using Thirdweb x402
    const result = await settleX402Payment(paymentData, resourceUrl, price)

    // If not 200, return the payment required response
    if (result.status !== 200) {
      res.status(result.status).json(result.responseBody)
      return
    }

    // Payment successful - fetch and return full content
    const html = await fetchHtml(url)
    const markdown = htmlToMarkdown(html, url)

    res.json({
      url,
      markdown,
      publisher: parsedUrl.hostname,
      fetched_at: new Date().toISOString()
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})
