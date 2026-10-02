import { loginSchema } from '#shared/schemas/auth'
import { login } from '~~/server/controllers/auth.controller'

export default defineEventHandler(async (event) => {
  const credentials = assertValid(await readValidatedBody(event, body => loginSchema.safeParse(body)))
  const { user, token } = await login(credentials, getRequestIP(event, { xForwardedFor: true }) ?? 'unknown')
  setSessionCookie(event, token)
  return { user }
})
