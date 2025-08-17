import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { organization } from 'better-auth/plugins'
import type { Env } from '../index'
import { getDb } from '../db'
import * as schema from '../db/schema'

export function getAuth(env: Env) {
  const db = getDb(env)
  
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: schema.users,
        session: schema.sessions,
        organization: schema.organizations,
        member: schema.organizationMembers,
      },
    }),
    
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    
    socialProviders: {
      github: env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET ? {
        clientId: env.AUTH_GITHUB_ID,
        clientSecret: env.AUTH_GITHUB_SECRET,
      } : undefined,
      google: env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET ? {
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET,
      } : undefined,
    },
    
    plugins: [
      openAPI(),
      organization({
        allowUserToCreateOrganization: true,
        organizationLimit: 5,
      }),
    ],
    
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
  })
}

export type Auth = ReturnType<typeof getAuth>