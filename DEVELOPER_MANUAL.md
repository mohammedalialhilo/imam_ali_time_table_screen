# DEVELOPER_MANUAL.md

## Project overview

`imam-ali-moskeen-display` is a Netlify-friendly mosque signage app for Imam Ali Moskeen in Copenhagen.

It has two primary surfaces:

- `index.html`: the public display, open to everyone
- `admin.html`: the protected admin dashboard for prayer times, events, theme, and admin-account management

The frontend is plain HTML, CSS, and JavaScript. Shared data is stored in Supabase and exposed to the browser through Netlify Functions.

## Tech stack

- plain HTML
- plain CSS with custom properties
- plain JavaScript ES modules
- checked-in standalone browser bundles for `file://` mode
- Netlify Functions with CommonJS
- Supabase Auth and Postgres
- optional Tesseract.js from CDN on `admin.html` only
- `localStorage` as a browser fallback cache

## File structure

```text
imam-ali-moskeen-display/
|-- index.html
|-- admin.html
|-- README.md
|-- USER_ADMIN_MANUAL.md
|-- DEVELOPER_MANUAL.md
|-- package.json
|-- .env.example
|-- netlify.toml
|-- assets/
|-- css/
|-- data/
|-- database/
|   |-- admin-auth.sql
|   `-- cleanup-archive-old-data.sql
|-- js/
|   |-- admin.js
|   |-- admin-standalone.js
|   |-- clock.js
|   |-- config.js
|   |-- display.js
|   |-- display-standalone.js
|   |-- events.js
|   |-- import-prayer-image.js
|   |-- prayer-times.js
|   |-- remote-data.js
|   |-- storage.js
|   `-- supabase-browser.js
`-- netlify/
    `-- functions/
        |-- _admin-auth.js
        |-- _shared.js
        |-- _supabase.js
        |-- public-supabase-config.js
        |-- auth-get-profile.js
        |-- admin-list-users.js
        |-- admin-create-user.js
        |-- admin-update-user-role.js
        |-- admin-disable-user.js
        |-- admin-delete-user.js
        |-- seed-super-admin.js
        |-- get-today-prayer-times.js
        |-- get-upcoming-event.js
        |-- get-admin-prayer-times.js
        |-- get-admin-events.js
        |-- save-prayer-times.js
        |-- save-event.js
        |-- archive-event.js
        |-- restore-event.js
        |-- restore-prayer-times.js
        |-- permanently-delete-event.js
        |-- permanently-delete-prayer-times.js
        |-- delete-event.js
        |-- today-prayer-times.js
        `-- upcoming-event.js
```

## Major frontend files

### `index.html`

Public display markup. It loads `js/display.js` on `http/https` and `js/display-standalone.js` on `file://`.

### `admin.html`

Protected admin markup. It contains:

- built-in login view
- access-denied view
- authenticated dashboard
- prayer-time import tools
- event management tools
- super-admin-only account management

### `js/config.js`

Central configuration:

- theme metadata
- prayer display modes
- sample paths
- Netlify Function paths
- text labels and fallback copy
- inline sample prayer and event data

### `js/prayer-times.js`

Prayer-time logic:

- schema validation
- `standard` vs `imamAliCopenhagen` display modes
- today's row lookup
- tomorrow lookup
- next-prayer calculation
- countdown helpers
- fallback load order

### `js/events.js`

Event logic:

- row normalization
- validation
- theme/category handling
- nearest-upcoming event selection
- remote/local/sample fallback load order

### `js/import-prayer-image.js`

Prayer-time image import support:

- OCR text cleanup
- Danish timetable parsing
- preview-row generation
- preview validation
- non-destructive live validation for editable preview cells

### `js/remote-data.js`

Browser-side Netlify Function client.

Responsibilities:

- public display reads
- protected admin reads and writes
- bearer token injection
- error translation for auth failures

This file never contains `SUPABASE_SERVICE_ROLE_KEY`.

### `js/supabase-browser.js`

Browser auth bootstrap.

It:

- loads the Supabase browser library from CDN
- fetches safe public config from `/.netlify/functions/public-supabase-config`
- creates the browser client with the anon key only

### `js/admin.js`

Authenticated admin runtime.

Responsibilities:

- login/logout
- session restore
- access checks through `auth-get-profile`
- role-based UI
- prayer import and preview editing
- event create/edit/archive flows
- super-admin account management

