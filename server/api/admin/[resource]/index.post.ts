import { adminResourceParamsSchema } from '#shared/schemas/content'
import { createRecord, writeSchema } from '~~/server/controllers/admin.controller'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event, 'admin_editor')
  const { resource } = assertValid(await getValidatedRouterParams(event, params => adminResourceParamsSchema.safeParse(params)))
  const schema = writeSchema(resource, 'create')
  const input = assertValid(await readValidatedBody(event, body => schema.safeParse(body)))
  setResponseStatus(event, 201)
  return createRecord(resource, input, user)
})
