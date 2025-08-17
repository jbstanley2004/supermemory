import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { sql, eq, inArray } from 'drizzle-orm'
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
      
      // Use Vectorize if available for faster search
      if (c.env.VECTORIZE) {
        const vectorResults = await c.env.VECTORIZE.query(queryEmbedding, {
          topK: params.limit || 10,
          filter: {
            userId: user.id,
            ...(params.containerTags && { containerTags: params.containerTags }),
          },
        })
        
        // Get chunks from database
        const chunkIds = vectorResults.matches.map((m: any) => m.id)
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
        
        // Format results
        const results = chunks.map((row, index) => ({
          id: row.chunk.id,
          documentId: row.document.id,
          content: row.chunk.content,
          title: row.document.title,
          url: row.document.url,
          summary: row.document.summary,
          metadata: row.document.metadata,
          score: vectorResults.matches[index]?.score || 0,
          type: 'chunk' as const,
        }))
        
        return c.json({
          results,
          query: params.query,
          totalResults: results.length,
        })
      }
      
      // Fallback to PostgreSQL vector search with pgvector
      const searchQuery = sql`
        SELECT 
          c.id as chunk_id,
          c.content as chunk_content,
          c.position,
          d.id as doc_id,
          d.title,
          d.url,
          d.summary,
          d.metadata,
          d.type,
          1 - (c.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
        FROM ${schema.memoryChunks} c
        INNER JOIN ${schema.documents} d ON c.document_id = d.id
        WHERE d.user_id = ${user.id}
        ${params.containerTags ? sql`AND d.container_tags @> ${JSON.stringify(params.containerTags)}::jsonb` : sql``}
        ORDER BY similarity DESC
        LIMIT ${params.limit || 10}
      `
      
      const results = await db.execute(searchQuery)
      
      // Format results
      const formattedResults = results.rows.map((row: any) => ({
        id: row.chunk_id,
        documentId: row.doc_id,
        content: row.chunk_content,
        title: row.title,
        url: row.url,
        summary: row.summary,
        metadata: row.metadata,
        score: row.similarity,
        type: 'chunk' as const,
      }))
      
      // Apply thresholds if specified
      let filteredResults = formattedResults
      if (params.chunkThreshold) {
        filteredResults = filteredResults.filter(r => r.score >= params.chunkThreshold)
      }
      
      // Group by document if needed
      if (params.groupByDocument) {
        const documentGroups = new Map()
        
        filteredResults.forEach(result => {
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
        results: filteredResults,
        query: params.query,
        totalResults: filteredResults.length,
      })
      
    } catch (error) {
      console.error('Error searching memories:', error)
      return c.json({ error: 'Failed to search memories' }, 500)
    }
  }
)