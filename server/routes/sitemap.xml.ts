/** Public pages only: the admin area is never listed. */
const publicPaths = ['/', '/services', '/work', '/products', '/about', '/contact']

export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin
  const urls = publicPaths.map(path => `  <url><loc>${new URL(path, siteUrl).href}</loc></url>`)
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    ''
  ].join('\n')
})
