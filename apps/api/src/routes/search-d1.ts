import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { eq, inArray } from 'drizzle-orm'
import type { Env } from '../index'
import { getDb, schema } from '../db'
import { getAuth } from '../lib/auth'
import { generateEmbedding } from '../lib/memory-processor'
import { SearchRequestSchema } from '@repo/validation/api'

export const searchRouter = new Hono<{ Bindings: Env }>()

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

// Search memories
searchRouter.post(
  '/',
  requireAuth,
  zValidator('json', SearchRequestSchema),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const params = c.req.valid('json')
    
    try {
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(params.query, c.env)
      
      // Use Vectorize for vector search (D1 doesn't support vector operations)
      if (!c.env.VECTORIZE) {
        return c.json({ error: 'Vector search not available' }, 500)
      }
      
      const vectorResults = await c.env.VECTORIZE.query(queryEmbedding, {
        topK: params.limit || 10,
        filter: {
          userId: user.id,
        },
      })
      
      if (!vectorResults.matches || vectorResults.matches.length === 0) {
        return c.json({
          results: [],
          query: params.query,
          totalResults: 0,
        })
      }
      
      // Get chunks from database
      const chunkIds = vectorResults.matches.map((m: any) => m.id)
      
      if (chunkIds.length === 0) {
        return c.json({
          results: [],
          query: params.query,
          totalResults: 0,
        })
      }
      
      const chunks = await db
        .select({
          chunk: schema.memoryChunks,
          document: schema.documents,
        })
        .from(schema.memoryChunks)
        .innerJoin(
          schema.documents,
          eq(schema.memoryChunks.documentId, schema.documents.id)
        )
        .where(inArray(schema.memoryChunks.id, chunkIds))
      
      // Create a map to maintain score order
      const scoreMap = new Map()
      vectorResults.matches.forEach((match: any) => {
        scoreMap.set(match.id, match.score)
      })
      
      // Format results and maintain order
      let results = chunks
        .map((row) => ({
          id: row.chunk.id,
          documentId: row.document.id,
          content: row.chunk.content,
          title: row.document.title,
          url: row.document.url,
          summary: row.document.summary,
          metadata: row.document.metadata ? JSON.parse(row.document.metadata) : null,
          score: scoreMap.get(row.chunk.id) || 0,
          type: 'chunk' as const,
        }))
        .sort((a, b) => b.score - a.score)
      
      // Apply container tags filter if specified
      if (params.containerTags && params.containerTags.length > 0) {
        results = results.filter((result) => {
          const documentContainerTags = result.metadata?.containerTags || []
          return params.containerTags.some((tag: string) => documentContainerTags.includes(tag))
        })
      }
      
      // Apply thresholds if specified
      if (params.chunkThreshold) {
        results = results.filter(r => r.score >= params.chunkThreshold)
      }
      
      // Group by document if needed
      const groupByDocument = (params as any).groupByDocument
      if (groupByDocument) {
        const documentGroups = new Map()
        
        results.forEach(result => {
          if (!documentGroups.has(result.documentId)) {
            documentGroups.set(result.documentId, {
              id: result.documentId,
              title: result.title,
              url: result.url,
              summary: result.summary,
              metadata: result.metadata,
              chunks: [],
              maxScore: 0,
              type: 'document' as const,
            })
          }
          
          const doc = documentGroups.get(result.documentId)
          doc.chunks.push({
            id: result.id,
            content: result.content,
            score: result.score,
          })
          doc.maxScore = Math.max(doc.maxScore, result.score)
        })
        
        // Sort documents by max score
        const sortedDocs = Array.from(documentGroups.values())
          .sort((a, b) => b.maxScore - a.maxScore)
        
        // Apply document threshold if specified
        let finalDocs = sortedDocs
        if (params.documentThreshold) {
          finalDocs = sortedDocs.filter(d => d.maxScore >= params.documentThreshold)
        }
        
        return c.json({
          results: finalDocs.slice(0, params.limit || 10),
          query: params.query,
          totalResults: finalDocs.length,
        })
      }
      
      return c.json({
        results,
        query: params.query,
        totalResults: results.length,
      })
      
    } catch (error) {
      console.error('Error searching memories:', error)
      return c.json({ error: 'Failed to search memories' }, 500)
    }
  }
)