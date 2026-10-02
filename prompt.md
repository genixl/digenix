# Task: Build the company landing page

## Role & Context
You are a senior software developer who has just set up a software development company and is now building its website. The initial Nuxt 3 project is already scaffolded and the folder structure is temporary. Follow every rule in `CLAUDE.md`. Work inside the existing structure, and reorganize it only where necessary.

## Goal
Build an interactive landing page that showcases everything a software development company offers, with a distinctive design identity that does not look like any typical agency or SaaS template.

## Step 1: Audit the Existing Design (before writing any code)
Inspect the prebuilt app and extract the design language already in use:
- Search `app.config.ts`, `tailwind.config.ts`, `nuxt.config.ts`, `assets/`, `layouts/`, `components/` and `pages/` for colors, fonts, spacing, and any existing component styling.
- Identify the primary, secondary, neutral and accent colors actually in use, plus the font families and type scale.
- Note the existing visual patterns (button style, spacing rhythm, section layout, icon style).
- Report your findings in a short summary before building.

**Do not invent a new palette or typography.** If something is missing (for example, no accent color exists), derive it from the existing colors so it stays consistent. Ask me only if the audit finds a real conflict.

## Hard Rules (strict)
1. **No rounded containers.** Cards, buttons, inputs, images, modals and badges all have sharp corners. Set this globally (Nuxt UI `ui` config in `app.config.ts`, rounded set to none) instead of overriding it per component.
2. **No placeholders.** No lorem ipsum, "Your text here", gray boxes, or stock-photo stand-ins. Write real, believable copy for a software company: services, process, tech stack, projects, team, contact. Use real imagery sources or crisp CSS/Iconify graphics.
3. **No `<style>` blocks, inline styles, or magic numbers.** Style only through Nuxt UI attributes and Tailwind utilities.
4. **No unnecessary files or code.** Edit existing files where possible, create a file only when the task needs it, and leave no dead code or extra demo pages.

## Design System: single source of truth
- Consolidate the audited colors, typography, spacing and radii (none) into one place: `app.config.ts` and `tailwind.config.ts`. Load fonts once, in one place.
- If tokens are currently scattered or hard-coded across files, move them into that central config and point the existing components at it.
- Every new element, the navbar included, consumes these tokens only. No hard-coded hex values, font names or font sizes in components.
- All pages share these tokens, while each page keeps its own layout character.

## Components & Libraries
- Build with `@nuxt/ui` (shadcn-style) components, and extend them with custom design elements where the identity needs it.
- Use a CDN-delivered library (shadcn-style component CDN) for custom elements where it helps. It must be loaded through Nuxt's native mechanisms (`nuxt.config.ts` / `useHead`) and not through ad-hoc script tags.
- Icons come from Nuxt UI's Iconify setup only.

## Navigation
- Use Nuxt's routing principles: `<NuxtLink>`, file-based `pages/`, and a shared layout in `layouts/`.
- The navbar is built from the audited colors and tokens.
- **Mobile:** a sliding menu layer. **Desktop (`lg:` and up):** a persistent horizontal bar anchored to the top.
- The transition between the two must be seamless: same links, same order, no layout jumps.
- Add smooth page transitions via Nuxt's `pageTransition` and `<Transition>`.

## Responsiveness
- Mobile-first. Single column on mobile, scaling to multi-column grids on `md:` and `lg:`.
- Elements must rearrange cleanly at every breakpoint. No horizontal scroll, no overlap, no clipped content.

## Page Identity
- Every page has its own character: its own layout rhythm, hero treatment, and composition, all built on the shared tokens so the site still feels like one brand.
- Create only the pages the navigation needs (e.g. Home, Services, Work, About, Contact).

## Landing Page: Hero Image Section
- A grid of images that **pop in and out at random positions while their images change**.
- Implement with Vue `<TransitionGroup>` and Tailwind transition/transform/opacity utility classes only. No custom keyframes and no style blocks.
- The randomization logic should be small, typed, and cleaned up on unmount (clear timers).
- Respect reduced-motion preferences (`motion-reduce:` variants).
- Image tiles are sharp-cornered and tuned for performance (sized, lazy-loaded where below the fold).

## Landing Page: Content Sections
Cover the full range of a software development company:
- Hero with value proposition and primary call to action
- Services (web, mobile, cloud/DevOps, UI/UX, AI/automation, consulting, maintenance)
- Development process
- Technology stack
- Selected work/case studies
- Why choose us / proof points
- Team or culture
- Contact form

Contact form follows `CLAUDE.md`: Zod schema exported from the Nitro server route, bound to `<UForm>`, validated with `readValidatedBody`.

## Verification
Before finishing, run the full verification loop from `CLAUDE.md` (typecheck, lint, headless browser check at mobile and desktop widths). Fix any failure and re-run. Then give a brief summary of what changed.