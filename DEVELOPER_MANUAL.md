# DEVELOPER MANUAL

## Project overview

`imam-ali-moskeen-display` is a plain HTML, CSS, and JavaScript digital signage project for mosque screens.

It is designed to:

- show prayer times for the current day
- calculate and highlight the next prayer
- show a live countdown to the next prayer
- show Gregorian and Hijri date text
- show the nearest active upcoming event
- support a normal teal theme and a Muharram red theme
- work directly from static files without a build step
- run on Netlify with simple serverless function fallbacks

The project has two user-facing pages:

- `index.html`: the display screen
- `admin.html`: the local admin interface

## Tech stack

- Plain HTML
- Plain CSS
- Plain JavaScript ES modules
- `localStorage` for the current admin/data store
- Netlify Functions for simple JSON endpoints

Not used:

- React
- TypeScript
- bundlers
- package-based build tooling

## File structure

```text
imam-ali-moskeen-display/
├── index.html
├── admin.html
├── README.md
├── USER_ADMIN_MANUAL.md
├── DEVELOPER_MANUAL.md
├── netlify.toml
├── assets/
│   ├── logo-red.png
│   ├── logo-teal.png
│   └── README_ASSETS.md
├── css/
│   ├── admin.css
│   ├── base.css
│   ├── display.css
│   └── themes.css
├── data/
│   ├── events.sample.json
│   └── prayer-times.sample.json
├── js/
│   ├── admin.js
│   ├── clock.js
│   ├── config.js
│   ├── display.js
│   ├── events.js
│   ├── prayer-times.js
│   └── storage.js
└── netlify/
    └── functions/
        ├── today-prayer-times.js
        └── upcoming-event.js
```

## Major files and responsibilities

### Root files

- `index.html`
  - display markup
  - DOM targets for clock, prayer list, next prayer, and event panel
- `admin.html`
  - non-technical admin UI
  - prayer/events JSON editors
  - theme controls
  - saved-data status panel
- `README.md`
  - project summary and startup instructions
- `USER_ADMIN_MANUAL.md`
  - instructions for mosque staff
- `DEVELOPER_MANUAL.md`
  - this document
- `netlify.toml`
  - Netlify publish/functions config
  - API redirects

### CSS

- `css/base.css`
  - reset
  - shared panel/button/form styles
  - dark background and shared utility classes
- `css/themes.css`
  - theme variables for `[data-theme="teal"]` and `[data-theme="muharram"]`
- `css/display.css`
  - portrait-first display layout
  - landscape media queries
  - prayer/event/clock panel layout
- `css/admin.css`
  - admin dashboard layout
  - JSON editor sizing
  - saved-data status panel

### JavaScript

- `js/config.js`
  - app constants
  - theme metadata
  - storage keys
  - prayer metadata
  - sample inline fallback data
  - fallback UI messages
- `js/storage.js`
  - all `localStorage` reads/writes
  - clear/reset helpers
  - storage support detection
- `js/clock.js`
  - local browser date/time formatting
  - clock tick interval
- `js/prayer-times.js`
  - prayer JSON validation
  - tolerant display-side prayer loading
  - exact local-date matching
  - next-prayer calculation
  - countdown formatting
- `js/events.js`
  - event validation
  - event loading
  - nearest active upcoming-event selection
- `js/display.js`
  - main display bootstrap
  - theme application
  - DOM rendering
  - countdown updates
  - midnight reload behavior
- `js/admin.js`
  - editor validation
  - saving to `localStorage`
  - theme selection/save
  - saved-data status refresh

### Data and serverless

- `data/prayer-times.sample.json`
  - static fallback prayer dataset
- `data/events.sample.json`
  - static fallback event dataset
- `netlify/functions/today-prayer-times.js`
  - returns the requested day prayer entry and, when available, the next day entry
- `netlify/functions/upcoming-event.js`
  - returns the nearest active upcoming event from sample data

## Data flow

## Display page flow

1. `index.html` loads `js/display.js`
2. `display.js` reads the saved theme from `localStorage`
3. `display.js` calls `loadPrayerTimes()` and `loadEvents()`
4. Prayer-time load priority:
   1. `localStorage`
   2. `data/prayer-times.sample.json`
   3. `/api/today-prayer-times`
   4. inline sample data from `config.js`
5. Event load priority:
   1. `localStorage`
   2. `data/events.sample.json`
   3. `/api/upcoming-event`
   4. inline sample data from `config.js`
6. Current day is matched by exact local browser date using `YYYY-MM-DD`
7. The next prayer is calculated from local browser time
8. The clock and countdown update every second
9. If the day changes, the page reloads
10. A scheduled reload is also set shortly after midnight

## Admin page flow

