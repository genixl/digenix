import type { z } from 'zod'
import { adminRoles, userCreateSchema, userUpdateSchema } from '#shared/schemas/auth'
import { contentSchemas, heroTileKinds, heroTileTones, sectionKeys, type AdminResourceName } from '#shared/schemas/content'

export type AdminFieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'tags' | 'select' | 'image' | 'results' | 'password'

export interface AdminField {
  name: string
  label: string
  type: AdminFieldType
  options?: readonly string[]
  help?: string
}

export interface AdminColumn {
  key: string
  label: string
}

export interface AdminResourceMeta {
  label: string
  icon: string
  columns: AdminColumn[]
  fields: AdminField[]
  createSchema?: z.ZodType
  updateSchema?: z.ZodType
}

const iconHelp = 'Iconify name, e.g. i-lucide-globe or i-simple-icons-vuedotjs'

const text = (name: string, label: string, help?: string): AdminField => ({ name, label, type: 'text', help })
const textarea = (name: string, label: string, help?: string): AdminField => ({ name, label, type: 'textarea', help })
const icon: AdminField = { name: 'icon', label: 'Icon', type: 'text', help: iconHelp }
const image: AdminField[] = [
  { name: 'imageUrl', label: 'Image', type: 'image' },
  text('imageAlt', 'Image description', 'Read aloud by screen readers')
]
const listing: AdminField[] = [
  { name: 'sortOrder', label: 'Order', type: 'number', help: 'Lower numbers appear first' },
  { name: 'published', label: 'Published', type: 'boolean' }
]

const cols = (...pairs: [string, string][]): AdminColumn[] => pairs.map(([key, label]) => ({ key, label }))
const shared = (schema: z.ZodType) => ({ createSchema: schema, updateSchema: schema })

