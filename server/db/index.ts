import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import * as schema from './schema'

export function createDb(connectionString: string) {
  return drizzle({ client: new Pool({ connectionString }), schema, casing: 'snake_case' })
}

export type Database = ReturnType<typeof createDb>

let instance: Database | undefined

/** The one shared database instance for the Nitro server. */
export function useDb(): Database {
  instance ??= createDb(useRuntimeConfig().databaseUrl)
  return instance
}

/** True when Postgres rejected a write because of a unique constraint. */
export function isUniqueViolation(error: unknown): boolean {
  for (let current = error; current instanceof Error; current = current.cause) {
    if ('code' in current && current.code === '23505') return true
  }
  return false
}
