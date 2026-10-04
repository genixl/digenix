interface SeoCopy {
  title: string
  body: string
  imageUrl: string | null
}

interface PageSeoOptions {
  /** Title used until an admin publishes the page's `seo` section. */
  title?: string
  /** The page's admin-managed `seo` section, which overrides everything when published. */
  seo: () => SeoCopy | undefined
  /** The section whose copy and image are auto-used when no `seo` section exists. */
  fallback: () => SeoCopy | undefined
}

const DESCRIPTION_LIMIT = 160

/** Collapses whitespace and trims to a search-snippet length on a word boundary. */
function summarize(text: string | undefined): string | undefined {
  const clean = text?.replace(/\s+/g, ' ').trim()
  if (!clean || clean.length <= DESCRIPTION_LIMIT) return clean || undefined
  return `${clean.slice(0, DESCRIPTION_LIMIT - 1).replace(/\s+\S*$/, '')}…`
}

/** Title, description, share preview and canonical URL for one public page. */
export function usePageSeo({ title, seo, fallback }: PageSeoOptions) {
  const siteUrl = useRuntimeConfig().public.siteUrl || useRequestURL().origin
  const route = useRoute()

  const pageTitle = computed(() => seo()?.title || title)
  const shareTitle = computed(() => pageTitle.value ? `${pageTitle.value} · ${siteName}` : siteName)
  const description = computed(() => summarize(seo()?.body || fallback()?.body))
  const url = computed(() => new URL(route.path, siteUrl).href)
  const image = computed(() => {
    const source = seo()?.imageUrl ?? fallback()?.imageUrl
    return source ? sizedImage(source, 1200, 630) : new URL('/digenix.png', siteUrl).href
  })

  useSeoMeta({
    title: pageTitle,
    description,
    ogTitle: shareTitle,
    ogDescription: description,
    ogUrl: url,
    ogImage: image,
    ogType: 'website',
    ogSiteName: siteName,
    twitterCard: 'summary_large_image'
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })

  return { description, url }
}