export const adminResourceMeta: Record<AdminResourceName, AdminResourceMeta> = {
  'services': {
    label: 'Services',
    icon: 'i-lucide-layers',
    columns: cols(['title', 'Title'], ['slug', 'Slug'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [
      text('title', 'Title'),
      text('slug', 'Slug', 'Used in links, e.g. /services#web'),
      icon,
      textarea('summary', 'Summary'),
      { name: 'deliverables', label: 'Deliverables', type: 'tags' },
      text('timeline', 'Timeline'),
      ...listing
    ],
    ...shared(contentSchemas.services)
  },
  'case-studies': {
    label: 'Projects',
    icon: 'i-lucide-briefcase',
    columns: cols(['title', 'Title'], ['sector', 'Sector'], ['year', 'Year'], ['published', 'Published']),
    fields: [
      text('title', 'Title'),
      text('slug', 'Slug'),
      text('client', 'Client'),
      text('sector', 'Sector'),
      { name: 'year', label: 'Year', type: 'number' },
      textarea('summary', 'Summary'),
      textarea('challenge', 'Challenge'),
      textarea('approach', 'Approach'),
      { name: 'results', label: 'Results', type: 'results', help: 'The first result is featured on the home page' },
      { name: 'stack', label: 'Technology', type: 'tags' },
      ...image,
      ...listing
    ],
    ...shared(contentSchemas['case-studies'])
  },
  'products': {
    label: 'Products',
    icon: 'i-lucide-package',
    columns: cols(['title', 'Title'], ['tag', 'Tag'], ['published', 'Published']),
    fields: [text('tag', 'Tag'), text('title', 'Title'), textarea('description', 'Description'), ...image, ...listing],
    ...shared(contentSchemas.products)
  },
  'metrics': {
    label: 'Metrics',
    icon: 'i-lucide-gauge',
    columns: cols(['value', 'Value'], ['label', 'Label'], ['showInHero', 'In hero'], ['published', 'Published']),
    fields: [
      text('value', 'Value', 'e.g. 2 wks or 100%'),
      text('label', 'Label'),
      { name: 'showInHero', label: 'Show in home hero', type: 'boolean', help: 'Up to three appear in the hero' },
      ...listing
    ],
    ...shared(contentSchemas.metrics)
  },
  'hero-tiles': {
    label: 'Hero images',
    icon: 'i-lucide-layout-grid',
    columns: cols(['kind', 'Kind'], ['label', 'Label'], ['imageAlt', 'Image'], ['published', 'Published']),
    fields: [
      { name: 'kind', label: 'Kind', type: 'select', options: heroTileKinds, help: 'Photo tiles show an image, mark tiles an icon and label' },
      ...image,
      { ...icon, help: `Mark tiles only. ${iconHelp}` },
      text('label', 'Label', 'Mark tiles only'),
      { name: 'tone', label: 'Tone', type: 'select', options: heroTileTones },
      ...listing
    ],
    ...shared(contentSchemas['hero-tiles'])
  },
  'process-steps': {
    label: 'Process steps',
    icon: 'i-lucide-list-ordered',
    columns: cols(['title', 'Title'], ['duration', 'Duration'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [text('title', 'Title'), text('duration', 'Duration'), textarea('description', 'Description'), text('output', 'Output'), ...listing],
    ...shared(contentSchemas['process-steps'])
  },
  'tech-stack': {
    label: 'Tech stack',
    icon: 'i-lucide-cpu',
    columns: cols(['category', 'Category'], ['name', 'Name'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [text('category', 'Category', 'Items are grouped by category'), text('name', 'Name'), icon, ...listing],
    ...shared(contentSchemas['tech-stack'])
  },
  'commitments': {
    label: 'Commitments',
    icon: 'i-lucide-handshake',
    columns: cols(['title', 'Title'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [text('title', 'Title'), icon, textarea('description', 'Description'), ...listing],
    ...shared(contentSchemas.commitments)
  },
  'disciplines': {
    label: 'Disciplines',
    icon: 'i-lucide-shapes',
    columns: cols(['title', 'Title'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [text('title', 'Title'), icon, textarea('description', 'Description'), ...listing],
    ...shared(contentSchemas.disciplines)
  },
  'principles': {
    label: 'Principles',
    icon: 'i-lucide-scale',
    columns: cols(['title', 'Title'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [text('title', 'Title'), textarea('description', 'Description'), ...listing],
    ...shared(contentSchemas.principles)
  },
  'engagement-models': {
    label: 'Engagement models',
    icon: 'i-lucide-file-signature',
    columns: cols(['title', 'Title'], ['bestFor', 'Best for'], ['published', 'Published']),
    fields: [text('title', 'Title'), icon, textarea('description', 'Description'), text('bestFor', 'Best for'), ...listing],
    ...shared(contentSchemas['engagement-models'])
  },
  'contact-steps': {
    label: 'Contact steps',
    icon: 'i-lucide-footprints',
    columns: cols(['title', 'Title'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [text('title', 'Title'), textarea('description', 'Description'), ...listing],
    ...shared(contentSchemas['contact-steps'])
  },
  'faqs': {
    label: 'FAQs',
    icon: 'i-lucide-circle-help',
    columns: cols(['question', 'Question'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [text('question', 'Question'), textarea('answer', 'Answer'), ...listing],
    ...shared(contentSchemas.faqs)
  },
  'page-sections': {
    label: 'Page copy',
    icon: 'i-lucide-text',
    columns: cols(['key', 'Section'], ['title', 'Title'], ['published', 'Published']),
    fields: [
      { name: 'key', label: 'Section', type: 'select', options: sectionKeys, help: 'Page and slot this copy fills' },
      text('eyebrow', 'Eyebrow', 'Small label above the title'),
      text('title', 'Title'),
      text('highlight', 'Highlight', 'Coloured words after the title (hero sections)'),
      textarea('body', 'Body', 'Separate paragraphs with a blank line'),
      ...image,
      { name: 'published', label: 'Published', type: 'boolean' }
    ],
    ...shared(contentSchemas['page-sections'])
  },
  'team-members': {
    label: 'Team',
    icon: 'i-lucide-users',
    columns: cols(['name', 'Name'], ['role', 'Role'], ['sortOrder', 'Order'], ['published', 'Published']),
    fields: [text('name', 'Name'), text('role', 'Role'), textarea('bio', 'Bio'), ...image, ...listing],
    ...shared(contentSchemas['team-members'])
  },
  'users': {
    label: 'Admin users',
    icon: 'i-lucide-shield-user',
    columns: cols(['name', 'Name'], ['email', 'Email'], ['role', 'Role']),
    fields: [
      text('name', 'Name'),
      text('email', 'Email'),
      { name: 'role', label: 'Role', type: 'select', options: adminRoles },
      { name: 'password', label: 'Password', type: 'password', help: 'At least 12 characters. Leave blank when editing to keep the current one.' }
    ],
    createSchema: userCreateSchema,
    updateSchema: userUpdateSchema
  },
  'inquiries': {
    label: 'Inquiries',
    icon: 'i-lucide-inbox',
    columns: cols(['createdAt', 'Received'], ['name', 'Name'], ['email', 'Email'], ['company', 'Company'], ['service', 'Service'], ['message', 'Message']),
    fields: []
  }
}

/** Blank form state for a new record, derived from the field types. */
export function emptyRecord(fields: AdminField[]): Record<string, unknown> {
  const values: Record<AdminFieldType, (field: AdminField) => unknown> = {
    text: () => '',
    textarea: () => '',
    password: () => '',
    number: field => (field.name === 'year' ? new Date().getFullYear() : 0),
    boolean: field => field.name === 'published',
    tags: () => [],
    results: () => [],
    select: field => field.options?.[0],
    image: () => null
  }
  const record: Record<string, unknown> = {}
  for (const field of fields) {
    record[field.name] = values[field.type](field)
    if (field.type === 'image') record.imagePublicId = null
  }
  return record
}
