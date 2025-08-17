import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import { secureHeaders } from 'hono/secure-headers'
import { timing } from 'hono/timing'

import { memoriesRouter } from './routes/memories'
import { searchRouter } from './routes/search'
import { connectionsRouter } from './routes/connections'
import { settingsRouter } from './routes/settings'
import { analyticsRouter } from './routes/analytics'
import { authRouter } from './routes/auth'
import { projectsRouter } from './routes/projects'
import { chatRouter } from './routes/chat'

export interface Env {
  // Bindings
  DB: Hyperdrive
  AI: any
  KV: KVNamespace
  R2: R2Bucket
  VECTORIZE: any
  
  // Environment variables
  DATABASE_URL: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  OPENAI_API_KEY: string
  RESEND_API_KEY: string
  ANTHROPIC_API_KEY?: string
  GEMINI_API_KEY?: string
  GROQ_API_KEY?: string
  NODE_ENV: string
  
  // OAuth
  AUTH_GITHUB_ID?: string
  AUTH_GITHUB_SECRET?: string
  AUTH_GOOGLE_ID?: string
  AUTH_GOOGLE_SECRET?: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  MICROSOFT_CLIENT_ID?: string
  MICROSOFT_CLIENT_SECRET?: string
  NOTION_CLIENT_ID?: string
  NOTION_CLIENT_SECRET?: string
}

const app = new Hono<{ Bindings: Env }>()

// Global middleware
app.use('*', timing())
app.use('*', logger())
app.use('*', compress())
app.use('*', secureHeaders())
app.use('*', cors({
  origin: (origin) => {
    // Allow requests from allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'https://app.supermemory.ai',
      'https://supermemory-consumer.terragon.workers.dev',
      /https:\/\/.*\.workers\.dev$/,
    ]
    
    if (!origin) return null
    
    for (const allowed of allowedOrigins) {
      if (allowed instanceof RegExp) {
        if (allowed.test(origin)) return origin
      } else if (origin === allowed) {
        return origin
      }
    }
    
    return null
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400,
}))

// Health check
app.get('/', (c) => {
  return c.json({
    name: 'SuperMemory API',
    version: '3.0.0',
    status: 'healthy',
    environment: c.env.NODE_ENV,
  })
})

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// API routes
app.route('/api/auth', authRouter)
app.route('/v3/memories', memoriesRouter)
app.route('/v3/search', searchRouter)
app.route('/v3/connections', connectionsRouter)
app.route('/v3/settings', settingsRouter)
app.route('/v3/analytics', analyticsRouter)
app.route('/v3/projects', projectsRouter)
app.route('/chat', chatRouter)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json(
    {
      error: 'Internal Server Error',
      message: c.env.NODE_ENV === 'development' ? err.message : undefined,
    },
    500
  )
})

export default app