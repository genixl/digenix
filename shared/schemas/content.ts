import { z } from 'zod'

export const IMAGE_FOLDER = 'digenix'
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const

export const imageUploadSchema = z.object({
  type: z.enum(imageTypes, { error: 'Upload a JPEG, PNG, WebP or AVIF image' }),
  size: z.number().int().positive('The file is empty').max(IMAGE_MAX_BYTES, 'Images must be 5 MB or smaller')
})

/** Every editable copy slot on the public site, grouped by page prefix. */
export const sectionKeys = [
  'site.footer',
  'home.hero',
  'home.gallery',
  'home.services',
  'home.servicesCta',
  'home.process',
  'home.technology',
  'home.work',
  'home.whyUs',
  'home.team',
  'home.contact',
  'home.seo',
  'services.hero',
  'services.engagement',
  'services.cta',
  'services.seo',
  'work.hero',
  'work.cta',
  'work.seo',
  'about.hero',
  'about.story',
  'about.principles',
  'about.disciplines',
  'about.team',
  'about.cta',
  'about.seo',
  'contact.hero',
  'contact.seo',
  'products.hero',
  'products.seo'
] as const
export type SectionKey = typeof sectionKeys[number]
type PageOf<K> = K extends `${infer P}.${string}` ? P : never
type SlotOf<K, P extends string> = K extends `${P}.${infer S}` ? S : never
export type SectionPage = PageOf<SectionKey>
export type SectionSlot<P extends SectionPage> = SlotOf<SectionKey, P>

const required = (label: string, max = 200) => z
  .string({ error: `${label} is required` })
  .trim()
  .min(1, `${label} is required`)
  .max(max, `${label} must be ${max} characters or fewer`)

const optional = (max = 200) => z.string().trim().max(max, `Keep it under ${max} characters`).default('')

const slug = z
  .string({ error: 'Slug is required' })
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes')
  .max(80, 'Slug must be 80 characters or fewer')

const icon = z
  .string({ error: 'Icon is required' })
  .trim()
  .regex(/^i-[a-z0-9]+(?:-[a-z0-9]+)+$/, 'Use an Iconify name such as i-lucide-globe')
  .max(80, 'Icon name is too long')

const textList = (label: string, max: number) => z
  .array(required(label, 120))
  .max(max, `Add at most ${max} items`)
  .default([])

const listing = {
  sortOrder: z.number({ error: 'Order must be a number' }).int().min(0).max(9999).default(0),
  published: z.boolean().default(true)
}

const image = {
  imageUrl: z
    .url({ error: 'Upload an image' })
    .refine(url => url.startsWith('https://res.cloudinary.com/'), 'Images must be uploaded through the admin')
    .nullable()
    .default(null),
  imagePublicId: z
    .string()
    .regex(new RegExp(`^${IMAGE_FOLDER}/[\\w-]+$`), 'Images must be uploaded through the admin')
    .nullable()
    .default(null),
  imageAlt: optional(200)
}

type ImageFields = { imageUrl: string | null, imageAlt: string }

function imageNeedsAlt(value: ImageFields, ctx: z.RefinementCtx): void {
  if (value.imageUrl && !value.imageAlt) {
    ctx.addIssue({ code: 'custom', path: ['imageAlt'], message: 'Describe the image for screen readers' })
  }
}

export const serviceSchema = z.object({
  slug,
  title: required('Title', 120),
  icon,
  summary: required('Summary', 600),
  deliverables: textList('Deliverable', 12),
  timeline: optional(160),
  ...listing
})

export const caseStudySchema = z.object({
  slug,
  title: required('Title', 160),
  client: required('Client', 160),
  sector: required('Sector', 80),
  year: z.number({ error: 'Year is required' }).int().min(1990, 'Enter a valid year').max(2100, 'Enter a valid year'),
  summary: required('Summary', 600),
  challenge: required('Challenge', 1200),
  approach: required('Approach', 1200),
  results: z
    .array(z.object({ value: required('Value', 20), label: required('Label', 120) }))
    .max(6, 'Add at most 6 results')
    .default([]),
  stack: textList('Technology', 20),
  ...image,
  ...listing
}).superRefine(imageNeedsAlt)

