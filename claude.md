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

- **Zero Style Blocks:** Never use `<style>` or `<style scoped>` blocks of any kind in Vue components, whether for keyframes, layout, or overrides. Style exclusively through Nuxt UI attributes and Tailwind utility classes. Any style block is grounds for task rejection.
- **Implementation Strategy:** All motion, state transitions, and interactive pop-out sequences must be orchestrated natively using Vue's built-in component primitives (`<Transition>`, `<TransitionGroup>`) matched with Tailwind CSS configuration classes.

## 6. Minimal Footprint: No Unnecessary Files or Code

- **Smallest Change Wins:** Write only the code the task requires. Do not add speculative features, extra abstractions, wrapper components, helpers, or utilities "just in case."
- **No File Sprawl:** Do not create new files unless the task cannot be done without them. Prefer editing existing files. Never create extra docs, READMEs, test scaffolds, example/demo pages, or config files that were not requested.
- **Reuse First:** Before creating a component, composable, or util, check whether one already exists in the project or in Nuxt / Nuxt UI, and reuse it.
- **No Dead Code:** Do not leave commented-out code, unused imports, unused variables, placeholder TODOs, or console logs behind.
- **No Over-Engineering:** Keep components short and focused. Do not split a simple view into many tiny files or add layers (stores, services, types files) unless the complexity demands it.

## 7. Strict Validation Contract (The Single Source of Truth)

- **Schema Mapping:** Every user input structure must be bound to a strict Zod validation schema. Define each schema once in a shared schema module (e.g. `shared/schemas/`) that contains only Zod definitions: no secrets, no database imports, no server-only code. Both the Nitro server and the frontend view import from it.
- **Form Orchestration:** Bind the schema directly to the Nuxt UI component contract:

  ```vue
  <UForm :schema="yourExportedSchema" :state="formState" @submit="handler">
  ```

- **Field Errors:** Let `<UFormGroup name="fieldName">` naturally capture and propagate Zod parsing exceptions. Never hand-roll custom error layout logic underneath input templates.
- **Server Sanitization:** All server API routes (`/server/api/*`) must protect incoming payloads immediately using H3's:

  ```ts
  readValidatedBody(event, (body) => schema.safeParse(body))
  ```

## 8. Backend Architecture

- **Server Only:** All server logic lives under `/server`. Secrets, database access, JWT signing, password hashing and Cloudinary credentials must never reach client code, the shared schema module, `runtimeConfig.public`, or any client bundle.
- **Layering:** Route handlers stay thin. Structure the server as: route handler (`server/api/*`) → controller (`server/controllers/*`) → service/query layer → Drizzle. Handlers validate input and call controllers, controllers hold the logic, and nothing else talks to the database directly.
- **Typed Everywhere:** No `any`. Infer types from Drizzle schemas (`$inferSelect`, `$inferInsert`) and Zod (`z.infer`) instead of hand-writing duplicate types.
- **Config Access:** Read environment values only through `useRuntimeConfig()` (private keys stay outside `public`). Never read `process.env` ad hoc inside handlers or components.
- **Error Responses:** Use H3 `createError` with correct status codes. Never leak stack traces, SQL, or internal messages to the client.

## 9. Database (PostgreSQL on Neon + Drizzle ORM)

- **Single Access Path:** Drizzle ORM is the only way the app talks to the database, including every query and transaction. No raw SQL strings, no other ORM or query builder.
- **Neon Driver:** Use the Neon serverless driver with Drizzle (`@neondatabase/serverless`). Create one shared db instance in `server/db/` and reuse it everywhere.
- **Config Files:** Maintain `drizzle.config.ts` at the project root and keep schema files in `server/db/schema/`. Schema changes go through generated migrations (`drizzle-kit generate` / `migrate`). Never edit the database by hand.
- **Transactions:** Any operation that writes to more than one table (or must be all-or-nothing) must run inside a Drizzle transaction.
- **Environment Variables:** Every database value (`DATABASE_URL`, etc.) lives in `.env`. Commit a `.env.example` with variable names only and never real values. `.env` stays in `.gitignore`.
- **Seeding:** Provide one idempotent seed script for the default service records and the first admin account (credentials supplied via `.env`, never hardcoded).

## 10. Authentication, Sessions & Roles

