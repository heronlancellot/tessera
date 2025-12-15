import { Router, Request, Response } from 'express'
import type { Router as RouterType } from 'express'
import { htmlToMarkdown } from '../services/converter.js'
import { getEndpointByHostname } from '../services/pricing.js'
import { settleX402Payment, isX402Configured } from '../middleware/x402.js'
import { logRequest } from '../services/analytics.js'

export const fetchRouter: RouterType = Router()

// GET /fetch?url=https://medium.com/article-xyz
fetchRouter.get('/', async (req: Request, res: Response) => {
  const { url } = req.query
  const startTime = Date.now()

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
    console.log('parsedUrl', parsedUrl)

    // Get endpoint info from Supabase (pass hostname and pathname for slug matching)
    const endpointInfo = await getEndpointByHostname(parsedUrl)

    console.log('endpointInfo', endpointInfo)
    // Publisher not integrated with Tessera
    if (!endpointInfo) {
      res.status(404).json({
        error: 'Publisher not found',
        message: `This publisher (${parsedUrl.hostname}) is not integrated with Tessera yet. The publisher may need to be approved and have an endpoint configured.`,
        hostname: parsedUrl.hostname,
        hint: 'Check if the publisher exists in the database and has an active endpoint configured.'
      })
      return
    }

    // Free content - return error (agents should use regular web scraping for free content)
    if (endpointInfo.price_usd === 0) {
      res.status(400).json({
        error: 'Free content',
        message: 'This content is free. Use a web scraping service instead.',
        publisher: endpointInfo.publisher.name,
        price: 0
      })
      return
    }

    // Paid content - process payment
    const paymentData = req.headers['x-payment'] as string | null
    const resourceUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`

    // Get publisher's wallet address for payment recipient
    // If publisher has a wallet_address, use it; otherwise fallback to MERCHANT_WALLET_ADDRESS
    const payTo = endpointInfo.publisher.contract_address
    // Settle payment using Thirdweb x402
    // Payment goes to publisher's wallet if available, otherwise to merchant wallet
    const result = await settleX402Payment(
      paymentData,
      resourceUrl,
      endpointInfo.price_usd,
      payTo
    )

    // If not 200, return the payment required response
    if (result.status !== 200) {
      res.status(result.status).json(result.responseBody)
      return
    }

    // Payment successful - fetch content from publisher's API
    // Use the endpoint path directly as configured in the database
    const publisherApiUrl = endpointInfo.path

    console.log(`[fetch] Request URL: ${url}`)
    console.log(`[fetch] Calling publisher API: ${publisherApiUrl}`)

    // Call publisher's API with Tessera auth key
    const publisherResponse = await fetch(publisherApiUrl, {
      headers: {
        'X-Tessera-Key': process.env.PUBLISHER_TESSERA_KEY || 'demo-tessera-key-for-publisher-auth'
      }
    })

    if (!publisherResponse.ok) {
      throw new Error(`Publisher API error: ${publisherResponse.status} ${publisherResponse.statusText}`)
    }

    const publisherData = await publisherResponse.json() as {
      title?: string
      content?: string
      markdown?: string
      [key: string]: any
    }

    // Convert HTML content to markdown
    const markdown = publisherData.content
      ? htmlToMarkdown(publisherData.content, url)
      : publisherData.markdown || 'No content available'

    // Log successful request
    if (req.userId && req.apiKeyId) {
      logRequest({
        userId: req.userId,
        apiKeyId: req.apiKeyId,
        requestType: 'fetch',
        url,
        endpointId: endpointInfo.id,
        amountUsd: endpointInfo.price_usd,
        txHash: result.paymentReceipt?.transaction,
        status: 'completed',
        responseTimeMs: Date.now() - startTime
      })
    }

    res.json({
      url,
      markdown,
      title: publisherData.title,
      publisher: endpointInfo.publisher.name,
      price: endpointInfo.price_usd,
      paid: true,
      fetched_at: new Date().toISOString()
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Fetch error:', error)

    // Log failed request
    if (req.userId && req.apiKeyId) {
      logRequest({
        userId: req.userId,
        apiKeyId: req.apiKeyId,
        requestType: 'fetch',
        url: url as string,
        amountUsd: 0, // Failed, no charge
        status: 'failed',
        errorMessage: message,
        responseTimeMs: Date.now() - startTime
      })
    }

    res.status(500).json({ error: message })
  }
})
