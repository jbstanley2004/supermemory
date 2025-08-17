import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { nanoid } from 'nanoid'
import { eq, and, desc, asc, inArray } from 'drizzle-orm'
import type { Env } from '../index'
import { getDb, schema } from '../db'
import { getAuth } from '../lib/auth'
import { processMemory } from '../lib/memory-processor'
import {
  MemoryAddSchema,
  MemoryUpdateSchema,
  ListMemoriesQuerySchema,
  MemoryResponseSchema,
  ListMemoriesResponseSchema,
} from '@repo/validation/api'
import { z } from 'zod'

export const memoriesRouter = new Hono<{ Bindings: Env }>()

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

// Create memory
memoriesRouter.post(
  '/',
  requireAuth,
  zValidator('json', MemoryAddSchema),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const data = c.req.valid('json')
    
    try {
      // Create document record
      const documentId = nanoid()
      const [document] = await db.insert(schema.documents).values({
        id: documentId,
        userId: user.id,
        customId: data.customId,
        content: data.content,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        containerTags: data.containerTags ? JSON.stringify(data.containerTags) : JSON.stringify([]),
        type: data.content?.startsWith('http') ? 'url' : 'text',
        status: 'processing',
      }).returning()
      
      // Process memory asynchronously
      c.executionCtx.waitUntil(
        processMemory(c.env, documentId, data.content || '', user.id)
      )
      
      return c.json({
        id: document.id,
        status: document.status,
      })
    } catch (error) {
      console.error('Error creating memory:', error)
      return c.json({ error: 'Failed to create memory' }, 500)
    }
  }
)

// List memories
memoriesRouter.post(
  '/list',
  requireAuth,
  zValidator('json', z.object({
    limit: z.number().optional().default(10),
    page: z.number().optional().default(1),
    status: z.string().optional(),
    containerTags: z.array(z.string()).optional(),
  }).optional()),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const params = c.req.valid('json') || {}
    
    try {
      const limit = params.limit || 10
      const page = params.page || 1
      const offset = (page - 1) * limit
      
      // Build query conditions
      const conditions = [eq(schema.documents.userId, user.id)]
      
      if (params.status) {
        conditions.push(eq(schema.documents.status, params.status))
      }
      
      // Get total count
      const totalResult = await db
        .select({ count: schema.documents.id })
        .from(schema.documents)
        .where(and(...conditions))
      
      const totalItems = totalResult.length
      
      // Get paginated results
      const memories = await db
        .select({
          id: schema.documents.id,
          customId: schema.documents.customId,
          connectionId: schema.documents.connectionId,
          title: schema.documents.title,
          summary: schema.documents.summary,
          type: schema.documents.type,
          status: schema.documents.status,
          metadata: schema.documents.metadata,
          containerTags: schema.documents.containerTags,
          createdAt: schema.documents.createdAt,
          updatedAt: schema.documents.updatedAt,
        })
        .from(schema.documents)
        .where(and(...conditions))
        .orderBy(desc(schema.documents.createdAt))
        .limit(limit)
        .offset(offset)
      
      // Filter by container tags if needed and parse JSON
      let filteredMemories = memories.map(mem => ({
        ...mem,
        metadata: mem.metadata ? JSON.parse(mem.metadata) : null,
        containerTags: mem.containerTags ? JSON.parse(mem.containerTags) : [],
        createdAt: new Date(mem.createdAt * 1000).toISOString(),
        updatedAt: new Date(mem.updatedAt * 1000).toISOString(),
      }))
      
      if (params.containerTags && params.containerTags.length > 0) {
        filteredMemories = filteredMemories.filter((mem) => {
          const tags = mem.containerTags || []
          return params.containerTags!.some(tag => tags.includes(tag))
        })
      }
      
      return c.json({
        memories: filteredMemories,
        pagination: {
          currentPage: page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      })
    } catch (error) {
      console.error('Error listing memories:', error)
      return c.json({ error: 'Failed to list memories' }, 500)
    }
  }
)