Preview editing note:

- the parsed timetable preview is rendered once after parsing
- cell edits update `state.previewRows` immediately
- live validation runs without replacing the active input element
- full preview re-rendering is reserved for parse/reset/save flows

### `js/display.js`

Public display runtime.

Responsibilities:

- load theme
- load prayer times and events
- render live clock and countdown
- highlight the next prayer
- refresh remote data every minute
- reload shortly after midnight

## Major backend files

### `netlify/functions/_supabase.js`

Shared Supabase client factory.

Exports:

- `createSupabaseAnonClient()`
- `createSupabaseAdminClient()`

Only Netlify Functions use the service role key.

### `netlify/functions/_shared.js`

Shared server-side helpers:

- JSON responses
- request parsing
- prayer and event normalization
- camelCase to snake_case conversion
- Copenhagen date/time helpers

### `netlify/functions/_admin-auth.js`

Shared admin permission guard.

Responsibilities:

- read `Authorization: Bearer ...`
- verify the Supabase JWT
- load `admin_profiles`
- require `active = true`
- optionally require `role = super_admin`
- prevent removing the last active super admin

### `netlify/functions/public-supabase-config.js`

Safe public config endpoint for the browser.

Returns only:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Never returns:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SEED_SUPER_ADMIN_PASSWORD`
- `SEED_SETUP_TOKEN`

### `netlify/functions/auth-get-profile.js`

Protected profile lookup for `/admin`.

Returns the authenticated admin's:

- `id`
- `email`
- `role`
- `active`

### Admin account management functions

All of these are super-admin only:

- `admin-list-users.js`
- `admin-create-user.js`
- `admin-update-user-role.js`
- `admin-disable-user.js`
- `admin-delete-user.js`

Important safeguards:

- no password is returned in responses
- the last active super admin cannot be disabled, deleted, or demoted
- permanent deletion requires the target account to be inactive first

### Protected content-management functions

These require any active admin account:

- `get-admin-prayer-times.js`
- `get-admin-events.js`
- `save-prayer-times.js`
- `save-event.js`
- `archive-event.js`
- `restore-event.js`
- `restore-prayer-times.js`
- `permanently-delete-event.js`
- `permanently-delete-prayer-times.js`

### Public display functions

These remain public:

- `get-today-prayer-times.js`
- `get-upcoming-event.js`
- wrapper endpoints `today-prayer-times.js` and `upcoming-event.js`

Public display reads intentionally stay open because mosque screens do not log in.

## Supabase Auth architecture

### Browser side

`/admin` uses email/password login through Supabase Auth.

The browser only receives:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Flow:

1. `admin.html` loads `js/admin.js`
2. `js/supabase-browser.js` fetches `public-supabase-config`
3. Supabase Auth restores or creates a session
4. `auth-get-profile` verifies the bearer token and returns the matching `admin_profiles` row
5. the dashboard opens only if the profile exists and `active = true`

### Server side

Protected functions use `_admin-auth.js`.

Every protected action:

1. reads the bearer token from request headers
2. verifies the Supabase user
3. reads `admin_profiles`
4. denies access when no profile exists
5. denies access when `active = false`
6. denies access to super-admin actions when the role is only `admin`

## `admin_profiles` table

SQL file:

- `database/admin-auth.sql`

Expected table:

```sql
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('super_admin', 'admin')),
  active boolean not null default true,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);
```

The SQL file also:

- backfills missing columns safely
- adds indexes
- adds an `updated_at` trigger
- enables RLS
- adds policies for own-profile reads and super-admin management

## Role-based access control

### `super_admin`

Can:

- do all normal admin actions
- create admin users
- list admin users
- change admin roles
- disable admin accounts
- permanently delete disabled admin accounts

### `admin`

Can:

- manage prayer times
- manage events
- manage display content

Cannot:

- view other admin accounts
- create admin users
- change roles
- disable or delete admins

## Environment variables

Required in Netlify:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SEED_SUPER_ADMIN_EMAIL`
- `SEED_SUPER_ADMIN_PASSWORD`
- `SEED_SETUP_TOKEN`

Project-specific value:

- `SEED_SUPER_ADMIN_EMAIL=noorlocatoor@gmail.com`

Important:

