import { jwtVerify, SignJWT } from 'jose'
import type { H3Event } from 'h3'
import { adminRoles, type AdminRole } from '#shared/schemas/auth'
import { findUser, type PublicUser } from '~~/server/services/users.service'

export const SESSION_COOKIE = 'dgx_session'
const SESSION_TTL_SECONDS = 60 * 60 * 2
const ISSUER = 'digenix-admin'

function secretKey(): Uint8Array {
  const secret = useRuntimeConfig().jwtSecret
  if (secret.length < 32) throw new Error('NUXT_JWT_SECRET must be at least 32 characters')
  return new TextEncoder().encode(secret)
}

export function signSession(user: Pick<PublicUser, 'id' | 'role'>): Promise<string> {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey())
}

/** Returns the user id from a valid token, or undefined for missing, expired or tampered tokens. */
export async function verifySession(token: string | undefined): Promise<number | undefined> {
  if (!token) return undefined
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER, algorithms: ['HS256'] })
    const id = Number(payload.sub)
    return Number.isInteger(id) && id > 0 ? id : undefined
  } catch {
    return undefined
  }
}

export function setSessionCookie(event: H3Event, token: string): void {
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  })
}

export function clearSessionCookie(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE, { httpOnly: true, secure: !import.meta.dev, sameSite: 'strict', path: '/' })
}

/** Resolves the signed-in user from the cookie, re-reading the role from the database on every request. */
export async function getSessionUser(event: H3Event): Promise<PublicUser | undefined> {
  const id = await verifySession(getCookie(event, SESSION_COOKIE))
  return id === undefined ? undefined : findUser(id)
}

/**
 * Reusable guard for every admin route. `admin_viewer` allows any signed-in admin,
 * `admin_editor` additionally requires write privileges.
 */
export async function requireAdmin(event: H3Event, minimum: AdminRole): Promise<PublicUser> {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (adminRoles.indexOf(user.role) < adminRoles.indexOf(minimum)) {
    logger.warn('auth.forbidden', { userId: user.id, role: user.role, method: event.method, path: event.path.split('?')[0] })
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  event.context.adminUser = user
  return user
}

declare module 'h3' {
  interface H3EventContext {
    adminUser?: PublicUser
  }
}
