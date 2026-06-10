# imam-ali-moskeen-display

Digital signage web app for Imam Ali Moskeen in Copenhagen.

It is built with plain HTML, CSS, and JavaScript, works without a frontend build step, and is ready for Netlify deployment.

## Included

- `index.html`: public display screen
- `admin.html`: admin panel for prayer times, events, and theme
- `css/`: base, theme, display, and admin styles
- `js/`: modular frontend logic plus checked-in standalone `file://` bundles
- `data/`: sample JSON fallback data
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

The admin page is form-first:

- prayer times can be imported from timetable image OCR, pasted timetable text, or advanced JSON
- events can be managed with a simple form and optional image
- advanced JSON fallbacks remain available for both prayer times and events

When deployed with Supabase configured:

- prayer-time saves go through `/.netlify/functions/save-prayer-times`
- event saves go through `/.netlify/functions/save-event`
- event deletes go through `/.netlify/functions/delete-event`

If the Netlify Functions are unavailable, the admin page falls back to local browser storage and shows a warning.

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

## Required Netlify environment variables

Add these in the Netlify dashboard:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Path in Netlify:

`Site settings -> Environment variables`

Important:

- do not commit real keys to GitHub
- do not place the service role key in frontend JavaScript
- only Netlify Functions should use `SUPABASE_SERVICE_ROLE_KEY`

Use `.env.example` as the placeholder reference file.

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

## Logo files

Replace these placeholder files with the real mosque logos when ready:

- `assets/logo-teal.png`
- `assets/logo-red.png`
