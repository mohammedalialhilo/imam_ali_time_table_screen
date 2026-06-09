# User Admin Manual

## Open the admin page

1. Open `admin.html` in your browser.
2. Keep `index.html` open on the display screen if you want to test updates live in the same browser profile.

## Update prayer times

1. Paste a JSON array into the **Prayer Times JSON** box.
2. Click **Validate**.
3. If validation succeeds, click **Save**.

Each prayer time entry must include:

- `date`
- `hijriDateArabic`
- `hijriDateLatin`
- `fajr`
- `sunrise`
- `dhuhr`
- `asr`
- `maghrib`
- `isha`

Example date format:

```json
"2026-06-09"
```

Example time format:

```json
"13:09"
```

## Update events

1. Paste a JSON array into the **Events JSON** box.
2. Click **Validate**.
3. If validation succeeds, click **Save**.

Each event should include:

- `id`
- `titleArabic`
- `titleDanish`
- `date`
- `time`
- `locationArabic`
- `locationDanish`
- `descriptionArabic`
- `descriptionDanish`
- `theme`
- `active`

## Change the display theme

1. Choose `Teal` or `Muharram`.
2. Click **Save Theme**.

The display page reads the saved theme from the browser.

## Preview saved data

Use **Refresh Preview** to see:

- active theme
- number of saved prayer entries
- date range of saved prayer entries
- number of saved events
- next active event

## Clear local data

Click **Clear Local Data** to remove:

- saved prayer times
- saved events
- saved theme

After clearing, the app returns to fallback sample data and the default teal theme.

## Important note

`localStorage` is tied to the browser profile. If the display screen uses a different browser, computer, or profile, copy the JSON there and save it again from `admin.html`.
