import { and, asc, desc, eq, like, type SQL } from 'drizzle-orm'
import type { PgColumn, PgInsertValue, PgTable, PgUpdateSetSource, SelectedFields } from 'drizzle-orm/pg-core'
import type { SelectResultFields } from 'drizzle-orm/query-builders/select.types'
import { useDb } from '~~/server/db'
import {
  caseStudies,
  caseStudyResults,
  commitments,
  contactSteps,
  disciplines,
  engagementModels,
  faqs,
  heroTiles,
  inquiries,
  metrics,
  pageSections,
  principles,
  processSteps,
  products,
  services,
  teamMembers,
  techStackItems
} from '~~/server/db/schema'
import type { CaseStudyInput, SectionPage, SectionSlot } from '#shared/schemas/content'
import type { ContactPayload } from '#shared/schemas/contact'
import { releaseImage } from './cloudinary.service'

type ListingTable = PgTable & { id: PgColumn, sortOrder: PgColumn, published: PgColumn }

const sectionColumns = {
  key: pageSections.key,
  eyebrow: pageSections.eyebrow,
  title: pageSections.title,
  highlight: pageSections.highlight,
  body: pageSections.body,
  imageUrl: pageSections.imageUrl,
  imageAlt: pageSections.imageAlt
}

function imagePublicIdOf(row: object | undefined): string | null {
  return row && 'imagePublicId' in row && typeof row.imagePublicId === 'string' ? row.imagePublicId : null
}

/** Admin CRUD plus a published-only public listing for one content table. */
function contentTable<T extends ListingTable, C extends SelectedFields>(table: T, publicColumns: C) {
  type Row = T['$inferSelect']

  return {
    async list(): Promise<Row[]> {
      return useDb().select().from(table as PgTable).orderBy(asc(table.sortOrder), asc(table.id)) as Promise<Row[]>
    },

    async listPublished(): Promise<SelectResultFields<C>[]> {
      return useDb()
        .select(publicColumns)
        .from(table as PgTable)
        .where(eq(table.published, true))
        .orderBy(asc(table.sortOrder), asc(table.id)) as Promise<SelectResultFields<C>[]>
    },

    async create(values: PgInsertValue<T>): Promise<Row | undefined> {
      const [row] = await useDb().insert(table).values(values).returning() as Row[]
      return row
    },

    async update(id: number, values: PgUpdateSetSource<T>): Promise<Row | undefined> {
      const db = useDb()
      const [existing] = await db.select().from(table as PgTable).where(eq(table.id, id)).limit(1)
      if (!existing) return undefined
      const [row] = await db.update(table).set(values).where(eq(table.id, id)).returning() as Row[]
      const previousImage = imagePublicIdOf(existing)
      if (previousImage !== imagePublicIdOf(row)) await releaseImage(previousImage)
      return row
    },

    async remove(id: number): Promise<boolean> {
      const [row] = await useDb().delete(table).where(eq(table.id, id)).returning() as Row[]
      await releaseImage(imagePublicIdOf(row))
      return row !== undefined
    }
  }
}

const card = <T extends typeof commitments | typeof disciplines>(table: T) => ({
  id: table.id,
  title: table.title,
  icon: table.icon,
  description: table.description
})

export const content = {
  'services': contentTable(services, {
    id: services.id,
    slug: services.slug,
    title: services.title,
    icon: services.icon,
    summary: services.summary,
    deliverables: services.deliverables,
    timeline: services.timeline
  }),
  'products': contentTable(products, {
    id: products.id,
    tag: products.tag,
    title: products.title,
    description: products.description,
    imageUrl: products.imageUrl,
    imageAlt: products.imageAlt
  }),
  'metrics': contentTable(metrics, {
    id: metrics.id,
    value: metrics.value,
    label: metrics.label,
    showInHero: metrics.showInHero
  }),
  'hero-tiles': contentTable(heroTiles, {
    id: heroTiles.id,
    kind: heroTiles.kind,
    imageUrl: heroTiles.imageUrl,
    imageAlt: heroTiles.imageAlt,
    icon: heroTiles.icon,
    label: heroTiles.label,
    tone: heroTiles.tone
  }),
  'process-steps': contentTable(processSteps, {
    id: processSteps.id,
    title: processSteps.title,
    duration: processSteps.duration,
    description: processSteps.description,
    output: processSteps.output
  }),
  'tech-stack': contentTable(techStackItems, {
    id: techStackItems.id,
    category: techStackItems.category,
    name: techStackItems.name,
    icon: techStackItems.icon
  }),
  'commitments': contentTable(commitments, card(commitments)),
  'disciplines': contentTable(disciplines, card(disciplines)),
  'principles': contentTable(principles, {
    id: principles.id,
    title: principles.title,
    description: principles.description
  }),
  'engagement-models': contentTable(engagementModels, {
    id: engagementModels.id,
    title: engagementModels.title,
    icon: engagementModels.icon,
    description: engagementModels.description,
    bestFor: engagementModels.bestFor
  }),
  'contact-steps': contentTable(contactSteps, {
    id: contactSteps.id,
    title: contactSteps.title,
    description: contactSteps.description
  }),
  'faqs': contentTable(faqs, {
    id: faqs.id,
    question: faqs.question,
    answer: faqs.answer
  }),
  'page-sections': contentTable(pageSections, sectionColumns),
  'team-members': contentTable(teamMembers, {
    id: teamMembers.id,
    name: teamMembers.name,
    role: teamMembers.role,
    bio: teamMembers.bio,
    imageUrl: teamMembers.imageUrl,
    imageAlt: teamMembers.imageAlt
  })
}

