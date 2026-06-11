import { APP_CONFIG, SAMPLE_EVENTS } from "./config.js";
import { loadUpcomingEventFromRemote } from "./remote-data.js";
import { getEventsFromStorage, saveEventsToStorage } from "./storage.js";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const IMAGE_DATA_URL_PATTERN = /^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,/i;

const FALLBACK_EVENT_CATEGORIES = {
  normal: {
    label: "Normal",
    labelArabic: "عادي",
    labelDanish: "Normal",
    placeholderArabic: "فعالية المسجد",
    placeholderDanish: "Moské-arrangement",
    symbol: "N",
    displayThemes: ["teal"],
  },
  muharram: {
    label: "Muharram",
    labelArabic: "محرم",
    labelDanish: "Muharram",
    placeholderArabic: "فعالية محرم",
    placeholderDanish: "Muharram-arrangement",
    symbol: "M",
    displayThemes: ["muharram"],
  },
  ramadan: {
    label: "Ramadan",
    labelArabic: "رمضان",
    labelDanish: "Ramadan",
    placeholderArabic: "برنامج رمضان",
    placeholderDanish: "Ramadan-program",
    symbol: "R",
    displayThemes: ["teal"],
  },
  eid: {
    label: "Eid",
    labelArabic: "عيد",
    labelDanish: "Eid",
    placeholderArabic: "فعالية العيد",
    placeholderDanish: "Eid-arrangement",
    symbol: "E",
    displayThemes: ["teal"],
  },
  majlis: {
    label: "Majlis",
    labelArabic: "مجلس",
    labelDanish: "Majlis",
    placeholderArabic: "مجلس",
    placeholderDanish: "Majlis",
    symbol: "J",
    displayThemes: ["teal", "muharram"],
  },
  friday: {
    label: "Friday prayer",
    labelArabic: "الجمعة",
    labelDanish: "Fredagsbøn",
    placeholderArabic: "صلاة الجمعة",
    placeholderDanish: "Fredagsbøn",
    symbol: "F",
    displayThemes: ["teal"],
  },
};

const LEGACY_THEME_MAP = {
  teal: "normal",
  muharram: "muharram",
};

