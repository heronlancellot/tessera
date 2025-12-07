/**
 * HTML to Markdown converter
 *
 * TODO: Implement Firecrawl-style conversion
 * Reference: https://github.com/firecrawl/firecrawl
 *
 * Steps:
 * 1. Use @mozilla/readability to extract main content
 * 2. Use turndown to convert HTML -> Markdown
 * 3. Clean up (remove scripts, styles, tracking, etc)
 *
 * Dependencies to add:
 * - @mozilla/readability
 * - turndown
 * - jsdom (for Readability)
 */

export function htmlToMarkdown(html: string): string {
  // Placeholder: basic HTML tag stripping
  // Replace with proper implementation based on Firecrawl

  let text = html

  // Remove script and style tags with content
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '')

  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, '')

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  // Clean up whitespace
  text = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n\n')

  return text
}