- never commit real secrets
- never expose the service role key to the browser
- never expose the seed password or setup token to the browser

Reference file:

- `.env.example`

## First super admin seed

Function:

- `netlify/functions/seed-super-admin.js`

Required request:

- `POST /.netlify/functions/seed-super-admin`
- header: `x-seed-token: <SEED_SETUP_TOKEN>`

The function:

- reads `SEED_SUPER_ADMIN_EMAIL`
- reads `SEED_SUPER_ADMIN_PASSWORD`
- reads `SEED_SETUP_TOKEN`
- uses `SUPABASE_SERVICE_ROLE_KEY`
- creates the auth user if missing
- repairs the `admin_profiles` row if the user already exists
- enforces `role = super_admin`
- enforces `active = true`

Security rules:

- the password is read only from `process.env.SEED_SUPER_ADMIN_PASSWORD`
- the password is never logged
- the password is never returned
- requests without the correct `x-seed-token` return `403`

Recommended post-seed cleanup:

1. remove `SEED_SUPER_ADMIN_PASSWORD` from Netlify
2. remove `SEED_SETUP_TOKEN` from Netlify
3. or remove/disable `seed-super-admin.js`

## Data flow

### Public display

Prayer-time load order:

1. `/.netlify/functions/get-today-prayer-times`
2. `localStorage`
3. `data/prayer-times.sample.json`
4. inline sample data

Event load order:

1. `/.netlify/functions/get-upcoming-event`
2. `localStorage`
3. `data/events.sample.json`
4. inline sample data

The display refreshes:

- countdown every second
- remote data every minute
- full page shortly after midnight

### Admin dashboard

Access flow:

1. restore Supabase session
2. call `auth-get-profile`
3. show dashboard only for active admin users

Write flow:

1. save locally in browser state and storage
2. attempt remote Netlify Function write with bearer token
3. show synced or local-only status

Important nuance:

- `/admin` itself now depends on Supabase auth and Netlify Functions
- once the dashboard is open, individual content saves still keep local fallback behavior if a write request fails

## Prayer-time data model

Unified frontend shape:

```json
{
  "date": "2026-07-03",
  "hijriDateArabic": "",
  "hijriDateLatin": "",
  "fajr": "01:44",
  "sunrise": "04:32",
  "dhuhr": "13:14",
  "asr": "",
  "sunset": "21:55",
  "maghrib": "22:35",
  "isha": "",
  "midnight": "23:50",
  "archived": false
}
```

Display modes:

- `standard`: `fajr`, `sunrise`, `dhuhr`, `asr`, `maghrib`, `isha`
- `imamAliCopenhagen`: `fajr`, `sunrise`, `dhuhr`, `sunset`, `maghrib`, `midnight`

Default:

- `imamAliCopenhagen`

## Event data model

Frontend shape:

```json
{
  "id": "event-001",
  "titleArabic": "Majlis Arabic title",
  "titleDanish": "Majlis - first evening of Muharram",
  "date": "2026-07-13",
  "time": "19:30",
  "locationArabic": "Mosque hall",
  "locationDanish": "Hovedmoskeen",
  "descriptionArabic": "Program description",
  "descriptionDanish": "Program description",
  "imageDataUrl": "",
  "theme": "muharram",
  "active": true,
  "archived": false
}
```

Database shape uses snake_case:

- `title_arabic`
- `title_danish`
- `event_date`
- `event_time`
- `location_arabic`
- `location_danish`
- `description_arabic`
- `description_danish`
- `image_data_url`

## Theme system

Display themes:

- `teal`
- `muharram`

Storage:

- browser-local via `localStorage`

Current limitation:

- theme selection is not yet shared through Supabase

## OCR import architecture

`admin.html` prioritizes prayer import in this order:

1. upload timetable image
2. review OCR text
3. fix OCR text manually
4. parse timetable
5. review editable preview
6. save

The OCR flow is intentionally review-first because client-side OCR can misread:

- digits
- separators
- Danish weekday names
- column alignment

Manual JSON entry remains available as an advanced fallback, hidden by default.

## Archive and cleanup

SQL file:

- `database/cleanup-archive-old-data.sql`

Behavior:

- archives prayer times before the first day of the current month
- archives events 7 days after event date/time
- schedules the job daily at `03:15 UTC` using `pg_cron`

Archive-first rules:

