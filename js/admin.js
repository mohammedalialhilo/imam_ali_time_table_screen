import { APP_CONFIG, SAMPLE_EVENTS, SAMPLE_PRAYER_TIMES } from "./config.js";
import { validateEventsArray } from "./events.js";
import { validatePrayerTimesArray } from "./prayer-times.js";
import {
  clearStoredDisplayData,
  getEventsFromStorage,
  getPrayerTimesFromStorage,
  getThemeFromStorage,
  hasLocalStorageSupport,
  saveEventsToStorage,
  savePrayerTimesToStorage,
  saveThemeToStorage,
} from "./storage.js";

const elements = {
  body: document.body,
  adminThemeBadge: document.querySelector("#admin-theme-badge"),
  generalStatus: document.querySelector("#admin-general-status"),
  prayerTimesInput: document.querySelector("#prayer-times-input"),
  eventsInput: document.querySelector("#events-input"),
  prayerTimesStatus: document.querySelector("#prayer-times-status"),
  eventsStatus: document.querySelector("#events-status"),
  themeStatus: document.querySelector("#theme-status"),
  statusPanelNote: document.querySelector("#status-panel-note"),
  statusPrayerCount: document.querySelector("#status-prayer-count"),
  statusPrayerFirstDate: document.querySelector("#status-prayer-first-date"),
  statusPrayerLastDate: document.querySelector("#status-prayer-last-date"),
  statusEventCount: document.querySelector("#status-event-count"),
  statusCurrentTheme: document.querySelector("#status-current-theme"),
  loadSampleData: document.querySelector("#load-sample-data"),
  validatePrayerTimes: document.querySelector("#validate-prayer-times"),
  savePrayerTimes: document.querySelector("#save-prayer-times"),
  validateEvents: document.querySelector("#validate-events"),
  saveEvents: document.querySelector("#save-events"),
  saveTheme: document.querySelector("#save-theme"),
  refreshPreview: document.querySelector("#refresh-preview"),
  clearLocalData: document.querySelector("#clear-local-data"),
  themeInputs: [...document.querySelectorAll('input[name="theme"]')],
};

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function setStatus(element, message, tone = "") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = "status-line";
  if (tone) {
    element.classList.add(`is-${tone}`);
  }
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

function sortByDate(entries) {
  return [...entries].sort((left, right) => left.date.localeCompare(right.date));
}

function applyTheme(theme) {
  const safeTheme = APP_CONFIG.themes[theme] ? theme : APP_CONFIG.defaultTheme;
  elements.body.dataset.theme = safeTheme;
  setText(elements.adminThemeBadge, APP_CONFIG.themes[safeTheme].label);

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

function formatValidationErrors(errors) {
  return errors.join(" ");
}

function validatePrayerTextarea() {
  const parsed = parseJsonFromTextarea(elements.prayerTimesInput);
  if (!parsed.ok) {
    setStatus(elements.prayerTimesStatus, `Invalid JSON: ${parsed.error.message}`, "error");
    return null;
  }

  const validation = validatePrayerTimesArray(parsed.value);
  if (!validation.valid) {
    setStatus(elements.prayerTimesStatus, formatValidationErrors(validation.errors), "error");
    return null;
  }

  elements.prayerTimesInput.value = prettyJson(validation.normalized);
  setStatus(
    elements.prayerTimesStatus,
    `Prayer times are valid. ${validation.normalized.length} day entries formatted and ready to save.`,
    "success",
  );
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
    setStatus(elements.eventsStatus, formatValidationErrors(validation.errors), "error");
    return null;
  }

  elements.eventsInput.value = prettyJson(validation.normalized);
  setStatus(
    elements.eventsStatus,
    `Events are valid. ${validation.normalized.length} entries formatted and ready to save.`,
    "success",
  );
  return validation.normalized;
}

function getSavedPrayerData() {
  const savedPrayerTimes = getPrayerTimesFromStorage();
  const validation = validatePrayerTimesArray(savedPrayerTimes);

  return validation.valid ? sortByDate(validation.normalized) : [];
}

function getSavedEventData() {
  const savedEvents = getEventsFromStorage();
  const validation = validateEventsArray(savedEvents);

  return validation.valid ? sortByDate(validation.normalized) : [];
}

function refreshStatusPanel() {
  const savedPrayerTimes = getSavedPrayerData();
  const savedEvents = getSavedEventData();
  const currentTheme = getThemeFromStorage();

  setText(elements.statusPrayerCount, String(savedPrayerTimes.length));
  setText(elements.statusPrayerFirstDate, savedPrayerTimes[0]?.date ?? "—");
  setText(elements.statusPrayerLastDate, savedPrayerTimes[savedPrayerTimes.length - 1]?.date ?? "—");
  setText(elements.statusEventCount, String(savedEvents.length));
  setText(elements.statusCurrentTheme, APP_CONFIG.themes[currentTheme].label);

  if (savedPrayerTimes.length === 0 && savedEvents.length === 0) {
    setStatus(
      elements.statusPanelNote,
      "No saved browser data found. The display will use bundled sample fallback data.",
      "warning",
    );
    return;
  }

  if (savedPrayerTimes.length === 0 || savedEvents.length === 0) {
    setStatus(
      elements.statusPanelNote,
      "Saved browser data is partial. Any missing section on the display will fall back to sample data.",
      "warning",
    );
    return;
  }

  setStatus(
    elements.statusPanelNote,
    "Saved browser data is available in this browser and can be read by index.html.",
    "success",
  );
}

