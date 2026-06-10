import { APP_CONFIG, SAMPLE_EVENTS, SAMPLE_PRAYER_TIMES } from "./config.js";
import {
  createEvent,
  deleteEvent,
  duplicateEvent,
  getEventThemeMeta,
  getSavedEvents,
  saveEvents,
  toggleEventActive,
  updateEvent,
  validateEventsArray,
} from "./events.js";
import {
  IMPORT_MONTH_OPTIONS,
  SAMPLE_TIMETABLE_TEXT,
  importedRowsToPrayerEntries,
  parseTimetableText,
  summarizeImportedRows,
  validateImportedPrayerRows,
} from "./import-prayer-image.js";
import { validatePrayerTimesArray } from "./prayer-times.js";
import {
  clearStoredDisplayData,
  clearStoredEvents,
  clearStoredPrayerTimes,
  getPrayerTimesFromStorage,
  getThemeFromStorage,
  hasLocalStorageSupport,
  savePrayerTimesToStorage,
  saveThemeToStorage,
} from "./storage.js";
import {
  checkSupabaseConnection,
  deleteEventRemotely,
  getRemoteFailureMessage,
  saveEventRemotely,
  savePrayerTimesRemotely,
} from "./remote-data.js";

const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
const MAX_EVENT_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_EVENT_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const PREVIEW_FIELDS = [
  { key: "date", label: "Date" },
  { key: "fajr", label: "Fajr / Subh" },
  { key: "sunrise", label: "Sunrise / Solopgang" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr (optional)" },
  { key: "sunset", label: "Sunset / Solnedgang" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha (optional)" },
  { key: "midnight", label: "Midnight / Midnat" },
];

const elements = {
  body: document.body,
  adminThemeBadge: document.querySelector("#admin-theme-badge"),
  generalStatus: document.querySelector("#admin-general-status"),
  adminStatusNote: document.querySelector("#status-panel-note"),
  dangerStatus: document.querySelector("#danger-status"),
  prayerTimesInput: document.querySelector("#prayer-times-input"),
  eventsInput: document.querySelector("#events-input"),
  importTextInput: document.querySelector("#import-text-input"),
  prayerTimesStatus: document.querySelector("#prayer-times-status"),
  eventsStatus: document.querySelector("#events-status"),
  themeStatus: document.querySelector("#theme-status"),
  imageImportStatus: document.querySelector("#image-import-status"),
  parseStatus: document.querySelector("#parse-status"),
  importSaveStatus: document.querySelector("#import-save-status"),
  previewSummary: document.querySelector("#preview-summary"),
  previewErrors: document.querySelector("#preview-errors"),
  statusPrayerCount: document.querySelector("#status-prayer-count"),
  statusPrayerFirstDate: document.querySelector("#status-prayer-first-date"),
  statusPrayerLastDate: document.querySelector("#status-prayer-last-date"),
  statusEventCount: document.querySelector("#status-event-count"),
  statusCurrentTheme: document.querySelector("#status-current-theme"),
  statusDataSource: document.querySelector("#status-data-source"),
  loadSampleData: document.querySelector("#load-sample-data"),
  validatePrayerTimes: document.querySelector("#validate-prayer-times"),
  savePrayerTimes: document.querySelector("#save-prayer-times"),
  validateEvents: document.querySelector("#validate-events"),
  saveEvents: document.querySelector("#save-events"),
  saveTheme: document.querySelector("#save-theme"),
  refreshPreview: document.querySelector("#refresh-preview"),
  clearLocalData: document.querySelector("#clear-local-data"),
  clearPrayerTimes: document.querySelector("#clear-prayer-times"),
  clearEvents: document.querySelector("#clear-events"),
  themeInputs: [...document.querySelectorAll('input[name="theme"]')],
  importMonth: document.querySelector("#import-month"),
  importYear: document.querySelector("#import-year"),
  imageInput: document.querySelector("#timetable-image-input"),
  runOcrButton: document.querySelector("#run-ocr-button"),
  useSampleImportText: document.querySelector("#use-sample-import-text"),
  imagePreviewPanel: document.querySelector("#image-preview-panel"),
  imagePreview: document.querySelector("#timetable-image-preview"),
  parseTimetable: document.querySelector("#parse-timetable"),
  previewTableContainer: document.querySelector("#preview-table-container"),
  saveImportedPrayerTimes: document.querySelector("#save-imported-prayer-times"),
  parseSkippedContainer: document.querySelector("#parse-skipped-container"),
  parseSkippedLines: document.querySelector("#parse-skipped-lines"),
  toggleManualEntry: document.querySelector("#toggle-manual-entry"),
  manualJsonSection: document.querySelector("#manual-json-section"),
  eventForm: document.querySelector("#event-form"),
  eventId: document.querySelector("#event-id"),
  eventTitleArabic: document.querySelector("#event-title-arabic"),
  eventTitleDanish: document.querySelector("#event-title-danish"),
  eventDate: document.querySelector("#event-date"),
  eventTime: document.querySelector("#event-time"),
  eventLocationArabic: document.querySelector("#event-location-arabic"),
  eventLocationDanish: document.querySelector("#event-location-danish"),
  eventDescriptionArabic: document.querySelector("#event-description-arabic"),
  eventDescriptionDanish: document.querySelector("#event-description-danish"),
  eventTheme: document.querySelector("#event-theme"),
  eventActive: document.querySelector("#event-active"),
  eventImageInput: document.querySelector("#event-image-input"),
  eventImagePreviewShell: document.querySelector("#event-image-preview-shell"),
  eventImagePreview: document.querySelector("#event-image-preview"),
  eventImagePlaceholderSymbol: document.querySelector("#event-image-placeholder-symbol"),
  eventImagePlaceholderAr: document.querySelector("#event-image-placeholder-ar"),
  eventImagePlaceholderDa: document.querySelector("#event-image-placeholder-da"),
  eventImageStatus: document.querySelector("#event-image-status"),
  eventFormErrors: document.querySelector("#event-form-errors"),
  eventSubmitButton: document.querySelector("#event-submit-button"),
  eventCancelEdit: document.querySelector("#event-cancel-edit"),
  eventFormStatus: document.querySelector("#event-form-status"),
  savedEventsList: document.querySelector("#saved-events-list"),
  eventDataSource: document.querySelector("#event-data-source"),
  toggleEventJsonEntry: document.querySelector("#toggle-event-json-entry"),
  eventJsonSection: document.querySelector("#event-json-section"),
};

const state = {
  previewRows: [],
  currentImageFile: null,
  currentImageUrl: "",
  tesseractPromise: null,
  eventImageDataUrl: "",
  editingEventId: "",
  supabaseConnected: false,
  supabaseChecked: false,
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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sortByDate(entries) {
  return [...entries].sort((left, right) => left.date.localeCompare(right.date));
}

function mergePrayerEntries(existingEntries, incomingEntries) {
  const merged = new Map();
  [...existingEntries, ...incomingEntries].forEach((entry) => {
    merged.set(entry.date, entry);
  });
  return sortByDate([...merged.values()]);
}

function getThemeLabel(theme) {
  return APP_CONFIG.themes[theme]?.label ?? APP_CONFIG.themes[APP_CONFIG.defaultTheme].label;
}

function getSavedPrayerData() {
  const savedPrayerTimes = getPrayerTimesFromStorage();
  const validation = validatePrayerTimesArray(savedPrayerTimes, { schema: "any" });
  return validation.valid ? sortByDate(validation.normalized) : [];
}

function getSampleEvents() {
  const validation = validateEventsArray(SAMPLE_EVENTS);
  return validation.valid ? validation.normalized : [];
}

function getCurrentEventCollection() {
  const savedEvents = getSavedEvents();
  if (savedEvents.length > 0) {
    return {
      items: savedEvents,
      source: "localStorage",
    };
  }

  return {
    items: getSampleEvents(),
    source: "sample",
  };
}

function getDisplaySourceLabel(usingLocalPrayerData, usingLocalEventData) {
  if (state.supabaseConnected) {
    return "Supabase";
  }

  if (usingLocalPrayerData || usingLocalEventData) {
    return "localStorage";
  }

  return "Sample data";
}

async function refreshSupabaseConnectionState() {
  const result = await checkSupabaseConnection();
  state.supabaseConnected = result.connected;
  state.supabaseChecked = true;
  refreshStatusPanel();
  setStatus(
    elements.generalStatus,
    result.connected ? APP_CONFIG.syncMessages.connected : APP_CONFIG.syncMessages.unavailable,
    result.connected ? "success" : "warning",
  );
  return result;
}

async function syncPrayerTimesWithRemote(entries) {
  const result = await savePrayerTimesRemotely(entries);
  state.supabaseConnected = result.ok;
  state.supabaseChecked = true;
  refreshStatusPanel();
  return result;
}

async function syncEventWithRemote(event) {
  const result = await saveEventRemotely(event);
  state.supabaseConnected = result.ok;
  state.supabaseChecked = true;
  refreshStatusPanel();
  return result;
}

async function syncEventCollectionWithRemote(events) {
  if (!Array.isArray(events) || events.length === 0) {
    state.supabaseChecked = true;
    return {
      ok: true,
      skipped: false,
      status: 200,
      data: { count: 0 },
      error: "",
    };
  }

  const results = await Promise.all(events.map((item) => saveEventRemotely(item)));
  const failedResult = results.find((result) => !result.ok) ?? null;
  const allSkipped = results.every((result) => result.skipped);
  state.supabaseConnected = !failedResult && !allSkipped;
  state.supabaseChecked = true;
  refreshStatusPanel();

  if (failedResult) {
    return failedResult;
  }

  if (allSkipped) {
    return {
      ok: false,
      skipped: true,
      status: 0,
      data: null,
      error: "Remote functions are unavailable in direct file-open mode.",
    };
  }

  return {
    ok: true,
    skipped: false,
    status: 200,
    data: { count: results.length },
    error: "",
  };
}

async function syncEventDeleteWithRemote(eventId) {
  const result = await deleteEventRemotely(eventId);
  state.supabaseConnected = result.ok;
  state.supabaseChecked = true;
  refreshStatusPanel();
  return result;
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

function populateMonthOptions() {
  elements.importMonth.innerHTML = IMPORT_MONTH_OPTIONS
    .map((monthOption) => `<option value="${monthOption.value}">${monthOption.label}</option>`)
    .join("");
}

function setDefaultImportPeriod() {
  const now = new Date();
  elements.importMonth.value = String(now.getMonth() + 1);
  elements.importYear.value = String(now.getFullYear());
}

function refreshStatusPanel() {
  const savedPrayerTimes = getSavedPrayerData();
  const savedEvents = getSavedEvents();
  const currentTheme = getThemeFromStorage();
  const usingLocalPrayerData = savedPrayerTimes.length > 0;
  const usingLocalEventData = savedEvents.length > 0;

  setText(elements.statusPrayerCount, String(savedPrayerTimes.length));
  setText(elements.statusPrayerFirstDate, savedPrayerTimes[0]?.date ?? "—");
  setText(elements.statusPrayerLastDate, savedPrayerTimes[savedPrayerTimes.length - 1]?.date ?? "—");
  setText(elements.statusEventCount, String(savedEvents.length));
  setText(elements.statusCurrentTheme, getThemeLabel(currentTheme));
  setText(elements.statusDataSource, getDisplaySourceLabel(usingLocalPrayerData, usingLocalEventData));

  if (!state.supabaseChecked) {
    setStatus(elements.adminStatusNote, "Checking Supabase connection status...", "warning");
    return;
  }

  if (state.supabaseConnected) {
    setStatus(elements.adminStatusNote, APP_CONFIG.syncMessages.connected, "success");
    return;
  }

  if (!usingLocalPrayerData && !usingLocalEventData) {
    setStatus(
      elements.adminStatusNote,
      `${APP_CONFIG.syncMessages.unavailable} The display will use bundled sample data.`,
      "warning",
    );
    return;
  }

  if (!usingLocalPrayerData) {
    setStatus(
      elements.adminStatusNote,
      `${APP_CONFIG.syncMessages.unavailable} Prayer times still come from sample data. Events or theme settings are saved in this browser.`,
      "warning",
    );
    return;
  }

  setStatus(
    elements.adminStatusNote,
    `${APP_CONFIG.syncMessages.unavailable} Saved browser data is available in this browser and can be read by index.html.`,
    "success",
  );
}

function syncEventEditor(events = getCurrentEventCollection().items) {
  elements.eventsInput.value = prettyJson(events);
}

function populateEditors() {
  const savedPrayerTimes = getSavedPrayerData();
  elements.prayerTimesInput.value = prettyJson(savedPrayerTimes.length > 0 ? savedPrayerTimes : SAMPLE_PRAYER_TIMES);
  syncEventEditor();
}

function loadSampleDataIntoEditors() {
  elements.prayerTimesInput.value = prettyJson(SAMPLE_PRAYER_TIMES);
  elements.eventsInput.value = prettyJson(SAMPLE_EVENTS);
}

function setGeneralReadyState() {
  if (hasLocalStorageSupport()) {
    setStatus(
      elements.generalStatus,
      "Ready. Upload a timetable image or paste timetable text, then review the preview before saving.",
      "success",
    );
    return;
  }

  setStatus(
    elements.generalStatus,
    "This browser does not allow localStorage. Supabase saves may still work when deployed, but browser-local fallback data will not be stored here.",
    "warning",
  );
}

function toggleManualSection(forceVisible) {
  const shouldShow = typeof forceVisible === "boolean"
    ? forceVisible
    : elements.manualJsonSection.hidden;

  elements.manualJsonSection.hidden = !shouldShow;
  elements.toggleManualEntry.textContent = shouldShow
    ? "Hide manual JSON entry"
    : "إدخال البيانات يدوياً / Enter data manually";
}

function toggleEventJsonSection(forceVisible) {
  const shouldShow = typeof forceVisible === "boolean"
    ? forceVisible
    : elements.eventJsonSection.hidden;

  elements.eventJsonSection.hidden = !shouldShow;
  elements.toggleEventJsonEntry.textContent = shouldShow
    ? "Hide event JSON entry"
    : "إدخال الفعاليات بصيغة JSON يدوياً / Enter event JSON manually";
}

function clearImagePreview() {
  if (state.currentImageUrl) {
    URL.revokeObjectURL(state.currentImageUrl);
  }

  state.currentImageUrl = "";
  state.currentImageFile = null;
  elements.imagePreview.src = "";
  elements.imagePreviewPanel.hidden = true;
  elements.runOcrButton.disabled = true;
}

function showImagePreview(file) {
  if (!file) {
    clearImagePreview();
    return;
  }

  if (state.currentImageUrl) {
    URL.revokeObjectURL(state.currentImageUrl);
  }

  state.currentImageFile = file;
  state.currentImageUrl = URL.createObjectURL(file);
  elements.imagePreview.src = state.currentImageUrl;
  elements.imagePreviewPanel.hidden = false;
  elements.runOcrButton.disabled = false;
}

function renderSkippedLines(skippedLines = []) {
  if (!Array.isArray(skippedLines) || skippedLines.length === 0) {
    elements.parseSkippedContainer.hidden = true;
    elements.parseSkippedLines.innerHTML = "";
    return;
  }

  elements.parseSkippedContainer.hidden = false;
  elements.parseSkippedLines.innerHTML = skippedLines
    .map((item) => `<li><strong>Line ${item.lineNumber}:</strong> ${escapeHtml(item.rawLine)}</li>`)
    .join("");
}

function getPreviewFieldIssue(row, field) {
  const joinedErrors = row.errors.join(" ").toLowerCase();
  if (field === "date") {
    return joinedErrors.includes("date");
  }
  return joinedErrors.includes(field.toLowerCase());
}

function renderPreviewTable() {
  if (state.previewRows.length === 0) {
    elements.previewTableContainer.innerHTML = `
      <div class="preview-empty-state">
        Upload a timetable image or paste timetable text to build the editable preview table.
      </div>
    `;
    return;
  }

  const headerMarkup = PREVIEW_FIELDS.map((field) => `<th scope="col">${field.label}</th>`).join("");
  const bodyMarkup = state.previewRows.map((row, rowIndex) => {
    const fieldCells = PREVIEW_FIELDS.map((field) => {
      const invalidClass = getPreviewFieldIssue(row, field.key) ? " is-invalid" : "";
      return `
        <td>
          <input
            class="preview-input${invalidClass}"
            type="text"
            value="${escapeHtml(row[field.key] ?? "")}"
            data-row-index="${rowIndex}"
            data-field="${field.key}"
          >
        </td>
      `;
    }).join("");

    const statusClass = row.errors.length > 0 ? "preview-status-text is-error" : "preview-status-text";
    const statusText = row.errors.length > 0
      ? row.statusText
      : `Ready. Source line ${row.sourceLineNumber || "—"}.`;

    return `
      <tr class="${row.errors.length > 0 ? "preview-row-error" : ""}">
        ${fieldCells}
        <td>
          <p class="${statusClass}" title="${escapeHtml(row.sourceLine || "")}">${escapeHtml(statusText)}</p>
        </td>
      </tr>
    `;
  }).join("");

  elements.previewTableContainer.innerHTML = `
    <table class="preview-table">
      <thead>
        <tr>
          ${headerMarkup}
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>${bodyMarkup}</tbody>
    </table>
  `;
}

function refreshPreviewValidation() {
  const validation = validateImportedPrayerRows(state.previewRows);
  state.previewRows = validation.rows;

  const summary = summarizeImportedRows(validation.rows.filter((row) => row.date));
  setText(
    elements.previewSummary,
    validation.rows.length > 0
      ? `Preview rows: ${summary.count}. First date: ${summary.firstDate}. Last date: ${summary.lastDate}.`
      : "No timetable parsed yet.",
  );

  if (validation.rows.length === 0) {
    setStatus(elements.previewErrors, "Parse a timetable to see validation details here.");
  } else if (validation.valid) {
    setStatus(elements.previewErrors, "All preview rows are valid and ready to save.", "success");
  } else {
    setStatus(
      elements.previewErrors,
      `${validation.errorCount} validation issues must be fixed before saving.`,
      "error",
    );
  }

  elements.saveImportedPrayerTimes.disabled = !validation.valid;
  renderPreviewTable();
}

function parseImportText() {
  const rawText = elements.importTextInput.value.trim();
  if (!rawText) {
    state.previewRows = [];
    renderSkippedLines([]);
    renderPreviewTable();
    setStatus(elements.parseStatus, "Paste timetable text or review OCR text before parsing.", "error");
    setStatus(elements.importSaveStatus, "Imported prayer times are not saved yet.");
    refreshPreviewValidation();
    return;
  }

  const parseResult = parseTimetableText(rawText, {
    month: Number(elements.importMonth.value),
    year: Number(elements.importYear.value),
  });

  state.previewRows = parseResult.rows;
  renderSkippedLines(parseResult.skippedLines);
  refreshPreviewValidation();
  setStatus(
    elements.importSaveStatus,
    parseResult.rows.length > 0
      ? "Preview updated. Review every row, then save imported prayer times."
      : "Imported prayer times are not saved yet.",
    parseResult.rows.length > 0 ? "warning" : "",
  );

  if (parseResult.rows.length === 0) {
    setStatus(elements.parseStatus, parseResult.message, "error");
    return;
  }

  if (parseResult.valid) {
    setStatus(elements.parseStatus, parseResult.message, "success");
    return;
  }

  setStatus(elements.parseStatus, `${parseResult.message} Fix highlighted rows before saving.`, "warning");
}

function populateImportSample() {
  elements.importMonth.value = "7";
  elements.importYear.value = "2026";
  elements.importTextInput.value = SAMPLE_TIMETABLE_TEXT;
  parseImportText();
}

function updateManualEditorFromSavedPrayerData(prayerEntries) {
  elements.prayerTimesInput.value = prettyJson(sortByDate(prayerEntries));
}

async function persistPrayerDataset(prayerEntries, successMessage) {
  const localSaved = savePrayerTimesToStorage(prayerEntries);
  const remoteResult = await syncPrayerTimesWithRemote(prayerEntries);

  if (localSaved) {
    updateManualEditorFromSavedPrayerData(prayerEntries);
    refreshStatusPanel();
  }

  if (remoteResult.ok && localSaved) {
    return {
      ok: true,
      localSaved: true,
      tone: "success",
      detail: successMessage,
      general: APP_CONFIG.syncMessages.connected,
    };
  }

  if (remoteResult.ok) {
    return {
      ok: true,
      localSaved: false,
      tone: "warning",
      detail: `${successMessage} Supabase was updated, but this browser could not update its local cache.`,
      general: APP_CONFIG.syncMessages.connected,
    };
  }

  if (localSaved) {
    return {
      ok: true,
      localSaved: true,
      tone: "warning",
      detail: `${successMessage} Saved in this browser only.`,
      general: APP_CONFIG.syncMessages.localOnly,
      remoteError: getRemoteFailureMessage(remoteResult),
    };
  }

  return {
    ok: false,
    localSaved: false,
    tone: "error",
    detail: "Could not save prayer times locally or remotely.",
    general: getRemoteFailureMessage(remoteResult, "Supabase unavailable. Prayer times were not saved."),
  };
}

async function saveImportedPrayerRows() {
  const validation = validateImportedPrayerRows(state.previewRows);
  state.previewRows = validation.rows;
  refreshPreviewValidation();

  if (!validation.valid) {
    setStatus(elements.importSaveStatus, "Imported rows contain validation errors and cannot be saved yet.", "error");
    setStatus(elements.generalStatus, "Fix the highlighted preview rows before saving imported prayer times.", "error");
    return;
  }

  const mergedPrayerEntries = mergePrayerEntries(
    getSavedPrayerData(),
    importedRowsToPrayerEntries(validation.rows),
  );

  const persistence = await persistPrayerDataset(
    mergedPrayerEntries,
    `Saved ${validation.rows.length} imported prayer-time rows. The merged dataset now has ${mergedPrayerEntries.length} day entries.`,
  );

  setStatus(elements.importSaveStatus, persistence.detail, persistence.tone);
  setStatus(elements.generalStatus, persistence.general, persistence.ok ? persistence.tone : "error");
  setStatus(
    elements.prayerTimesStatus,
    persistence.localSaved
      ? "Manual JSON editor updated with the saved merged prayer-time dataset."
      : "Manual JSON editor could not be updated because the browser copy was not saved.",
    persistence.localSaved ? persistence.tone : "error",
  );
}

function loadTesseract() {
  if (window.Tesseract) {
    return Promise.resolve(window.Tesseract);
  }

  if (state.tesseractPromise) {
    return state.tesseractPromise;
  }

  state.tesseractPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TESSERACT_CDN;
    script.async = true;
    script.onload = () => {
      if (window.Tesseract) {
        resolve(window.Tesseract);
      } else {
        state.tesseractPromise = null;
        reject(new Error("Tesseract loaded but was not available on window."));
      }
    };
    script.onerror = () => {
      state.tesseractPromise = null;
      reject(new Error("Could not load Tesseract.js from CDN."));
    };
    document.head.appendChild(script);
  });

  return state.tesseractPromise;
}

async function runOcrForCurrentImage() {
  if (!state.currentImageFile) {
    setStatus(elements.imageImportStatus, "Upload an image before running OCR.", "error");
    return;
  }

  setStatus(elements.imageImportStatus, "Loading OCR engine…", "warning");

  try {
    const Tesseract = await loadTesseract();
    const result = await Tesseract.recognize(state.currentImageFile, "eng", {
      logger(message) {
        if (message?.status) {
          const percent = typeof message.progress === "number"
            ? ` ${Math.round(message.progress * 100)}%`
            : "";
          setStatus(elements.imageImportStatus, `${message.status}${percent}`, "warning");
        }
      },
    });

    const extractedText = String(result?.data?.text ?? "").trim();
    elements.importTextInput.value = extractedText;

    if (!extractedText) {
      setStatus(
        elements.imageImportStatus,
        "OCR finished but no text was detected. Paste the timetable text manually below.",
        "warning",
      );
      return;
    }

    setStatus(
      elements.imageImportStatus,
      "OCR finished. Review and correct the extracted text before parsing.",
      "success",
    );
    setStatus(elements.parseStatus, "OCR text is ready. Click Parse timetable after reviewing it.", "warning");
  } catch (error) {
    setStatus(
      elements.imageImportStatus,
      "OCR is unavailable right now. The page still works: paste timetable text manually and continue.",
      "warning",
    );
  }
}

function handleImageSelection() {
  const file = elements.imageInput.files?.[0] ?? null;
  if (!file) {
    clearImagePreview();
    setStatus(elements.imageImportStatus, "No image uploaded yet.");
    return;
  }

  showImagePreview(file);
  setStatus(elements.imageImportStatus, "Image uploaded. OCR will now try to read the timetable.", "warning");
  runOcrForCurrentImage();
}

function updatePreviewCell(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const rowIndex = Number(target.dataset.rowIndex);
  const field = target.dataset.field;
  if (!Number.isInteger(rowIndex) || !field || !state.previewRows[rowIndex]) {
    return;
  }

  state.previewRows[rowIndex] = {
    ...state.previewRows[rowIndex],
    [field]: target.value,
  };
  refreshPreviewValidation();
  setStatus(elements.importSaveStatus, "Preview changed. Save again after reviewing the updated rows.", "warning");
}

function validatePrayerTextarea() {
  const parsed = parseJsonFromTextarea(elements.prayerTimesInput);
  if (!parsed.ok) {
    setStatus(elements.prayerTimesStatus, `Invalid JSON: ${parsed.error.message}`, "error");
    return null;
  }

  const validation = validatePrayerTimesArray(parsed.value, { schema: "any" });
  if (!validation.valid) {
    setStatus(elements.prayerTimesStatus, formatValidationErrors(validation.errors), "error");
    return null;
  }

  const ordered = sortByDate(validation.normalized);
  elements.prayerTimesInput.value = prettyJson(ordered);
  setStatus(
    elements.prayerTimesStatus,
    `Prayer times are valid. ${ordered.length} day entries formatted and ready to save.`,
    "success",
  );
  return ordered;
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

function setEventPlaceholderTheme(theme) {
  const themeMeta = getEventThemeMeta(theme);
  elements.eventImagePreviewShell.dataset.theme = themeMeta.key;
  setText(elements.eventImagePlaceholderSymbol, themeMeta.symbol);
  setText(elements.eventImagePlaceholderAr, themeMeta.placeholderArabic);
  setText(elements.eventImagePlaceholderDa, themeMeta.placeholderDanish);
}

function setEventImagePreview(dataUrl = "") {
  const hasImage = Boolean(dataUrl);
  state.eventImageDataUrl = dataUrl;
  elements.eventImagePreviewShell.dataset.hasImage = hasImage ? "true" : "false";

  if (hasImage) {
    elements.eventImagePreview.src = dataUrl;
    elements.eventImagePreview.hidden = false;
    return;
  }

  elements.eventImagePreview.hidden = true;
  elements.eventImagePreview.removeAttribute("src");
}

function clearEventErrors() {
  elements.eventFormErrors.hidden = true;
  elements.eventFormErrors.innerHTML = "";
}

function showEventErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) {
    clearEventErrors();
    return;
  }

  elements.eventFormErrors.hidden = false;
  elements.eventFormErrors.innerHTML = errors
    .map((message) => `<li>${escapeHtml(message)}</li>`)
    .join("");
}

function resetEventForm(options = {}) {
  elements.eventForm.reset();
  elements.eventId.value = "";
  elements.eventTheme.value = "normal";
  elements.eventActive.checked = true;
  elements.eventImageInput.value = "";
  state.eventImageDataUrl = "";
  state.editingEventId = "";
  setEventPlaceholderTheme("normal");
  setEventImagePreview("");
  clearEventErrors();
  elements.eventSubmitButton.textContent = "Save event / حفظ الفعالية";
  elements.eventCancelEdit.hidden = true;
  setStatus(
    elements.eventImageStatus,
    "No image selected. A clean placeholder will be used if you save without an image.",
  );

  if (!options.preserveStatus) {
    setStatus(
      elements.eventFormStatus,
      "Fill in the event details, then save. The list below updates after each change.",
    );
  }
}

function fillEventForm(event) {
  state.editingEventId = event.id;
  elements.eventId.value = event.id;
  elements.eventTitleArabic.value = event.titleArabic || "";
  elements.eventTitleDanish.value = event.titleDanish || "";
  elements.eventDate.value = event.date || "";
  elements.eventTime.value = event.time || "";
  elements.eventLocationArabic.value = event.locationArabic || "";
  elements.eventLocationDanish.value = event.locationDanish || "";
  elements.eventDescriptionArabic.value = event.descriptionArabic || "";
  elements.eventDescriptionDanish.value = event.descriptionDanish || "";
  elements.eventTheme.value = event.theme || "normal";
  elements.eventActive.checked = Boolean(event.active);
  setEventPlaceholderTheme(event.theme || "normal");
  setEventImagePreview(event.imageDataUrl || "");
  elements.eventImageInput.value = "";
  clearEventErrors();
  elements.eventSubmitButton.textContent = "Update event / تحديث الفعالية";
  elements.eventCancelEdit.hidden = false;
  setStatus(
    elements.eventImageStatus,
    event.imageDataUrl
      ? "Current image loaded. Choose a new image only if you want to replace it."
      : "This event currently uses the placeholder image.",
    event.imageDataUrl ? "success" : "warning",
  );
  setStatus(elements.eventFormStatus, "Editing event. Update the fields and save when ready.", "warning");
  elements.eventForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not decode image."));
    image.src = dataUrl;
  });
}

