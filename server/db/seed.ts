import { userCreateSchema } from '../../shared/schemas/auth'
import { serviceSchema, type ServiceInput } from '../../shared/schemas/content'
import { hashPassword } from '../services/users.service'
import { logger } from '../utils/logger'
import { createDb } from './index'
import { services, users } from './schema'

const defaultServices: ServiceInput[] = [
  {
    slug: 'web',
    title: 'Web platforms',
    icon: 'i-lucide-globe',
    summary: 'Customer portals, marketplaces and internal tools built on Vue, Nuxt and TypeScript: fast on first load, accessible by default and easy for your team to extend.',
    deliverables: ['Server-rendered web applications', 'Customer and partner portals', 'Headless commerce', 'Admin dashboards and back offices'],
    timeline: 'Typically 6–16 weeks to first release',
    sortOrder: 1,
    published: true
  },
  {
    slug: 'mobile',
    title: 'Mobile apps',
    icon: 'i-lucide-smartphone',
    summary: 'iOS and Android apps from a single Flutter or React Native codebase, with offline sync, push notifications and the store release pipeline already wired.',
    deliverables: ['iOS and Android from one codebase', 'Offline-first data sync', 'Push notifications and deep links', 'App Store and Play Store releases'],
    timeline: 'Typically 8–14 weeks to store launch',
    sortOrder: 2,
    published: true
  },
  {
    slug: 'cloud',
    title: 'Cloud & DevOps',
    icon: 'i-lucide-cloud-cog',
    summary: 'Infrastructure as code, CI/CD and observability, so deployments become a non-event and you hear about an incident before your customers do.',
    deliverables: ['Terraform-managed AWS, GCP or Azure', 'Containers and Kubernetes', 'CI/CD pipelines', 'Monitoring, alerting and cost reviews'],
    timeline: 'Typically 3–8 weeks per platform',
    sortOrder: 3,
    published: true
  },
  {
    slug: 'design',
    title: 'UI/UX design',
    icon: 'i-lucide-pen-tool',
    summary: 'Research-led product design. We interview your users, map the journeys that matter and hand over a component library engineers can build from directly.',
    deliverables: ['User interviews and journey mapping', 'Wireframes and clickable prototypes', 'Design systems in Figma', 'Usability testing'],
    timeline: 'Typically 3–6 weeks per product area',
    sortOrder: 4,
    published: true
  },
  {
    slug: 'ai',
    title: 'AI & automation',
    icon: 'i-lucide-bot',
    summary: 'Practical AI where it pays for itself: document extraction, support copilots and workflow automation, evaluated against your own data before it ships.',
    deliverables: ['LLM-powered assistants', 'Document and data extraction', 'Workflow automation', 'Evaluation suites and guardrails'],
    timeline: 'Typically a 2-week pilot, then staged rollout',
    sortOrder: 5,
    published: true
  },
  {
    slug: 'consulting',
    title: 'Technical consulting',
    icon: 'i-lucide-compass',
    summary: 'Architecture reviews, technical due diligence and delivery rescue for teams that need a senior second opinion before committing budget.',
    deliverables: ['Architecture and code audits', 'Technical due diligence', 'Build-versus-buy assessments', 'Roadmap and team planning'],
    timeline: 'Typically 1–3 weeks per engagement',
    sortOrder: 6,
    published: true
  },
  {
    slug: 'maintenance',
    title: 'Maintenance & support',
    icon: 'i-lucide-life-buoy',
    summary: 'Ongoing care for software already in production: security patches, dependency upgrades, performance work and an agreed response time when something breaks.',
    deliverables: ['Security and dependency updates', 'Performance tuning', 'Agreed response times', 'Monthly health reports'],
    timeline: 'Monthly retainer, cancel with 30 days notice',
    sortOrder: 7,
    published: true
  }
]

/** Idempotent: inserts missing default services and the first admin, never overwrites existing rows. */
async function seed(): Promise<void> {
  const databaseUrl = process.env.NUXT_DATABASE_URL
  if (!databaseUrl) throw new Error('NUXT_DATABASE_URL is not set')

  const admin = userCreateSchema.parse({
    name: process.env.SEED_ADMIN_NAME,
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    role: 'admin_editor'
  })
  const serviceRows = defaultServices.map(service => serviceSchema.parse(service))
  const passwordHash = await hashPassword(admin.password)

  const db = createDb(databaseUrl)
  try {
    const result = await db.transaction(async (tx) => {
      const insertedServices = await tx
        .insert(services)
        .values(serviceRows)
        .onConflictDoNothing({ target: services.slug })
        .returning({ id: services.id })
      const insertedAdmins = await tx
        .insert(users)
        .values({ name: admin.name, email: admin.email, role: admin.role, passwordHash })
        .onConflictDoNothing({ target: users.email })
        .returning({ id: users.id })
      return { services: insertedServices.length, admins: insertedAdmins.length }
    })
    logger.info('seed.completed', { servicesInserted: result.services, adminsInserted: result.admins })
  } finally {
    await db.$client.end()
  }
}

seed().catch((error: unknown) => {
  logger.error('seed.failed', error)
  process.exitCode = 1
})
