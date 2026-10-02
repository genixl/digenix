import { getSiteContent } from '~~/server/controllers/content.controller'

export default defineEventHandler(() => getSiteContent())
