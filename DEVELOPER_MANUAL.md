# DEVELOPER_MANUAL.md

## Project overview

`imam-ali-moskeen-display` is a static digital signage app for Imam Ali Moskeen in Copenhagen.

It has two main pages:

- `index.html`: public display
- `admin.html`: admin panel

The project is designed for:

- no frontend build step
- plain HTML, CSS, and JavaScript
- Netlify deployment
- direct `file://` opening
- Supabase-backed shared prayer times and events through Netlify Functions

## Tech stack

- plain HTML
- plain CSS
- plain JavaScript ES modules
- checked-in standalone JS bundles for `file://` mode
- Netlify Functions with CommonJS
- Supabase via `@supabase/supabase-js`
- optional Tesseract.js on `admin.html` only
- `localStorage` fallback for browser-local persistence

## File structure

```text
imam-ali-moskeen-display/
├── index.html
├── admin.html
├── README.md
├── USER_ADMIN_MANUAL.md
├── DEVELOPER_MANUAL.md
├── package.json
├── .env.example
├── .gitignore
├── netlify.toml
├── assets/
│   ├── logo-red.png
│   ├── logo-teal.png
│   └── README_ASSETS.md
├── css/
│   ├── base.css
│   ├── display.css
│   ├── admin.css
│   └── themes.css
├── data/
│   ├── prayer-times.sample.json
│   └── events.sample.json
├── js/
│   ├── admin.js
│   ├── admin-standalone.js
│   ├── clock.js
│   ├── config.js
│   ├── display.js
│   ├── display-standalone.js
│   ├── events.js
│   ├── import-prayer-image.js
│   ├── prayer-times.js
│   ├── remote-data.js
│   └── storage.js
└── netlify/
    └── functions/
        ├── _shared.js
        ├── _supabase.js
        ├── delete-event.js
        ├── get-today-prayer-times.js
        ├── get-upcoming-event.js
        ├── save-event.js
        ├── save-prayer-times.js
        ├── today-prayer-times.js
        └── upcoming-event.js
```

## Major files

### `index.html`

Public display markup. It loads the ES module runtime on `http/https` and the standalone bundle on `file://`.

### `admin.html`

Admin markup. Prayer import is image-first. Event management is form-first. Advanced JSON remains hidden by default.

### `js/config.js`

Central configuration:

- themes
- storage keys
- prayer display mode
- event categories
- sample file paths
- Netlify Function paths
- admin sync status messages
- inline sample data

### `js/storage.js`

Thin `localStorage` wrapper for prayer times, events, and theme.

### `js/remote-data.js`

Frontend helper for Netlify Function calls:

- connection check
- remote prayer-time reads
- remote event reads
- remote prayer-time writes
- remote event saves
- remote event deletes

This module never uses Supabase keys directly.

### `js/prayer-times.js`

Prayer-time validation and loading logic:

- normalize prayer entries
- validate flexible schemas
- compute today/tomorrow rows
- compute next prayer
- countdown helpers
- load order: Supabase function -> localStorage -> sample JSON -> inline sample

### `js/events.js`

Event normalization, validation, CRUD helpers, and loading logic:

- category normalization
- backward compatibility for legacy theme values
- next-upcoming event selection
- load order: Supabase function -> localStorage -> sample JSON -> inline sample

### `js/import-prayer-image.js`

Prayer-timetable parser:

- OCR text cleanup
- Danish timetable parsing
- preview-row generation
- validation
- conversion into prayer entries

### `js/display.js`

Display runtime:

- theme load
- prayer/event data load
- render clock, dates, next prayer, prayer list, and event
- refresh countdown every second
- refresh remote prayer/event data every minute
- reload shortly after midnight

### `js/admin.js`

Admin runtime:

- status cards
- prayer OCR/text import
- preview table editing
- manual prayer JSON fallback
- event form
- saved-event list actions
- manual event JSON fallback
- local fallback saves
- Supabase sync status

### `netlify/functions/_supabase.js`

Shared Supabase client factory for Netlify Functions.

Exports:

- `createSupabaseAnonClient()`
- `createSupabaseAdminClient()`

### `netlify/functions/_shared.js`

Shared function-side helpers:

- JSON responses
- Copenhagen date/time helpers
- request-body parsing
- prayer-time normalization/validation
- event normalization/validation
- camelCase <-> snake_case mapping

### Compatibility wrappers

- `today-prayer-times.js`
- `upcoming-event.js`

These keep older `/api/...` redirects working by delegating to the newer Supabase-backed read functions.

## Required Netlify environment variables

Add these in Netlify:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Netlify path:

`Site settings -> Environment variables`

Use `.env.example` for placeholder names only.

## Security rules

### Never expose the service role key

`SUPABASE_SERVICE_ROLE_KEY` must never appear in:

- frontend JavaScript
- HTML
- CSS
- committed config files
- client-side network calls

Only Netlify Functions may use it.

### Frontend safety boundary

Frontend code only talks to:

- `/.netlify/functions/get-today-prayer-times`
- `/.netlify/functions/get-upcoming-event`
- `/.netlify/functions/save-prayer-times`
- `/.netlify/functions/save-event`
- `/.netlify/functions/delete-event`

