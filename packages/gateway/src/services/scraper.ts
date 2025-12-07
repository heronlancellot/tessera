/**
 * Fetch HTML content from a URL
 */
export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; TesseraBot/1.0)',
      'Accept': 'text/html,application/xhtml+xml'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  return response.text()
}
