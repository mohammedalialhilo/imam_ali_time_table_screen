import { APP_CONFIG, SAMPLE_EVENTS, SAMPLE_PRAYER_TIMES } from "./config.js";
import { getUpcomingEvent, validateEventsArray } from "./events.js";
import { validatePrayerTimesArray } from "./prayer-times.js";
import {
  clearStoredDisplayData,
  getEventsFromStorage,
  getPrayerTimesFromStorage,
  getThemeFromStorage,
  saveEventsToStorage,
  savePrayerTimesToStorage,
  saveThemeToStorage,
} from "./storage.js";

const elements = {
  body: document.body,
  adminThemeBadge: document.querySelector("#admin-theme-badge"),
  prayerTimesInput: document.querySelector("#prayer-times-input"),
  eventsInput: document.querySelector("#events-input"),
  prayerTimesStatus: document.querySelector("#prayer-times-status"),
  eventsStatus: document.querySelector("#events-status"),
  themeStatus: document.querySelector("#theme-status"),
  clearStatus: document.querySelector("#clear-status"),
  previewTheme: document.querySelector("#preview-theme"),
  previewPrayerCount: document.querySelector("#preview-prayer-count"),
  previewPrayerRange: document.querySelector("#preview-prayer-range"),
  previewEventCount: document.querySelector("#preview-event-count"),
  previewNextEvent: document.querySelector("#preview-next-event"),
  loadPrayerSample: document.querySelector("#load-prayer-sample"),
  validatePrayerTimes: document.querySelector("#validate-prayer-times"),
  savePrayerTimes: document.querySelector("#save-prayer-times"),
  loadEventSample: document.querySelector("#load-event-sample"),
  validateEvents: document.querySelector("#validate-events"),
  saveEvents: document.querySelector("#save-events"),
  saveTheme: document.querySelector("#save-theme"),
  refreshPreview: document.querySelector("#refresh-preview"),
  clearLocalData: document.querySelector("#clear-local-data"),
  themeInputs: [...document.querySelectorAll('input[name="theme"]')],
};

function setStatus(element, message, tone = "") {
  element.textContent = message;
  element.className = "status-line";
  if (tone) {
    element.classList.add(`is-${tone}`);
  }
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

function applyTheme(theme) {
  const safeTheme = APP_CONFIG.themes[theme] ? theme : APP_CONFIG.defaultTheme;
  elements.body.dataset.theme = safeTheme;
  elements.adminThemeBadge.textContent = APP_CONFIG.themes[safeTheme].label;
  elements.themeInputs.forEach((input) => {
    input.checked = input.value === safeTheme;
  });
}

function parseJsonFromTextarea(textarea) {
  try {
    return { ok: true, value: JSON.parse(textarea.value) };
  } catch (error) {
    return { ok: false, error };
  }
}

function validatePrayerTextarea() {
  const parsed = parseJsonFromTextarea(elements.prayerTimesInput);
  if (!parsed.ok) {
    setStatus(elements.prayerTimesStatus, `Invalid JSON: ${parsed.error.message}`, "error");
    return null;
  }

  const validation = validatePrayerTimesArray(parsed.value);
  if (!validation.valid) {
    setStatus(elements.prayerTimesStatus, validation.errors.join(" "), "error");
    return null;
  }

  setStatus(elements.prayerTimesStatus, `Valid prayer data with ${validation.normalized.length} day entries.`, "success");
  return validation.normalized;
}

function validateEventTextarea() {
  const parsed = parseJsonFromTextarea(elements.eventsInput);
  if (!parsed.ok) {
    setStatus(elements.eventsStatus, `Invalid JSON: ${parsed.error.message}`, "error");
    return null;
  }

  const validation = validateEventsArray(parsed.value);
  if (!validation.valid) {
    setStatus(elements.eventsStatus, validation.errors.join(" "), "error");
    return null;
  }

  setStatus(elements.eventsStatus, `Valid event data with ${validation.normalized.length} items.`, "success");
  return validation.normalized;
}

function formatRange(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return "No entries saved.";
  }

  const sorted = [...entries].sort((left, right) => left.date.localeCompare(right.date));
  return `${sorted[0].date} -> ${sorted[sorted.length - 1].date}`;
}

