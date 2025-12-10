/**
 * Research Agent Example
 *
 * Demonstrates how AI agents can use Tessera SDK to:
 * 1. Preview paywalled content (free)
 * 2. Decide if it's worth purchasing
 * 3. Fetch full content with automatic USDC payment
 * 4. Process and summarize the content
 */

import { config } from 'dotenv'
import { Tessera } from '@tessera-sdk/sdk'
import OpenAI from 'openai'

config()

// Initialize Tessera SDK with agent's wallet and API key
const tessera = new Tessera({
  privateKey: process.env.AGENT_PRIVATE_KEY!,
  baseUrl: process.env.GATEWAY_URL || 'http://localhost:3001',
  apiKey: process.env.TESSERA_API_KEY
})

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

// Tool definitions for OpenAI function calling
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'preview_article',
      description: 'Preview a paywalled article for free. Returns title, preview text (~500 chars), price in USD, and publisher. Use this first to check if content is relevant before paying.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL of the article to preview'
          }
        },
        required: ['url'],
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'fetch_article',
      description: 'Fetch full paywalled article content by paying with USDC. This costs money! Only use after preview confirms the content is relevant. Returns full article in markdown format.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL of the article to fetch'
          }
        },
        required: ['url'],
        additionalProperties: false
      }
    }
  }
]

async function runAgent(userQuery: string): Promise<string> {
  console.log('🤖 Research Agent starting...\n')
  console.log(`📝 User query: ${userQuery}\n`)

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a research agent with access to paywalled web content via cryptocurrency payments.

YOU MUST USE THE AVAILABLE TOOLS TO ACCESS CONTENT. You cannot access URLs directly.

MANDATORY WORKFLOW:
1. ALWAYS call preview_article first (it's free)
2. ALWAYS call fetch_article after preview (costs USDC) - DO NOT SKIP THIS STEP
3. Provide comprehensive summary based on fetched content

CRITICAL RULES:
- You MUST call BOTH preview_article AND fetch_article for every URL
- DO NOT decide if content is "worth it" - ALWAYS fetch after preview
- You are NOT cost-conscious - always fetch the full content
- Mention the cost when purchasing ($X USDC)`
    },
    {
      role: 'user',
      content: userQuery
    }
  ]

  let iterations = 0
  const maxIterations = 10

  while (iterations < maxIterations) {
    iterations++

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools,
      tool_choice: 'auto'
    })

    const responseMessage = response.choices[0].message
    messages.push(responseMessage)

    // Check if agent wants to use tools
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name
        const functionArgs = JSON.parse(toolCall.function.arguments)

        console.log(`🔧 Calling tool: ${functionName}`)
        console.log(`   Args: ${JSON.stringify(functionArgs, null, 2)}`)

        let result: any

        try {
          if (functionName === 'preview_article') {
            console.log('   📄 Fetching preview (free)...')
            result = await tessera.preview(functionArgs.url)
            console.log(`   ✅ Preview received - Title: "${result.title}", Price: $${result.price}`)
          } else if (functionName === 'fetch_article') {
            console.log(`   💰 Fetching full article (will pay with USDC)...`)
            result = await tessera.fetch(functionArgs.url)
            console.log(`   ✅ Full article received (${result.markdown.length} chars)`)
          }

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.log(`   ❌ Error: ${errorMessage}`)

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: errorMessage })
          })
        }

        console.log()
      }

      // Continue the loop to get next response
      continue
    }

    // No more tool calls, return final answer
    if (responseMessage.content) {
      console.log('✅ Agent finished!\n')
      return responseMessage.content
    }

    // Safety: if no content and no tool calls, break
    break
  }

  return 'Agent reached maximum iterations without completing the task.'
}

// Example usage
async function main() {
  if (!process.env.AGENT_PRIVATE_KEY) {
    console.error('❌ Missing AGENT_PRIVATE_KEY in .env')
    process.exit(1)
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Missing OPENAI_API_KEY in .env')
    process.exit(1)
  }

  if (!process.env.TESSERA_API_KEY) {
    console.error('❌ Missing TESSERA_API_KEY in .env')
    process.exit(1)
  }

  // Example queries - uncomment to try different ones
  const query = process.argv[2] || 'Summarize this article: https://example.com'

  try {
    const answer = await runAgent(query)
    console.log('━'.repeat(80))
    console.log('📋 FINAL ANSWER:')
    console.log('━'.repeat(80))
    console.log(answer)
    console.log('━'.repeat(80))
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