No frontend file imports `@supabase/supabase-js`.

## Supabase client architecture

### Read client

`createSupabaseAnonClient()` uses:

- `process.env.SUPABASE_URL`
- `process.env.SUPABASE_ANON_KEY`

Used for:

- `get-today-prayer-times.js`
- `get-upcoming-event.js`

### Admin client

`createSupabaseAdminClient()` uses:

- `process.env.SUPABASE_URL`
- `process.env.SUPABASE_SERVICE_ROLE_KEY`

Used for:

- `save-prayer-times.js`
- `save-event.js`
- `delete-event.js`

## Netlify Functions architecture

### `get-today-prayer-times.js`

Reads from Supabase table:

- `prayer_times`

Expected columns:

- `date`
- `hijri_date_arabic`
- `hijri_date_latin`
- `fajr`
- `sunrise`
- `dhuhr`
- `asr`
- `sunset`
- `maghrib`
- `isha`
- `midnight`

Behavior:

- accepts optional `?date=YYYY-MM-DD`
- returns today plus tomorrow when available
- returns `404` when today's row is missing
- returns JSON without crashing on failure

### `get-upcoming-event.js`

Reads from Supabase table:

- `events`

Expected columns:

- `id`
- `title_arabic`
- `title_danish`
- `event_date`
- `event_time`
- `location_arabic`
- `location_danish`
- `description_arabic`
- `description_danish`
- `image_data_url`
- `theme`
- `active`
- `created_at`
- `updated_at`

Behavior:

- reads active events
- sorts by `event_date` and `event_time`
- returns the next future event
- falls back to the most recent past active event if needed
- returns `upcomingEvent: null` when no event exists

### `save-prayer-times.js`

Behavior:

- POST only
- accepts an array or `{ items: [...] }`
- validates input before writing
- upserts into `prayer_times` on `date`
- uses service role key only inside the function

### `save-event.js`

Behavior:

- POST only
- accepts camelCase or snake_case fields
- validates required fields:
  - `titleArabic` / `title_arabic`
  - `titleDanish` / `title_danish`
  - `date` / `event_date`
  - `time` / `event_time`
- upserts on `id`

### `delete-event.js`

Behavior:

- compatibility wrapper
- forwards to `archive-event.js`
- keeps older callers archive-first instead of hard-deleting

## Data flow

### Display page

1. load theme from `localStorage`
2. load prayer times in this order:
   - Supabase read function
   - `localStorage`
   - sample JSON
   - inline sample
3. load events in this order:
   - Supabase read function
   - `localStorage`
   - sample JSON
   - inline sample
4. render display
5. refresh countdown every second
6. refresh remote data every minute
7. reload after midnight

### Admin page

