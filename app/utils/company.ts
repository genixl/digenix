import type { NavigationMenuItem } from '@nuxt/ui'

export const siteName = 'Digenix'

export const navigation: NavigationMenuItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]

export interface Photo {
  id: string
  alt: string
}

export function photoUrl(photo: Photo, width: number, height: number): string {
  return `https://images.unsplash.com/${photo.id}?w=${width}&h=${height}&fit=crop&auto=format&q=70`
}

export const teamPhoto: Photo = {
  id: 'photo-1522071820081-009f0129c71c',
  alt: 'Engineers and designers working together around a table'
}

export const studioPhoto: Photo = {
  id: 'photo-1556761175-5973dc0f32e7',
  alt: 'Team gathered in an open studio for a project review'
}

export type HeroVisual
  = | { kind: 'photo', photo: Photo }
    | { kind: 'mark', icon: string, label: string, tone: 'primary' | 'secondary' }

export const heroVisuals: HeroVisual[] = [
  { kind: 'photo', photo: { id: 'photo-1522071820081-009f0129c71c', alt: 'Developers collaborating around laptops' } },
  { kind: 'mark', icon: 'i-lucide-code-xml', label: 'Web platforms', tone: 'primary' },
  { kind: 'photo', photo: { id: 'photo-1461749280684-dccba630e2f6', alt: 'Source code on a monitor' } },
  { kind: 'photo', photo: { id: 'photo-1581291518857-4e27b48ff24e', alt: 'Designer sketching wireframes' } },
  { kind: 'photo', photo: { id: 'photo-1558494949-ef010cbdcc31', alt: 'Server rack with network cabling' } },
  { kind: 'mark', icon: 'i-lucide-smartphone', label: 'Mobile apps', tone: 'secondary' },
  { kind: 'photo', photo: { id: 'photo-1512941937669-90a1b58e7e9c', alt: 'Smartphone home screen with apps' } },
  { kind: 'photo', photo: { id: 'photo-1551434678-e076c223a692', alt: 'Engineers pairing at a shared desk' } },
  { kind: 'mark', icon: 'i-lucide-cloud-cog', label: 'Cloud & DevOps', tone: 'primary' },
  { kind: 'photo', photo: { id: 'photo-1551288049-bebda4e38f71', alt: 'Analytics dashboard with charts' } },
  { kind: 'photo', photo: { id: 'photo-1586717791821-3f44a563fa4c', alt: 'Interface wireframes drawn on a tablet' } },
  { kind: 'mark', icon: 'i-lucide-bot', label: 'AI & automation', tone: 'secondary' },
  { kind: 'photo', photo: { id: 'photo-1542831371-29b0f74f9713', alt: 'Close-up of front-end code' } },
  { kind: 'photo', photo: { id: 'photo-1519389950473-47ba0277781c', alt: 'Team working on laptops from above' } }
]

export interface Service {
  slug: string
  title: string
  icon: string
  summary: string
  deliverables: string[]
  timeline: string
}

