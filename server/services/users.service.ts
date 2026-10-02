import bcrypt from 'bcryptjs'
import { asc, eq } from 'drizzle-orm'
import { useDb } from '../db'
import { users } from '../db/schema'
import type { UserCreateInput, UserUpdateInput } from '../../shared/schemas/auth'

const BCRYPT_ROUNDS = 12

const publicColumns = {
  id: users.id,
  email: users.email,
  name: users.name,
  role: users.role,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt
}

export type PublicUser = Pick<typeof users.$inferSelect, keyof typeof publicColumns>

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/** Internal lookup that includes the password hash. Never return its result to a client. */
export async function findUserCredentials(email: string) {
  const [user] = await useDb().select().from(users).where(eq(users.email, email)).limit(1)
  return user
}

export async function findUser(id: number): Promise<PublicUser | undefined> {
  const [user] = await useDb().select(publicColumns).from(users).where(eq(users.id, id)).limit(1)
  return user
}

export function listUsers(): Promise<PublicUser[]> {
  return useDb().select(publicColumns).from(users).orderBy(asc(users.id))
}

export async function createUser(input: UserCreateInput): Promise<PublicUser | undefined> {
  const { password, ...profile } = input
  const [user] = await useDb()
    .insert(users)
    .values({ ...profile, passwordHash: await hashPassword(password) })
    .returning(publicColumns)
  return user
}

export async function updateUser(id: number, input: UserUpdateInput): Promise<PublicUser | undefined> {
  const { password, ...profile } = input
  const [user] = await useDb()
    .update(users)
    .set(password ? { ...profile, passwordHash: await hashPassword(password) } : profile)
    .where(eq(users.id, id))
    .returning(publicColumns)
  return user
}

export async function deleteUser(id: number): Promise<boolean> {
  const deleted = await useDb().delete(users).where(eq(users.id, id)).returning({ id: users.id })
  return deleted.length > 0
}