async function resizeImageDataUrl(dataUrl, fileType) {
  const image = await loadImageElement(dataUrl);
  const maxWidth = 1600;
  const maxHeight = 1600;
  const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  if (width === image.width && height === image.height && fileType === "image/png") {
    return dataUrl;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    return dataUrl;
  }

  context.drawImage(image, 0, 0, width, height);
  const outputType = fileType === "image/png" ? "image/png" : "image/webp";
  const output = canvas.toDataURL(outputType, outputType === "image/png" ? undefined : 0.86);
  return output || dataUrl;
}

async function prepareEventImage(file) {
  const warnings = [];

  if (!ALLOWED_EVENT_IMAGE_TYPES.has(file.type)) {
    throw new Error("Invalid image type. Use PNG, JPG, JPEG, or WEBP.");
  }

  if (file.size > MAX_EVENT_IMAGE_BYTES) {
    warnings.push("Large images may not save correctly in the browser. Use an optimized image under 2 MB.");
  }

  const originalDataUrl = await readFileAsDataUrl(file);

  try {
    const optimizedDataUrl = await resizeImageDataUrl(originalDataUrl, file.type);
    return {
      dataUrl: optimizedDataUrl,
      warnings,
    };
  } catch (error) {
    warnings.push("The image could not be optimized automatically. The original file preview is being used.");
    return {
      dataUrl: originalDataUrl,
      warnings,
    };
  }
}

