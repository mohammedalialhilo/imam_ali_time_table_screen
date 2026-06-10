# USER ADMIN MANUAL

## What this website does

This website is a digital screen system for the mosque.

It shows:

- today's prayer times
- the current time and date
- the Hijri date
- the next prayer and live countdown
- upcoming events
- either the normal teal theme or the Muharram red theme

There are two main pages:

- `index.html`: the public display screen
- `admin.html`: the update page for mosque staff

You do not need to edit code to use it.

## Before you start

This version saves data in the browser using `localStorage`.

This is important:

- data is saved only in the same browser on the same device
- if you use `admin.html` on one laptop, another laptop will not receive the update automatically
- if the display screen uses a different browser or device, you must save the same data there as well

Recommended future upgrade:

- connect the project to Supabase or another online database so one admin update can sync to all screens

## How to open the display screen

1. Open `index.html` in a browser.
2. Put that page on the TV, kiosk, or vertical screen you want to use.
3. For the best result, use full screen mode in the browser.

The display page updates the live clock every second and reloads automatically shortly after midnight.

## How to open the admin page

1. Open `admin.html` in the browser you want to use for updates.
2. Use the **Open Display Preview** button to open `index.html`.
3. Keep `admin.html` and `index.html` in the same browser profile if you want the preview to read the saved data immediately.

## What you can do in the admin page

The admin page lets you:

- paste prayer times JSON
- paste events JSON
- validate prayer times before saving
- validate events before saving
- save prayer times
- save events
- load sample data into both editors
- clear saved data
- choose the active theme
- open the display preview
- check the saved-data status panel

## Recommended update workflow

1. Open `admin.html`
2. Paste the monthly prayer times JSON
3. Click **Validate Prayer Times**
4. Click **Save Prayer Times**
5. Paste the events JSON
6. Click **Validate Events**
7. Click **Save Events**
8. Select the theme if needed
9. Click **Save Theme**
10. Open or refresh `index.html`
11. Confirm the display looks correct

## How to add monthly prayer times

Prayer times are saved as a JSON array.

Each day must be one object in the array.

### Required fields for each day

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

### Date and time format

- `date` must use `YYYY-MM-DD`
- times must use `HH:mm`

Examples:

- correct date: `2026-06-10`
- correct time: `17:40`

### Steps

1. Prepare one JSON array for the month.
2. Paste it into the **Prayer Times JSON** box.
3. Click **Validate Prayer Times**.
4. If the message says the data is valid, click **Save Prayer Times**.
5. The saved-data status panel should update with:
   - number of prayer-time days
   - first date
   - last date

### Prayer times JSON example

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
  },
  {
    "date": "2026-06-10",
    "hijriDateArabic": "24 ذو الحجة 1447 هـ",
    "hijriDateLatin": "24 Dhu al-Hijjah 1447 H",
    "fajr": "02:28",
    "sunrise": "04:27",
    "dhuhr": "13:09",
    "asr": "17:40",
    "maghrib": "21:52",
    "isha": "23:44"
  }
]
```

## How to add upcoming events

Events are also saved as a JSON array.

The display shows the nearest active upcoming event.

### Required fields for each event

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

### Date and time format

- `date` must use `YYYY-MM-DD`
- `time` must use `HH:mm`
- `active` must be `true` or `false`

### Steps

1. Paste the event array into the **Events JSON** box.
2. Click **Validate Events**.
3. If the message says the data is valid, click **Save Events**.
4. The saved-data status panel should update the event count.

### Events JSON example

```json
[
  {
    "id": "event-001",
    "titleArabic": "صلاة الجمعة",
    "titleDanish": "Fredagsbøn (Jumu'ah)",
    "date": "2026-06-12",
    "time": "13:30",
    "locationArabic": "الجامع الرئيسي",
    "locationDanish": "Hovedmoskeen",
    "descriptionArabic": "مرحباً بكم - نسعد بزيارتكم",
    "descriptionDanish": "Alle er velkomne - Vi glæder os til at se dig",
    "theme": "teal",
    "active": true
  },
  {
    "id": "event-002",
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

## How to switch the theme

The project includes two themes:

- `teal`: the normal daily display theme
- `muharram`: the black and red Muharram theme

### Steps

1. In `admin.html`, find the **Theme** section.
2. Select `Teal` or `Muharram`.
3. Click **Save Theme**.
4. Refresh `index.html` if the new theme does not appear immediately.

## How to check that the display updated

After saving data in `admin.html`:

1. Open `index.html` in the same browser.
2. Check that the prayer times match the data you saved.
3. Check that the event section shows the correct upcoming event.
4. Check that the selected theme is visible.
5. Check that the prayer row highlight and next-prayer card look correct.

Useful signs that the display updated:

- the prayer list matches your saved dates and times
- the event card shows your saved event
- the theme color changed
- the display is reading saved local data instead of old sample data

## What to do if today's prayer times are missing

If the display says today's prayer data is missing:

1. Open `admin.html`.
2. Check the **Saved Data Status** panel.
3. Look at the first and last prayer dates.
4. Confirm that today's date is included in your saved prayer-time JSON.
5. If today's date is missing, add it to the prayer-times array.
6. Validate again.
7. Save again.
8. Refresh `index.html`.

Also check:

- that you saved data in the same browser and device as the display
- that the date format is exactly `YYYY-MM-DD`
- that all required prayer fields are present

## What to do if the screen looks wrong

If the display looks incorrect:

1. Refresh `index.html`.
2. Confirm the correct theme is selected and saved.
3. Confirm the prayer times JSON is valid.
4. Confirm the events JSON is valid.
5. Check that the saved-data status panel shows the expected date range and counts.
6. Make sure you are using the same browser/device as the screen.

If you still have a problem:

1. Click **Load Sample Data** in `admin.html` to load known-good example data into the editors.
2. Do not save yet unless you want to replace your current saved data.
3. Compare the sample format with your own JSON.
4. If needed, click **Clear Saved Data** and let the display return to sample fallback data.

## How to refresh the screen

You can refresh the display in any of these ways:

- press the browser refresh button
- press `F5`
- close and reopen `index.html`
- reopen the page from the kiosk browser

The display also reloads automatically shortly after midnight to pick up the new day.

## How to use it on multiple screens

Because this version uses `localStorage`, there is no central online admin yet.

That means:

- each screen or device stores its own saved data
- one update does not automatically sync to all screens

### If you have multiple screens now

Use one of these methods:

1. Open `admin.html` on each screen device and save the same data there.
2. Use the same browser profile on the same device that runs the display.
3. If several displays run from one device/browser profile, they can share the same saved data there.

### Recommended future upgrade

For proper mosque-wide multi-screen syncing, connect the app to:

- Supabase
- Firebase
- another online database and admin backend

That would allow:

- one central admin page
- one source of truth for prayer times and events
- automatic updates across all screens

## Clear saved data

If you want to remove the saved browser data:

1. Open `admin.html`.
2. Click **Clear Saved Data**.
3. The saved prayer times, events, and theme will be removed from that browser.
4. The editors will show sample fallback data again.
5. `index.html` will go back to sample fallback data and the default teal theme.

## Final reminder

This version is good for:

- a single device
- a single browser profile
- local testing
- small manual setups

For a permanent multi-screen mosque setup, the next recommended step is a shared backend such as Supabase.
