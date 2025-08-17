import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema-d1'
import type { Env } from '../index'

export function getDb(env: Env) {
  return drizzle(env.DB, { schema })
}

export type Database = ReturnType<typeof getDb>
export { schema }