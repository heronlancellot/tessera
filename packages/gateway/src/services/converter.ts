/**
 * HTML to Markdown converter
 *
 * Uses Mozilla Readability to extract main content (removing ads, nav, etc)
 * and Turndown to convert the clean HTML to Markdown.
 *
 * Based on Firecrawl's approach: https://github.com/firecrawl/firecrawl
 */

import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

export function htmlToMarkdown(html: string, url?: string): string {
  try {
    // 1. Parse HTML with JSDOM
    const dom = new JSDOM(html, { url })

    // 2. Extract main content with Readability (removes ads, nav, footers, etc)
    const reader = new Readability(dom.window.document)
    const article = reader.parse()

    if (!article) {
      // Fallback: if Readability can't parse, use the whole HTML
      return convertHtmlToMarkdown(html)
    }

    // 3. Convert clean HTML to Markdown with Turndown
    const markdown = convertHtmlToMarkdown(article.content || '')

    // Optional: prepend title if available
    if (article.title) {
      return `# ${article.title}\n\n${markdown}`
    }

    return markdown
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error)
    // Fallback to basic conversion
    return convertHtmlToMarkdown(html)
  }
}

function convertHtmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
  })

  // Configure Turndown rules
  turndown.remove(['script', 'style', 'noscript', 'iframe'])

  const markdown = turndown.turndown(html)

  // Clean up excessive newlines
  return markdown
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
