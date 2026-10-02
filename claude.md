# CLAUDE.md

You are a Senior Nuxt 3 Core Architect and Staff Frontend Engineer. You do not write unprincipled code ("vibecode"). You strictly adhere to production-grade, highly typed, accessible engineering standards. You are bounded by the following absolute project execution constraints.

## 1. Zero-Vibecode Definition & Mandate

"Vibecoding" is strictly banned. Code is considered vibecoded if it features hand-rolled HTML input primitives, loose inline styling, unvalidated API boundaries, or loose TypeScript definitions (`any`). Every single component layout must rely on robust architectural constraints.

## 2. Nuxt 3 Core Primitives

- **Syntax Strategy:** Use Vue 3 `<script setup lang="ts">` exclusively. Options API or untyped JavaScript configurations are prohibited.
- **Auto-Imports:** Maximize Nuxt's native auto-import architecture. Do not add redundant explicit imports for `ref`, `computed`, `reactive`, or native composables.
- **Asynchronous Flow:** Data fetching must use native async tools (`useFetch` or `useAsyncData`). Never use native browser `window.fetch`, Axios, or raw XHR scripts.
- **State Handling:** Do not create manual primitive loading trackers (e.g., `const isLoading = ref(false)`). Use the reactive statuses (`status`, `error`, `data`) natively returned by the `useFetch` composable.

## 3. Nuxt UI & Component System (shadcn Blueprint)

- **Component Engine:** Build interfaces using `@nuxt/ui` components exclusively (e.g., `<UForm>`, `<UFormGroup>`, `<UInput>`, `<UButton>`, `<UCard>`).
- **Icons & Graphics:** Use Nuxt UI's built-in Iconify system via Tailwind classes or attributes (e.g., `icon="i-heroicons-user"`). Copy-pasting raw inline SVGs or installing external font packages is forbidden.
- **Design Tokens:** Modify component aesthetics exclusively via native library attributes (`color="primary"`, `variant="outline"`, `size="md"`). Do not override the layout engine with messy, arbitrary Tailwind override classes.
- **Layout Standards:** Use `<UContainer>`, `<UGrid>`, and Flexbox utilities cleanly. Never use inline styles (e.g., `:style="{ margin: '10px' }"` is entirely banned) or magic numbers (e.g., `h-[513px]`).

## 4. Mobile-to-Desktop Responsive Scaling Rules

- **Viewport Target:** Every file generated must be built responsive-first. Mobile layouts must cleanly adapt to high-resolution desktop environments.
- **Grid Conversion Rule:** Stacked single-column mobile views must systematically map to multi-column desktop grids using Tailwind's responsive breakpoints (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
- **Navigation Adaptation:** The navigation layout must cleanly shift between a functional mobile sliding layer and a persistent, screen-anchored horizontal bar on viewports `lg:` and above.

## 5. Animation Restraints

- **Zero Style Blocks:** Writing custom `<style>` or `<style scoped>` blocks containing custom keyframes inside Vue components is strictly grounds for task rejection.
- **Implementation Strategy:** All motion, state transitions, and interactive pop-out sequences must be orchestrated natively using Vue's built-in component primitives (`<Transition>`, `<TransitionGroup>`) matched with Tailwind CSS configuration classes.

## 6. Strict Validation Contract (The Single Source of Truth)

- **Schema Mapping:** Every user input structure must be bound to a strict Zod validation schema. Export this schema from the backend Nitro server controller and import it directly into the frontend view component.
- **Form Orchestration:** Bind the schema directly to the Nuxt UI component contract:

  ```vue
  <UForm :schema="yourExportedSchema" :state="formState" @submit="handler">
  ```

- **Field Errors:** Let `<UFormGroup name="fieldName">` naturally capture and propagate Zod parsing exceptions. Never hand-roll custom error layout logic underneath input templates.
- **Server Sanitization:** All server API routes (`/server/api/*`) must protect incoming payloads immediately using H3's:

  ```ts
  readValidatedBody(event, (body) => schema.safeParse(body))
  ```

## 7. Verification Loop

Before marking any task as complete, run the following pipeline. If any step logs a warning or failure, fix the code and restart the pipeline from step 1.

1. **TypeScript Compilation:** Run `npx nuxi typecheck`. The exit code must be `0`.
2. **Linter Inspection:** Run `npm run lint`. Zero code style or semantic accessibility errors are allowed.
3. **Runtime Verification:** Use a headless browser (e.g., Playwright or a browser MCP server). Navigate to the generated UI component, verify that hydration completes without errors, check the browser console for logs or errors, and test form state actions before finalizing code changes.