function getEventCategories() {
  return APP_CONFIG.eventCategories ?? FALLBACK_EVENT_CATEGORIES;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function isValidDateKey(value) {
  return DATE_KEY_PATTERN.test(String(value ?? "").trim());
}

function isValidTimeString(value) {
  return TIME_PATTERN.test(String(value ?? "").trim());
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

function normalizeString(value) {
  return String(value ?? "").trim();
}

function normalizeIsoTimestamp(value) {
  const normalized = normalizeString(value);
  if (!normalized) {
    return "";
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

function normalizeImageDataUrl(value) {
  const normalized = normalizeString(value);
  return IMAGE_DATA_URL_PATTERN.test(normalized) ? normalized : "";
}

function getSafeThemeKey(theme) {
  const normalized = normalizeString(theme).toLowerCase();
  const mapped = LEGACY_THEME_MAP[normalized] ?? normalized;
  return getEventCategories()[mapped] ? mapped : "normal";
}

function normalizeActiveValue(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "false") {
      return false;
    }
    if (normalized === "true") {
      return true;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return value == null ? true : Boolean(value);
}

function normalizeArchivedValue(value) {
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

  return false;
}

function createEventId() {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `event-${Date.now().toString(36)}-${randomPart}`;
}

function sortEventsByDateTime(events = []) {
  return [...events].sort((left, right) => {
    const leftDate = getEventDateTime(left).getTime();
    const rightDate = getEventDateTime(right).getTime();
    return leftDate - rightDate;
  });
}

function normalizeEventEntry(event = {}, index = 0) {
  return {
    id: normalizeString(event.id) || `event-${index + 1}`,
    titleArabic: normalizeString(event.titleArabic),
    titleDanish: normalizeString(event.titleDanish),
    date: normalizeString(event.date),
    time: normalizeString(event.time),
    locationArabic: normalizeString(event.locationArabic),
    locationDanish: normalizeString(event.locationDanish),
    descriptionArabic: normalizeString(event.descriptionArabic),
    descriptionDanish: normalizeString(event.descriptionDanish),
    imageDataUrl: normalizeImageDataUrl(event.imageDataUrl),
    theme: getSafeThemeKey(event.theme),
    active: normalizeActiveValue(event.active),
    archived: normalizeArchivedValue(event.archived),
    createdAt: normalizeIsoTimestamp(event.createdAt),
    updatedAt: normalizeIsoTimestamp(event.updatedAt),
  };
}

function sanitizeEventEntry(event = {}, index = 0) {
  const normalized = normalizeEventEntry(event, index);
  if (!isValidDateKey(normalized.date) || !isRealCalendarDate(normalized.date)) {
    return null;
  }

  if (!isValidTimeString(normalized.time)) {
    return null;
  }

  return normalized;
}

function sanitizeEventsArray(input, options = {}) {
  if (!Array.isArray(input)) {
    return [];
  }

  const includeArchived = options.includeArchived === true;
  const byId = new Map();
  input.forEach((event, index) => {
    const sanitized = sanitizeEventEntry(event, index);
    if (sanitized && (includeArchived || !sanitized.archived)) {
      byId.set(sanitized.id, sanitized);
    }
  });

  return sortEventsByDateTime([...byId.values()]);
}

function normalizeEventPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.events)) {
    return payload.events;
  }

  if (payload?.upcomingEvent && typeof payload.upcomingEvent === "object") {
    return [payload.upcomingEvent];
  }

  if (payload && typeof payload === "object" && "id" in payload) {
    return [payload];
  }

  return [];
}

async function fetchEventsJson(url) {
  if (typeof window === "undefined" || window.location.protocol === "file:" || typeof fetch !== "function") {
    return [];
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return sanitizeEventsArray(normalizeEventPayload(payload));
  } catch (error) {
    return [];
  }
}

async function loadSampleEventsFromFile() {
  return fetchEventsJson(APP_CONFIG.samplePaths.events);
}

async function loadEventsFromFunction() {
  const result = await loadUpcomingEventFromRemote();
  if (!result.ok) {
    return null;
  }

  return sanitizeEventsArray(normalizeEventPayload(result.data));
}

function buildStoredEvent(eventData = {}, existingEvent = null) {
  const nowIso = new Date().toISOString();
  const requestedId = normalizeString(eventData.id);
  return {
    id: existingEvent?.id || requestedId || createEventId(),
    titleArabic: normalizeString(eventData.titleArabic),
    titleDanish: normalizeString(eventData.titleDanish),
    date: normalizeString(eventData.date),
    time: normalizeString(eventData.time),
    locationArabic: normalizeString(eventData.locationArabic),
    locationDanish: normalizeString(eventData.locationDanish),
    descriptionArabic: normalizeString(eventData.descriptionArabic),
    descriptionDanish: normalizeString(eventData.descriptionDanish),
    imageDataUrl: normalizeImageDataUrl(eventData.imageDataUrl || existingEvent?.imageDataUrl),
    theme: getSafeThemeKey(eventData.theme || existingEvent?.theme),
    active: typeof eventData.active === "boolean" ? eventData.active : normalizeActiveValue(existingEvent?.active),
    archived: typeof eventData.archived === "boolean" ? eventData.archived : normalizeArchivedValue(existingEvent?.archived),
    createdAt: existingEvent?.createdAt || normalizeIsoTimestamp(eventData.createdAt) || nowIso,
    updatedAt: nowIso,
  };
}

function withSavedEvents(items) {
  return {
    ok: saveEvents(items),
    items,
  };
}

export function getEventThemeMeta(theme) {
  const safeTheme = getSafeThemeKey(theme);
  return {
    key: safeTheme,
    ...getEventCategories()[safeTheme],
  };
}

export function eventMatchesDisplayTheme(event, displayTheme = APP_CONFIG.defaultTheme) {
  const eventTheme = getEventThemeMeta(event?.theme);
  return eventTheme.displayThemes.includes(displayTheme);
}

export function getEventDateTime(event) {
  const safeDate = normalizeString(event?.date);
  const safeTime = normalizeString(event?.time);
  if (!isValidDateKey(safeDate) || !isValidTimeString(safeTime)) {
    return new Date(0);
  }

  const [year, month, day] = safeDate.split("-").map(Number);
  const [hours, minutes] = safeTime.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function validateEventsArray(input) {
  if (!Array.isArray(input)) {
    return {
      valid: false,
      errors: ["Events must be an array of event objects."],
      normalized: [],
    };
  }

  const errors = [];
  const normalized = input.map((event, index) => normalizeEventEntry(event, index));
  const duplicateIds = new Map();

  normalized.forEach((event) => {
    if (event.id) {
      duplicateIds.set(event.id, (duplicateIds.get(event.id) ?? 0) + 1);
    }
  });

  normalized.forEach((event, index) => {
    if (!event.id) {
      errors.push(`Entry ${index + 1}: id is required.`);
    }

    if (!event.titleArabic) {
      errors.push(`Entry ${index + 1}: titleArabic is required.`);
    }

    if (!event.titleDanish) {
      errors.push(`Entry ${index + 1}: titleDanish is required.`);
    }

    if (!isValidDateKey(event.date)) {
      errors.push(`Entry ${index + 1}: date must use YYYY-MM-DD.`);
    } else if (!isRealCalendarDate(event.date)) {
      errors.push(`Entry ${index + 1}: date is not a real calendar date.`);
    }

    if (!isValidTimeString(event.time)) {
      errors.push(`Entry ${index + 1}: time must use HH:mm.`);
    }

    if (typeof input[index]?.active !== "boolean") {
      errors.push(`Entry ${index + 1}: active must be boolean.`);
    }

    if (event.imageDataUrl && !IMAGE_DATA_URL_PATTERN.test(event.imageDataUrl)) {
      errors.push(`Entry ${index + 1}: imageDataUrl must be an image data URL when provided.`);
    }

    if (event.id && duplicateIds.get(event.id) > 1) {
      errors.push(`Entry ${index + 1}: duplicate id ${event.id}.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    normalized: sortEventsByDateTime(normalized),
  };
}

export async function loadEvents() {
  const functionEvents = await loadEventsFromFunction();
  if (functionEvents !== null) {
    return { items: functionEvents, source: "supabase-function" };
  }

  const storedEvents = sanitizeEventsArray(getEventsFromStorage());
  if (storedEvents.length > 0) {
    return { items: storedEvents, source: "localStorage" };
  }

  const fileEvents = await loadSampleEventsFromFile();
  if (fileEvents.length > 0) {
    return { items: fileEvents, source: "sample-file" };
  }

  return {
    items: sanitizeEventsArray(SAMPLE_EVENTS),
    source: "inline-sample",
  };
}

export function getUpcomingEvent(events, now = new Date()) {
  const activeEvents = sanitizeEventsArray(events).filter((event) => event.active && !event.archived);
  if (activeEvents.length === 0) {
    return null;
  }

  const futureEvents = activeEvents
    .filter((event) => getEventDateTime(event).getTime() >= now.getTime())
    .sort((left, right) => getEventDateTime(left) - getEventDateTime(right));

  if (futureEvents.length > 0) {
    return futureEvents[0];
  }

  const mostRecentPastEvents = activeEvents
    .filter((event) => getEventDateTime(event).getTime() < now.getTime())
    .sort((left, right) => getEventDateTime(right) - getEventDateTime(left));

  return mostRecentPastEvents[0] ?? null;
}

export function getSavedEvents(options = {}) {
  return sanitizeEventsArray(getEventsFromStorage(), options);
}

export function saveEvents(events) {
  return saveEventsToStorage(sortEventsByDateTime(sanitizeEventsArray(events, { includeArchived: true })));
}

export function createEvent(eventData, baseEvents = getSavedEvents({ includeArchived: true })) {
  const items = sortEventsByDateTime([
    ...sanitizeEventsArray(baseEvents, { includeArchived: true }),
    sanitizeEventEntry(buildStoredEvent(eventData), 0),
  ].filter(Boolean));

  return withSavedEvents(items);
}

export function updateEvent(eventId, eventData, baseEvents = getSavedEvents({ includeArchived: true })) {
  const items = sanitizeEventsArray(baseEvents, { includeArchived: true }).map((event) => (
    event.id === eventId
      ? sanitizeEventEntry(buildStoredEvent(eventData, event), 0)
      : event
  )).filter(Boolean);

  return withSavedEvents(sortEventsByDateTime(items));
}

export function deleteEvent(eventId, baseEvents = getSavedEvents({ includeArchived: true })) {
  const items = sanitizeEventsArray(baseEvents, { includeArchived: true }).filter((event) => event.id !== eventId);
  return withSavedEvents(items);
}

export function duplicateEvent(eventId, baseEvents = getSavedEvents({ includeArchived: true })) {
  const items = sanitizeEventsArray(baseEvents, { includeArchived: true });
  const original = items.find((event) => event.id === eventId);
  if (!original) {
    return { ok: false, items };
  }

  const copy = sanitizeEventEntry(buildStoredEvent({
    ...original,
    id: createEventId(),
    titleArabic: `${original.titleArabic} - نسخة`,
    titleDanish: `${original.titleDanish} (copy)`,
    createdAt: "",
    updatedAt: "",
  }), 0);

  return withSavedEvents(sortEventsByDateTime([...items, copy].filter(Boolean)));
}

export function toggleEventActive(eventId, baseEvents = getSavedEvents({ includeArchived: true })) {
  const items = sanitizeEventsArray(baseEvents, { includeArchived: true }).map((event) => (
    event.id === eventId
      ? sanitizeEventEntry(buildStoredEvent({ ...event, active: !event.active }, event), 0)
      : event
  )).filter(Boolean);

  return withSavedEvents(sortEventsByDateTime(items));
}

export function setEventArchived(eventId, archived, baseEvents = getSavedEvents({ includeArchived: true })) {
  const items = sanitizeEventsArray(baseEvents, { includeArchived: true }).map((event) => (
    event.id === eventId
      ? sanitizeEventEntry(buildStoredEvent({ ...event, archived }, event), 0)
      : event
  )).filter(Boolean);

  return withSavedEvents(sortEventsByDateTime(items));
}

export function createDraftEventDate(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}