export const services: Service[] = [
  {
    slug: 'web',
    title: 'Web platforms',
    icon: 'i-lucide-globe',
    summary: 'Customer portals, marketplaces and internal tools built on Vue, Nuxt and TypeScript: fast on first load, accessible by default and easy for your team to extend.',
    deliverables: ['Server-rendered web applications', 'Customer and partner portals', 'Headless commerce', 'Admin dashboards and back offices'],
    timeline: 'Typically 6–16 weeks to first release'
  },
  {
    slug: 'mobile',
    title: 'Mobile apps',
    icon: 'i-lucide-smartphone',
    summary: 'iOS and Android apps from a single Flutter or React Native codebase, with offline sync, push notifications and the store release pipeline already wired.',
    deliverables: ['iOS and Android from one codebase', 'Offline-first data sync', 'Push notifications and deep links', 'App Store and Play Store releases'],
    timeline: 'Typically 8–14 weeks to store launch'
  },
  {
    slug: 'cloud',
    title: 'Cloud & DevOps',
    icon: 'i-lucide-cloud-cog',
    summary: 'Infrastructure as code, CI/CD and observability, so deployments become a non-event and you hear about an incident before your customers do.',
    deliverables: ['Terraform-managed AWS, GCP or Azure', 'Containers and Kubernetes', 'CI/CD pipelines', 'Monitoring, alerting and cost reviews'],
    timeline: 'Typically 3–8 weeks per platform'
  },
  {
    slug: 'design',
    title: 'UI/UX design',
    icon: 'i-lucide-pen-tool',
    summary: 'Research-led product design. We interview your users, map the journeys that matter and hand over a component library engineers can build from directly.',
    deliverables: ['User interviews and journey mapping', 'Wireframes and clickable prototypes', 'Design systems in Figma', 'Usability testing'],
    timeline: 'Typically 3–6 weeks per product area'
  },
  {
    slug: 'ai',
    title: 'AI & automation',
    icon: 'i-lucide-bot',
    summary: 'Practical AI where it pays for itself: document extraction, support copilots and workflow automation, evaluated against your own data before it ships.',
    deliverables: ['LLM-powered assistants', 'Document and data extraction', 'Workflow automation', 'Evaluation suites and guardrails'],
    timeline: 'Typically a 2-week pilot, then staged rollout'
  },
  {
    slug: 'consulting',
    title: 'Technical consulting',
    icon: 'i-lucide-compass',
    summary: 'Architecture reviews, technical due diligence and delivery rescue for teams that need a senior second opinion before committing budget.',
    deliverables: ['Architecture and code audits', 'Technical due diligence', 'Build-versus-buy assessments', 'Roadmap and team planning'],
    timeline: 'Typically 1–3 weeks per engagement'
  },
  {
    slug: 'maintenance',
    title: 'Maintenance & support',
    icon: 'i-lucide-life-buoy',
    summary: 'Ongoing care for software already in production: security patches, dependency upgrades, performance work and an agreed response time when something breaks.',
    deliverables: ['Security and dependency updates', 'Performance tuning', 'Agreed response times', 'Monthly health reports'],
    timeline: 'Monthly retainer, cancel with 30 days notice'
  }
]

export interface ProcessStep {
  title: string
  duration: string
  description: string
  output: string
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Discover',
    duration: 'Week 1',
    description: 'Workshops with your stakeholders and users to pin down the problem, the constraints and what success looks like in numbers.',
    output: 'Problem brief and success metrics'
  },
  {
    title: 'Define',
    duration: 'Week 2',
    description: 'We turn the brief into a scoped backlog, an architecture outline and a milestone plan with a fixed price for each milestone.',
    output: 'Milestone plan and fixed quote'
  },
  {
    title: 'Design',
    duration: 'Weeks 2–4',
    description: 'Clickable prototypes tested with real users, then a component library that engineering builds from directly.',
    output: 'Tested prototype and design system'
  },
  {
    title: 'Build',
    duration: '2-week sprints',
    description: 'Working software every sprint, deployed to a staging environment you can click through, with a live demo at the end of each cycle.',
    output: 'Demo-ready increment every sprint'
  },
  {
    title: 'Launch & evolve',
    duration: 'Ongoing',
    description: 'A rehearsed go-live, monitoring from the first minute, and a support plan that keeps the product healthy as it grows.',
    output: 'Production release and support plan'
  }
]

export interface TechGroup {
  label: string
  tools: { name: string, icon: string }[]
}

