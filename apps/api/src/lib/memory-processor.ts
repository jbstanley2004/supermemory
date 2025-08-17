import { openai } from '@ai-sdk/openai'
import { generateText, embed } from 'ai'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { getDb, schema } from '../db'
import type { Env } from '../index'

// Chunk text into smaller pieces for embedding
function chunkText(text: string, maxTokens: number = 500): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []
  let currentChunk: string[] = []
  let currentTokens = 0
  
  for (const word of words) {
    const wordTokens = Math.ceil(word.length / 4) // Rough token estimate
    
    if (currentTokens + wordTokens > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '))
      currentChunk = []
      currentTokens = 0
    }
    
    currentChunk.push(word)
    currentTokens += wordTokens
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '))
  }
  
  return chunks
}

// Extract content from URL
async function extractFromUrl(url: string, env: Env): Promise<string> {
  try {
    const response = await fetch(url)
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.includes('text/html')) {
      const html = await response.text()
      // Simple HTML to text conversion (in production, use a proper parser)
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    } else if (contentType.includes('application/pdf')) {
      // For PDFs, we'd need a PDF parser
      // For now, return a placeholder
      return `PDF content from ${url}`
    } else {
      return await response.text()
    }
  } catch (error) {
    console.error('Error extracting from URL:', error)
    throw new Error(`Failed to extract content from URL: ${url}`)
  }
}

// Generate summary using AI
async function generateSummary(content: string, env: Env): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: `Summarize the following content in 2-3 sentences:\n\n${content.slice(0, 2000)}`,
      maxTokens: 150,
      apiKey: env.OPENAI_API_KEY,
    })
    
    return text
  } catch (error) {
    console.error('Error generating summary:', error)
    return content.slice(0, 200) + '...'
  }
}

// Generate title using AI
async function generateTitle(content: string, env: Env): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: `Generate a short, descriptive title for the following content:\n\n${content.slice(0, 1000)}`,
      maxTokens: 50,
      apiKey: env.OPENAI_API_KEY,
    })
    
    return text.trim()
  } catch (error) {
    console.error('Error generating title:', error)
    return 'Untitled Memory'
  }
}

// Generate embeddings using OpenAI or Cloudflare AI
async function generateEmbedding(text: string, env: Env): Promise<number[]> {
  try {
    // Try Cloudflare AI first (faster and cheaper)
    if (env.AI) {
      const response = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: [text],
      }) as any
      
      if (response.data && response.data[0]) {
        return response.data[0]
      }
    }
    
    // Fall back to OpenAI
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: text,
      apiKey: env.OPENAI_API_KEY,
    })
    
    return embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

// Process a memory document
export async function processMemory(
  env: Env,
  documentId: string,
  content: string,
  userId: string
): Promise<void> {
  const db = getDb(env)
  
  try {
    // Extract content if URL
    let extractedContent = content
    let title = ''
    let url = ''
    
    if (content.startsWith('http')) {
      url = content
      extractedContent = await extractFromUrl(content, env)
      
      // Try to extract title from URL
      const urlObj = new URL(url)
      title = urlObj.hostname
    }
    
    // Generate title and summary
    if (!title) {
      title = await generateTitle(extractedContent, env)
    }
    const summary = await generateSummary(extractedContent, env)
    
    // Update document with processed content
    await db
      .update(schema.documents)
      .set({
        raw: extractedContent,
        title,
        summary,
        url: url || null,
        status: 'processing',
        tokenCount: Math.ceil(extractedContent.length / 4),
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, documentId))
    
    // Chunk the content
    const chunks = chunkText(extractedContent, 500)
    
    // Generate embeddings and store chunks
    const chunkPromises = chunks.map(async (chunkContent, index) => {
      const chunkId = nanoid()
      const embedding = await generateEmbedding(chunkContent, env)
      
      // Store in database
      await db.insert(schema.memoryChunks).values({
        id: chunkId,
        documentId,
        userId,
        content: chunkContent,
        contentHash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(chunkContent))
          .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')),
        embedding,
        position: index,
        tokenCount: Math.ceil(chunkContent.length / 4),
      })
      
      // Also store in Vectorize if available
      if (env.VECTORIZE) {
        await env.VECTORIZE.insert([{
          id: chunkId,
          values: embedding,
          metadata: {
            documentId,
            userId,
            position: index,
          },
        }])
      }
    })
    
    await Promise.all(chunkPromises)
    
    // Update document status
    await db
      .update(schema.documents)
      .set({
        status: 'done',
        chunkCount: chunks.length,
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, documentId))
    
  } catch (error) {
    console.error('Error processing memory:', error)
    
    // Update document status to failed
    await db
      .update(schema.documents)
      .set({
        status: 'failed',
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, documentId))
    
    throw error
  }
}

// Re-export for use in routes
export { generateEmbedding }