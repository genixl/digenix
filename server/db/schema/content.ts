import { relations } from 'drizzle-orm'
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { heroTileKinds, heroTileTones, type SectionKey } from '../../../shared/schemas/content'

const id = () => integer().primaryKey().generatedAlwaysAsIdentity()

const timestamps = () => ({
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())
})

const listing = () => ({
  sortOrder: integer().notNull().default(0),
  published: boolean().notNull().default(true),
  ...timestamps()
})

const image = () => ({
  imageUrl: text(),
  imagePublicId: text(),
  imageAlt: text().notNull().default('')
})

export const services = pgTable('services', {
  id: id(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  icon: text().notNull(),
  summary: text().notNull(),
  deliverables: text().array().notNull().default([]),
  timeline: text().notNull().default(''),
  ...listing()
})

export const caseStudies = pgTable('case_studies', {
  id: id(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  client: text().notNull(),
  sector: text().notNull(),
  year: integer().notNull(),
  summary: text().notNull(),
  challenge: text().notNull(),
  approach: text().notNull(),
  stack: text().array().notNull().default([]),
  ...image(),
  ...listing()
})

export const caseStudyResults = pgTable('case_study_results', {
  id: id(),
  caseStudyId: integer().notNull().references(() => caseStudies.id, { onDelete: 'cascade' }),
  value: text().notNull(),
  label: text().notNull(),
  sortOrder: integer().notNull().default(0)
})

export const caseStudiesRelations = relations(caseStudies, ({ many }) => ({
  results: many(caseStudyResults)
}))

export const caseStudyResultsRelations = relations(caseStudyResults, ({ one }) => ({
  caseStudy: one(caseStudies, { fields: [caseStudyResults.caseStudyId], references: [caseStudies.id] })
}))

export const products = pgTable('products', {
  id: id(),
  tag: text().notNull(),
  title: text().notNull(),
  description: text().notNull(),
  ...image(),
  ...listing()
})

export const metrics = pgTable('metrics', {
  id: id(),
  value: text().notNull(),
  label: text().notNull(),
  showInHero: boolean().notNull().default(false),
  ...listing()
})

export const heroTileKind = pgEnum('hero_tile_kind', heroTileKinds)
export const heroTileTone = pgEnum('hero_tile_tone', heroTileTones)

export const heroTiles = pgTable('hero_tiles', {
  id: id(),
  kind: heroTileKind().notNull(),
  ...image(),
  icon: text().notNull().default(''),
  label: text().notNull().default(''),
  tone: heroTileTone().notNull().default('primary'),
  ...listing()
})

export const processSteps = pgTable('process_steps', {
  id: id(),
  title: text().notNull(),
  duration: text().notNull(),
  description: text().notNull(),
  output: text().notNull(),
  ...listing()
})

export const techStackItems = pgTable('tech_stack_items', {
  id: id(),
  category: text().notNull(),
  name: text().notNull(),
  icon: text().notNull(),
  ...listing()
})

export const commitments = pgTable('commitments', {
  id: id(),
  title: text().notNull(),
  icon: text().notNull(),
  description: text().notNull(),
  ...listing()
})

export const disciplines = pgTable('disciplines', {
  id: id(),
  title: text().notNull(),
  icon: text().notNull(),
  description: text().notNull(),
  ...listing()
})

export const principles = pgTable('principles', {
  id: id(),
  title: text().notNull(),
  description: text().notNull(),
  ...listing()
})

export const engagementModels = pgTable('engagement_models', {
  id: id(),
  title: text().notNull(),
  icon: text().notNull(),
  description: text().notNull(),
  bestFor: text().notNull().default(''),
  ...listing()
})

export const contactSteps = pgTable('contact_steps', {
  id: id(),
  title: text().notNull(),
  description: text().notNull(),
  ...listing()
})

export const faqs = pgTable('faqs', {
  id: id(),
  question: text().notNull(),
  answer: text().notNull(),
  ...listing()
})

export const pageSections = pgTable('page_sections', {
  id: id(),
  key: text().$type<SectionKey>().notNull().unique(),
  eyebrow: text().notNull().default(''),
  title: text().notNull().default(''),
  highlight: text().notNull().default(''),
  body: text().notNull().default(''),
  ...image(),
  ...listing()
})

export const teamMembers = pgTable('team_members', {
  id: id(),
  name: text().notNull(),
  role: text().notNull(),
  bio: text().notNull().default(''),
  ...image(),
  ...listing()
})

export const inquiries = pgTable('inquiries', {
  id: id(),
  reference: uuid().notNull().unique().defaultRandom(),
  name: text().notNull(),
  email: text().notNull(),
  company: text().notNull(),
  service: text().notNull(),
  message: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
})
