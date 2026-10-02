import { logout } from '~~/server/controllers/auth.controller'

export default defineEventHandler(async (event) => {
  logout(await getSessionUser(event))
  clearSessionCookie(event)
  return { ok: true }
})