async function handleEventImageSelection() {
  const file = elements.eventImageInput.files?.[0] ?? null;
  if (!file) {
    if (!state.editingEventId) {
      setEventImagePreview("");
      setStatus(
        elements.eventImageStatus,
        "No image selected. A clean placeholder will be used if you save without an image.",
      );
    }
    return;
  }

  try {
    const result = await prepareEventImage(file);
    setEventImagePreview(result.dataUrl);
    const tone = result.warnings.length > 0 ? "warning" : "success";
    const suffix = result.warnings.length > 0 ? ` ${result.warnings.join(" ")}` : "";
    setStatus(elements.eventImageStatus, `Image ready for preview and saving.${suffix}`.trim(), tone);
  } catch (error) {
    elements.eventImageInput.value = "";
    setEventImagePreview(state.editingEventId ? state.eventImageDataUrl : "");
    setStatus(elements.eventImageStatus, error.message, "error");
  }
}

function getEventFormPayload() {
  return {
    id: elements.eventId.value.trim(),
    titleArabic: elements.eventTitleArabic.value.trim(),
    titleDanish: elements.eventTitleDanish.value.trim(),
    date: elements.eventDate.value.trim(),
    time: elements.eventTime.value.trim(),
    locationArabic: elements.eventLocationArabic.value.trim(),
    locationDanish: elements.eventLocationDanish.value.trim(),
    descriptionArabic: elements.eventDescriptionArabic.value.trim(),
    descriptionDanish: elements.eventDescriptionDanish.value.trim(),
    imageDataUrl: state.eventImageDataUrl,
    theme: elements.eventTheme.value,
    active: elements.eventActive.checked,
  };
}

