import { z } from 'zod'

export const adminRoles = ['admin_viewer', 'admin_editor'] as const
export type AdminRole = typeof adminRoles[number]

const email = z
  .email({ error: 'Enter a valid email address' })
  .trim()
  .toLowerCase()
  .max(254, 'Email is too long')

const name = z
  .string({ error: 'Name is required' })
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(120, 'Name is too long')

const password = z
  .string({ error: 'Password is required' })
  .min(12, 'Password must be at least 12 characters')
  .max(200, 'Password is too long')

export const loginSchema = z.object({
  email,
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required').max(200, 'Password is too long')
})

export const userCreateSchema = z.object({
  name,
  email,
  role: z.enum(adminRoles, { error: 'Choose a role' }),
  password
})

export const userUpdateSchema = userCreateSchema.extend({
  password: z.union([z.literal(''), password]).default('')
})

export type LoginInput = z.infer<typeof loginSchema>
export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