function populateEditors() {
  const savedPrayerTimes = getSavedPrayerData();
  const savedEvents = getSavedEventData();

  elements.prayerTimesInput.value = prettyJson(savedPrayerTimes.length > 0 ? savedPrayerTimes : SAMPLE_PRAYER_TIMES);
  elements.eventsInput.value = prettyJson(savedEvents.length > 0 ? savedEvents : SAMPLE_EVENTS);
}

function loadSampleDataIntoEditors() {
  elements.prayerTimesInput.value = prettyJson(SAMPLE_PRAYER_TIMES);
  elements.eventsInput.value = prettyJson(SAMPLE_EVENTS);
}

function setGeneralReadyState() {
  if (hasLocalStorageSupport()) {
    setStatus(
      elements.generalStatus,
      "Ready. Validate each JSON box before saving. Saved data stays only in this browser.",
      "success",
    );
    return;
  }

  setStatus(
    elements.generalStatus,
    "This browser does not allow localStorage. You can validate JSON here, but saving will not work.",
    "error",
  );
}

function bindEvents() {
  elements.loadSampleData.addEventListener("click", () => {
    loadSampleDataIntoEditors();
    setStatus(elements.prayerTimesStatus, "Sample prayer times loaded into the editor. Validate before saving.", "warning");
    setStatus(elements.eventsStatus, "Sample events loaded into the editor. Validate before saving.", "warning");
    setStatus(elements.generalStatus, "Sample data loaded into both editors. Nothing has been saved yet.", "warning");
  });

  elements.validatePrayerTimes.addEventListener("click", () => {
    const validated = validatePrayerTextarea();
    if (validated) {
      setStatus(elements.generalStatus, "Prayer-time JSON is valid and formatted. Save it to update this browser.", "success");
    }
  });

  elements.savePrayerTimes.addEventListener("click", () => {
    const normalized = validatePrayerTextarea();
    if (!normalized) {
      setStatus(elements.generalStatus, "Prayer-time JSON could not be saved because validation failed.", "error");
      return;
    }

    if (!savePrayerTimesToStorage(normalized)) {
      setStatus(elements.prayerTimesStatus, "Could not save prayer times to localStorage in this browser.", "error");
      setStatus(elements.generalStatus, "Prayer times were not saved.", "error");
      return;
    }

    setStatus(elements.prayerTimesStatus, `Saved ${normalized.length} prayer-time days to this browser.`, "success");
    setStatus(elements.generalStatus, "Prayer times saved. index.html will now read the saved browser values.", "success");
    refreshStatusPanel();
  });

  elements.validateEvents.addEventListener("click", () => {
    const validated = validateEventTextarea();
    if (validated) {
      setStatus(elements.generalStatus, "Events JSON is valid and formatted. Save it to update this browser.", "success");
    }
  });

  elements.saveEvents.addEventListener("click", () => {
    const normalized = validateEventTextarea();
    if (!normalized) {
      setStatus(elements.generalStatus, "Events JSON could not be saved because validation failed.", "error");
      return;
    }

    if (!saveEventsToStorage(normalized)) {
      setStatus(elements.eventsStatus, "Could not save events to localStorage in this browser.", "error");
      setStatus(elements.generalStatus, "Events were not saved.", "error");
      return;
    }

    setStatus(elements.eventsStatus, `Saved ${normalized.length} events to this browser.`, "success");
    setStatus(elements.generalStatus, "Events saved. index.html will now read the saved browser values.", "success");
    refreshStatusPanel();
  });

  elements.themeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      applyTheme(input.value);
      setStatus(elements.themeStatus, `Theme selected: ${APP_CONFIG.themes[input.value].label}. Click Save Theme to store it.`, "warning");
    });
  });

  elements.saveTheme.addEventListener("click", () => {
    const selectedTheme = elements.themeInputs.find((input) => input.checked)?.value ?? APP_CONFIG.defaultTheme;
    if (!saveThemeToStorage(selectedTheme)) {
      setStatus(elements.themeStatus, "Could not save the theme to localStorage in this browser.", "error");
      setStatus(elements.generalStatus, "Theme was not saved.", "error");
      return;
    }

    applyTheme(selectedTheme);
    setStatus(elements.themeStatus, `Theme saved as ${APP_CONFIG.themes[selectedTheme].label}.`, "success");
    setStatus(elements.generalStatus, "Theme saved. index.html will use the selected theme in this browser.", "success");
    refreshStatusPanel();
  });

  elements.refreshPreview.addEventListener("click", () => {
    refreshStatusPanel();
    setStatus(elements.generalStatus, "Saved-data status refreshed from this browser.", "success");
  });

  elements.clearLocalData.addEventListener("click", () => {
    if (!clearStoredDisplayData()) {
      setStatus(elements.generalStatus, "Could not clear localStorage in this browser.", "error");
      return;
    }

    applyTheme(APP_CONFIG.defaultTheme);
    loadSampleDataIntoEditors();
    setStatus(elements.prayerTimesStatus, "Saved prayer times cleared. The editor now shows sample fallback data.", "warning");
    setStatus(elements.eventsStatus, "Saved events cleared. The editor now shows sample fallback data.", "warning");
    setStatus(elements.themeStatus, "Saved theme cleared. The display will fall back to teal.", "warning");
    setStatus(elements.generalStatus, "Saved browser data cleared. index.html will now fall back to sample data.", "warning");
    refreshStatusPanel();
  });
}

function initAdmin() {
  applyTheme(getThemeFromStorage());
  populateEditors();
  refreshStatusPanel();
  setGeneralReadyState();
  bindEvents();
}

initAdmin();
