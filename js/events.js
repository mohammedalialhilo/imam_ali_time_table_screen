import { APP_CONFIG, SAMPLE_EVENTS } from "./config.js";
import { getEventsFromStorage } from "./storage.js";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function normalizeEvent(entry) {
  return {
    id: String(entry.id ?? "").trim(),
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

    if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
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
  if (typeof window === "undefined" || window.location.protocol === "file:" || typeof fetch !== "function") {
    return null;
  }

  try {
    const response = await fetch(APP_CONFIG.samplePaths.events, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const validation = validateEventsArray(payload);
    return validation.valid ? validation.normalized : null;
  } catch (error) {
    return null;
  }
}

export async function loadEvents() {
  const stored = getEventsFromStorage();
  const storedValidation = validateEventsArray(stored);
  if (storedValidation.valid && storedValidation.normalized.length > 0) {
    return { items: storedValidation.normalized, source: "localStorage" };
  }

  const fileData = await loadSampleEventsFromFile();
  if (fileData && fileData.length > 0) {
    return { items: fileData, source: "sample-file" };
  }

  return {
    items: validateEventsArray(SAMPLE_EVENTS).normalized,
    source: "inline-sample",
  };
}

export function getUpcomingEvent(events, now = new Date()) {
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  const activeEvents = events.filter((event) => event.active);
  if (activeEvents.length === 0) {
    return null;
  }

  const sorted = [...activeEvents].sort((left, right) => {
    const leftDate = createEventDateTime(left).getTime();
    const rightDate = createEventDateTime(right).getTime();
    return leftDate - rightDate;
  });

  const futureEvent = sorted.find((event) => createEventDateTime(event).getTime() >= now.getTime());
  return futureEvent ?? sorted[0];
}

export function getEventDateTime(event) {
  return createEventDateTime(event);
}
