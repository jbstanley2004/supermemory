import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { Env } from '../index'
import { getDb, schema } from '../db'
import { getAuth } from '../lib/auth'
import { z } from 'zod'

export const settingsRouter = new Hono<{ Bindings: Env }>()

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

// Get settings
settingsRouter.get(
  '/',
  requireAuth,
  async (c) => {
    const user = c.get('user')
    
    try {
      // Get user settings from KV
      const settingsKey = `settings:${user.id}`
      const settings = await c.env.KV.get(settingsKey, 'json') || {}
      
      return c.json({ settings })
    } catch (error) {
      console.error('Error getting settings:', error)
      return c.json({ error: 'Failed to get settings' }, 500)
    }
  }
)

// Update settings
settingsRouter.patch(
  '/',
  requireAuth,
  zValidator('json', z.object({
    excludeItems: z.array(z.string()).optional(),
    filterPrompt: z.string().optional(),
    includeItems: z.array(z.string()).optional(),
    shouldLLMFilter: z.boolean().optional(),
  })),
  async (c) => {
    const user = c.get('user')
    const updates = c.req.valid('json')
    
    try {
      // Get existing settings
      const settingsKey = `settings:${user.id}`
      const existingSettings = await c.env.KV.get(settingsKey, 'json') || {}
      
      // Merge with updates
      const newSettings = {
        ...existingSettings,
        ...updates,
      }
      
      // Save to KV
      await c.env.KV.put(settingsKey, JSON.stringify(newSettings))
      
      return c.json({
        message: 'Settings updated successfully',
        settings: newSettings,
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      return c.json({ error: 'Failed to update settings' }, 500)
    }
  }
)