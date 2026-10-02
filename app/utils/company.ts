import type { NavigationMenuItem } from '@nuxt/ui'

export const siteName = 'Digenix'

export const navigation: NavigationMenuItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]

/** Requests a cropped, auto-format rendition of a Cloudinary upload. */
export function sizedImage(url: string, width: number, height: number): string {
  return url.replace('/image/upload/', `/image/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`)
}

/** Splits admin-entered copy into paragraphs on blank lines. */
export function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map(part => part.trim()).filter(Boolean)
}
