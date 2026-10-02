import { contactSchema } from '#shared/schemas/contact'
import { submitInquiry } from '~~/server/controllers/content.controller'

export default defineEventHandler(async (event) => {
  const inquiry = assertValid(await readValidatedBody(event, body => contactSchema.safeParse(body)))
  return submitInquiry(inquiry)
})
