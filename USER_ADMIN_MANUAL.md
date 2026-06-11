# USER_ADMIN_MANUAL.md

## What the website does

This website is the digital signage system for Imam Ali Moskeen in Copenhagen.

The public display can show:

- today's prayer times
- current time and date
- Hijri date
- next prayer with live countdown
- upcoming event
- teal theme or Muharram red theme

Arabic is the main display language. Danish is shown as the secondary language.

## The two pages you use

### Display page

Open:

- `/index.html`
- or `/display` after Netlify deployment

This is the page shown on the mosque screen.

### Admin page

Open:

- `/admin.html`
- or `/admin` after Netlify deployment

This is the page used by mosque staff to update prayer times, events, and theme.

Important:

- `/admin` now requires login
- the public display page stays open and does not require login

## How to log in to the admin panel

1. Open `/admin`.
2. Enter your admin email.
3. Enter your password.
4. Click **Login / تسجيل الدخول**.
5. Wait for the page to verify your admin role.

After successful login, the admin dashboard appears.

## How to log out

1. Open `/admin`.
2. Click the **Logout / تسجيل الخروج** button in the top area.
3. The page returns to the login screen.

## Admin roles

There are two admin roles:

### Super admin

Super admins can:

- do everything normal admins can do
- create new admin accounts
- change admin roles
- disable admin accounts
- permanently remove disabled admin accounts
- view the full admin-account list

### Normal admin

Normal admins can:

- import prayer times
- edit and save prayer times
- add, edit, archive, restore, and manage events
- upload event images
- change the local theme setting if needed
- manage display content

Normal admins cannot:

- create admin accounts
- change admin roles
- disable other admins
- delete admin accounts

## How remote updates work

When the project is deployed on Netlify with Supabase connected:

- prayer times can be saved from the admin page to Supabase
- events can be saved from the admin page to Supabase
- mosque display screens read the shared data through Netlify Functions

Display update timing:

- running display screens refresh remote prayer/event data about once every minute
- manual browser refresh updates immediately
- the display also reloads shortly after midnight

Important:

- prayer times and events can sync through Supabase
- theme selection is still local to the browser/device for now

## Automatic archive behavior

When Supabase is connected, old display data can be archived automatically.

- prayer times from previous months are archived after the month has passed
- events are archived 7 days after the event date and time
- archived data does not appear on the public display
- archived data can be restored from the admin page
- permanent deletion is only available inside the archived-data section

## How to open the display screen

1. Open `index.html` or `/display`.
2. Put this page on the TV or vertical signage screen.
3. Leave the page open during the day.

## How to use the admin page

1. Open `admin.html` or `/admin`.
2. Log in with your admin email and password.
3. Check the quick status cards.
4. Look at the status line near the top:
   - `Connected to Supabase. Updates will sync to mosque screens.`
   - or `Supabase unavailable. Changes are saved locally only.`
5. Update prayer times, events, or theme.

## What to do if login fails

If login does not work:

1. Make sure both email and password are filled in.
2. Check that you are using the correct admin email.
3. Try the password again carefully.
4. If the message says Supabase is unavailable, try again later or contact the developer.
5. If the message says access is denied, your account may not have an active admin profile.

Important:

- if Supabase or the Netlify admin functions are unavailable, the login screen cannot open the dashboard
- once login works again, your normal prayer-time and event tools are available as usual

## What to do if an admin account is disabled

If a disabled admin tries to log in:

- login may succeed in Supabase Auth
- but `/admin` will show access denied because the admin profile is inactive

Only a super admin can reactivate access by updating the admin account in the backend/admin tools.

## Recommended prayer-time update method

The easiest method is:

1. upload the monthly timetable image
2. review the OCR text
3. correct mistakes
4. parse the timetable
5. review the preview table
6. save prayer times

## How to upload prayer times from an image

1. Open `/admin`.
2. Go to **Prayer times import**.
3. Choose the correct **month** and **year**.
4. Upload the timetable image.
5. Wait for OCR.
6. Review the extracted text.
7. Correct mistakes manually if needed.
8. Click **Parse timetable**.
9. Review the preview table carefully.
10. Fix any highlighted errors.
11. Click **Save corrected timetable**.
12. Open `/display` and confirm the update.

Important warning:

OCR can make mistakes. Always compare the preview table with the original image before saving.

## Copenhagen timetable format