export type PublicSection = Omit<SelectResultFields<typeof sectionColumns>, 'key'>

/** Published copy blocks for one page, keyed by slot name (e.g. `hero` for `home.hero`). */
export async function listSections<P extends SectionPage>(page: P): Promise<Partial<Record<SectionSlot<P>, PublicSection>>> {
  const rows = await useDb()
    .select(sectionColumns)
    .from(pageSections)
    .where(and(eq(pageSections.published, true), like(pageSections.key, `${page}.%`)))
  const slots: Partial<Record<string, PublicSection>> = Object.fromEntries(
    rows.map(({ key, ...section }) => [key.slice(page.length + 1), section])
  )
  return slots
}

function withResults() {
  return { columns: { value: true, label: true }, orderBy: [asc(caseStudyResults.sortOrder)] } satisfies {
    columns: { value: true, label: true }
    orderBy: SQL[]
  }
}

function resultRows(caseStudyId: number, results: CaseStudyInput['results']) {
  return results.map((result, index) => ({ ...result, caseStudyId, sortOrder: index }))
}

/** Case studies own their results rows, so every write runs in one transaction. */
export const caseStudyContent = {
  list() {
    return useDb().query.caseStudies.findMany({
      orderBy: [asc(caseStudies.sortOrder), asc(caseStudies.id)],
      with: { results: withResults() }
    })
  },

  listPublished() {
    return useDb().query.caseStudies.findMany({
      columns: { imagePublicId: false, published: false, sortOrder: false, createdAt: false, updatedAt: false },
      where: eq(caseStudies.published, true),
      orderBy: [asc(caseStudies.sortOrder), asc(caseStudies.id)],
      with: { results: withResults() }
    })
  },

  create({ results, ...study }: CaseStudyInput) {
    return useDb().transaction(async (tx) => {
      const [row] = await tx.insert(caseStudies).values(study).returning()
      if (!row) return undefined
      if (results.length) await tx.insert(caseStudyResults).values(resultRows(row.id, results))
      return { ...row, results }
    })
  },

  async update(id: number, { results, ...study }: CaseStudyInput) {
    const outcome = await useDb().transaction(async (tx) => {
      const [existing] = await tx
        .select({ imagePublicId: caseStudies.imagePublicId })
        .from(caseStudies)
        .where(eq(caseStudies.id, id))
        .limit(1)
      if (!existing) return undefined
      const [row] = await tx.update(caseStudies).set(study).where(eq(caseStudies.id, id)).returning()
      if (!row) return undefined
      await tx.delete(caseStudyResults).where(eq(caseStudyResults.caseStudyId, id))
      if (results.length) await tx.insert(caseStudyResults).values(resultRows(id, results))
      return { row: { ...row, results }, previousImage: existing.imagePublicId }
    })
    if (outcome && outcome.previousImage !== outcome.row.imagePublicId) await releaseImage(outcome.previousImage)
    return outcome?.row
  },

  async remove(id: number): Promise<boolean> {
    const [row] = await useDb().delete(caseStudies).where(eq(caseStudies.id, id)).returning()
    await releaseImage(row?.imagePublicId)
    return row !== undefined
  }
}

export const inquiryContent = {
  list() {
    return useDb().select().from(inquiries).orderBy(desc(inquiries.createdAt))
  },

  async create(input: ContactPayload) {
    const [row] = await useDb().insert(inquiries).values(input).returning({ reference: inquiries.reference })
    return row
  },

  async remove(id: number): Promise<boolean> {
    const deleted = await useDb().delete(inquiries).where(eq(inquiries.id, id)).returning({ id: inquiries.id })
    return deleted.length > 0
  }
}

export async function isOfferedService(title: string): Promise<boolean> {
  const [row] = await useDb()
    .select({ id: services.id })
    .from(services)
    .where(and(eq(services.published, true), eq(services.title, title)))
    .limit(1)
  return row !== undefined
}
