import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import type { Env } from '../index'
import { getDb, schema } from '../db'
import { getAuth } from '../lib/auth'
import { z } from 'zod'

export const analyticsRouter = new Hono<{ Bindings: Env }>()

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

const AnalyticsQuerySchema = z.object({
  period: z.enum(['24h', '7d', '30d', 'all']).optional().default('7d'),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).optional().default(20),
  page: z.number().min(1).optional().default(1),
})

// Get usage analytics
analyticsRouter.get(
  '/usage',
  requireAuth,
  zValidator('query', AnalyticsQuerySchema),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const params = c.req.valid('query')
    
    try {
      // Calculate date range
      let fromDate = new Date()
      let toDate = new Date()
      
      if (params.from && params.to) {
        fromDate = new Date(params.from)
        toDate = new Date(params.to)
      } else {
        switch (params.period) {
          case '24h':
            fromDate.setDate(fromDate.getDate() - 1)
            break
          case '7d':
            fromDate.setDate(fromDate.getDate() - 7)
            break
          case '30d':
            fromDate.setDate(fromDate.getDate() - 30)
            break
          case 'all':
            fromDate = new Date('2020-01-01')
            break
        }
      }
      
      // Get memory stats
      const memoryStats = await db
        .select({
          totalMemories: sql<number>`count(*)`,
          totalTokens: sql<number>`sum(${schema.documents.tokenCount})`,
          totalChunks: sql<number>`sum(${schema.documents.chunkCount})`,
        })
        .from(schema.documents)
        .where(
          and(
            eq(schema.documents.userId, user.id),
            gte(schema.documents.createdAt, fromDate),
            lte(schema.documents.createdAt, toDate)
          )
        )
      
      // Get search stats from analytics events
      const searchStats = await db
        .select({
          totalSearches: sql<number>`count(*)`,
        })
        .from(schema.analyticsEvents)
        .where(
          and(
            eq(schema.analyticsEvents.userId, user.id),
            eq(schema.analyticsEvents.event, 'memory_searched'),
            gte(schema.analyticsEvents.createdAt, fromDate),
            lte(schema.analyticsEvents.createdAt, toDate)
          )
        )
      
      // Get daily breakdown
      const dailyBreakdown = await db
        .select({
          date: sql<string>`date_trunc('day', ${schema.documents.createdAt})`,
          count: sql<number>`count(*)`,
        })
        .from(schema.documents)
        .where(
          and(
            eq(schema.documents.userId, user.id),
            gte(schema.documents.createdAt, fromDate),
            lte(schema.documents.createdAt, toDate)
          )
        )
        .groupBy(sql`date_trunc('day', ${schema.documents.createdAt})`)
        .orderBy(sql`date_trunc('day', ${schema.documents.createdAt})`)
      
      return c.json({
        usage: {
          memories: {
            total: memoryStats[0]?.totalMemories || 0,
            tokens: memoryStats[0]?.totalTokens || 0,
            chunks: memoryStats[0]?.totalChunks || 0,
          },
          searches: {
            total: searchStats[0]?.totalSearches || 0,
          },
          dailyBreakdown: dailyBreakdown.map(d => ({
            date: d.date,
            count: d.count,
          })),
        },
        period: params.period,
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      })
    } catch (error) {
      console.error('Error getting usage analytics:', error)
      return c.json({ error: 'Failed to get analytics' }, 500)
    }
  }
)

// Get memory analytics
analyticsRouter.get(
  '/memory',
  requireAuth,
  zValidator('query', AnalyticsQuerySchema),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const params = c.req.valid('query')
    
    try {
      const limit = params.limit
      const offset = (params.page - 1) * limit
      
      // Get recent memories
      const recentMemories = await db
        .select({
          id: schema.documents.id,
          title: schema.documents.title,
          type: schema.documents.type,
          status: schema.documents.status,
          tokenCount: schema.documents.tokenCount,
          createdAt: schema.documents.createdAt,
        })
        .from(schema.documents)
        .where(eq(schema.documents.userId, user.id))
        .orderBy(desc(schema.documents.createdAt))
        .limit(limit)
        .offset(offset)
      
      // Get type distribution
      const typeDistribution = await db
        .select({
          type: schema.documents.type,
          count: sql<number>`count(*)`,
        })
        .from(schema.documents)
        .where(eq(schema.documents.userId, user.id))
        .groupBy(schema.documents.type)
      
      return c.json({
        memories: recentMemories.map(m => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        })),
        distribution: typeDistribution,
        pagination: {
          page: params.page,
          limit,
          total: recentMemories.length,
        },
      })
    } catch (error) {
      console.error('Error getting memory analytics:', error)
      return c.json({ error: 'Failed to get memory analytics' }, 500)
    }
  }
)

// Get chat analytics
analyticsRouter.get(
  '/chat',
  requireAuth,
  zValidator('query', AnalyticsQuerySchema),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const params = c.req.valid('query')
    
    try {
      // Get chat message stats
      const chatStats = await db
        .select({
          totalMessages: sql<number>`count(*)`,
          date: sql<string>`date_trunc('day', ${schema.analyticsEvents.createdAt})`,
        })
        .from(schema.analyticsEvents)
        .where(
          and(
            eq(schema.analyticsEvents.userId, user.id),
            eq(schema.analyticsEvents.event, 'chat_message')
          )
        )
        .groupBy(sql`date_trunc('day', ${schema.analyticsEvents.createdAt})`)
        .orderBy(sql`date_trunc('day', ${schema.analyticsEvents.createdAt})`)
      
      return c.json({
        chat: {
          dailyMessages: chatStats.map(s => ({
            date: s.date,
            count: s.totalMessages,
          })),
          total: chatStats.reduce((sum, s) => sum + s.totalMessages, 0),
        },
      })
    } catch (error) {
      console.error('Error getting chat analytics:', error)
      return c.json({ error: 'Failed to get chat analytics' }, 500)
    }
  }
)

// Track analytics event
analyticsRouter.post(
  '/track',
  requireAuth,
  zValidator('json', z.object({
    event: z.string(),
    properties: z.record(z.any()).optional(),
  })),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const { event, properties } = c.req.valid('json')
    
    try {
      await db.insert(schema.analyticsEvents).values({
        id: nanoid(),
        userId: user.id,
        event,
        properties,
      })
      
      return c.json({ success: true })
    } catch (error) {
      console.error('Error tracking event:', error)
      return c.json({ error: 'Failed to track event' }, 500)
    }
  }
)