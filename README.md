# imam-ali-moskeen-display

Static digital signage web app for Imam Ali Moskeen. It is designed for portrait-first masjid screens and includes a landscape layout for wide TVs.

## Included

- `index.html`: live display screen
- `admin.html`: browser-based localStorage admin page
- `css/`: shared base styles, theme variables, display layout, admin layout
- `js/`: modular logic for storage, prayer times, events, clock formatting, display rendering, and admin actions
- `data/`: sample JSON fallbacks
- `netlify/functions/`: simple JSON API endpoints for today's prayer times and the upcoming event

## Documentation

- [USER_ADMIN_MANUAL.md](USER_ADMIN_MANUAL.md): step-by-step guide for mosque staff and admins
- [DEVELOPER_MANUAL.md](DEVELOPER_MANUAL.md): technical architecture, data flow, deployment, and upgrade notes

## How It Works

1. The display page first reads prayer times, events, and theme from `localStorage`.
2. If there is no saved local data, it tries the sample JSON files.
3. When opened with `file://`, browsers often block JSON fetches, so the app falls back to inline sample data that mirrors the sample files.
4. The admin page validates and formats pasted JSON before saving it to `localStorage`.

## Admin Notes

- `admin.html` is intended for non-technical updates.
- Saved data exists only in the browser and device where it was entered.
- If you need one admin update to reach several screens automatically, add a shared backend later, such as Supabase.

## Run Locally

### Open directly

Open `index.html` or `admin.html` in a browser. This works without a build step.

### Optional local server

Any static server works if you want sample JSON fetches instead of inline fallbacks. Example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Theme Support

- `teal`: daily teal signage theme
- `muharram`: red Muharram theme

The active theme is controlled from `admin.html` and stored in the browser.

## Netlify

- No build step is required.
- Static publish directory: project root
- Functions directory: `netlify/functions`
- Redirects:
  - `/display` -> `index.html`
  - `/admin` -> `admin.html`
  - `/api/today-prayer-times`
  - `/api/upcoming-event`

## Assets

Placeholder PNG logos are included at:

- `assets/logo-teal.png`
- `assets/logo-red.png`

Replace them with official mosque logos using the same filenames when ready.
