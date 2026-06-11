# imam-ali-moskeen-display

Digital signage web app for Imam Ali Moskeen in Copenhagen.

It is built with plain HTML, CSS, and JavaScript, works without a frontend build step, and is ready for Netlify deployment.

## Included

- `index.html`: public display screen
- `admin.html`: admin panel for prayer times, events, and theme
- `css/`: base, theme, display, and admin styles
- `js/`: modular frontend logic plus checked-in standalone `file://` bundles
- `data/`: sample JSON fallback data
- `database/`: Supabase SQL migrations and maintenance scripts
- `netlify/functions/`: Netlify Functions for Supabase-backed reads and writes

## Documentation

- [USER_ADMIN_MANUAL.md](USER_ADMIN_MANUAL.md): guide for mosque staff and admins
- [DEVELOPER_MANUAL.md](DEVELOPER_MANUAL.md): architecture, deployment, and backend notes

## How it works

### Display page

The public display now loads prayer times and events in this order:

1. Netlify Functions backed by Supabase
2. `localStorage`
3. sample JSON files
4. inline sample fallback for direct `file://` mode

When the display is running from a deployed site, it refreshes remote prayer/event data every minute so shared updates can appear on mosque screens without reopening the page.

### Admin page

The admin page now requires Supabase login.

After login:

- prayer times can be imported from timetable image OCR, pasted timetable text, or advanced JSON
- events can be managed with a simple form and optional image
- advanced JSON fallbacks remain available for both prayer times and events
- normal admins can use the existing content-management tools
- super admins can also manage admin accounts

When deployed with Supabase configured:

- prayer-time saves go through `/.netlify/functions/save-prayer-times`
- event saves go through `/.netlify/functions/save-event`
- active-event archive actions go through `/.netlify/functions/archive-event`
- archived restore/delete actions go through the dedicated restore and permanent-delete functions

Old data is archive-first:

- prayer times from previous months can be archived automatically
- events are archived one week after their event date/time passes
- archived rows stay out of the public display
- archived rows can be restored from the admin page
- the first super admin can be created through a protected one-time seed function

If the Netlify Functions are unavailable, the admin page falls back to local browser storage and shows a warning.
If the Supabase auth/config endpoints are unavailable, `/admin` cannot complete login until Netlify/Supabase is restored. After a successful login, individual content saves still fall back locally when write functions fail.

## Run locally

### Open directly

Open `index.html` or `admin.html` in a browser.

The HTML pages automatically switch to the checked-in standalone bundles when opened from `file://`.

### Optional local server

Any static server works. Example:

```powershell
python -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/admin.html`

Note:

- `/admin` login and protected admin operations require Netlify Functions and Supabase
- opening `admin.html` from `file://` is useful for static UI inspection, but not for real authenticated admin work

## Required Netlify environment variables

Add these in the Netlify dashboard:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SEED_SUPER_ADMIN_EMAIL`
- `SEED_SUPER_ADMIN_PASSWORD`
- `SEED_SETUP_TOKEN`

Path in Netlify:

`Site settings -> Environment variables`

Important:

- do not commit real keys to GitHub
- do not place the service role key in frontend JavaScript
- do not place the seed password in any committed file
- only Netlify Functions should use `SUPABASE_SERVICE_ROLE_KEY`
- for this project set `SEED_SUPER_ADMIN_EMAIL=noorlocatoor@gmail.com`
- set `SEED_SUPER_ADMIN_PASSWORD` only in Netlify
- set `SEED_SETUP_TOKEN` only in Netlify

Use `.env.example` as the placeholder reference file.

## One-time super admin seed

Protected endpoint:

- `POST /.netlify/functions/seed-super-admin`

Required header:

- `x-seed-token: <your SEED_SETUP_TOKEN>`

The seed function:

- uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- reads `SEED_SUPER_ADMIN_EMAIL`
- reads `SEED_SUPER_ADMIN_PASSWORD`
- creates the Supabase Auth user if missing
- creates or updates the `admin_profiles` row
- enforces `role = super_admin`
- enforces `active = true`
- never returns the password

If `admin_profiles` does not already exist in Supabase, run:

- `database/admin-auth.sql`

Expected seed email for this project:

- `noorlocatoor@gmail.com`

Example PowerShell call:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://your-site.netlify.app/.netlify/functions/seed-super-admin" `
  -Headers @{ "x-seed-token" = "your-one-time-seed-token" }
```

Expected success response:

```json
{
  "success": true,
  "message": "Super admin seeded successfully",
  "email": "noorlocatoor@gmail.com"
}
```

Expected idempotent response:

```json
{
  "success": true,
  "message": "Super admin already exists and is active",
  "email": "noorlocatoor@gmail.com"
}
```

After setup:

- remove `SEED_SUPER_ADMIN_PASSWORD` from Netlify
- remove `SEED_SETUP_TOKEN` from Netlify
- or remove/disable `netlify/functions/seed-super-admin.js`

This endpoint is for initial setup only.

## Admin authentication

The public display stays open.

The admin route is protected:

- visit `/admin`
- if no Supabase session exists, the built-in login screen appears
- login uses email/password through Supabase Auth
- after login, Netlify Functions verify the bearer token and the `admin_profiles` row
- if the user is missing an active `admin_profiles` row, `/admin` shows access denied

Roles:

- `super_admin`: can manage content and admin accounts
- `admin`: can manage content only

## Netlify

- no frontend build step is required
- publish directory: project root
- functions directory: `netlify/functions`

`netlify.toml` keeps:

```toml
[build]
  publish = "."
  functions = "netlify/functions"
```

Redirects include:

- `/display` -> `index.html`
- `/admin` -> `admin.html`
- `/api/today-prayer-times` -> `/.netlify/functions/get-today-prayer-times`
- `/api/upcoming-event` -> `/.netlify/functions/get-upcoming-event`

## Current limitations

- theme selection is still browser-local and is not yet synced through Supabase
- event images are still stored as data URLs inside event records
- local fallback data is device-specific
- the included cleanup cron job must be applied in Supabase from `database/cleanup-archive-old-data.sql`
- direct `file://` use of `admin.html` cannot perform real Supabase login because protected functions and public config come from Netlify

## Logo files

Replace these placeholder files with the real mosque logos when ready:

- `assets/logo-teal.png`
- `assets/logo-red.png`
