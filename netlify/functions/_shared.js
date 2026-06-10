const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const IMAGE_DATA_URL_PATTERN = /^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,/i;
const HTTP_URL_PATTERN = /^https?:\/\//i;

const COPENHAGEN_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Copenhagen",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const COPENHAGEN_DATETIME_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Copenhagen",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatToMap(formatter, date = new Date()) {
  return formatter.formatToParts(date).reduce((accumulator, part) => {
    if (part.type !== "literal") {
      accumulator[part.type] = part.value;
    }
    return accumulator;
  }, {});
}

function getCopenhagenDateKey(date = new Date()) {
  const parts = formatToMap(COPENHAGEN_DATE_FORMATTER, date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getCopenhagenTimeKey(date = new Date()) {
  const parts = formatToMap(COPENHAGEN_DATETIME_FORMATTER, date);
  return `${parts.hour}:${parts.minute}`;
}

function getRequestedDateKey(event) {
  const requested = String(event?.queryStringParameters?.date ?? "").trim();
  return isValidDateKey(requested) ? requested : getCopenhagenDateKey(new Date());
}

function getTomorrowDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return getCopenhagenDateKey(new Date(year, month - 1, day + 1, 12, 0, 0, 0));
}

function normalizeString(value) {
  return String(value ?? "").trim();
}

function normalizeOptionalString(value) {
  const normalized = normalizeString(value);
  return normalized || "";
}

function isValidDateKey(value) {
  return DATE_KEY_PATTERN.test(normalizeString(value));
}

function isValidTimeString(value) {
  return TIME_PATTERN.test(normalizeString(value));
}

function isRealCalendarDate(dateKey) {
  if (!isValidDateKey(dateKey)) {
    return false;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const parsed = new Date(year, month - 1, day, 12, 0, 0, 0);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

function normalizeBoolean(value, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return fallback;
}

function normalizeIsoTimestamp(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return "";
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

function normalizeImageValue(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return "";
  }

  if (IMAGE_DATA_URL_PATTERN.test(normalized) || HTTP_URL_PATTERN.test(normalized)) {
    return normalized;
  }

  return "";
}

function parseJsonBody(event) {
  if (!event?.body) {
    return {};
  }

  if (typeof event.body === "object") {
    return event.body;
  }

  return JSON.parse(event.body);
}

function normalizePrayerRow(input = {}) {
  return {
    date: normalizeString(input.date),
    hijriDateArabic: normalizeOptionalString(input.hijriDateArabic ?? input.hijri_date_arabic),
    hijriDateLatin: normalizeOptionalString(input.hijriDateLatin ?? input.hijri_date_latin),
    fajr: normalizeOptionalString(input.fajr),
    sunrise: normalizeOptionalString(input.sunrise),
    dhuhr: normalizeOptionalString(input.dhuhr),
    asr: normalizeOptionalString(input.asr),
    sunset: normalizeOptionalString(input.sunset),
    maghrib: normalizeOptionalString(input.maghrib),
    isha: normalizeOptionalString(input.isha),
    midnight: normalizeOptionalString(input.midnight),
  };
}

function normalizePrayerRows(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizePrayerRow);
  }

  if (Array.isArray(payload?.items)) {
    return payload.items.map(normalizePrayerRow);
  }

  if (Array.isArray(payload?.prayerTimes)) {
    return payload.prayerTimes.map(normalizePrayerRow);
  }

  if (payload && typeof payload === "object" && payload.date) {
    return [normalizePrayerRow(payload)];
  }

  return [];
}

function validatePrayerRows(rows = []) {
  const errors = [];
  const duplicateDates = new Map();

  rows.forEach((row) => {
    if (row.date) {
      duplicateDates.set(row.date, (duplicateDates.get(row.date) ?? 0) + 1);
    }
  });

  rows.forEach((row, index) => {
    if (!isValidDateKey(row.date)) {
      errors.push(`Entry ${index + 1}: date must use YYYY-MM-DD.`);
    } else if (!isRealCalendarDate(row.date)) {
      errors.push(`Entry ${index + 1}: date is not a real calendar date.`);
    }

    ["fajr", "sunrise", "dhuhr", "maghrib"].forEach((field) => {
      if (!isValidTimeString(row[field])) {
        errors.push(`Entry ${index + 1}: ${field} must use HH:mm.`);
      }
    });

    ["asr", "sunset", "isha", "midnight"].forEach((field) => {
      if (row[field] && !isValidTimeString(row[field])) {
        errors.push(`Entry ${index + 1}: ${field} must use HH:mm or stay empty.`);
      }
    });

    if (!isValidTimeString(row.asr) && !isValidTimeString(row.sunset)) {
      errors.push(`Entry ${index + 1}: provide either asr or sunset in HH:mm.`);
    }

    if (!isValidTimeString(row.isha) && !isValidTimeString(row.midnight)) {
      errors.push(`Entry ${index + 1}: provide either isha or midnight in HH:mm.`);
    }

    if (row.date && duplicateDates.get(row.date) > 1) {
      errors.push(`Entry ${index + 1}: duplicate date ${row.date}.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    items: rows,
  };
}

function toPrayerDbRow(row) {
  return {
    date: row.date,
    hijri_date_arabic: row.hijriDateArabic,
    hijri_date_latin: row.hijriDateLatin,
    fajr: row.fajr,
    sunrise: row.sunrise,
    dhuhr: row.dhuhr,
    asr: row.asr,
    sunset: row.sunset,
    maghrib: row.maghrib,
    isha: row.isha,
    midnight: row.midnight,
    updated_at: new Date().toISOString(),
  };
}

function fromPrayerDbRow(row = {}) {
  return normalizePrayerRow(row);
}

function createEventId() {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `event-${Date.now().toString(36)}-${randomPart}`;
}

function normalizeEventRow(input = {}) {
  return {
    id: normalizeOptionalString(input.id),
    titleArabic: normalizeOptionalString(input.titleArabic ?? input.title_arabic),
    titleDanish: normalizeOptionalString(input.titleDanish ?? input.title_danish),
    date: normalizeOptionalString(input.date ?? input.event_date),
    time: normalizeOptionalString(input.time ?? input.event_time),
    locationArabic: normalizeOptionalString(input.locationArabic ?? input.location_arabic),
    locationDanish: normalizeOptionalString(input.locationDanish ?? input.location_danish),
    descriptionArabic: normalizeOptionalString(input.descriptionArabic ?? input.description_arabic),
    descriptionDanish: normalizeOptionalString(input.descriptionDanish ?? input.description_danish),
    imageDataUrl: normalizeImageValue(input.imageDataUrl ?? input.image_data_url),
    theme: normalizeOptionalString(input.theme) || "normal",
    active: normalizeBoolean(input.active, true),
    createdAt: normalizeIsoTimestamp(input.createdAt ?? input.created_at),
    updatedAt: normalizeIsoTimestamp(input.updatedAt ?? input.updated_at),
  };
}

function validateEventRow(row) {
  const errors = [];

  if (!row.titleArabic) {
    errors.push("titleArabic is required.");
  }

  if (!row.titleDanish) {
    errors.push("titleDanish is required.");
  }

  if (!isValidDateKey(row.date)) {
    errors.push("date must use YYYY-MM-DD.");
  } else if (!isRealCalendarDate(row.date)) {
    errors.push("date is not a real calendar date.");
  }

  if (!isValidTimeString(row.time)) {
    errors.push("time must use HH:mm.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function toEventDbRow(row, existing = {}) {
  const nowIso = new Date().toISOString();
  return {
    id: row.id || existing.id || createEventId(),
    title_arabic: row.titleArabic,
    title_danish: row.titleDanish,
    event_date: row.date,
    event_time: row.time,
    location_arabic: row.locationArabic,
    location_danish: row.locationDanish,
    description_arabic: row.descriptionArabic,
    description_danish: row.descriptionDanish,
    image_data_url: row.imageDataUrl,
    theme: row.theme || "normal",
    active: normalizeBoolean(row.active, true),
    created_at: existing.created_at || row.createdAt || nowIso,
    updated_at: nowIso,
  };
}

function fromEventDbRow(row = {}) {
  return normalizeEventRow(row);
}

function sortPrayerRows(rows = []) {
  return [...rows].sort((left, right) => left.date.localeCompare(right.date));
}

function createEventSortKey(row) {
  return `${row.date}T${row.time}`;
}

function sortEventRows(rows = []) {
  return [...rows].sort((left, right) => createEventSortKey(left).localeCompare(createEventSortKey(right)));
}

module.exports = {
  createEventId,
  fromEventDbRow,
  fromPrayerDbRow,
  getCopenhagenDateKey,
  getCopenhagenTimeKey,
  getRequestedDateKey,
  getTomorrowDateKey,
  isValidDateKey,
  jsonResponse,
  normalizeEventRow,
  normalizePrayerRow,
  normalizePrayerRows,
  parseJsonBody,
  sortEventRows,
  sortPrayerRows,
  toEventDbRow,
  toPrayerDbRow,
  validateEventRow,
  validatePrayerRows,
};
