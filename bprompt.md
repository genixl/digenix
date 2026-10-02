# Task: Build the backend and move all hardcoded content into the database

## Role & Context
You are a full stack developer. The Nuxt 3 frontend is already built and set up, but much of its content is hardcoded. Your job is to build the backend so that content lives in the database and is managed by admins, then connect the frontend to it. Follow every rule in `CLAUDE.md`, especially sections 8-15.

## Goal
Eliminate hardcoded content. The public site must show only what an admin has entered. Admins manage everything through a hidden, authenticated admin area.

## Stack (fixed)
- **Database:** PostgreSQL on Neon
- **ORM:** Drizzle ORM, used for all database access, schema, migrations and transactions
- **Auth:** JWT in cookies, bcrypt for password hashing, handled through server-side auth controllers
- **Validation:** Zod on all user input, with schemas shared from one module
- **Images:** Cloudinary
- **Testing:** Jest will be added later, so write testable code now and do not add tests yet
- **Logging:** a full application log and a separate error log

## Step 1: Audit the Entire Application (before writing any code)
Go through every page, component, composable and layout, and list everything that is hardcoded and should come from the database. Look for:
- Projects, products, case studies
- Images and galleries (including the hero image grid)
- Metrics, counters and statistics
- Team members, testimonials, process steps, tech stack items
- Any other text or content blocks that an admin should be able to change

Report your findings as a table list (table name, fields, which components use it) and a short plan before building. Ask me only about real ambiguities, such as whether "products" and "projects" are the same thing.

**Services exception:** services are seeded as default records but remain editable by an admin with edit privileges. They must still be read from the database.

## Step 2: Database Setup
- Create `drizzle.config.ts` and all config files Drizzle needs, plus the db instance in `server/db/` using the Neon serverless driver.
- Define schemas in `server/db/schema/`, including the users table with roles and every content table found in the audit.
- Generate and apply migrations through drizzle-kit. Never change the database by hand.
- All database values live in `.env`. Create `.env.example` with variable names only, and make sure `.env` is gitignored.
- Write one idempotent seed script for the default services and the first admin account (credentials from `.env`, never hardcoded).
- Use Drizzle transactions for any multi-table or all-or-nothing writes.

## Step 3: Authentication & Roles
- Build auth controllers (login, logout, current session) in `server/controllers/`. Route handlers only call them.
- Hash passwords with bcrypt. Issue a short-lived signed JWT and store it in an `httpOnly`, `secure` (production), `sameSite` cookie set from the server. Never use `localStorage` or any client-readable storage for tokens.
- Two roles:
  - `admin_viewer`: read-only access to the admin area
  - `admin_editor`: can create, update and delete all content, images and metrics
- Enforce roles on the server with a reusable guard for every admin route. Every write route requires `admin_editor`.
- No public registration route. Accounts come from the seed script or from an `admin_editor`.
- The login page and admin area are never linked anywhere on the public site, are marked `noindex`, and are protected by Nuxt route middleware that verifies the session through the server.
- Use a generic error for failed logins and add basic rate limiting on the login endpoint.

## Step 4: Content API
- **Public endpoints:** read-only, return only published, public fields.
- **Admin endpoints:** authenticated and role-checked, with full create, read, update and delete for each content type.
- Every payload is validated with Zod through `readValidatedBody(event, (body) => schema.safeParse(body))`, using schemas from the shared schema module.
- Keep handlers thin: handler → controller → service/query → Drizzle.
- Return correct status codes through H3 `createError`. Never expose stack traces, SQL or internal messages.

## Step 5: Admin Dashboard
- Build the admin area with `@nuxt/ui` components, following the existing design tokens and the no-rounded-containers rule.
- Forms use `<UForm>` with the shared Zod schema.
- Cover management screens for every content type from the audit, including services (edit), metrics, projects, products, team and images.
- Viewers see the data with no edit controls, and the server still blocks any write attempt from them.
- Create only the pages and components this needs, with no extra files or demo pages.

## Step 6: Images (Cloudinary)
- Uploads go through an authenticated `admin_editor` endpoint. The Cloudinary secret stays on the server.
- Validate file type and size before uploading.
- Store only the returned URL and public ID in the database.
- Deleting or replacing a record's image also deletes the old Cloudinary asset.

## Step 7: Replace Hardcoded Content
- Switch every hardcoded value found in the audit to data fetched with `useFetch` / `useAsyncData`, using their returned `status`, `error` and `data`.
- Remove the old hardcoded arrays completely. No static fallbacks.
- Empty tables render a clean empty state, not fake content.
- The hero image grid animation keeps working with images that now come from the database.

## Step 8: Logging
- One shared logger utility. No scattered `console.log` calls.
- Write the application log (requests, auth events, admin changes) to `logs/app.log` and a separate error log (exceptions with stack traces) to `logs/error.log`. All log files use the `.log` extension and live in a gitignored `logs/` folder. Output also goes to stdout when the filesystem is not writable.
- Never log passwords, tokens, cookies, or secrets.
- Log the user ID and role on every admin write action.

## Hard Rules
- Server data and secrets never reach the client bundle, `runtimeConfig.public`, or the shared schema module.
- No `any`, no raw SQL, no hardcoded content, no `<style>` blocks, no rounded containers.
- No unnecessary files or code. Edit existing files where possible.

## Verification
Run the full verification loop from `CLAUDE.md` section 15 (typecheck, lint, migration check, security check, headless browser check). Test the API as an unauthenticated user, an `admin_viewer` and an `admin_editor`, and confirm that:
- visitors cannot reach or see any admin route,
- viewers cannot write,
- the public site shows only admin-entered data.

Fix any failure and re-run. Finish with a brief summary of what changed and what environment variables I need to fill in.