function refreshPreview() {
  const theme = getThemeFromStorage();
  const savedPrayerTimes = getPrayerTimesFromStorage();
  const savedEvents = getEventsFromStorage();

  const prayerValidation = validatePrayerTimesArray(savedPrayerTimes);
  const eventValidation = validateEventsArray(savedEvents);

  const prayerData = prayerValidation.valid && prayerValidation.normalized.length > 0
    ? prayerValidation.normalized
    : SAMPLE_PRAYER_TIMES;
  const eventData = eventValidation.valid && eventValidation.normalized.length > 0
    ? eventValidation.normalized
    : SAMPLE_EVENTS;

  applyTheme(theme);
  elements.previewTheme.textContent = APP_CONFIG.themes[theme].label;
  elements.previewPrayerCount.textContent = `${prayerData.length} daily entries`;
  elements.previewPrayerRange.textContent = formatRange(prayerData);
  elements.previewEventCount.textContent = `${eventData.length} events`;

  const upcomingEvent = getUpcomingEvent(eventData, new Date());
  elements.previewNextEvent.textContent = upcomingEvent
    ? `${upcomingEvent.titleDanish} - ${upcomingEvent.date} ${upcomingEvent.time}`
    : "No active upcoming event.";
}

function populateInputs() {
  const savedPrayerTimes = getPrayerTimesFromStorage();
  const savedEvents = getEventsFromStorage();
  const prayerValidation = validatePrayerTimesArray(savedPrayerTimes);
  const eventValidation = validateEventsArray(savedEvents);

  elements.prayerTimesInput.value = prettyJson(
    prayerValidation.valid && prayerValidation.normalized.length > 0
      ? prayerValidation.normalized
      : SAMPLE_PRAYER_TIMES
  );

  elements.eventsInput.value = prettyJson(
    eventValidation.valid && eventValidation.normalized.length > 0
      ? eventValidation.normalized
      : SAMPLE_EVENTS
  );
}

function bindEvents() {
  elements.loadPrayerSample.addEventListener("click", () => {
    elements.prayerTimesInput.value = prettyJson(SAMPLE_PRAYER_TIMES);
    setStatus(elements.prayerTimesStatus, "Sample prayer times loaded into the editor.", "warning");
  });

  elements.validatePrayerTimes.addEventListener("click", () => {
    validatePrayerTextarea();
  });

  elements.savePrayerTimes.addEventListener("click", () => {
    const normalized = validatePrayerTextarea();
    if (!normalized) {
      return;
    }

    savePrayerTimesToStorage(normalized);
    setStatus(elements.prayerTimesStatus, `Saved ${normalized.length} prayer entries to localStorage.`, "success");
    refreshPreview();
  });

  elements.loadEventSample.addEventListener("click", () => {
    elements.eventsInput.value = prettyJson(SAMPLE_EVENTS);
    setStatus(elements.eventsStatus, "Sample events loaded into the editor.", "warning");
  });

  elements.validateEvents.addEventListener("click", () => {
    validateEventTextarea();
  });

  elements.saveEvents.addEventListener("click", () => {
    const normalized = validateEventTextarea();
    if (!normalized) {
      return;
    }

    saveEventsToStorage(normalized);
    setStatus(elements.eventsStatus, `Saved ${normalized.length} events to localStorage.`, "success");
    refreshPreview();
  });

  elements.saveTheme.addEventListener("click", () => {
    const selectedTheme = elements.themeInputs.find((input) => input.checked)?.value ?? APP_CONFIG.defaultTheme;
    saveThemeToStorage(selectedTheme);
    applyTheme(selectedTheme);
    setStatus(elements.themeStatus, `Theme saved as ${APP_CONFIG.themes[selectedTheme].label}.`, "success");
    refreshPreview();
  });

  elements.refreshPreview.addEventListener("click", () => {
    refreshPreview();
    setStatus(elements.clearStatus, "Preview refreshed from current browser storage.", "success");
  });

  elements.clearLocalData.addEventListener("click", () => {
    clearStoredDisplayData();
    populateInputs();
    applyTheme(APP_CONFIG.defaultTheme);
    setStatus(elements.clearStatus, "Prayer times, events, and theme were cleared from localStorage.", "warning");
    setStatus(elements.themeStatus, "Theme reset to default teal after clearing local data.", "warning");
    refreshPreview();
  });
}

function initAdmin() {
  applyTheme(getThemeFromStorage());
  populateInputs();
  refreshPreview();
  bindEvents();
}

initAdmin();