1. `admin.html` loads `js/admin.js`
2. The script reads saved prayer times, events, and theme from `localStorage`
3. Editors are filled with saved data when valid
4. If there is no saved valid data, editors show bundled sample data
5. Validation happens before save
6. Valid JSON is prettified in the textarea
7. Only validated data is saved
8. The saved-data status panel reads actual saved browser data, not fallback data

## Prayer-time data model

Prayer times are stored as an array of daily objects.

Example:

```json
[
  {
    "date": "2026-06-09",
    "hijriDateArabic": "23 ذو الحجة 1447 هـ",
    "hijriDateLatin": "23 Dhu al-Hijjah 1447 H",
    "fajr": "02:29",
    "sunrise": "04:28",
    "dhuhr": "13:09",
    "asr": "17:39",
    "maghrib": "21:51",
    "isha": "23:43"
  }
]
```

### Required fields

- `date`
- `fajr`
- `sunrise`
- `dhuhr`
- `asr`
- `maghrib`
- `isha`

### Optional fields

- `hijriDateArabic`
- `hijriDateLatin`

### Validation rules

- array only
- `date` must be `YYYY-MM-DD`
- prayer fields must be `HH:mm`

### Runtime behavior

- invalid or missing prayer times are shown as `--:--` in the display renderer
- exact date matching is used for today and tomorrow
- after the last prayer, tomorrow’s Fajr is used if tomorrow exists

## Event data model

Events are stored as an array of objects.

Example:

```json
[
  {
    "id": "event-001",
    "titleArabic": "مجلس الليلة الأولى من محرم",
    "titleDanish": "Majlis – første aften af Muharram",
    "date": "2026-06-13",
    "time": "19:30",
    "locationArabic": "الجامع الرئيسي",
    "locationDanish": "Hovedmoskeen",
    "descriptionArabic": "ذكرى استشهاد الإمام الحسين عليه السلام",
    "descriptionDanish": "Mindehøjtidelighed for Imam Hussein",
    "theme": "muharram",
    "active": true
  }
]
```

### Required fields

- `id`
- `titleArabic`
- `titleDanish`
- `date`
- `time`
- `active`

### Optional fields

- `locationArabic`
- `locationDanish`
- `descriptionArabic`
- `descriptionDanish`
- `theme`

### Validation rules

- array only
- `date` must be `YYYY-MM-DD`
- `time` must be `HH:mm`
- `active` must be boolean

### Runtime behavior

- only active events are considered
- only events with date/time now or in the future are returned
- the nearest upcoming event is shown
- if there is no upcoming event, the display shows the built-in no-event message

## Theme system

Theme state is stored in `localStorage` under:

- `imamAliDisplay.theme`

Supported values:

- `teal`
- `muharram`

Theme definitions live in:

- `js/config.js`
- `css/themes.css`

Runtime flow:

1. theme value is read from storage
2. `data-theme` is applied to `<body>`
3. CSS variables control colors, glow, borders, and backgrounds
4. `display.js` swaps the logo path and banner styling

## How `display.js` works

High-level behavior:

1. load theme
2. load prayer/event datasets
3. resolve today and tomorrow prayer entries
4. resolve themed feature event and general upcoming event
5. render static panels
6. start the live clock
7. update next prayer and countdown every second

Key responsibilities:

- apply theme and logo fallback
- render header/banner content
- render Gregorian and Hijri date
- render next prayer card
- render prayer rows/cards
- render event block
- show prayer missing/completed fallback states
- schedule midnight reload

Notable implementation details:

- `getLocalDateKey()` is used for exact date matching
- `getNextPrayer()` returns explicit statuses:
  - `missing-today`
  - `upcoming-today`
  - `upcoming-tomorrow`
  - `day-completed`
- countdown display is formatted in:
  - main `HH:mm:ss`
  - Arabic `1س 19د 20ث`
  - Danish `1t 19m 20s`

## How `admin.js` works

High-level behavior:

1. read saved browser data
2. populate editors
3. validate JSON on demand
4. save validated JSON only
5. save theme
6. update saved-data status panel
7. clear browser data when requested

Key responsibilities:

- parse textarea JSON safely
- call `validatePrayerTimesArray()` and `validateEventsArray()`
- prettify valid JSON
- block invalid saves
- save prayer times, events, and theme through `storage.js`
- show clear success, warning, and error messages
- repopulate sample data after clear

## How `localStorage` fallback works

The app is intentionally resilient.

### Display side

For prayer times:

1. try saved `localStorage`
2. try sample JSON file
3. try Netlify function
4. use inline sample fallback

For events:

1. try saved `localStorage`
2. try sample JSON file
3. try Netlify function
4. use inline sample fallback

### Admin side

- if saved browser data exists and validates, it is shown in the editor
- otherwise sample data is loaded into the editors
- the saved-data status panel reports only real saved browser data

## How Netlify Functions work

Netlify configuration is defined in `netlify.toml`.

