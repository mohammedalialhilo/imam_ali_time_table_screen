# Developer Manual

## Stack

- Plain HTML
- Plain CSS
- Plain JavaScript modules
- Netlify Functions for lightweight JSON endpoints

No React, TypeScript, bundler, or build step is required.

## File Responsibilities

- `index.html`: signage layout and display DOM targets
- `admin.html`: localStorage administration UI
- `css/base.css`: reset, shared components, shared dark UI primitives
- `css/themes.css`: theme variables for teal and Muharram modes
- `css/display.css`: portrait-first signage layout and landscape overrides
- `css/admin.css`: admin page layout and controls
- `js/config.js`: theme config, storage keys, prayer metadata, inline sample data
- `js/storage.js`: localStorage access helpers
- `js/prayer-times.js`: validation, fallback loading, next-prayer logic, countdown formatting
- `js/events.js`: validation, fallback loading, upcoming-event selection
- `js/clock.js`: time zone aware display formatting helpers
- `js/display.js`: display page bootstrap and rendering
- `js/admin.js`: admin page interactions

## Data Flow

### Display page

1. Read theme from `localStorage`
2. Load prayer times from `localStorage`
3. If no saved prayer times exist, try `data/prayer-times.sample.json`
4. If fetch is unavailable or blocked under `file://`, use inline sample prayer data
5. Repeat the same pattern for events
6. Render the current date, Hijri text, next prayer, prayer list, and event block
7. Update clock and countdown every second

### Admin page

1. Load saved browser data if present
2. Populate the textareas with saved data or the bundled sample data
3. Validate pasted JSON before saving
4. Persist only validated data

## Local Development Notes

- Opening `index.html` directly works because inline sample data mirrors the JSON files.
- Browsers commonly block `fetch()` to local JSON files under `file://`.
- If you want to test JSON file loading instead of inline fallback, run a static server.

## Netlify Functions

### `today-prayer-times`

- reads `data/prayer-times.sample.json`
- returns the entry matching the current Copenhagen date if found
- falls back to the first sample entry

### `upcoming-event`

- reads `data/events.sample.json`
- returns the next active event by date/time
- falls back to the first active event

## Replacing Logos

Swap these files in place:

- `assets/logo-teal.png`
- `assets/logo-red.png`

No code changes are needed if the filenames stay the same.
