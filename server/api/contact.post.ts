import { z } from 'zod'
import { contactSchema } from '~~/server/utils/contactSchema'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, raw => contactSchema.safeParse(raw))

  if (!body.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: z.flattenError(body.error).fieldErrors
    })
  }

  const reference = crypto.randomUUID()
  await useStorage('data').setItem(`inquiries:${reference}`, {
    ...body.data,
    receivedAt: new Date().toISOString()
  })

  return { reference }
})
