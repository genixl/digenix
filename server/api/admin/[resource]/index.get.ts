import { adminResourceParamsSchema } from '#shared/schemas/content'
import { listRecords } from '~~/server/controllers/admin.controller'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, 'admin_viewer')
  const { resource } = assertValid(await getValidatedRouterParams(event, params => adminResourceParamsSchema.safeParse(params)))
  return listRecords(resource)
})
