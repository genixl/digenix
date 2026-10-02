import { adminRecordParamsSchema } from '#shared/schemas/content'
import { deleteRecord } from '~~/server/controllers/admin.controller'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event, 'admin_editor')
  const { resource, id } = assertValid(await getValidatedRouterParams(event, params => adminRecordParamsSchema.safeParse(params)))
  await deleteRecord(resource, id, user)
  setResponseStatus(event, 204)
  return null
})
