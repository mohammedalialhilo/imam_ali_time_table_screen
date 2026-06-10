# User Admin Manual

## What this page does

`admin.html` lets a masjid admin update:

- prayer times
- upcoming events
- the display theme

No code editing is needed.

## Important storage note

This version saves data only in `localStorage`.

That means:

- data is saved only on the device and browser where `admin.html` is used
- another computer, TV box, tablet, or browser will not receive the update automatically
- if you clear browser storage, the saved data is removed from that browser

For real multi-screen syncing later, the project should use an online database such as Supabase.

## Open the admin page

1. Open `admin.html` in the browser that should control the screen.
2. Use **Open Display Preview** to open `index.html`.
3. Keep both pages in the same browser profile if you want the preview to read the saved values immediately.

## Main buttons

- `Load Sample Data`:
  fills both JSON editors with sample data, but does not save it
- `Clear Saved Data`:
  removes saved prayer times, events, and theme from this browser
- `Open Display Preview`:
  opens `index.html`

## Update prayer times

1. Paste your prayer-times JSON into **Prayer Times JSON**.
2. Click **Validate Prayer Times**.
3. If the message says the data is valid, click **Save Prayer Times**.
4. Open or refresh `index.html` in the same browser to confirm the update.

After successful validation, the JSON box is automatically formatted.

### Prayer-times rules

The data must be an array.

Each object must include:

- `date`
- `fajr`
- `sunrise`
- `dhuhr`
- `asr`
- `maghrib`
- `isha`

Optional fields:

- `hijriDateArabic`
- `hijriDateLatin`

### Formats

- `date` must be `YYYY-MM-DD`
- prayer times must be `HH:mm`

### Example

```json
[
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

## Update events

1. Paste your events JSON into **Events JSON**.
2. Click **Validate Events**.
3. If the message says the data is valid, click **Save Events**.
4. Open or refresh `index.html` in the same browser to confirm the update.

After successful validation, the JSON box is automatically formatted.

### Event rules

The data must be an array.

Each object must include:

- `id`
- `titleArabic`
- `titleDanish`
- `date`
- `time`
- `active`

Optional fields:

- `locationArabic`
- `locationDanish`
- `descriptionArabic`
- `descriptionDanish`
- `theme`

### Formats

- `date` must be `YYYY-MM-DD`
- `time` must be `HH:mm`
- `active` must be `true` or `false`

### Example

```json
[
  {
    "id": "event-001",
    "titleArabic": "صلاة الجمعة",
    "titleDanish": "Fredagsbøn",
    "date": "2026-06-12",
    "time": "13:30",
    "locationArabic": "الجامع الرئيسي",
    "locationDanish": "Hovedmoskeen",
    "descriptionArabic": "مرحباً بكم",
    "descriptionDanish": "Alle er velkomne",
    "theme": "teal",
    "active": true
  }
]
```

## Change theme

1. Select `Teal` or `Muharram`.
2. Click **Save Theme**.
3. Refresh `index.html` if needed.

## Saved Data Status panel

The status panel shows what is saved in this browser:

- prayer-time days
- first date
- last date
- saved events
- current theme

Use **Refresh Status** if you want to re-read the saved browser data.

## Clear saved data

1. Click **Clear Saved Data**.
2. The saved browser data is removed.
3. The editors will show sample fallback data again.
4. `index.html` will return to fallback sample data and the default teal theme.

## If validation fails

- invalid JSON will show an error message
- invalid data will not be saved
- fix the message shown under the editor, then validate again

## Recommended workflow

1. Open `admin.html`
2. Paste prayer times
3. Validate prayer times
4. Save prayer times
5. Paste events
6. Validate events
7. Save events
8. Save the theme if needed
9. Open `index.html` and confirm the display
