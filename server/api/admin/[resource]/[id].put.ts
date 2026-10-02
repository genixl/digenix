import { adminRecordParamsSchema } from '#shared/schemas/content'
import { updateRecord, writeSchema } from '~~/server/controllers/admin.controller'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event, 'admin_editor')
  const { resource, id } = assertValid(await getValidatedRouterParams(event, params => adminRecordParamsSchema.safeParse(params)))
  const schema = writeSchema(resource, 'update')
  const input = assertValid(await readValidatedBody(event, body => schema.safeParse(body)))
  return updateRecord(resource, id, input, user)
})