// Get single memory
memoriesRouter.get(
  '/:id',
  requireAuth,
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const memoryId = c.req.param('id')
    
    try {
      const [memory] = await db
        .select()
        .from(schema.documents)
        .where(
          and(
            eq(schema.documents.id, memoryId),
            eq(schema.documents.userId, user.id)
          )
        )
        .limit(1)
      
      if (!memory) {
        return c.json({ error: 'Memory not found' }, 404)
      }
      
      // Get chunk count
      const chunks = await db
        .select({ count: schema.memoryChunks.id })
        .from(schema.memoryChunks)
        .where(eq(schema.memoryChunks.documentId, memory.id))
      
      return c.json({
        ...memory,
        metadata: memory.metadata ? JSON.parse(memory.metadata) : null,
        containerTags: memory.containerTags ? JSON.parse(memory.containerTags) : [],
        chunkCount: chunks.length,
        createdAt: new Date(memory.createdAt * 1000).toISOString(),
        updatedAt: new Date(memory.updatedAt * 1000).toISOString(),
      })
    } catch (error) {
      console.error('Error getting memory:', error)
      return c.json({ error: 'Failed to get memory' }, 500)
    }
  }
)

// Update memory
memoriesRouter.patch(
  '/:id',
  requireAuth,
  zValidator('json', MemoryUpdateSchema),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const memoryId = c.req.param('id')
    const updates = c.req.valid('json')
    
    try {
      const updateData: any = {
        updatedAt: Math.floor(Date.now() / 1000),
      }
      
      if (updates.content !== undefined) updateData.content = updates.content
      if (updates.customId !== undefined) updateData.customId = updates.customId
      if (updates.metadata !== undefined) updateData.metadata = JSON.stringify(updates.metadata)
      if (updates.containerTags !== undefined) updateData.containerTags = JSON.stringify(updates.containerTags)
      
      const [updated] = await db
        .update(schema.documents)
        .set(updateData)
        .where(
          and(
            eq(schema.documents.id, memoryId),
            eq(schema.documents.userId, user.id)
          )
        )
        .returning()
      
      if (!updated) {
        return c.json({ error: 'Memory not found' }, 404)
      }
      
      // If content was updated, reprocess
      if (updates.content) {
        c.executionCtx.waitUntil(
          processMemory(c.env, memoryId, updates.content, user.id)
        )
      }
      
      return c.json({
        id: updated.id,
        status: updated.status,
      })
    } catch (error) {
      console.error('Error updating memory:', error)
      return c.json({ error: 'Failed to update memory' }, 500)
    }
  }
)

// Delete memory
memoriesRouter.delete(
  '/:id',
  requireAuth,
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const memoryId = c.req.param('id')
    
    try {
      // Delete chunks first (cascading delete should handle this)
      await db
        .delete(schema.memoryChunks)
        .where(eq(schema.memoryChunks.documentId, memoryId))
      
      // Delete document
      const result = await db
        .delete(schema.documents)
        .where(
          and(
            eq(schema.documents.id, memoryId),
            eq(schema.documents.userId, user.id)
          )
        )
      
      return c.json({ success: true }, 204)
    } catch (error) {
      console.error('Error deleting memory:', error)
      return c.json({ error: 'Failed to delete memory' }, 500)
    }
  }
)

// Get documents with memories
memoriesRouter.post(
  '/documents',
  requireAuth,
  zValidator('json', z.object({
    limit: z.number().optional().default(10),
    page: z.number().optional().default(1),
    containerTags: z.array(z.string()).optional(),
  })),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const params = c.req.valid('json')
    
    try {
      const limit = params.limit
      const page = params.page
      const offset = (page - 1) * limit
      
      // Get documents with their chunks
      const documents = await db
        .select({
          document: schema.documents,
          chunkId: schema.memoryChunks.id,
        })
        .from(schema.documents)
        .leftJoin(
          schema.memoryChunks,
          eq(schema.documents.id, schema.memoryChunks.documentId)
        )
        .where(eq(schema.documents.userId, user.id))
        .orderBy(desc(schema.documents.createdAt))
        .limit(limit)
        .offset(offset)
      
      // Group by document
      const documentsMap = new Map()
      documents.forEach(({ document, chunkId }) => {
        if (!documentsMap.has(document.id)) {
          documentsMap.set(document.id, {
            ...document,
            metadata: document.metadata ? JSON.parse(document.metadata) : null,
            containerTags: document.containerTags ? JSON.parse(document.containerTags) : [],
            memories: [],
            createdAt: new Date(document.createdAt * 1000).toISOString(),
            updatedAt: new Date(document.updatedAt * 1000).toISOString(),
          })
        }
        if (chunkId) {
          documentsMap.get(document.id).memories.push(chunkId)
        }
      })
      
      return c.json({
        documents: Array.from(documentsMap.values()),
        pagination: {
          currentPage: page,
          limit,
          totalItems: documentsMap.size,
          totalPages: Math.ceil(documentsMap.size / limit),
        },
      })
    } catch (error) {
      console.error('Error getting documents:', error)
      return c.json({ error: 'Failed to get documents' }, 500)
    }
  }
)