import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { nanoid } from 'nanoid'
import { eq, and } from 'drizzle-orm'
import type { Env } from '../index'
import { getDb, schema } from '../db'
import { getAuth } from '../lib/auth'
import { z } from 'zod'

export const projectsRouter = new Hono<{ Bindings: Env }>()

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

// List projects
projectsRouter.get(
  '/',
  requireAuth,
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    
    try {
      const projects = await db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.userId, user.id))
      
      return c.json({
        projects: projects.map(p => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        })),
      })
    } catch (error) {
      console.error('Error listing projects:', error)
      return c.json({ error: 'Failed to list projects' }, 500)
    }
  }
)

// Create project
projectsRouter.post(
  '/',
  requireAuth,
  zValidator('json', z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    slug: z.string().optional(),
  })),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const data = c.req.valid('json')
    
    try {
      const projectId = nanoid()
      const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-')
      
      const [project] = await db
        .insert(schema.projects)
        .values({
          id: projectId,
          userId: user.id,
          name: data.name,
          description: data.description,
          slug,
        })
        .returning()
      
      return c.json({
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      })
    } catch (error) {
      console.error('Error creating project:', error)
      return c.json({ error: 'Failed to create project' }, 500)
    }
  }
)

// Delete project
projectsRouter.delete(
  '/:projectId',
  requireAuth,
  zValidator('json', z.object({
    confirmed: z.boolean(),
  })),
  async (c) => {
    const db = getDb(c.env)
    const user = c.get('user')
    const projectId = c.req.param('projectId')
    const { confirmed } = c.req.valid('json')
    
    if (!confirmed) {
      return c.json({ error: 'Deletion not confirmed' }, 400)
    }
    
    try {
      const [deleted] = await db
        .delete(schema.projects)
        .where(
          and(
            eq(schema.projects.id, projectId),
            eq(schema.projects.userId, user.id)
          )
        )
        .returning({ id: schema.projects.id, name: schema.projects.name })
      
      if (!deleted) {
        return c.json({ error: 'Project not found' }, 404)
      }
      
      return c.json({
        message: `Project "${deleted.name}" deleted successfully`,
        id: deleted.id,
      })
    } catch (error) {
      console.error('Error deleting project:', error)
      return c.json({ error: 'Failed to delete project' }, 500)
    }
  }
)