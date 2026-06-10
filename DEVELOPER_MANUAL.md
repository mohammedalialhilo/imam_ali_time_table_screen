# Developer Manual

## Stack

- Plain HTML
- Plain CSS
- Plain JavaScript modules
- Netlify Functions for lightweight JSON endpoints

No React, TypeScript, bundler, or build step is required.

## File Responsibilities

- `index.html`: signage layout and display DOM targets
- `admin.html`: localStorage administration UI for non-technical users
- `css/base.css`: reset, shared components, shared dark UI primitives
- `css/themes.css`: theme variables for teal and Muharram modes
- `css/display.css`: portrait-first signage layout and landscape overrides
- `css/admin.css`: admin page layout, editors, and status panel
- `js/config.js`: theme config, storage keys, prayer metadata, fallback messages, inline sample data
- `js/storage.js`: localStorage access helpers
- `js/prayer-times.js`: validation, fallback loading, local-date matching, next-prayer logic, countdown formatting
- `js/events.js`: validation, fallback loading, upcoming-event selection
- `js/clock.js`: local browser date/time formatting helpers
- `js/display.js`: display page bootstrap and rendering
- `js/admin.js`: admin page validation, save flow, theme handling, and saved-data status

## Data Flow

### Display page

1. Read the saved theme from `localStorage`
2. Load prayer times from `localStorage`
3. If no saved prayer times exist, try `data/prayer-times.sample.json`
4. If that is unavailable, try the Netlify function
5. If fetch is unavailable or blocked under `file://`, use inline sample prayer data
6. Repeat the same priority for events
7. Match prayer data by local browser date key (`YYYY-MM-DD`)
8. Recalculate the next prayer and countdown every second
9. Reload shortly after midnight so the new day is picked up cleanly

### Admin page

1. Read saved browser data from `localStorage`
2. Fill the editors with saved data when present, otherwise use bundled sample data
3. Validate pasted JSON before saving
4. Prettify valid JSON after validation
5. Persist only validated data
6. Keep the saved-data status panel based on actual saved browser data, not on fallback samples

## Validation Rules

### Prayer times

- must be an array
- each object must include:
  - `date`
  - `fajr`
  - `sunrise`
  - `dhuhr`
  - `asr`
  - `maghrib`
  - `isha`
- `date` must be `YYYY-MM-DD`
- time fields must be `HH:mm`
- `hijriDateArabic` and `hijriDateLatin` are optional

### Events

- must be an array
- each object must include:
  - `id`
  - `titleArabic`
  - `titleDanish`
  - `date`
  - `time`
  - `active`
- `date` must be `YYYY-MM-DD`
- `time` must be `HH:mm`
- `active` must be a boolean
- `locationArabic`, `locationDanish`, `descriptionArabic`, `descriptionDanish`, and `theme` are optional

## Local Development Notes

- Opening `index.html` and `admin.html` directly works without a build step.
- Browsers commonly block `fetch()` to local JSON files under `file://`.
- Inline sample data exists so the app still works when local file fetches are blocked.
- `localStorage` is browser-specific. Saving data in one browser or one device does not sync it to others.
- For real multi-screen admin sync later, the project should move to an online backend such as Supabase.

## Netlify Functions

### `today-prayer-times`

- reads `data/prayer-times.sample.json`
- accepts an optional `date` query parameter
- returns the exact requested date entry when present
- also returns the following day entry when present

### `upcoming-event`

- reads `data/events.sample.json`
- returns the nearest active event whose date/time is today or in the future
- returns `null` when no future active event exists

## Replacing Logos

Swap these files in place:

- `assets/logo-teal.png`
- `assets/logo-red.png`

No code changes are needed if the filenames stay the same.