export const techStack: TechGroup[] = [
  {
    label: 'Frontend',
    tools: [
      { name: 'Vue', icon: 'i-simple-icons-vuedotjs' },
      { name: 'Nuxt', icon: 'i-simple-icons-nuxt' },
      { name: 'React', icon: 'i-simple-icons-react' },
      { name: 'TypeScript', icon: 'i-simple-icons-typescript' },
      { name: 'Tailwind CSS', icon: 'i-simple-icons-tailwindcss' }
    ]
  },
  {
    label: 'Mobile',
    tools: [
      { name: 'Flutter', icon: 'i-simple-icons-flutter' },
      { name: 'Kotlin', icon: 'i-simple-icons-kotlin' },
      { name: 'Swift', icon: 'i-simple-icons-swift' }
    ]
  },
  {
    label: 'Backend & data',
    tools: [
      { name: 'Node.js', icon: 'i-simple-icons-nodedotjs' },
      { name: 'Python', icon: 'i-simple-icons-python' },
      { name: 'Go', icon: 'i-simple-icons-go' },
      { name: 'PostgreSQL', icon: 'i-simple-icons-postgresql' },
      { name: 'Redis', icon: 'i-simple-icons-redis' },
      { name: 'GraphQL', icon: 'i-simple-icons-graphql' }
    ]
  },
  {
    label: 'Cloud & DevOps',
    tools: [
      { name: 'AWS', icon: 'i-simple-icons-amazonwebservices' },
      { name: 'Google Cloud', icon: 'i-simple-icons-googlecloud' },
      { name: 'Docker', icon: 'i-simple-icons-docker' },
      { name: 'Kubernetes', icon: 'i-simple-icons-kubernetes' },
      { name: 'Terraform', icon: 'i-simple-icons-terraform' },
      { name: 'GitHub Actions', icon: 'i-simple-icons-githubactions' }
    ]
  },
  {
    label: 'AI & ML',
    tools: [
      { name: 'OpenAI', icon: 'i-simple-icons-openai' },
      { name: 'PyTorch', icon: 'i-simple-icons-pytorch' },
      { name: 'LangChain', icon: 'i-simple-icons-langchain' },
      { name: 'Hugging Face', icon: 'i-simple-icons-huggingface' }
    ]
  },
  {
    label: 'Design',
    tools: [
      { name: 'Figma', icon: 'i-simple-icons-figma' }
    ]
  }
]

export interface CaseStudy {
  slug: string
  title: string
  client: string
  sector: string
  year: number
  photo: Photo
  summary: string
  challenge: string
  approach: string
  results: { value: string, label: string }[]
  stack: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'fleet-dispatch',
    title: 'Live dispatch for a regional logistics operator',
    client: 'Regional freight and last-mile carrier',
    sector: 'Logistics',
    year: 2025,
    photo: { id: 'photo-1460925895917-afdab827c52f', alt: 'Laptop showing a logistics analytics dashboard' },
    summary: 'Replaced phone-and-spreadsheet dispatch with a live web console and a driver app that works without signal.',
    challenge: 'Dispatchers juggled six tools and phoned drivers for every status update. Trucks routinely drove back empty because nobody could see spare capacity in time.',
    approach: 'We shadowed the dispatch desk for a week, then shipped a Nuxt console with live vehicle positions, a Flutter driver app with offline job sync, and a matching engine that suggests return loads.',
    results: [
      { value: '38%', label: 'fewer empty return trips' },
      { value: '6 → 1', label: 'tools replaced by one console' },
      { value: '14 wks', label: 'from kickoff to launch' }
    ],
    stack: ['Nuxt', 'Flutter', 'Node.js', 'PostgreSQL', 'AWS']
  },
  {
    slug: 'clinic-booking',
    title: 'Patient booking app for a network of clinics',
    client: 'Multi-site outpatient clinic group',
    sector: 'Healthcare',
    year: 2025,
    photo: { id: 'photo-1512941937669-90a1b58e7e9c', alt: 'Smartphone held in hand showing apps' },
    summary: 'A mobile app that lets patients book, reschedule and pay for appointments across every branch.',
    challenge: 'Call-centre queues peaked at 40 minutes on Monday mornings, and one in five booked appointments ended as a no-show.',
    approach: 'We designed the booking flow with patients in two rounds of usability testing, then built iOS and Android apps with SMS reminders and one-tap rescheduling backed by the clinics’ existing records system.',
    results: [
      { value: '61%', label: 'of bookings now self-service' },
      { value: '−27%', label: 'drop in no-shows' },
      { value: '4.7★', label: 'average store rating' }
    ],
    stack: ['Flutter', 'Kotlin', 'Python', 'PostgreSQL', 'Google Cloud']
  },
  {
    slug: 'lending-insights',
    title: 'Loan document automation for a credit cooperative',
    client: 'Member-owned savings and credit cooperative',
    sector: 'Financial services',
    year: 2024,
    photo: { id: 'photo-1551288049-bebda4e38f71', alt: 'Monitor displaying financial charts' },
    summary: 'An AI pipeline that reads payslips and bank statements, flags inconsistencies and pre-fills credit assessments.',
    challenge: 'Loan officers spent most of each application re-typing figures from scanned documents, and approvals took up to nine working days.',
    approach: 'We built an extraction pipeline evaluated against 1,200 anonymised historical applications, with every extracted figure linked back to its source line for officer review.',
    results: [
      { value: '9 → 2', label: 'days to a loan decision' },
      { value: '96%', label: 'field accuracy on held-out documents' },
      { value: '100%', label: 'of figures traceable to source' }
    ],
    stack: ['Python', 'OpenAI', 'LangChain', 'PostgreSQL', 'Docker']
  },
  {
    slug: 'retail-design-system',
    title: 'Design system for a growing retail brand',
    client: 'Omnichannel home-goods retailer',
    sector: 'Retail',
    year: 2024,
    photo: { id: 'photo-1586717791821-3f44a563fa4c', alt: 'Tablet showing interface wireframes' },
    summary: 'One component library shared by the online store, the staff tablet app and email templates.',
    challenge: 'Three agencies had built three storefront experiences. Every campaign needed the same banner rebuilt in three codebases.',
    approach: 'We audited 140 existing screens, consolidated them into a token-driven Figma library and a matching Vue component package with visual regression tests.',
    results: [
      { value: '140 → 38', label: 'screens consolidated into patterns' },
      { value: '3×', label: 'faster campaign launches' },
      { value: 'AA', label: 'WCAG 2.2 contrast across the library' }
    ],
    stack: ['Figma', 'Vue', 'TypeScript', 'Tailwind CSS']
  }
]

