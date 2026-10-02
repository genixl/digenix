import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { adminRoles } from '../../../shared/schemas/auth'

export const adminRole = pgEnum('admin_role', adminRoles)

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text().notNull().unique(),
  name: text().notNull(),
  passwordHash: text().notNull(),
  role: adminRole().notNull().default('admin_viewer'),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

export type User = typeof users.$inferSelect
