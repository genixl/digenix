import type { z } from 'zod'
import { userCreateSchema, userUpdateSchema } from '#shared/schemas/auth'
import { contentSchemas, imageUploadSchema, type AdminResourceName } from '#shared/schemas/content'
import { isUniqueViolation } from '~~/server/db'
import { detectImageType, uploadImage, type StoredImage } from '~~/server/services/cloudinary.service'
import { caseStudyContent, content, inquiryContent } from '~~/server/services/content.service'
import { createUser, deleteUser, listUsers, updateUser, type PublicUser } from '~~/server/services/users.service'

type Row = object

interface AdminResource {
  createSchema?: z.ZodType
  updateSchema?: z.ZodType
  list: () => Promise<Row[]>
  create?: (input: unknown) => Promise<Row | undefined>
  update?: (id: number, input: unknown, actor: PublicUser) => Promise<Row | undefined>
  remove?: (id: number, actor: PublicUser) => Promise<boolean>
}

interface ContentStore<T> {
  list: () => Promise<Row[]>
  create: (input: T) => Promise<Row | undefined>
  update: (id: number, input: T) => Promise<Row | undefined>
  remove: (id: number) => Promise<boolean>
}

/** Binds a store to its shared schema. Inputs are re-parsed here so the store only ever sees typed, validated data. */
function editable<S extends z.ZodType>(schema: S, store: ContentStore<z.output<S>>): AdminResource {
  return {
    createSchema: schema,
    updateSchema: schema,
    list: () => store.list(),
    create: input => store.create(schema.parse(input)),
    update: (id, input) => store.update(id, schema.parse(input)),
    remove: id => store.remove(id)
  }
}

const conflict = (statusMessage: string) => createError({ statusCode: 409, statusMessage })

const resources: Record<AdminResourceName, AdminResource> = {
  'services': editable(contentSchemas.services, content.services),
  'case-studies': editable(contentSchemas['case-studies'], caseStudyContent),
  'products': editable(contentSchemas.products, content.products),
  'metrics': editable(contentSchemas.metrics, content.metrics),
  'hero-tiles': editable(contentSchemas['hero-tiles'], content['hero-tiles']),
  'process-steps': editable(contentSchemas['process-steps'], content['process-steps']),
  'tech-stack': editable(contentSchemas['tech-stack'], content['tech-stack']),
  'commitments': editable(contentSchemas.commitments, content.commitments),
  'disciplines': editable(contentSchemas.disciplines, content.disciplines),
  'principles': editable(contentSchemas.principles, content.principles),
  'engagement-models': editable(contentSchemas['engagement-models'], content['engagement-models']),
  'contact-steps': editable(contentSchemas['contact-steps'], content['contact-steps']),
  'faqs': editable(contentSchemas.faqs, content.faqs),
  'page-sections': editable(contentSchemas['page-sections'], content['page-sections']),
  'team-members': editable(contentSchemas['team-members'], content['team-members']),
  'users': {
    createSchema: userCreateSchema,
    updateSchema: userUpdateSchema,
    list: listUsers,
    create: input => createUser(userCreateSchema.parse(input)),
    update: (id, input, actor) => {
      const data = userUpdateSchema.parse(input)
      if (id === actor.id && data.role !== actor.role) throw conflict('You cannot change your own role')
      return updateUser(id, data)
    },
    remove: (id, actor) => {
      if (id === actor.id) throw conflict('You cannot delete your own account')
      return deleteUser(id)
    }
  },
  'inquiries': {
    list: () => inquiryContent.list(),
    remove: id => inquiryContent.remove(id)
  }
}

const notFound = () => createError({ statusCode: 404, statusMessage: 'Record not found' })
const notAllowed = () => createError({ statusCode: 405, statusMessage: 'This resource is read-only' })

function recordId(row: Row): unknown {
  return 'id' in row ? row.id : undefined
}

function audit(action: string, resource: AdminResourceName, id: unknown, actor: PublicUser): void {
  logger.info(`admin.${action}`, { resource, recordId: id, userId: actor.id, role: actor.role })
}

async function mapConflicts<T>(write: Promise<T>): Promise<T> {
  try {
    return await write
  } catch (error) {
    if (isUniqueViolation(error)) throw conflict('A record with this slug, key or email already exists')
    throw error
  }
}

export function writeSchema(resource: AdminResourceName, mode: 'create' | 'update'): z.ZodType {
  const schema = mode === 'create' ? resources[resource].createSchema : resources[resource].updateSchema
  if (!schema) throw notAllowed()
  return schema
}

export function listRecords(resource: AdminResourceName): Promise<Row[]> {
  return resources[resource].list()
}

export async function createRecord(resource: AdminResourceName, input: unknown, actor: PublicUser): Promise<Row> {
  const create = resources[resource].create
  if (!create) throw notAllowed()
  const row = await mapConflicts(create(input))
  if (!row) throw createError({ statusCode: 500, statusMessage: 'Server Error' })
  audit('create', resource, recordId(row), actor)
  return row
}

export async function updateRecord(resource: AdminResourceName, id: number, input: unknown, actor: PublicUser): Promise<Row> {
  const update = resources[resource].update
  if (!update) throw notAllowed()
  const row = await mapConflicts(update(id, input, actor))
  if (!row) throw notFound()
  audit('update', resource, id, actor)
  return row
}

export async function deleteRecord(resource: AdminResourceName, id: number, actor: PublicUser): Promise<void> {
  const remove = resources[resource].remove
  if (!remove) throw notAllowed()
  if (!await remove(id, actor)) throw notFound()
  audit('delete', resource, id, actor)
}

export async function uploadAdminImage(data: Buffer | undefined, actor: PublicUser): Promise<StoredImage> {
  const file = assertValid(imageUploadSchema.safeParse({ type: data && detectImageType(data), size: data?.length ?? 0 }))
  if (!data) throw createError({ statusCode: 422, statusMessage: 'Choose an image to upload' })
  try {
    const image = await uploadImage(data, file.type)
    logger.info('admin.image_upload', { publicId: image.publicId, bytes: file.size, userId: actor.id, role: actor.role })
    return image
  } catch (error) {
    logger.error('admin.image_upload_failed', error, { userId: actor.id, role: actor.role })
    throw createError({ statusCode: 502, statusMessage: 'The image could not be uploaded. Try again.' })
  }
}
