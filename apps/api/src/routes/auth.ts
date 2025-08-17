import { Hono } from 'hono'
import type { Env } from '../index'
import { getAuth } from '../lib/auth'

export const authRouter = new Hono<{ Bindings: Env }>()

authRouter.all('*', async (c) => {
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})