- **Auth Controllers:** Authentication is handled by dedicated server-side auth controllers (login, logout, current session). Handlers call them. Do not scatter auth logic across routes.
- **Passwords:** Hash with bcrypt before storing. Never store, log, or return plaintext passwords or hashes.
- **JWT in Cookies:** Issue a signed JWT with a short expiry and store it in an `httpOnly`, `secure` (in production), `sameSite` cookie set from the server using H3 cookie helpers. Never put tokens in `localStorage`, `sessionStorage`, or any client-readable storage. Logout clears the cookie server-side.
- **Roles:** Two admin roles exist: `admin_viewer` (read-only) and `admin_editor` (can create, update and delete content). Role checks are enforced on the server in a reusable auth middleware/guard for every admin route. Hiding buttons in the UI is never the only protection. Every write endpoint requires `admin_editor`.
- **No Public Registration:** There is no sign-up route. Admin accounts are created by the seed script or by an `admin_editor`.
- **Hidden Admin Area:** Login and dashboard routes are never linked from the public navbar, footer, or sitemap. Mark them `noindex`. Hiding is a convenience only. The real protection is server-side authentication.
- **Login Hardening:** Use a generic error for failed logins (never reveal whether the email exists) and add basic rate limiting on the login endpoint.
- **Route Guarding:** Protect admin pages with Nuxt route middleware that checks the session through the server, and never by trusting client state alone.

## 11. Content Management: No Hardcoded Data

- **Database Is the Source of Truth:** All content shown on the public site (projects, products, images, metrics, team, process steps, tech stack, case studies, copy, and so on) must come from the database through the API. No hardcoded arrays, static fallbacks, or placeholder data in components, pages, or composables.
- **Admin-Managed:** Only data entered by an `admin_editor` appears on the public site. If a table is empty, render a clean empty state and not fake content.
- **Services Exception:** Services are seeded as default records and are editable by `admin_editor`. They still render from the database, never from a hardcoded list.
- **Metrics:** Metrics and counters shown in the app are admin-managed records, not literals in the code.
- **Audit Rule:** Before adding any new UI that shows content, check whether it should be database-backed. If it is content, it goes in a table.
- **Public vs Admin Endpoints:** Public read endpoints return only published, public fields. Admin endpoints are authenticated and role-checked.

## 12. Image Storage (Cloudinary)

- **Cloudinary Only:** All uploaded images are stored in Cloudinary. The database stores only the returned URL and public ID, never the file itself.
- **Server-Side Credentials:** The Cloudinary API secret stays on the server. Uploads and deletions go through authenticated `admin_editor` endpoints. Validate file type and size before uploading.
- **Cleanup:** Deleting or replacing a record's image also deletes the old asset from Cloudinary.

## 13. Logging & Error Handling

- **Single Logger:** Use one shared logger utility for the whole application. No scattered `console.log` calls.
- **Two Streams:** Write an application log (requests, auth events, admin changes) to `logs/app.log` and a separate error log (exceptions, failed operations, stack traces) to `logs/error.log`. All log files use the `.log` extension and live in a gitignored `logs/` directory. Output also goes to stdout when deployed somewhere without a writable filesystem.
- **Never Log Secrets:** No passwords, tokens, cookies, API keys, or full request bodies containing sensitive fields.
- **Context:** Log the user ID and role (not credentials) on admin write actions, so changes can be traced.

## 14. Testing (Jest, added later)

- Jest will be introduced later, so write testable code now: keep controllers and services free of H3 event coupling where practical, and keep pure logic in small typed functions.
- Do not create test files or Jest config until asked.

## 15. Verification Loop

Before marking any task as complete, run the following pipeline. If any step logs a warning or failure, fix the code and restart the pipeline from step 1.

1. **TypeScript Compilation:** Run `npx nuxi typecheck`. The exit code must be `0`.
2. **Linter Inspection:** Run `npm run lint`. Zero code style or semantic accessibility errors are allowed.
3. **Database Check:** When the schema changes, generate a migration, confirm it applies cleanly, and confirm the app still runs against it.
4. **Security Check:** Confirm no secret appears in client code or `runtimeConfig.public`, every admin route is guarded server-side, and every write route requires `admin_editor`.
5. **Runtime Verification:** Use a headless browser (e.g., Playwright or a browser MCP server). Navigate to the generated UI, verify that hydration completes without errors, check the browser console for logs or errors, and test form state actions before finalizing code changes. For backend work, also exercise the API as an unauthenticated user, `admin_viewer`, and `admin_editor`.