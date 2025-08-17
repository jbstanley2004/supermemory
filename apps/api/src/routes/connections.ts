import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { nanoid } from 'nanoid'
import { eq, and } from 'drizzle-orm'
import type { Env } from '../index'
import { getDb, schema } from '../db'
import { getAuth } from '../lib/auth'
import { z } from 'zod'

export const connectionsRouter = new Hono<{ Bindings: Env }>()

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

// List connections
connectionsRouter.get(
  '/',
  requireAuth,
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    
    try {
      const connections = await db
        .select({
          id: schema.connections.id,
          provider: schema.connections.provider,
          status: schema.connections.status,
          metadata: schema.connections.metadata,
          containerTags: schema.connections.containerTags,
          lastSyncedAt: schema.connections.lastSyncedAt,
          createdAt: schema.connections.createdAt,
          updatedAt: schema.connections.updatedAt,
        })
        .from(schema.connections)
        .where(eq(schema.connections.userId, user.id))
      
      return c.json(connections.map(conn => ({
        ...conn,
        lastSyncedAt: conn.lastSyncedAt?.toISOString(),
        createdAt: conn.createdAt.toISOString(),
        updatedAt: conn.updatedAt.toISOString(),
      })))
    } catch (error) {
      console.error('Error listing connections:', error)
      return c.json({ error: 'Failed to list connections' }, 500)
    }
  }
)

// Create connection (OAuth flow initiation)
connectionsRouter.post(
  '/:provider',
  requireAuth,
  zValidator('json', z.object({
    redirectUrl: z.string().optional(),
    containerTags: z.array(z.string()).optional(),
    documentLimit: z.number().optional(),
    metadata: z.record(z.any()).optional(),
  })),
  async (c) => {
    const provider = c.req.param('provider')
    const params = c.req.valid('json')
    const user = c.get('user')
    
    // Validate provider
    if (!['google-drive', 'notion', 'onedrive'].includes(provider)) {
      return c.json({ error: 'Invalid provider' }, 400)
    }
    
    try {
      // Generate OAuth URL based on provider
      let authUrl = ''
      const state = nanoid()
      
      // Store state in KV for verification
      await c.env.KV.put(
        `oauth:${state}`,
        JSON.stringify({
          userId: user.id,
          provider,
          containerTags: params.containerTags,
          metadata: params.metadata,
          redirectUrl: params.redirectUrl,
        }),
        { expirationTtl: 600 } // 10 minutes
      )
      
      switch (provider) {
        case 'google-drive':
          if (!c.env.GOOGLE_CLIENT_ID) {
            return c.json({ error: 'Google Drive not configured' }, 400)
          }
          
          const googleParams = new URLSearchParams({
            client_id: c.env.GOOGLE_CLIENT_ID,
            redirect_uri: `${c.env.BETTER_AUTH_URL}/v3/connections/callback`,
            response_type: 'code',
            scope: 'https://www.googleapis.com/auth/drive.readonly',
            state,
            access_type: 'offline',
            prompt: 'consent',
          })
          authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googleParams}`
          break
          
        case 'notion':
          if (!c.env.NOTION_CLIENT_ID) {
            return c.json({ error: 'Notion not configured' }, 400)
          }
          
          const notionParams = new URLSearchParams({
            client_id: c.env.NOTION_CLIENT_ID,
            redirect_uri: `${c.env.BETTER_AUTH_URL}/v3/connections/callback`,
            response_type: 'code',
            owner: 'user',
            state,
          })
          authUrl = `https://api.notion.com/v1/oauth/authorize?${notionParams}`
          break
          
        case 'onedrive':
          if (!c.env.MICROSOFT_CLIENT_ID) {
            return c.json({ error: 'OneDrive not configured' }, 400)
          }
          
          const msParams = new URLSearchParams({
            client_id: c.env.MICROSOFT_CLIENT_ID,
            redirect_uri: `${c.env.BETTER_AUTH_URL}/v3/connections/callback`,
            response_type: 'code',
            scope: 'Files.Read.All offline_access',
            state,
          })
          authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${msParams}`
          break
      }
      
      return c.json({
        id: state,
        authLink: authUrl,
        expiresIn: '600',
        redirectsTo: params.redirectUrl,
      })
    } catch (error) {
      console.error('Error creating connection:', error)
      return c.json({ error: 'Failed to create connection' }, 500)
    }
  }
)

// OAuth callback handler
connectionsRouter.get(
  '/callback',
  async (c) => {
    const code = c.req.query('code')
    const state = c.req.query('state')
    const error = c.req.query('error')
    
    if (error) {
      return c.text(`OAuth error: ${error}`, 400)
    }
    
    if (!code || !state) {
      return c.text('Missing code or state', 400)
    }
    
    try {
      // Retrieve state from KV
      const stateData = await c.env.KV.get(`oauth:${state}`)
      if (!stateData) {
        return c.text('Invalid or expired state', 400)
      }
      
      const { userId, provider, containerTags, metadata, redirectUrl } = JSON.parse(stateData)
      const db = getDb(c.env)
      
      // Exchange code for tokens based on provider
      let accessToken = ''
      let refreshToken = ''
      let expiresAt = null
      
      // ... (implement token exchange for each provider)
      // This would involve making POST requests to each provider's token endpoint
      
      // Save connection to database
      const connectionId = nanoid()
      await db.insert(schema.connections).values({
        id: connectionId,
        userId,
        provider,
        status: 'active',
        accessToken,
        refreshToken,
        expiresAt,
        metadata,
        containerTags,
      })
      
      // Delete state from KV
      await c.env.KV.delete(`oauth:${state}`)
      
      // Redirect to the specified URL or a default success page
      if (redirectUrl) {
        return c.redirect(`${redirectUrl}?success=true&connectionId=${connectionId}`)
      }
      
      return c.text('Connection created successfully!', 200)
    } catch (error) {
      console.error('Error in OAuth callback:', error)
      return c.text('Failed to complete OAuth flow', 500)
    }
  }
)

// Delete connection
connectionsRouter.delete(
  '/:connectionId',
  requireAuth,
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const connectionId = c.req.param('connectionId')
    
    try {
      const [deleted] = await db
        .delete(schema.connections)
        .where(
          and(
            eq(schema.connections.id, connectionId),
            eq(schema.connections.userId, user.id)
          )
        )
        .returning({ id: schema.connections.id, provider: schema.connections.provider })
      
      if (!deleted) {
        return c.json({ error: 'Connection not found' }, 404)
      }
      
      return c.json(deleted)
    } catch (error) {
      console.error('Error deleting connection:', error)
      return c.json({ error: 'Failed to delete connection' }, 500)
    }
  }
)