import { Hono } from 'hono'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { nanoid } from 'nanoid'
import type { Env } from '../index'
import { getAuth } from '../lib/auth'
import { getDb, schema } from '../db'
import { generateEmbedding } from '../lib/memory-processor'
import { sql } from 'drizzle-orm'

export const chatRouter = new Hono<{ Bindings: Env }>()

// Middleware to check authentication
const requireAuth = async (c: any, next: any) => {
  const auth = getAuth(c.env)
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  c.set('user', session.user)
  c.set('session', session.session)
  await next()
}

// Chat endpoint with RAG
chatRouter.post(
  '/',
  requireAuth,
  async (c) => {
    const user = c.get('user')
    const db = getDb(c.env)
    
    try {
      const { messages, model = 'gpt-4o-mini', containerTags } = await c.req.json()
      
      if (!messages || !Array.isArray(messages)) {
        return c.json({ error: 'Messages array is required' }, 400)
      }
      
      // Get the last user message for context retrieval
      const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()
      if (!lastUserMessage) {
        return c.json({ error: 'No user message found' }, 400)
      }
      
      // Search for relevant context
      const queryEmbedding = await generateEmbedding(lastUserMessage.content, c.env)
      
      // Use PostgreSQL vector search to find relevant chunks
      const searchQuery = sql`
        SELECT 
          c.content as chunk_content,
          d.title,
          d.url,
          d.summary,
          1 - (c.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
        FROM ${schema.memoryChunks} c
        INNER JOIN ${schema.documents} d ON c.document_id = d.id
        WHERE d.user_id = ${user.id}
        ${containerTags ? sql`AND d.container_tags @> ${JSON.stringify(containerTags)}::jsonb` : sql``}
        ORDER BY similarity DESC
        LIMIT 5
      `
      
      const contextResults = await db.execute(searchQuery)
      
      // Build context from search results
      let context = ''
      if (contextResults.rows.length > 0) {
        context = 'Relevant information from your memories:\n\n'
        contextResults.rows.forEach((row: any) => {
          context += `Title: ${row.title || 'Untitled'}\n`
          if (row.url) context += `Source: ${row.url}\n`
          context += `Content: ${row.chunk_content}\n\n`
        })
      }
      
      // Prepare messages with context
      const messagesWithContext = [
        {
          role: 'system',
          content: `You are a helpful assistant with access to the user's personal knowledge base. 
          Use the provided context to answer questions accurately. 
          If the context doesn't contain relevant information, you can still provide general knowledge but mention that it's not from their saved memories.
          
          ${context}`,
        },
        ...messages,
      ]
      
      // Track analytics
      await db.insert(schema.analyticsEvents).values({
        id: nanoid(),
        userId: user.id,
        event: 'chat_message',
        properties: {
          model,
          hasContext: contextResults.rows.length > 0,
          messageCount: messages.length,
        },
      })
      
      // Stream the response
      let selectedModel
      if (model.startsWith('gpt')) {
        selectedModel = openai(model)
      } else if (model.startsWith('claude')) {
        if (!c.env.ANTHROPIC_API_KEY) {
          return c.json({ error: 'Anthropic not configured' }, 400)
        }
        selectedModel = anthropic(model)
      } else {
        selectedModel = openai('gpt-4o-mini')
      }
      
      const result = await streamText({
        model: selectedModel,
        messages: messagesWithContext,
        apiKey: model.startsWith('claude') ? c.env.ANTHROPIC_API_KEY : c.env.OPENAI_API_KEY,
      })
      
      // Return streaming response
      return new Response(result.toTextStreamResponse().body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } catch (error) {
      console.error('Error in chat:', error)
      return c.json({ error: 'Failed to process chat request' }, 500)
    }
  }
)