export const productSchema = z.object({
  tag: required('Tag', 40),
  title: required('Title', 120),
  description: required('Description', 600),
  ...image,
  ...listing
}).superRefine(imageNeedsAlt)

export const metricSchema = z.object({
  value: required('Value', 20),
  label: required('Label', 120),
  showInHero: z.boolean().default(false),
  ...listing
})

export const heroTileKinds = ['photo', 'mark'] as const
export const heroTileTones = ['primary', 'secondary'] as const

export const heroTileSchema = z.object({
  kind: z.enum(heroTileKinds, { error: 'Choose a tile kind' }),
  ...image,
  icon: z.union([z.literal(''), icon]).default(''),
  label: optional(60),
  tone: z.enum(heroTileTones).default('primary'),
  ...listing
}).superRefine((value, ctx) => {
  imageNeedsAlt(value, ctx)
  if (value.kind === 'photo' && !value.imageUrl) {
    ctx.addIssue({ code: 'custom', path: ['imageUrl'], message: 'Photo tiles need an image' })
  }
  if (value.kind === 'mark' && !value.icon) {
    ctx.addIssue({ code: 'custom', path: ['icon'], message: 'Mark tiles need an icon' })
  }
  if (value.kind === 'mark' && !value.label) {
    ctx.addIssue({ code: 'custom', path: ['label'], message: 'Mark tiles need a label' })
  }
})

export const processStepSchema = z.object({
  title: required('Title', 80),
  duration: required('Duration', 40),
  description: required('Description', 600),
  output: required('Output', 160),
  ...listing
})

export const techStackItemSchema = z.object({
  category: required('Category', 60),
  name: required('Name', 60),
  icon,
  ...listing
})

export const commitmentSchema = z.object({
  title: required('Title', 120),
  icon,
  description: required('Description', 600),
  ...listing
})

export const disciplineSchema = commitmentSchema

export const principleSchema = z.object({
  title: required('Title', 120),
  description: required('Description', 600),
  ...listing
})

export const engagementModelSchema = z.object({
  title: required('Title', 120),
  icon,
  description: required('Description', 600),
  bestFor: optional(120),
  ...listing
})

export const contactStepSchema = principleSchema

export const faqSchema = z.object({
  question: required('Question', 200),
  answer: required('Answer', 1200),
  ...listing
})

export const pageSectionSchema = z.object({
  key: z.enum(sectionKeys, { error: 'Choose a section' }),
  eyebrow: optional(80),
  title: optional(200),
  highlight: optional(120),
  body: optional(2000),
  ...image,
  published: listing.published
}).superRefine(imageNeedsAlt)

export const teamMemberSchema = z.object({
  name: required('Name', 120),
  role: required('Role', 120),
  bio: optional(600),
  ...image,
  ...listing
}).superRefine(imageNeedsAlt)

export const adminResourceNames = [
  'services',
  'case-studies',
  'products',
  'metrics',
  'hero-tiles',
  'process-steps',
  'tech-stack',
  'commitments',
  'disciplines',
  'principles',
  'engagement-models',
  'contact-steps',
  'faqs',
  'page-sections',
  'team-members',
  'users',
  'inquiries'
] as const
export type AdminResourceName = typeof adminResourceNames[number]
export type ContentResource = Exclude<AdminResourceName, 'users' | 'inquiries'>

/** Admin resources whose create and update payloads share one schema. */
export const contentSchemas = {
  'services': serviceSchema,
  'case-studies': caseStudySchema,
  'products': productSchema,
  'metrics': metricSchema,
  'hero-tiles': heroTileSchema,
  'process-steps': processStepSchema,
  'tech-stack': techStackItemSchema,
  'commitments': commitmentSchema,
  'disciplines': disciplineSchema,
  'principles': principleSchema,
  'engagement-models': engagementModelSchema,
  'contact-steps': contactStepSchema,
  'faqs': faqSchema,
  'page-sections': pageSectionSchema,
  'team-members': teamMemberSchema
} as const satisfies Record<ContentResource, z.ZodType>

export const adminResourceParamsSchema = z.object({
  resource: z.enum(adminResourceNames)
})

export const adminRecordParamsSchema = adminResourceParamsSchema.extend({
  id: z.coerce.number().int().positive()
})

export type ServiceInput = z.infer<typeof serviceSchema>
export type CaseStudyInput = z.infer<typeof caseStudySchema>