- archived rows are excluded from the public display
- archived rows can be restored from the admin UI
- permanent deletion is restricted to archived rows

Manual run:

```sql
select public.archive_old_display_data();
```

Unschedule:

```sql
select cron.unschedule(jobid)
from cron.job
where jobname = 'archive-old-display-data';
```

## How `display.js` works

At startup it:

1. reads theme from storage
2. loads prayer times and events
3. derives today's row and tomorrow's row
4. calculates next prayer using the configured mode
5. renders the clock, prayer list, event, and footer

During runtime it:

- updates the clock and countdown every second
- refreshes remote data every minute
- reloads after the date changes

## How `admin.js` works

At startup it:

1. renders the static admin shell
2. initializes import and event UI state
3. creates a browser auth client
4. restores the Supabase session
5. calls `auth-get-profile`
6. either shows login, access denied, or the dashboard

After login it:

- injects bearer tokens into protected Netlify Function calls
- shows super-admin tools only when `role === "super_admin"`
- keeps the existing prayer and event editing flows intact

## How local fallback works

### Display

Display remains resilient without Supabase:

- remote functions first
- then local storage
- then bundled sample data

### Admin

Admin no longer has a no-auth dashboard fallback.

That means:

- if the public auth/config functions are unavailable, `/admin` cannot be used
- after a successful login, failed content writes still preserve the local browser copy and show a warning

This tradeoff is deliberate because `/admin` is now protected.

## How to run locally

### Direct file-open mode

Open:

- `index.html`
- `admin.html`

Notes:

- `index.html` works with checked-in standalone bundle fallback
- `admin.html` is useful for layout inspection, but real login requires Netlify Functions and Supabase over `http/https`

### Static server mode

Example:

```powershell
python -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/admin.html`

## Rebuilding standalone bundles

No build step is required for deployment, but the checked-in standalone bundles should be refreshed when module sources change.

Example:

```powershell
npx esbuild js/display.js --bundle --format=iife --platform=browser --outfile=js/display-standalone.js
npx esbuild js/admin.js --bundle --format=iife --platform=browser --outfile=js/admin-standalone.js
```

## How to deploy on Netlify

`netlify.toml`:

```toml
[build]
  publish = "."
  functions = "netlify/functions"
```

Deployment steps:

1. push the repository
2. create or import the site in Netlify
3. keep the publish directory as the repository root
4. keep the functions directory as `netlify/functions`
5. add the Supabase and seed environment variables
6. deploy
7. run `database/admin-auth.sql` in Supabase
8. run `database/cleanup-archive-old-data.sql` in Supabase
9. call the seed function once

## Suggested Supabase upgrade path

This project already uses Supabase for shared data. A sensible next step is expanding that into a fuller backend:

1. move theme into a shared `settings` table
2. move event images from inline data URLs to Supabase Storage
3. add password-reset and invite flows for admins
4. add audit logs for prayer, event, and admin changes
5. add row ownership and change-history tables if governance becomes important

## Coding standards

- keep the frontend framework-free
- keep Netlify deployment static-first
- prefer existing project patterns over new abstractions
- keep service-role usage inside Netlify Functions only
- update checked-in standalone bundles when source modules change
- keep comments short and only where they help

## Testing checklist

Verify after auth-related changes:

1. `/admin` shows login when unauthenticated
2. valid login opens the dashboard
3. invalid login stays on the login view with an error
4. users without `admin_profiles` are denied
5. inactive admins are denied
6. normal admins do not see the super-admin panel
7. normal admins receive `403` from super-admin-only functions
8. super admins can list admin users
9. super admins can create admin users
10. super admins can change roles
11. last active super admin cannot be demoted, disabled, or deleted
12. protected content functions require bearer auth
13. public display functions remain open
14. seed function rejects missing or wrong `x-seed-token`
15. no real secrets appear in frontend files or docs
16. standalone bundles still load

## Known limitations

- theme selection is still browser-local
- event images are still stored as data URLs
- `/admin` requires deployed Netlify and Supabase auth infrastructure and cannot do real login in direct `file://` mode
- there is no password-reset UI yet
- Tesseract OCR still requires human review before saving

## Future improvements

- add a remote theme and settings table
- move event images to Supabase Storage
- add password reset and invite-based onboarding
- add audit trails for admin changes
- add server-side OCR or upload-assisted parsing for cleaner imports