1. load local prayer times, events, and theme for editing/fallback
2. check whether Supabase read functions are reachable
3. show connection status
4. on save:
   - attempt local save
   - attempt remote Netlify Function save
   - show success, local-only warning, or Supabase error

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
  "midnight": "23:50"
}
```

For Copenhagen mode, required fields are:

- `date`
- `fajr`
- `sunrise`
- `dhuhr`
- `sunset`
- `maghrib`
- `midnight`

## Event data model

Frontend shape:

```json
{
  "id": "event-001",
  "titleArabic": "مجلس الليلة الأولى من محرم",
  "titleDanish": "Majlis – første aften af Muharram",
  "date": "2026-07-13",
  "time": "19:30",
  "locationArabic": "الجامع الرئيسي",
  "locationDanish": "Hovedmoskeen",
  "descriptionArabic": "ذكرى استشهاد الإمام الحسين عليه السلام",
  "descriptionDanish": "Mindehøjtidelighed for Imam Hussein",
  "imageDataUrl": "data:image/webp;base64,...",
  "theme": "muharram",
  "active": true,
  "createdAt": "2026-06-10T10:30:00.000Z",
  "updatedAt": "2026-06-10T10:30:00.000Z"
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

Display theme still uses browser-local storage:

- `body[data-theme="teal"]`
- `body[data-theme="muharram"]`

Shared theme sync is not implemented yet.

## OCR import architecture

Flow:

1. upload timetable image
2. preview image
3. load Tesseract.js from CDN on demand
4. place OCR text in editable textarea
5. admin corrects text
6. parse timetable
7. validate preview rows
8. save only after review

Manual review remains required because client-side OCR can misread digits, separators, and Danish weekday names.

## Parser logic

`js/import-prayer-image.js` parses lines like:

```text
fredag 3 01:44 04:32 13:14 21:55 22:35 23:50
```

Mapping:

- `Subh` -> `fajr`
- `Solopgang` -> `sunrise`
- `Dhuhr` -> `dhuhr`
- `Solnedgang` -> `sunset`
- `Maghrib` -> `maghrib`
- `Midnat` -> `midnight`

It never invents missing `asr` or `isha`.

## Event form architecture

Visible admin flow:

1. optional image upload
2. bilingual titles
3. date and time
4. locations and descriptions
5. theme/category
6. active toggle
7. save/update

Saved-event list actions:

- edit
- delete
- duplicate
- toggle active/inactive

Advanced fallback:

- hidden event JSON editor

## Image preview and storage approach

Current behavior:

- event images are previewed in the browser
- images are stored in the event record as `imageDataUrl`
- Supabase sync stores that string in the `events` table

This works for a static prototype, but it is not ideal long-term.

## Event image display logic

`js/display.js`:

- uses the event image when present
- falls back to a themed placeholder when no image is present
- uses `object-fit: cover`
- keeps old events without `imageDataUrl` working

## Fallback behavior

### Display

If Supabase or Netlify Functions fail:

1. try local browser data
2. then sample JSON
3. then inline sample

### Admin

If remote save fails:

- save locally when possible
- show: `Saved locally only. This will not update other screens until Supabase is connected.`

## How to run locally

### Direct file-open mode

Open:

- `index.html`
- `admin.html`

The pages switch automatically to:

- `js/display-standalone.js`
- `js/admin-standalone.js`

### Static server mode

Example:

```powershell
python -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/admin.html`

## How to deploy on Netlify

`netlify.toml` keeps:

```toml
[build]
  publish = "."
  functions = "netlify/functions"
```

No frontend build command is required.

Deployment:

1. push the repo
2. create/import the site in Netlify
3. keep publish directory at the repo root
4. keep functions directory as `netlify/functions`
5. add the Supabase environment variables
6. deploy

## How to test deployed functions

After deployment, test:

- `/.netlify/functions/get-today-prayer-times?date=2026-07-10`
- `/.netlify/functions/get-upcoming-event`

Then test writes from the admin page:

1. save prayer times
2. save an event
3. archive an event, then restore it from the archived section
4. confirm the display updates within about one minute or on manual refresh

## How to rotate keys

1. create new Supabase keys in the Supabase dashboard
2. update the values in Netlify environment variables
3. redeploy the site if needed
4. verify the function endpoints again

Never commit rotated keys into source control.

## Coding standards

- no frontend framework
- no frontend build step
- semantic HTML
- CSS custom properties for theme values
- module-based JS
- service role key only in Netlify Functions
- checked-in standalone bundles must match the ES module sources

## Testing checklist

Verify after changes:

1. `index.html` loads
2. `admin.html` loads
3. no real Supabase keys are present in source
4. `.env.example` contains placeholders only
5. `.gitignore` protects `.env` files
6. Netlify Functions read env vars safely
7. display reads remote data first
8. admin saves remotely with local fallback
9. prayer OCR import still works
10. event form still works
11. theme switching still works
12. `file://` mode still works
13. standalone bundles still load

## Archive and cleanup

Archive-first behavior is part of the Supabase-backed admin flow.

Database fields:

- `prayer_times.archived boolean default false`
- `events.archived boolean default false`

Behavior:

- public display functions exclude archived rows
- new prayer times are saved with `archived = false`
- new events are saved with `archived = false`
- archiving an active event removes it from the public display without hard-deleting it
- permanent deletion is restricted to archived rows/items

SQL migration file:

- `database/cleanup-archive-old-data.sql`

The SQL file:

- enables `pg_cron`
- adds `archived` columns if they do not exist
- creates `public.archive_old_display_data()`
- archives prayer times earlier than the first day of the current month
- archives events older than 7 days after their event date/time
- schedules the cleanup at `03:15 UTC` every day

Manual run:

```sql
select public.archive_old_display_data();
```

Unschedule the cron job:

```sql
select cron.unschedule(jobid)
from cron.job
where jobname = 'archive-old-display-data';
```

Admin/archive function set:

- `get-admin-prayer-times.js`
- `get-admin-events.js`
- `archive-event.js`
- `restore-event.js`
- `restore-prayer-times.js`
- `permanently-delete-event.js`
- `permanently-delete-prayer-times.js`

`delete-event.js` is now only a compatibility wrapper that archives through `archive-event.js`.

## Archive-aware data model additions

Prayer-time example:

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

Event example:

```json
{
  "id": "event-001",
  "titleArabic": "Majlis",
  "titleDanish": "Majlis",
  "date": "2026-07-13",
  "time": "19:30",
  "active": true,
  "archived": false
}
```

## Archive notes for future backend work

- keep the service role key inside Netlify Functions only
- keep archive and restore actions server-side
- add admin authentication before exposing archive management on a public deployment
- consider moving cleanup into a protected RPC if you later centralize admin auth in Supabase

## Known limitations

- theme is not yet synced through Supabase
- admin now loads remote active and archived datasets when Supabase is reachable, but still keeps a browser-local cache for fallback
- event images are still stored inline as data URLs
- there is no authentication layer yet
- archive management endpoints are still public until an auth layer is added
- OCR still requires human review before saving

## Future improvements

- add a shared `settings` table for remote theme sync
- move event images to Supabase Storage and store file URLs instead of data URLs
- add admin authentication
- add full remote list endpoints for prayer times and events
- move archive management behind authenticated admin access
- add audit history and rollback
