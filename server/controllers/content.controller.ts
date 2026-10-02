import type { ContactPayload } from '#shared/schemas/contact'
import { caseStudyContent, content, inquiryContent, isOfferedService, listSections } from '~~/server/services/content.service'

interface TechItem {
  category: string
  name: string
  icon: string
}

/** Groups tech items by category, keeping the admin-defined order of first appearance. */
export function groupTechStack(items: TechItem[]): { label: string, tools: { name: string, icon: string }[] }[] {
  const groups = new Map<string, { name: string, icon: string }[]>()
  for (const { category, name, icon } of items) {
    groups.set(category, [...groups.get(category) ?? [], { name, icon }])
  }
  return [...groups].map(([label, tools]) => ({ label, tools }))
}

export async function getSiteContent() {
  return { sections: await listSections('site') }
}

export async function getHomeContent() {
  const [sections, heroTiles, metrics, services, processSteps, techStack, caseStudies, commitments, disciplines] = await Promise.all([
    listSections('home'),
    content['hero-tiles'].listPublished(),
    content.metrics.listPublished(),
    content.services.listPublished(),
    content['process-steps'].listPublished(),
    content['tech-stack'].listPublished(),
    caseStudyContent.listPublished(),
    content.commitments.listPublished(),
    content.disciplines.listPublished()
  ])
  return {
    sections,
    heroTiles,
    metrics,
    services,
    processSteps,
    techStack: groupTechStack(techStack),
    caseStudies: caseStudies.slice(0, 3),
    commitments,
    disciplines
  }
}

export async function getServicesContent() {
  const [sections, services, engagementModels] = await Promise.all([
    listSections('services'),
    content.services.listPublished(),
    content['engagement-models'].listPublished()
  ])
  return { sections, services, engagementModels }
}

export async function getWorkContent() {
  const [sections, caseStudies] = await Promise.all([listSections('work'), caseStudyContent.listPublished()])
  return { sections, caseStudies }
}

export async function getAboutContent() {
  const [sections, principles, disciplines, teamMembers] = await Promise.all([
    listSections('about'),
    content.principles.listPublished(),
    content.disciplines.listPublished(),
    content['team-members'].listPublished()
  ])
  return { sections, principles, disciplines, teamMembers }
}

export async function getContactContent() {
  const [sections, contactSteps, faqs, services] = await Promise.all([
    listSections('contact'),
    content['contact-steps'].listPublished(),
    content.faqs.listPublished(),
    content.services.listPublished()
  ])
  return { sections, contactSteps, faqs, services: services.map(service => service.title) }
}

export async function getProductsContent() {
  const [sections, products] = await Promise.all([listSections('products'), content.products.listPublished()])
  return { sections, products }
}

export async function submitInquiry(input: ContactPayload): Promise<{ reference: string }> {
  if (!await isOfferedService(input.service)) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: { service: ['Choose the service you need'] } })
  }
  const row = await inquiryContent.create(input)
  if (!row) throw createError({ statusCode: 500, statusMessage: 'Server Error' })
  logger.info('inquiry.received', { reference: row.reference, service: input.service })
  return row
}