Current settings:

- publish directory: `.`
- functions directory: `netlify/functions`

Redirects are defined for:

- `/display`
- `/admin`
- `/api/today-prayer-times`
- `/api/upcoming-event`

Current frontend API paths in `js/config.js` point to:

- `/api/today-prayer-times`
- `/api/upcoming-event`

Netlify then rewrites those public routes to the internal function endpoints.

### `today-prayer-times`

- reads `data/prayer-times.sample.json`
- accepts an optional `date` query parameter
- returns:
  - requested date
  - tomorrow entry when available
  - `items` array for frontend normalization

### `upcoming-event`

- reads `data/events.sample.json`
- filters to active future events
- returns the nearest one or `null`

## How to run locally

## Option 1: open files directly

Open either:

- `index.html`
- `admin.html`

This works without a build step.

Notes:

- browsers often block `fetch()` for local JSON files under `file://`
- the app still works because inline sample data exists

## Option 2: run a simple local server

Example:

```powershell
python -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/admin.html`

This is useful when you want the sample JSON files to load through `fetch()`.

## How to deploy on Netlify

This project is deployable as static files plus Netlify Functions.

### Required Netlify settings

- build command: none required
- publish directory: `.`
- functions directory: `netlify/functions`

These settings already exist in `netlify.toml`.

### Deployment steps

1. Push the project to a Git repository.
2. Create a new Netlify site from that repository.
3. Confirm Netlify detects:
   - publish directory `.`
   - functions directory `netlify/functions`
4. Deploy the site.
5. Confirm:
   - `index.html` loads
   - `admin.html` loads
   - functions respond
   - redirects from `netlify.toml` are active

### Post-deploy checks

- open the display page
- open the admin page
- save prayer times in the admin page
- save events in the admin page
- save a theme
- confirm the same browser session can read the changes

## How to add a real backend/database later

The clean path is to replace `localStorage` as the main source of truth while keeping the static frontend.

Recommended changes:

1. add a hosted database
2. add authenticated admin access
3. save prayer times and events remotely
4. have display screens read remote data first
5. keep local sample data only as emergency fallback

## Suggested Supabase upgrade plan

### Phase 1: data storage

Create tables:

- `prayer_times`
  - `date` primary key
  - `hijri_date_arabic`
  - `hijri_date_latin`
  - `fajr`
  - `sunrise`
  - `dhuhr`
  - `asr`
  - `maghrib`
  - `isha`
- `events`
  - `id`
  - `title_arabic`
  - `title_danish`
  - `date`
  - `time`
  - `location_arabic`
  - `location_danish`
  - `description_arabic`
  - `description_danish`
  - `theme`
  - `active`
- `settings`
  - `current_theme`

### Phase 2: read path

Update frontend loaders to:

1. fetch Supabase data first
2. use current local fallback chain only if the remote read fails

### Phase 3: admin writes

Replace `localStorage` save actions in `admin.js` with:

- insert/update prayer rows
- insert/update event rows
- update theme setting

### Phase 4: authentication

Add Supabase Auth so only approved mosque admins can update data.

### Phase 5: screen sync

Use one of:

- periodic polling
- serverless cached API endpoints
- realtime subscriptions for settings/events if needed

## Coding standards

- keep the project static-first
- use plain HTML, CSS, and JavaScript
- use semantic HTML
- keep modules small and focused
- prefer existing project patterns over new abstractions
- use CSS custom properties for theming
- avoid inline styles
- avoid unnecessary comments
- validate user-entered JSON before persisting it
- fail gracefully when data is missing
- do not break direct `file://` usage

## Testing checklist

### Display

- `index.html` opens directly without a build step
- today’s prayer times are shown when data exists
- missing today shows a clear fallback
- next prayer is calculated correctly
- countdown updates every second
- after the last prayer, tomorrow’s Fajr is used when available
- highlight moves to the correct next prayer
- page reloads after midnight
- no upcoming event shows the correct fallback message
- both themes render correctly
- missing logo image does not break layout

### Admin

- invalid JSON shows an error
- invalid JSON is not saved
- valid prayer times are prettified and saved
- valid events are prettified and saved
- theme saves correctly
- status panel shows saved prayer count/date range/event count/theme
- clear saved data restores fallback behavior

### Deployment

- Netlify publishes from project root
- Netlify functions deploy from `netlify/functions`
- function routes respond
- redirect routes respond

## Known limitations

- no authentication on `admin.html`
- `localStorage` data is limited to one browser profile on one device
- no true central sync between multiple screens
- no database persistence
- sample JSON and inline sample data both need to stay aligned

## Future improvements

- replace `localStorage` with Supabase-backed storage
- add authentication for admins
- create CSV import for prayer times
- add export/download of current saved data
- add bulk event management UI
- add remote theme scheduling
- add optional multilingual admin help text