The Imam Ali Moskeen Copenhagen timetable uses these columns:

- `Ugedag`
- `Date`
- `Subh`
- `Solopgang`
- `Dhuhr`
- `Solnedgang`
- `Maghrib`
- `Midnat`

The system imports them like this:

- `Subh` -> `fajr`
- `Solopgang` -> `sunrise`
- `Dhuhr` -> `dhuhr`
- `Solnedgang` -> `sunset`
- `Maghrib` -> `maghrib`
- `Midnat` -> `midnight`

Important:

- `Solnedgang` is not `Maghrib`
- `Midnat` is not `Isha`
- if `Asr` or `Isha` are missing in the timetable, they stay empty

## How to paste timetable text manually

If OCR is unavailable, you can still paste timetable text.

1. Open `/admin`.
2. Choose the correct month and year.
3. Paste the timetable text.
4. Click **Parse timetable**.
5. Review the preview table.
6. Fix any errors.
7. Click **Save corrected timetable**.

Example line:

```text
fredag 3 01:44 04:32 13:14 21:55 22:35 23:50
```

## How to review and correct parsed prayer times

1. Upload an image or paste timetable text.
2. Choose the correct month and year.
3. Click **Parse timetable**.
4. Review the **Preview parsed timetable** section.
5. Check the summary cards:
   - parsed rows
   - first date
   - last date
   - validation issues
6. Fix every highlighted cell.
7. If OCR text looks messy, click **Auto-fix OCR text** and then **Re-parse text**.
8. Make sure the validation panel says all rows are valid.
9. Click **Save corrected timetable**.

Important:

- OCR can read numbers incorrectly. Always compare the preview with the original timetable image before saving.
- On desktop and laptop screens, the preview appears as a wide editable table.
- On mobile screens, the preview changes into stacked editable cards.
- The page saves only when every required field is valid.

Preview columns:

- `Date`
- `Fajr/Subh`
- `Sunrise/Solopgang`
- `Dhuhr`
- `Asr` optional
- `Sunset/Solnedgang`
- `Maghrib`
- `Isha` optional
- `Midnight/Midnat`
- `Status`

Validation rules:

- `Date` must use `YYYY-MM-DD`
- required time fields must use `HH:mm`
- `Asr` and `Isha` may stay empty
- red rows and red inputs must be fixed before saving

## How to enter prayer times manually with JSON

This is an advanced fallback method and is hidden by default.

1. Open `/admin`.
2. Click `إدخال البيانات يدوياً / Enter data manually`.
3. Paste the JSON.
4. Click **Validate prayer times**.
5. Click **Save prayer times**.
6. Open `/display` and confirm the update.

## Prayer times JSON example

```json
[
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
]
```

## How to add an event with the simple form

1. Open `/admin`.
2. Go to **Events**.
3. Upload an event picture if available.
4. Enter the Arabic event name.
5. Enter the Danish event name.
6. Choose the date.
7. Choose the time.
8. Add the Arabic and Danish location.
9. Add optional Arabic and Danish descriptions.
10. Choose the category:
    - Normal
    - Muharram
    - Ramadan
    - Eid
    - Majlis
    - Friday prayer
11. Keep **Show this event on the display** checked if it should appear publicly.
12. Click **Save event / حفظ الفعالية**.
13. Open `/display` and confirm the update.

## How event images work

- supported formats: `PNG`, `JPG/JPEG`, `WEBP`
- the admin page previews the image immediately
- if no image is uploaded, the display uses a placeholder card
- large images over `2 MB` may not store well in browser fallback mode

Recommended image ratios:

- `16:9` for landscape screens
- `4:5` for portrait posters

## What to do if the image does not save

1. Use an optimized image under `2 MB`.
2. Prefer compressed `WEBP` or `JPG`.
3. Try again.
4. If needed, save the event without an image.

## How to edit an event

1. Open `/admin`.
2. In **Saved events**, click **Edit**.
3. Update the fields.
4. Click **Update event / تحديث الفعالية**.

## How to archive an active event

1. Open `/admin`.
2. Find the event in **Saved events**.
3. Click **Archive**.
4. Confirm the archive action.

The event is removed from the public display, but it can still be restored later.

## How to duplicate an event

1. Open `/admin`.
2. Find the event in **Saved events**.
3. Click **Duplicate**.
4. Edit the copy if needed.

## How to hide or show an event

1. Open `/admin`.
2. In **Saved events**, click **Hide** or **Show**.

