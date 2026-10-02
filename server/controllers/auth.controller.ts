import { randomUUID } from 'node:crypto'
import type { LoginInput } from '#shared/schemas/auth'
import { findUserCredentials, hashPassword, verifyPassword, type PublicUser } from '~~/server/services/users.service'

const INVALID_LOGIN = 'Invalid email or password'

// Compared against when the email is unknown, so both failure paths take the same time.
let decoyHash: Promise<string> | undefined

export async function login(input: LoginInput, clientKey: string): Promise<{ user: PublicUser, token: string }> {
  if (loginRateLimit.isBlocked(clientKey)) {
    logger.warn('auth.login_rate_limited', { ip: clientKey })
    throw createError({ statusCode: 429, statusMessage: 'Too many attempts. Try again in a few minutes.' })
  }

  const account = await findUserCredentials(input.email)
  decoyHash ??= hashPassword(randomUUID())
  const valid = await verifyPassword(input.password, account?.passwordHash ?? await decoyHash)

  if (!account || !valid) {
    loginRateLimit.recordFailure(clientKey)
    logger.warn('auth.login_failed', { ip: clientKey })
    throw createError({ statusCode: 401, statusMessage: INVALID_LOGIN })
  }

  loginRateLimit.reset(clientKey)
  const user: PublicUser = {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt
  }
  logger.info('auth.login', { userId: user.id, role: user.role })
  return { user, token: await signSession(user) }
}

export function logout(user: PublicUser | undefined): void {
  logger.info('auth.logout', { userId: user?.id, role: user?.role })
}
