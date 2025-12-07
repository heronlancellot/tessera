import { Router, Request, Response } from 'express'
import type { Router as RouterType } from 'express'
import { fetchHtml } from '../services/scraper.js'
import { htmlToMarkdown } from '../services/converter.js'
import { getPrice } from '../services/pricing.js'

export const previewRouter: RouterType = Router()

// GET /preview?url=https://medium.com/article-xyz
previewRouter.get('/', async (req: Request, res: Response) => {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Missing url parameter' })
    return
  }

  try {
    // Validate URL
    const parsedUrl = new URL(url)

    // Fetch HTML from publisher
    const html = await fetchHtml(url)

    // Convert to markdown (pass URL for proper link resolution)
    const markdown = htmlToMarkdown(html, url)

    // Get first ~500 chars as preview
    const preview = markdown.slice(0, 500) + (markdown.length > 500 ? '...' : '')

    // Get price for this URL
    const price = await getPrice(parsedUrl.hostname)

    res.json({
      url,
      title: extractTitle(html),
      preview,
      price,
      publisher: parsedUrl.hostname,
      fetch_url: `/fetch?url=${encodeURIComponent(url)}`
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? match[1].trim() : 'Untitled'
}
