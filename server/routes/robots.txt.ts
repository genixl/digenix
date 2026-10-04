export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${new URL('/sitemap.xml', siteUrl).href}`,
    ''
  ].join('\n')
})