Inactive events stay saved but do not appear on the public display.

## How to view archived data

1. Open `/admin`.
2. Go to **Archived data**.
3. Click **Show archived prayer times** or **Show archived events**.
4. Review the archived items before restoring or deleting anything.

## How to restore archived prayer times

1. Open `/admin`.
2. Go to **Archived data**.
3. Open **Archived prayer times**.
4. Click **Restore** for one day, or **Restore month** for a whole archived month.
5. Open `/display` and confirm the data appears again.

## How to restore an archived event

1. Open `/admin`.
2. Go to **Archived data**.
3. Open **Archived events**.
4. Click **Restore event**.
5. Open `/display` and confirm the event appears again if it is still active and relevant.

## How to permanently delete archived data

Use this only when you are sure the archived data is no longer needed.

Prayer times:

1. Open **Archived prayer times**.
2. Click **Delete** for one archived day, or **Delete month** for a full archived month.
3. Confirm the warning.

Events:

1. Open **Archived events**.
2. Click **Delete forever**.
3. Confirm the warning.

Important:

- permanent delete cannot be undone
- permanent delete is only available from the archived-data section

## Advanced: entering event JSON manually

The advanced event JSON editor is still available as a backup.

1. Open `/admin`.
2. In **Events**, click `إدخال الفعاليات بصيغة JSON يدوياً / Enter event JSON manually`.
3. Paste the JSON.
4. Click **Validate events**.
5. Click **Save events**.
6. Open `/display` and confirm the update.

## Events JSON example

```json
[
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
    "imageDataUrl": "",
    "theme": "muharram",
    "active": true,
    "createdAt": "2026-06-10T10:30:00.000Z",
    "updatedAt": "2026-06-10T10:30:00.000Z"
  }
]
```

## How to switch theme

1. Open `/admin`.
2. Choose:
   - `Teal normal theme`
   - `Muharram red theme`
3. Click **Save theme**.
4. Refresh the display page on each screen where the theme should change.

Important:

Theme selection is still local to the browser/device. It does not sync through Supabase yet.

## How to save updates from home

If Supabase is connected:

1. Open the deployed `/admin` page from home.
2. Log in with your admin account.
3. Save prayer times or events normally.
4. Wait about one minute, or refresh the mosque display page manually.
5. Confirm the update appears on the screen.

## How a super admin creates a new admin account

1. Log in to `/admin` with a super admin account.
2. Find the **Admin accounts / حسابات الإدارة** section.
3. Enter the new admin email.
4. Enter a temporary password.
5. Choose the role:
   - `Admin`
   - or `Super admin`
6. Click **Create admin account**.
7. Share the login details securely with the new admin.

Important:

- do not write real passwords in public documents
- ask the new admin to change or rotate credentials through your normal internal process if needed

## How to check that the display updated

After saving:

1. open `/display`
2. confirm today's prayer times are correct
3. confirm the next prayer card is correct
4. confirm the event section is correct
5. confirm the theme is correct for that screen

## What to do if today's prayer times are missing

1. Open `/admin`.
2. Check the first and last saved dates.
3. Confirm today's date is included.
4. If today's month was archived by mistake, restore it from **Archived prayer times**.
5. If the month does not exist yet, import the correct timetable month.
6. Save again.
7. Refresh the display page.

## What to do if the screen looks wrong

1. Refresh `/display`.
2. Check that today's prayer data exists.
3. Check that the selected theme is correct.
4. If a logo image is missing, the display uses a text fallback.
5. If Supabase is unavailable, the page may fall back to local or sample data.

## How to refresh the screen

Manual refresh:

- refresh the browser
- or reopen `/display`

Automatic refresh:

- countdown updates every second
- remote prayer/event data refreshes about once every minute
- full page reload happens shortly after midnight

## How to use it on multiple screens

With Supabase connected:

- one prayer-time or event update can reach multiple deployed screens
- each screen should use the deployed display page

Without Supabase:

- each browser/device keeps its own local data
- changes on one device do not automatically reach another device

## Current limitation of localStorage

`localStorage` only saves data in the same browser on the same device.

It does not sync between:

- different computers
- different browsers
- home admin device and mosque screens

## Recommended future upgrade

For full shared management, continue using or expanding:

- Supabase

Good next steps:

- sync theme through a shared settings table
- move event images from data URLs to Supabase Storage