function validateEventFormPayload(payload) {
  const errors = [];
  const validation = validateEventsArray([{
    id: payload.id || "event-form-preview",
    titleArabic: payload.titleArabic,
    titleDanish: payload.titleDanish,
    date: payload.date,
    time: payload.time,
    locationArabic: payload.locationArabic,
    locationDanish: payload.locationDanish,
    descriptionArabic: payload.descriptionArabic,
    descriptionDanish: payload.descriptionDanish,
    imageDataUrl: payload.imageDataUrl,
    theme: payload.theme,
    active: payload.active,
  }]);

  errors.push(...validation.errors.map((message) => message.replace(/^Entry 1:\s*/, "")));
  return errors;
}

function renderSavedEventCard(event) {
  const themeMeta = getEventThemeMeta(event.theme);
  const locationText = event.locationArabic || event.locationDanish
    ? `${event.locationArabic || "—"} / ${event.locationDanish || "—"}`
    : "No location / بدون موقع";

  const imageMarkup = event.imageDataUrl
    ? `<img src="${escapeHtml(event.imageDataUrl)}" alt="${escapeHtml(event.titleDanish || event.titleArabic || "Event image")}">`
    : `
      <div class="saved-event-thumb-placeholder">
        <span class="saved-event-thumb-symbol">${escapeHtml(themeMeta.symbol)}</span>
        <span class="arabic">${escapeHtml(themeMeta.placeholderArabic)}</span>
        <span class="latin">${escapeHtml(themeMeta.placeholderDanish)}</span>
      </div>
    `;

  return `
    <article class="saved-event-card" data-event-id="${escapeHtml(event.id)}">
      <div class="saved-event-thumb" data-theme="${escapeHtml(themeMeta.key)}">
        ${imageMarkup}
      </div>
      <div class="saved-event-copy">
        <h4 class="saved-event-title-ar arabic">${escapeHtml(event.titleArabic)}</h4>
        <p class="saved-event-title-da latin">${escapeHtml(event.titleDanish)}</p>
        <div class="saved-event-meta">
          <span>${escapeHtml(event.date)}</span>
          <span>${escapeHtml(event.time)}</span>
          <span>${escapeHtml(locationText)}</span>
        </div>
        <div class="saved-event-badges">
          <span>${escapeHtml(themeMeta.label)}</span>
          <span class="saved-event-status ${event.active ? "is-active" : "is-inactive"}">
            ${event.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <div class="saved-event-actions">
        <button type="button" data-action="edit" data-event-id="${escapeHtml(event.id)}">Edit</button>
        <button type="button" data-action="duplicate" data-event-id="${escapeHtml(event.id)}">Duplicate</button>
        <button type="button" data-action="toggle" data-event-id="${escapeHtml(event.id)}">
          ${event.active ? "Hide" : "Show"}
        </button>
        <button type="button" class="button-danger" data-action="delete" data-event-id="${escapeHtml(event.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderSavedEvents() {
  const collection = getCurrentEventCollection();
  elements.eventDataSource.textContent = collection.source === "localStorage" ? "localStorage" : "Sample data";

  if (collection.items.length === 0) {
    elements.savedEventsList.innerHTML = `
      <div class="saved-events-empty">
        No events are available yet.
      </div>
    `;
    return;
  }

  elements.savedEventsList.innerHTML = collection.items
    .map((event) => renderSavedEventCard(event))
    .join("");
}

async function persistEventResult(result, successMessage, remoteAction = null) {
  const remoteResult = typeof remoteAction === "function"
    ? await remoteAction()
    : {
      ok: false,
      skipped: true,
      status: 0,
      data: null,
      error: "No remote sync action was provided.",
    };

  if (result.ok) {
    syncEventEditor(result.items);
    renderSavedEvents();
    refreshStatusPanel();
    setStatus(elements.eventsStatus, `Event JSON editor updated with ${result.items.length} saved event entries.`, "success");
  }

  if (remoteResult.ok && result.ok) {
    setStatus(elements.eventsStatus, `Event JSON editor updated with ${result.items.length} saved event entries.`, "success");
    setStatus(elements.eventFormStatus, successMessage, "success");
    setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
    return true;
  }

  if (remoteResult.ok) {
    setStatus(elements.eventsStatus, "Supabase was updated, but this browser could not refresh its saved event list.", "warning");
    setStatus(
      elements.eventFormStatus,
      `${successMessage} Supabase was updated, but this browser could not update its local cache.`,
      "warning",
    );
    setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "warning");
    return true;
  }

  if (result.ok) {
    setStatus(elements.eventsStatus, `Event JSON editor updated in this browser only. ${APP_CONFIG.syncMessages.localOnly}`, "warning");
    setStatus(elements.eventFormStatus, `${successMessage} Saved in this browser only.`, "warning");
    setStatus(elements.generalStatus, APP_CONFIG.syncMessages.localOnly, "warning");
    return true;
  }

  setStatus(elements.eventsStatus, "Could not save the event locally or remotely.", "error");
  setStatus(elements.eventFormStatus, "Could not save events locally or remotely.", "error");
  setStatus(elements.generalStatus, getRemoteFailureMessage(remoteResult, "Supabase unavailable. Events were not saved."), "error");
  return false;
}

async function handleEventFormSubmit(event) {
  event.preventDefault();
  const payload = getEventFormPayload();
  const errors = validateEventFormPayload(payload);

  if (errors.length > 0) {
    showEventErrors(errors);
    setStatus(elements.eventFormStatus, "Fix the highlighted event form errors before saving.", "error");
    setStatus(elements.generalStatus, "The event form contains validation errors.", "error");
    return;
  }

  clearEventErrors();
  const collection = getCurrentEventCollection();
  const result = state.editingEventId
    ? updateEvent(state.editingEventId, payload, collection.items)
    : createEvent(payload, collection.items);

  const message = state.editingEventId
    ? "Event updated and saved to this browser."
    : "Event saved to this browser.";

  const remoteEvent = result.items.find((item) => item.id === (state.editingEventId || payload.id || ""));
  const syncCandidate = remoteEvent ?? result.items[result.items.length - 1] ?? payload;

  if (await persistEventResult(result, message, () => syncEventWithRemote(syncCandidate))) {
    resetEventForm({ preserveStatus: true });
  }
}

async function handleSavedEventAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.action;
  const eventId = target.dataset.eventId;
  if (!action || !eventId) {
    return;
  }

  const collection = getCurrentEventCollection();
  const selectedEvent = collection.items.find((item) => item.id === eventId);
  if (!selectedEvent) {
    setStatus(elements.eventFormStatus, "The selected event could not be found.", "error");
    return;
  }

  if (action === "edit") {
    fillEventForm(selectedEvent);
    return;
  }

  if (action === "delete") {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    const result = deleteEvent(eventId, collection.items);
    if (await persistEventResult(result, "Event deleted.", () => syncEventDeleteWithRemote(eventId))) {
      if (state.editingEventId === eventId) {
        resetEventForm({ preserveStatus: true });
      }
    }
    return;
  }

  if (action === "duplicate") {
    const result = duplicateEvent(eventId, collection.items);
    const duplicatedEvent = result.items.find((item) => item.id !== eventId && item.titleDanish.includes("(copy)"));
    await persistEventResult(result, "Event duplicated with a new ID.", () => syncEventWithRemote(duplicatedEvent ?? result.items[result.items.length - 1]));
    return;
  }

  if (action === "toggle") {
    const result = toggleEventActive(eventId, collection.items);
    const toggledEvent = result.items.find((item) => item.id === eventId);
    await persistEventResult(result, "Event visibility updated.", () => syncEventWithRemote(toggledEvent));
  }
}

function bindEvents() {
  elements.loadSampleData.addEventListener("click", () => {
    clearImagePreview();
    loadSampleDataIntoEditors();
    populateImportSample();
    renderSavedEvents();
    resetEventForm({ preserveStatus: true });
    setStatus(elements.eventsStatus, "Sample events loaded into the JSON fallback editor. Save if you want to replace local events.", "warning");
    setStatus(elements.prayerTimesStatus, "Sample prayer times loaded into the manual JSON editor.", "warning");
    setStatus(elements.generalStatus, "Sample data loaded into the import and editor sections. Nothing has been saved yet.", "warning");
  });

  elements.toggleManualEntry.addEventListener("click", () => {
    toggleManualSection();
  });

  elements.toggleEventJsonEntry.addEventListener("click", () => {
    toggleEventJsonSection();
  });

  elements.validatePrayerTimes.addEventListener("click", () => {
    const validated = validatePrayerTextarea();
    if (validated) {
      setStatus(elements.generalStatus, "Manual prayer-time JSON is valid and ready to save.", "success");
    }
  });

  elements.savePrayerTimes.addEventListener("click", () => {
    const normalized = validatePrayerTextarea();
    if (!normalized) {
      setStatus(elements.generalStatus, "Manual prayer-time JSON could not be saved because validation failed.", "error");
      return;
    }

    void (async () => {
      const persistence = await persistPrayerDataset(
        normalized,
        `Saved ${normalized.length} prayer-time days.`,
      );

      setStatus(elements.prayerTimesStatus, persistence.detail, persistence.tone);
      setStatus(elements.generalStatus, persistence.general, persistence.ok ? persistence.tone : "error");
    })();
  });

  elements.validateEvents.addEventListener("click", () => {
    const validated = validateEventTextarea();
    if (validated) {
      setStatus(elements.generalStatus, "Event JSON is valid and ready to save.", "success");
    }
  });

  elements.saveEvents.addEventListener("click", () => {
    const normalized = validateEventTextarea();
    if (!normalized) {
      setStatus(elements.generalStatus, "Event JSON could not be saved because validation failed.", "error");
      return;
    }

    const localSaved = saveEvents(normalized);
    if (localSaved) {
      syncEventEditor(normalized);
      renderSavedEvents();
      refreshStatusPanel();
    }

    void (async () => {
      const remoteResult = await syncEventCollectionWithRemote(normalized);

      if (remoteResult.ok && localSaved) {
        setStatus(elements.eventsStatus, `Saved ${normalized.length} events locally and to Supabase.`, "success");
        setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
        return;
      }

      if (remoteResult.ok) {
        setStatus(elements.eventsStatus, `Saved ${normalized.length} events to Supabase, but this browser copy could not be updated.`, "warning");
        setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "warning");
        return;
      }

      if (localSaved) {
        setStatus(elements.eventsStatus, `Saved ${normalized.length} events in this browser only.`, "warning");
        setStatus(elements.generalStatus, APP_CONFIG.syncMessages.localOnly, "warning");
        return;
      }

      setStatus(elements.eventsStatus, "Could not save events locally or remotely.", "error");
      setStatus(elements.generalStatus, getRemoteFailureMessage(remoteResult, "Supabase unavailable. Events were not saved."), "error");
    })();
  });

  elements.themeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      applyTheme(input.value);
      setStatus(elements.themeStatus, `Theme selected: ${getThemeLabel(input.value)}. Click Save theme to store it.`, "warning");
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
    refreshStatusPanel();
    setStatus(elements.themeStatus, `Theme saved as ${getThemeLabel(selectedTheme)}.`, "success");
    setStatus(elements.generalStatus, "Theme saved. index.html will use the selected theme in this browser.", "success");
  });

  elements.refreshPreview.addEventListener("click", () => {
    refreshStatusPanel();
    refreshPreviewValidation();
    renderSavedEvents();
    setStatus(elements.generalStatus, "Status and preview validation refreshed.", "success");
  });

  elements.imageInput.addEventListener("change", handleImageSelection);
  elements.runOcrButton.addEventListener("click", () => {
    runOcrForCurrentImage();
  });
  elements.useSampleImportText.addEventListener("click", () => {
    populateImportSample();
    setStatus(elements.generalStatus, "Sample timetable text loaded. Review the preview before saving.", "warning");
  });
  elements.parseTimetable.addEventListener("click", () => {
    parseImportText();
  });
  elements.previewTableContainer.addEventListener("input", updatePreviewCell);
  elements.previewTableContainer.addEventListener("change", updatePreviewCell);
  elements.saveImportedPrayerTimes.addEventListener("click", () => {
    saveImportedPrayerRows();
  });

  elements.eventTheme.addEventListener("change", () => {
    setEventPlaceholderTheme(elements.eventTheme.value);
  });
  elements.eventImageInput.addEventListener("change", () => {
    handleEventImageSelection();
  });
  elements.eventForm.addEventListener("submit", handleEventFormSubmit);
  elements.eventCancelEdit.addEventListener("click", () => {
    resetEventForm({ preserveStatus: true });
    setStatus(elements.eventFormStatus, "Edit cancelled. The form is ready for a new event.", "warning");
  });
  elements.savedEventsList.addEventListener("click", handleSavedEventAction);

  elements.clearPrayerTimes.addEventListener("click", () => {
    if (!clearStoredPrayerTimes()) {
      setStatus(elements.dangerStatus, "Could not clear saved prayer times in this browser.", "error");
      return;
    }

    elements.prayerTimesInput.value = prettyJson(SAMPLE_PRAYER_TIMES);
    setStatus(elements.prayerTimesStatus, "Saved prayer times cleared. The manual JSON editor now shows sample data.", "warning");
    setStatus(
      elements.importSaveStatus,
      state.supabaseConnected
        ? "Saved prayer times cleared in this browser. Deployed screens can still read the shared Supabase data."
        : "Saved prayer times cleared. The display will use sample fallback data until you save new rows.",
      "warning",
    );
    setStatus(elements.dangerStatus, "Saved prayer times cleared from this browser.", "warning");
    setStatus(
      elements.generalStatus,
      state.supabaseConnected
        ? "Local prayer cache cleared. Supabase remains connected for shared screen updates."
        : "Saved prayer times cleared. index.html will fall back to sample prayer data.",
      "warning",
    );
    refreshStatusPanel();
  });

  elements.clearEvents.addEventListener("click", () => {
    if (!clearStoredEvents()) {
      setStatus(elements.dangerStatus, "Could not clear saved events in this browser.", "error");
      return;
    }

    syncEventEditor(SAMPLE_EVENTS);
    renderSavedEvents();
    resetEventForm({ preserveStatus: true });
    setStatus(elements.eventsStatus, "Saved events cleared. The JSON fallback editor now shows sample events.", "warning");
    setStatus(elements.dangerStatus, "Saved events cleared from this browser.", "warning");
    setStatus(
      elements.generalStatus,
      state.supabaseConnected
        ? "Local event cache cleared. Supabase remains connected for shared screen updates."
        : "Saved events cleared. index.html will fall back to sample events if needed.",
      "warning",
    );
    refreshStatusPanel();
  });

  elements.clearLocalData.addEventListener("click", () => {
    if (!clearStoredDisplayData()) {
      setStatus(elements.dangerStatus, "Could not reset localStorage in this browser.", "error");
      return;
    }

    applyTheme(APP_CONFIG.defaultTheme);
    clearImagePreview();
    populateEditors();
    setDefaultImportPeriod();
    elements.importTextInput.value = "";
    state.previewRows = [];
    renderSkippedLines([]);
    renderPreviewTable();
    refreshPreviewValidation();
    renderSavedEvents();
    resetEventForm({ preserveStatus: true });
    setStatus(elements.prayerTimesStatus, "Saved prayer times cleared. The manual JSON editor now shows sample data.", "warning");
    setStatus(elements.eventsStatus, "Saved events cleared. The editor now shows sample events.", "warning");
    setStatus(elements.themeStatus, "Saved theme cleared. The display will fall back to teal.", "warning");
    setStatus(elements.dangerStatus, "All saved local data cleared from this browser.", "warning");
    setStatus(
      elements.generalStatus,
      state.supabaseConnected
        ? "Local browser data cleared. Deployed screens can still read shared Supabase data."
        : "Saved browser data cleared. index.html will now fall back to sample data.",
      "warning",
    );
    refreshStatusPanel();
  });
}

async function initAdmin() {
  populateMonthOptions();
  setDefaultImportPeriod();
  applyTheme(getThemeFromStorage());
  populateEditors();
  refreshStatusPanel();
  setGeneralReadyState();
  toggleManualSection(false);
  toggleEventJsonSection(false);
  renderPreviewTable();
  renderSavedEvents();
  resetEventForm({ preserveStatus: true });
  bindEvents();
  await refreshSupabaseConnectionState();
}

void initAdmin();
