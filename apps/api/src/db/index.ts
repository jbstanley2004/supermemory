import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import type { Env } from '../index'

export function getDb(env: Env) {
  // Use Hyperdrive connection string
  const sql = postgres(env.DATABASE_URL, {
    prepare: false,
  })
  
  return drizzle(sql, { schema })
}

export type Database = ReturnType<typeof getDb>
export { schema }