import { APP_CONFIG, SAMPLE_EVENTS } from "./config.js";
import { getEventsFromStorage } from "./storage.js";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function normalizeEvent(entry = {}, index = 0) {
  return {
    id: String(entry.id ?? `event-${index + 1}`).trim(),
    titleArabic: String(entry.titleArabic ?? "").trim(),
    titleDanish: String(entry.titleDanish ?? "").trim(),
    date: String(entry.date ?? "").trim(),
    time: String(entry.time ?? "").trim(),
    locationArabic: String(entry.locationArabic ?? "").trim(),
    locationDanish: String(entry.locationDanish ?? "").trim(),
    descriptionArabic: String(entry.descriptionArabic ?? "").trim(),
    descriptionDanish: String(entry.descriptionDanish ?? "").trim(),
    theme: APP_CONFIG.themes[entry.theme] ? entry.theme : APP_CONFIG.defaultTheme,
    active: Boolean(entry.active),
  };
}

function sanitizeEvent(entry, index) {
  const normalized = normalizeEvent(entry, index);
  if (!DATE_KEY_PATTERN.test(normalized.date) || !TIME_PATTERN.test(normalized.time)) {
    return null;
  }

  return normalized;
}

function sanitizeEventsArray(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((entry, index) => sanitizeEvent(entry, index))
    .filter(Boolean)
    .sort((left, right) => createEventDateTime(left) - createEventDateTime(right));
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

  if (payload && typeof payload === "object" && "date" in payload && "time" in payload) {
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

function createEventDateTime(event) {
  const [year, month, day] = event.date.split("-").map(Number);
  const [hours, minutes] = event.time.split(":").map(Number);
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
  const normalized = input.map(normalizeEvent);

  normalized.forEach((event, index) => {
    if (!event.id) {
      errors.push(`Event ${index + 1}: id is required.`);
    }

    if (!DATE_KEY_PATTERN.test(event.date)) {
      errors.push(`Event ${index + 1}: date must use YYYY-MM-DD.`);
    }

    if (!TIME_PATTERN.test(event.time)) {
      errors.push(`Event ${index + 1}: time must use HH:mm.`);
    }

    if (!event.titleArabic || !event.titleDanish) {
      errors.push(`Event ${index + 1}: both Arabic and Danish titles are required.`);
    }

    if (!event.locationArabic || !event.locationDanish) {
      errors.push(`Event ${index + 1}: both Arabic and Danish locations are required.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    normalized,
  };
}

async function loadSampleEventsFromFile() {
  return fetchEventsJson(APP_CONFIG.samplePaths.events);
}

async function loadUpcomingEventFromFunction() {
  return fetchEventsJson(APP_CONFIG.apiPaths.upcomingEvent);
}

export async function loadEvents() {
  const storedEvents = sanitizeEventsArray(getEventsFromStorage());
  if (storedEvents.length > 0) {
    return { items: storedEvents, source: "localStorage" };
  }

  const fileEvents = await loadSampleEventsFromFile();
  if (fileEvents.length > 0) {
    return { items: fileEvents, source: "sample-file" };
  }

  const functionEvents = await loadUpcomingEventFromFunction();
  if (functionEvents.length > 0) {
    return { items: functionEvents, source: "netlify-function" };
  }

  return {
    items: sanitizeEventsArray(SAMPLE_EVENTS),
    source: "inline-sample",
  };
}

export function getUpcomingEvent(events, now = new Date()) {
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  const sortedUpcomingEvents = events
    .filter((event) => event.active && createEventDateTime(event).getTime() >= now.getTime())
    .sort((left, right) => createEventDateTime(left) - createEventDateTime(right));

  return sortedUpcomingEvents[0] ?? null;
}

export function getEventDateTime(event) {
  return createEventDateTime(event);
}