export interface Commitment {
  title: string
  icon: string
  description: string
}

export const commitments: Commitment[] = [
  {
    title: 'Fixed-scope milestones',
    icon: 'i-lucide-calendar-check',
    description: 'Every engagement is split into priced milestones with a demo at the end of each. You never pay for a sprint you have not seen.'
  },
  {
    title: 'You own everything',
    icon: 'i-lucide-key-round',
    description: 'Code, designs, cloud accounts and documentation live in your organisation from day one. No lock-in and no hostage repositories.'
  },
  {
    title: 'Senior engineers only',
    icon: 'i-lucide-badge-check',
    description: 'The people in the kickoff are the people writing the code. No hand-off to a junior bench once the contract is signed.'
  },
  {
    title: 'Quality you can measure',
    icon: 'i-lucide-gauge',
    description: 'Automated tests, accessibility checks and performance budgets run on every pull request, and the reports are shared with you.'
  }
]

export const proofPoints: { value: string, label: string }[] = [
  { value: '2 wks', label: 'between live demos' },
  { value: '1 day', label: 'response time on support tickets' },
  { value: '100%', label: 'code and IP ownership transferred' },
  { value: 'AA', label: 'WCAG 2.2 accessibility target' }
]

export interface Discipline {
  title: string
  icon: string
  description: string
}

export const disciplines: Discipline[] = [
  {
    title: 'Product engineering',
    icon: 'i-lucide-square-terminal',
    description: 'Full-stack engineers who own features end to end, from database migration to the last pixel.'
  },
  {
    title: 'Product design',
    icon: 'i-lucide-pen-tool',
    description: 'Designers who run research, prototype quickly and stay embedded with engineering through delivery.'
  },
  {
    title: 'Cloud & reliability',
    icon: 'i-lucide-server-cog',
    description: 'Platform engineers who automate infrastructure and keep production observable and boring.'
  },
  {
    title: 'Data & AI',
    icon: 'i-lucide-workflow',
    description: 'Engineers who build data pipelines and evaluate models against your data before anything ships.'
  }
]

export const principles: { title: string, description: string }[] = [
  {
    title: 'Write it down',
    description: 'Decisions, architecture and trade-offs are documented where you can read them, so knowledge never leaves with a person.'
  },
  {
    title: 'Ship small, ship often',
    description: 'Small releases are easier to test, easier to roll back and give you something real to react to every two weeks.'
  },
  {
    title: 'Leave it better',
    description: 'Every change comes with tests and a little cleanup, so the codebase gets easier to work in, not harder.'
  }
]
