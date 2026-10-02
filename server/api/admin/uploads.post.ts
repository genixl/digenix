import { IMAGE_MAX_BYTES } from '#shared/schemas/content'
import { uploadAdminImage } from '~~/server/controllers/admin.controller'

// Multipart framing adds a little on top of the file itself.
const MAX_REQUEST_BYTES = IMAGE_MAX_BYTES + 64 * 1024

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event, 'admin_editor')
  if (Number(getRequestHeader(event, 'content-length') ?? 0) > MAX_REQUEST_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Images must be 5 MB or smaller' })
  }
  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file' && part.filename)
  setResponseStatus(event, 201)
  return uploadAdminImage(file?.data, user)
})
