import { APP_CONFIG, SAMPLE_EVENTS, SAMPLE_PRAYER_TIMES } from "./config.js";
import {
  createEvent,
  deleteEvent,
  duplicateEvent,
  getEventThemeMeta,
  getSavedEvents,
  setEventArchived,
  saveEvents,
  toggleEventActive,
  updateEvent,
  validateEventsArray,
} from "./events.js";
import {
  cleanupTimetableText,
  IMPORT_MONTH_OPTIONS,
  SAMPLE_TIMETABLE_TEXT,
  importedRowsToPrayerEntries,
  normalizeLooseTime,
  parseTimetableText,
  summarizeImportedRows,
  validateImportedPrayerRows,
} from "./import-prayer-image.js";
import { getSavedPrayerTimes, validatePrayerTimesArray } from "./prayer-times.js";
import {
  clearStoredDisplayData,
  clearStoredEvents,
  clearStoredPrayerTimes,
  getThemeFromStorage,
  hasLocalStorageSupport,
  savePrayerTimesToStorage,
  saveThemeToStorage,
} from "./storage.js";
import {
  archiveEventRemotely,
  checkSupabaseConnection,
  createAdminUserRemotely,
  deleteAdminUserRemotely,
  disableAdminUserRemotely,
  getRemoteFailureMessage,
  loadAdminUsersFromRemote,
  loadAuthProfile,
  loadAdminEventsFromRemote,
  loadAdminPrayerTimesFromRemote,
  permanentlyDeleteEventRemotely,
  permanentlyDeletePrayerTimesRemotely,
  restoreEventRemotely,
  restorePrayerTimesRemotely,
  saveEventRemotely,
  savePrayerTimesRemotely,
  setRemoteAuthTokenProvider,
  updateAdminUserRoleRemotely,
} from "./remote-data.js";
import { getSupabaseBrowserClient } from "./supabase-browser.js";

const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
const MAX_EVENT_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_EVENT_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const PREVIEW_FIELDS = [
  { key: "date", label: "Date", shortLabel: "Date", placeholder: "2026-07-03", inputMode: "numeric", columnClass: "preview-col-date" },
  { key: "fajr", label: "Fajr / Subh", shortLabel: "Fajr", placeholder: "01:44", inputMode: "numeric", columnClass: "preview-col-fajr" },
  { key: "sunrise", label: "Sunrise / Solopgang", shortLabel: "Sunrise", placeholder: "04:32", inputMode: "numeric", columnClass: "preview-col-sunrise" },
  { key: "dhuhr", label: "Dhuhr", shortLabel: "Dhuhr", placeholder: "13:14", inputMode: "numeric", columnClass: "preview-col-dhuhr" },
  { key: "asr", label: "Asr (optional)", shortLabel: "Asr", placeholder: "17:39", inputMode: "numeric", columnClass: "preview-col-asr" },
  { key: "sunset", label: "Sunset / Solnedgang", shortLabel: "Sunset", placeholder: "21:55", inputMode: "numeric", columnClass: "preview-col-sunset" },
  { key: "maghrib", label: "Maghrib", shortLabel: "Maghrib", placeholder: "22:35", inputMode: "numeric", columnClass: "preview-col-maghrib" },
  { key: "isha", label: "Isha (optional)", shortLabel: "Isha", placeholder: "23:43", inputMode: "numeric", columnClass: "preview-col-isha" },
  { key: "midnight", label: "Midnight / Midnat", shortLabel: "Midnight", placeholder: "23:50", inputMode: "numeric", columnClass: "preview-col-midnight" },
];

const elements = {
  body: document.body,
  dashboard: document.querySelector("#admin-dashboard"),
  adminThemeBadge: document.querySelector("#admin-theme-badge"),
  dashboardActions: document.querySelector("#admin-dashboard-actions"),
  authSummary: document.querySelector("#admin-auth-summary"),
  authEmail: document.querySelector("#admin-auth-email"),
  authRole: document.querySelector("#admin-auth-role"),
  logoutButton: document.querySelector("#admin-logout-button"),
  authView: document.querySelector("#admin-auth-view"),
  authLoading: document.querySelector("#admin-auth-loading"),
  loginCard: document.querySelector("#admin-login-card"),
  loginForm: document.querySelector("#admin-login-form"),
  loginEmail: document.querySelector("#admin-login-email"),
  loginPassword: document.querySelector("#admin-login-password"),
  loginStatus: document.querySelector("#admin-login-status"),
  accessDeniedCard: document.querySelector("#admin-access-denied-card"),
  accessDeniedMessage: document.querySelector("#admin-access-denied-message"),
  accessDeniedLogout: document.querySelector("#admin-access-denied-logout"),
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
  reparsePreview: document.querySelector("#reparse-preview"),
  autoFixImportText: document.querySelector("#autofix-import-text"),
  clearPreview: document.querySelector("#clear-preview"),
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
  archivedStatus: document.querySelector("#archived-status"),
  toggleArchivedPrayerTimes: document.querySelector("#toggle-archived-prayer-times"),
  toggleArchivedEvents: document.querySelector("#toggle-archived-events"),
  archivedPrayerTimesSection: document.querySelector("#archived-prayer-times-section"),
  archivedEventsSection: document.querySelector("#archived-events-section"),
  archivedPrayerTimesList: document.querySelector("#archived-prayer-times-list"),
  archivedEventsList: document.querySelector("#archived-events-list"),
  archivedPrayerCount: document.querySelector("#archived-prayer-count"),
  archivedEventCount: document.querySelector("#archived-event-count"),
  superAdminPanel: document.querySelector("#super-admin-panel"),
  adminUserForm: document.querySelector("#admin-user-form"),
  adminUserEmail: document.querySelector("#admin-user-email"),
  adminUserPassword: document.querySelector("#admin-user-password"),
  adminUserRole: document.querySelector("#admin-user-role"),
  refreshAdminUsers: document.querySelector("#refresh-admin-users"),
  adminUsersStatus: document.querySelector("#admin-users-status"),
  adminUsersCount: document.querySelector("#admin-users-count"),
  adminUsersList: document.querySelector("#admin-users-list"),
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
  remoteAdminDataLoaded: false,
  remotePrayerTimes: [],
  remoteEvents: [],
  archivedPrayerTimes: [],
  archivedEvents: [],
  dashboardInitialized: false,
  authClient: null,
  authSession: null,
  adminProfile: null,
  adminUsers: [],
  authResolved: false,
  authBusy: false,
  pendingLogoutMessage: "",
  pendingLogoutTone: "success",
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

function getRoleLabel(role) {
  return role === "super_admin" ? "Super admin" : "Admin";
}

function getRoleLabelArabic(role) {
  return role === "super_admin" ? "المشرف الأعلى" : "إداري";
}

function canManageAdminAccounts() {
  return state.adminProfile?.role === "super_admin";
}

function getCurrentAccessToken() {
  return state.authSession?.access_token ?? "";
}

function syncRemoteAuthProvider() {
  setRemoteAuthTokenProvider(() => getCurrentAccessToken());
}

function renderAdminSummaryReset() {
  setText(elements.authEmail, "—");
  setText(elements.authRole, "—");
  elements.body.dataset.adminRole = "";
  elements.superAdminPanel.hidden = true;
  state.adminUsers = [];
  renderAdminUsers();
}

function setAuthView(screen) {
  const isDashboard = screen === "dashboard";
  elements.authView.hidden = isDashboard;
  elements.authLoading.hidden = screen !== "loading";
  elements.loginCard.hidden = screen !== "login";
  elements.accessDeniedCard.hidden = screen !== "denied";
  elements.dashboard.hidden = !isDashboard;
  elements.dashboardActions.hidden = !isDashboard;
  elements.authSummary.hidden = !isDashboard;
}

function renderAuthSummary() {
  const email = state.adminProfile?.email || state.authSession?.user?.email || "—";
  const role = state.adminProfile?.role || "";

  setText(elements.authEmail, email);
  setText(elements.authRole, role ? `${getRoleLabel(role)} / ${getRoleLabelArabic(role)}` : "—");
  elements.body.dataset.adminRole = role || "";
  elements.superAdminPanel.hidden = !canManageAdminAccounts();
}

function showAuthLoading(message = "Verifying Supabase session and admin permissions.") {
  setAuthView("loading");
  const description = elements.authLoading.querySelector(".auth-copy");
  setText(description, message);
}

function showLoginScreen(message = "Enter your admin email and password to continue.", tone = "") {
  state.adminProfile = null;
  renderAdminSummaryReset();
  setAuthView("login");
  setStatus(elements.loginStatus, message, tone);
}

function showAccessDenied(message) {
  state.adminProfile = null;
  renderAdminSummaryReset();
  setAuthView("denied");
  setText(elements.accessDeniedMessage, message);
}

async function ensureAuthClient() {
  if (state.authClient) {
    return state.authClient;
  }

  state.authClient = await getSupabaseBrowserClient();
  return state.authClient;
}

function getAuthFailureMessage(result, fallbackMessage) {
  if (result?.status === 401) {
    return "Invalid login or expired session.";
  }

  if (result?.status === 403) {
    return String(result?.data?.error ?? result?.error ?? fallbackMessage);
  }

  return getRemoteFailureMessage(result, fallbackMessage);
}

async function handleRemoteAccessFailure(result) {
  if (result?.status !== 401 && result?.status !== 403) {
    return false;
  }

  await signOutAdmin("Your session expired or admin access was removed. Please log in again.", "warning");
  return true;
}

async function loadCurrentAdminProfile() {
  const profileResult = await loadAuthProfile();
  if (!profileResult.ok) {
    return profileResult;
  }

  state.adminProfile = profileResult.data?.profile ?? null;
  renderAuthSummary();
  return profileResult;
}

async function refreshAdminUsers() {
  if (!canManageAdminAccounts()) {
    state.adminUsers = [];
    renderAdminUsers();
    return null;
  }

  const result = await loadAdminUsersFromRemote();
  if (!result.ok) {
    setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not load admin accounts."), "error");
    renderAdminUsers();
    return result;
  }

  state.adminUsers = Array.isArray(result.data?.items) ? result.data.items : [];
  renderAdminUsers();
  setStatus(elements.adminUsersStatus, "Admin accounts loaded.", "success");
  return result;
}

function renderAdminUsers() {
  if (!elements.adminUsersList || !elements.adminUsersCount) {
    return;
  }

  const users = Array.isArray(state.adminUsers) ? state.adminUsers : [];
  setText(elements.adminUsersCount, `${users.length} account${users.length === 1 ? "" : "s"}`);

  if (!canManageAdminAccounts()) {
    elements.adminUsersList.innerHTML = `
      <div class="saved-events-empty">
        Admin account management is available only to super admins.
      </div>
    `;
    return;
  }

  if (users.length === 0) {
    elements.adminUsersList.innerHTML = `
      <div class="saved-events-empty">
        No admin accounts loaded yet.
      </div>
    `;
    return;
  }

  elements.adminUsersList.innerHTML = users.map((user) => {
    const isCurrentUser = user.id === state.adminProfile?.id;
    const activeLabel = user.active ? "Active" : "Disabled";

    return `
      <article class="admin-user-card">
        <div class="admin-user-copy">
          <h4>${escapeHtml(user.email)}</h4>
          <div class="admin-user-badges">
            <span class="saved-event-status ${user.active ? "is-active" : "is-inactive"}">${activeLabel}</span>
            <span>${escapeHtml(getRoleLabel(user.role))}</span>
            ${isCurrentUser ? '<span>You</span>' : ""}
          </div>
          <p class="admin-user-meta">
            Updated: ${escapeHtml(user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—")}
          </p>
        </div>
        <div class="admin-user-controls">
          <label class="admin-field">
            <span class="admin-label">Role</span>
            <select class="admin-role-select" data-role-select="${escapeHtml(user.id)}">
              <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
              <option value="super_admin" ${user.role === "super_admin" ? "selected" : ""}>Super admin</option>
            </select>
          </label>
          <div class="button-row admin-user-action-row">
            <button type="button" class="button-secondary" data-admin-action="save-role" data-user-id="${escapeHtml(user.id)}">
              Save role
            </button>
            <button type="button" class="button-warning" data-admin-action="disable" data-user-id="${escapeHtml(user.id)}" ${user.active ? "" : "disabled"}>
              ${user.active ? "Disable" : "Disabled"}
            </button>
            <button type="button" class="button-danger" data-admin-action="delete" data-user-id="${escapeHtml(user.id)}" ${user.active ? "disabled" : ""}>
              Delete
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function getSelectedRoleForUser(userId) {
  const selector = `[data-role-select="${CSS.escape(userId)}"]`;
  const select = elements.adminUsersList.querySelector(selector);
  return select instanceof HTMLSelectElement ? select.value : "";
}

async function activateAuthenticatedDashboard() {
  renderAuthSummary();
  setAuthView("dashboard");
  await refreshSupabaseConnectionState();
  if (canManageAdminAccounts()) {
    await refreshAdminUsers();
  } else {
    state.adminUsers = [];
    renderAdminUsers();
  }
}

async function resolveAdminAccess() {
  if (state.authBusy) {
    return;
  }

  state.authBusy = true;
  showAuthLoading();

  try {
    const client = await ensureAuthClient();
    const { data, error } = await client.auth.getSession();

    if (error) {
      showLoginScreen("Supabase session could not be restored. Please log in again.", "warning");
      return;
    }

    state.authSession = data.session ?? null;
    syncRemoteAuthProvider();

    if (!state.authSession?.access_token) {
      showLoginScreen();
      return;
    }

    const profileResult = await loadCurrentAdminProfile();
    if (!profileResult.ok) {
      if (profileResult.status === 401) {
        await client.auth.signOut();
        state.authSession = null;
        syncRemoteAuthProvider();
        showLoginScreen("Your session expired. Please log in again.", "warning");
        return;
      }

      if (profileResult.status === 403) {
        showAccessDenied(String(profileResult.data?.error ?? "This account does not have admin access."));
        return;
      }

      showLoginScreen(getAuthFailureMessage(profileResult, "Supabase unavailable."), "error");
      return;
    }

    await activateAuthenticatedDashboard();
  } catch (error) {
    showLoginScreen(error.message || "Supabase unavailable.", "error");
  } finally {
    state.authResolved = true;
    state.authBusy = false;
  }
}

async function signOutAdmin(message = "Signed out successfully.", tone = "success") {
  state.pendingLogoutMessage = message;
  state.pendingLogoutTone = tone;

  try {
    const client = await ensureAuthClient();
    await client.auth.signOut();
  } catch (_error) {
    // Ignore transport-level sign-out failures and reset the local UI state anyway.
  }

  state.authSession = null;
  state.adminProfile = null;
  state.adminUsers = [];
  state.supabaseConnected = false;
  state.supabaseChecked = false;
  state.remoteAdminDataLoaded = false;
  syncRemoteAuthProvider();
  renderAdminSummaryReset();
  showLoginScreen(message, tone);
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

function getStoredPrayerData(options = {}) {
  return sortByDate(getSavedPrayerTimes(options));
}

function getSavedPrayerData(options = {}) {
  if (state.supabaseConnected && state.remoteAdminDataLoaded) {
    if (options.includeArchived) {
      return sortByDate([...state.remotePrayerTimes, ...state.archivedPrayerTimes]);
    }
    return sortByDate(state.remotePrayerTimes);
  }

  return getStoredPrayerData(options);
}

function getSampleEvents() {
  const validation = validateEventsArray(SAMPLE_EVENTS);
  return validation.valid ? validation.normalized : [];
}

function getStoredEventCollection(options = {}) {
  const savedEvents = getSavedEvents(options);
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

function getCurrentEventCollection(options = {}) {
  if (state.supabaseConnected && state.remoteAdminDataLoaded) {
    if (options.includeArchived) {
      return {
        items: [...state.remoteEvents, ...state.archivedEvents],
        source: "supabase",
      };
    }

    return {
      items: state.remoteEvents,
      source: "supabase",
    };
  }

  return getStoredEventCollection(options);
}

function buildEventStorageSnapshot(activeEvents) {
  const merged = new Map();
  [...getArchivedEventData(), ...activeEvents].forEach((event) => {
    merged.set(event.id, event);
  });
  return [...merged.values()];
}

function getDisplaySourceLabel(collectionSource) {
  if (collectionSource === "supabase") {
    return "Supabase";
  }

  if (collectionSource === "localStorage") {
    return "localStorage";
  }

  if (state.supabaseConnected) {
    return "Supabase";
  }

  if (collectionSource === "sample") {
    return "Sample data";
  }

  if (state.supabaseConnected) {
    return "Supabase";
  }

  return "Sample data";
}

function getArchivedPrayerData() {
  if (state.supabaseConnected) {
    return sortByDate(state.archivedPrayerTimes);
  }

  return getStoredPrayerData({ includeArchived: true }).filter((entry) => entry.archived);
}

function getArchivedEventData() {
  if (state.supabaseConnected) {
    return [...state.archivedEvents];
  }

  return getSavedEvents({ includeArchived: true }).filter((event) => event.archived);
}

function updateArchivedToggleLabels() {
  setText(
    elements.toggleArchivedPrayerTimes,
    elements.archivedPrayerTimesSection.hidden ? "Show archived prayer times" : "Hide archived prayer times",
  );
  setText(
    elements.toggleArchivedEvents,
    elements.archivedEventsSection.hidden ? "Show archived events" : "Hide archived events",
  );
}

function syncLocalCacheWithRemote() {
  const combinedPrayerTimes = sortByDate([...state.remotePrayerTimes, ...state.archivedPrayerTimes]);
  const combinedEvents = [...state.remoteEvents, ...state.archivedEvents];

  savePrayerTimesToStorage(combinedPrayerTimes);
  saveEvents(combinedEvents);
}

async function refreshRemoteAdminData(options = {}) {
  if (!state.supabaseConnected) {
    state.remoteAdminDataLoaded = false;
    state.remotePrayerTimes = [];
    state.remoteEvents = [];
    state.archivedPrayerTimes = [];
    state.archivedEvents = [];
    renderArchivedData();
    refreshStatusPanel();
    return null;
  }

  const [activePrayerResult, activeEventResult, archivedPrayerResult, archivedEventResult] = await Promise.all([
    loadAdminPrayerTimesFromRemote({ archived: false }),
    loadAdminEventsFromRemote({ archived: false }),
    loadAdminPrayerTimesFromRemote({ archived: true }),
    loadAdminEventsFromRemote({ archived: true }),
  ]);

  const failure = [activePrayerResult, activeEventResult, archivedPrayerResult, archivedEventResult]
    .find((result) => !result.ok) ?? null;

  if (failure) {
    if (await handleRemoteAccessFailure(failure)) {
      return null;
    }

    state.supabaseConnected = false;
    state.remoteAdminDataLoaded = false;
    setStatus(
      elements.archivedStatus,
      getRemoteFailureMessage(failure, "Archived data could not be loaded from Supabase."),
      "warning",
    );
    renderArchivedData();
    refreshStatusPanel();
    return null;
  }

  state.remoteAdminDataLoaded = true;
  state.remotePrayerTimes = sortByDate(activePrayerResult.data?.items ?? []);
  state.remoteEvents = activeEventResult.data?.items ?? [];
  state.archivedPrayerTimes = sortByDate(archivedPrayerResult.data?.items ?? []);
  state.archivedEvents = archivedEventResult.data?.items ?? [];
  syncLocalCacheWithRemote();

  if (options.hydrateEditors) {
    updateManualEditorFromSavedPrayerData(state.remotePrayerTimes);
    syncEventEditor(state.remoteEvents);
  }

  renderSavedEvents();
  renderArchivedData();
  refreshStatusPanel();
  setStatus(elements.archivedStatus, "Archived data loaded from Supabase.", "success");
  return {
    prayerTimes: state.remotePrayerTimes,
    events: state.remoteEvents,
    archivedPrayerTimes: state.archivedPrayerTimes,
    archivedEvents: state.archivedEvents,
  };
}

async function refreshSupabaseConnectionState() {
  if (!state.authSession?.access_token || !state.adminProfile) {
    state.supabaseConnected = false;
    state.supabaseChecked = true;
    return {
      connected: false,
      message: "Admin login is required before Supabase admin tools can load.",
      detail: "authentication required",
    };
  }

  const result = await checkSupabaseConnection();
  state.supabaseConnected = result.connected;
  state.supabaseChecked = true;

  if (result.connected) {
    await refreshRemoteAdminData({ hydrateEditors: true });
  } else {
    renderArchivedData();
    refreshStatusPanel();
  }

  setStatus(
    elements.generalStatus,
    result.connected ? APP_CONFIG.syncMessages.connected : APP_CONFIG.syncMessages.unavailable,
    result.connected ? "success" : "warning",
  );
  return result;
}

async function syncPrayerTimesWithRemote(entries) {
  const result = await savePrayerTimesRemotely(entries);
  if (await handleRemoteAccessFailure(result)) {
    return result;
  }
  state.supabaseConnected = result.ok;
  state.supabaseChecked = true;
  if (result.ok) {
    await refreshRemoteAdminData({ hydrateEditors: true });
  } else {
    refreshStatusPanel();
  }
  return result;
}

async function syncEventWithRemote(event) {
  const result = await saveEventRemotely(event);
  if (await handleRemoteAccessFailure(result)) {
    return result;
  }
  state.supabaseConnected = result.ok;
  state.supabaseChecked = true;
  if (result.ok) {
    await refreshRemoteAdminData({ hydrateEditors: true });
  } else {
    refreshStatusPanel();
  }
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
  if (await handleRemoteAccessFailure(failedResult)) {
    return failedResult;
  }
  const allSkipped = results.every((result) => result.skipped);
  state.supabaseConnected = !failedResult && !allSkipped;
  state.supabaseChecked = true;
  if (!failedResult && !allSkipped) {
    await refreshRemoteAdminData({ hydrateEditors: true });
  } else {
    refreshStatusPanel();
  }

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

async function syncEventArchiveWithRemote(eventId) {
  const result = await archiveEventRemotely(eventId);
  if (await handleRemoteAccessFailure(result)) {
    return result;
  }
  state.supabaseConnected = result.ok;
  state.supabaseChecked = true;
  if (result.ok) {
    await refreshRemoteAdminData({ hydrateEditors: true });
  } else {
    refreshStatusPanel();
  }
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
  const prayerEntries = getSavedPrayerData();
  const eventCollection = getCurrentEventCollection();
  const savedEvents = eventCollection.items;
  const currentTheme = getThemeFromStorage();
  setText(elements.statusPrayerCount, String(prayerEntries.length));
  setText(elements.statusPrayerFirstDate, prayerEntries[0]?.date ?? "--");
  setText(elements.statusPrayerLastDate, prayerEntries[prayerEntries.length - 1]?.date ?? "--");
  setText(elements.statusEventCount, String(savedEvents.length));
  setText(elements.statusCurrentTheme, getThemeLabel(currentTheme));
  setText(elements.statusDataSource, getDisplaySourceLabel(state.supabaseConnected && prayerEntries.length > 0 ? "supabase" : eventCollection.source));

  if (!state.supabaseChecked) {
    setStatus(elements.adminStatusNote, "Checking Supabase connection status...", "warning");
    return;
  }

  if (state.supabaseConnected) {
    setStatus(elements.adminStatusNote, APP_CONFIG.syncMessages.connected, "success");
    return;
  }

  if (prayerEntries.length === 0 && savedEvents.length === 0) {
    setStatus(
      elements.adminStatusNote,
      `${APP_CONFIG.syncMessages.unavailable} The display will use bundled sample data.`,
      "warning",
    );
    return;
  }

  if (prayerEntries.length === 0) {
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
    .map((item) => `
      <li>
        <strong>Line ${item.lineNumber}:</strong> ${escapeHtml(item.rawLine)}
        <span>${escapeHtml(item.reason || "Needs manual review.")}</span>
      </li>
    `)
    .join("");
}

function getPreviewFieldIssue(row, field) {
  return Array.isArray(row.fieldErrors?.[field]) && row.fieldErrors[field].length > 0;
}

function updatePreviewActionState() {
  const hasImportText = Boolean(elements.importTextInput.value.trim());
  const hasPreviewRows = state.previewRows.length > 0;
  elements.reparsePreview.disabled = !hasImportText;
  elements.autoFixImportText.disabled = !hasImportText;
  elements.clearPreview.disabled = !hasPreviewRows;
}

function getPreviewFieldMessages(row, field) {
  return row.fieldErrors?.[field] ?? [];
}

function buildPreviewInput(row, rowIndex, field, extraClass = "") {
  const fieldMessages = getPreviewFieldMessages(row, field.key);
  const invalidClass = fieldMessages.length > 0 ? " is-invalid" : "";
  const titleAttribute = fieldMessages.length > 0
    ? ` title="${escapeHtml(fieldMessages.join(" "))}"`
    : "";

  return `
    <input
      class="preview-input${invalidClass}${extraClass ? ` ${extraClass}` : ""}"
      type="text"
      value="${escapeHtml(row[field.key] ?? "")}"
      placeholder="${escapeHtml(field.placeholder || "")}"
      inputmode="${escapeHtml(field.inputMode || "text")}"
      data-row-index="${rowIndex}"
      data-field="${field.key}"${titleAttribute}
    >
  `;
}

function renderPreviewSummary(validation) {
  if (validation.rows.length === 0) {
    elements.previewSummary.innerHTML = `
      <article class="preview-stat-card">
        <p class="preview-stat-label">Parsed rows</p>
        <p class="preview-stat-value">0</p>
      </article>
      <article class="preview-stat-card">
        <p class="preview-stat-label">First date</p>
        <p class="preview-stat-value">—</p>
      </article>
      <article class="preview-stat-card">
        <p class="preview-stat-label">Last date</p>
        <p class="preview-stat-value">—</p>
      </article>
      <article class="preview-stat-card preview-stat-card-errors">
        <p class="preview-stat-label">Validation issues</p>
        <p class="preview-stat-value">0</p>
      </article>
    `;
    return;
  }

  const summary = summarizeImportedRows(validation.rows);
  const errorCardClass = validation.errorCount > 0
    ? "preview-stat-card preview-stat-card-errors has-errors"
    : "preview-stat-card preview-stat-card-errors";

  elements.previewSummary.innerHTML = `
    <article class="preview-stat-card">
      <p class="preview-stat-label">Parsed rows</p>
      <p class="preview-stat-value">${summary.count}</p>
    </article>
    <article class="preview-stat-card">
      <p class="preview-stat-label">First date</p>
      <p class="preview-stat-value">${escapeHtml(summary.firstDate)}</p>
    </article>
    <article class="preview-stat-card">
      <p class="preview-stat-label">Last date</p>
      <p class="preview-stat-value">${escapeHtml(summary.lastDate)}</p>
    </article>
    <article class="${errorCardClass}">
      <p class="preview-stat-label">Validation issues</p>
      <p class="preview-stat-value">${validation.errorCount}</p>
    </article>
  `;
}

function renderPreviewValidationState(validation) {
  if (validation.rows.length === 0) {
    elements.previewErrors.className = "preview-validation-panel";
    elements.previewErrors.innerHTML = `
      <p class="preview-validation-title">Parse a timetable to see validation details here.</p>
      <p class="preview-validation-copy">The preview becomes editable after parsing.</p>
    `;
    return;
  }

  if (validation.valid) {
    elements.previewErrors.className = "preview-validation-panel is-success";
    elements.previewErrors.innerHTML = `
      <p class="preview-validation-title">All preview rows are valid and ready to save.</p>
      <p class="preview-validation-copy">You can save the corrected timetable now.</p>
    `;
    return;
  }

  const issueItems = validation.rows
    .flatMap((row, rowIndex) => row.errors.map((error) => {
      const rowLabel = row.date ? `Row ${rowIndex + 1} (${row.date})` : `Row ${rowIndex + 1}`;
      return `${rowLabel}: ${error}`;
    }))
    .slice(0, 4);

  const hiddenIssueCount = Math.max(validation.errorCount - issueItems.length, 0);
  elements.previewErrors.className = "preview-validation-panel is-error";
  elements.previewErrors.innerHTML = `
    <p class="preview-validation-title">${validation.errorCount} validation issues must be fixed before saving.</p>
    <ul class="preview-validation-list">
      ${issueItems.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}
      ${hiddenIssueCount > 0 ? `<li>And ${hiddenIssueCount} more issue${hiddenIssueCount === 1 ? "" : "s"}.</li>` : ""}
    </ul>
  `;
}

function getPreviewRowStatusText(row) {
  if (row.errors.length > 0) {
    return row.statusText;
  }

  return `Valid. Source line ${row.sourceLineNumber || "--"}.`;
}

function renderPreviewTable() {
  if (state.previewRows.length === 0) {
    elements.previewTableContainer.innerHTML = `
      <div class="preview-empty-state">
        Upload a timetable image or paste timetable text to build the editable review table.
      </div>
    `;
    updatePreviewActionState();
    return;
  }

  const headerMarkup = PREVIEW_FIELDS
    .map((field) => `<th scope="col" class="${field.columnClass}" data-field="${field.key}">${field.label}</th>`)
    .join("");
  const colMarkup = PREVIEW_FIELDS
    .map((field) => `<col class="${field.columnClass}">`)
    .join("");

  const tableBodyMarkup = state.previewRows.map((row, rowIndex) => {
    const fieldCells = PREVIEW_FIELDS.map((field) => `
      <td class="${field.columnClass}" data-field="${field.key}">
        ${buildPreviewInput(row, rowIndex, field)}
      </td>
    `).join("");

    const statusClass = row.errors.length > 0 ? "preview-status-text is-error" : "preview-status-text";
    const statusText = getPreviewRowStatusText(row);

    return `
      <tr class="${row.errors.length > 0 ? "preview-row-error" : ""}" data-preview-row="${rowIndex}">
        ${fieldCells}
        <td class="preview-col-status" data-field="status">
          <p
            class="${statusClass}"
            data-preview-status-row="${rowIndex}"
            title="${escapeHtml(row.sourceLine || "")}"
          >${escapeHtml(statusText)}</p>
        </td>
      </tr>
    `;
  }).join("");

  const cardMarkup = state.previewRows.map((row, rowIndex) => {
    const statusText = getPreviewRowStatusText(row);
    const cardFields = PREVIEW_FIELDS.map((field) => `
      <label class="preview-card-field" data-field="${field.key}">
        <span class="preview-card-label">${field.label}</span>
        ${buildPreviewInput(row, rowIndex, field, "preview-input-card")}
      </label>
    `).join("");

    return `
      <article class="preview-card${row.errors.length > 0 ? " is-error" : ""}" data-preview-row="${rowIndex}">
        <div class="preview-card-header">
          <div>
            <p class="preview-card-kicker">Preview row ${rowIndex + 1}</p>
            <h3 class="preview-card-title" data-preview-date-title-row="${rowIndex}">
              ${escapeHtml(row.date || "Missing date")}
            </h3>
            <p class="preview-card-source">Source line ${row.sourceLineNumber || "--"}</p>
          </div>
          <span class="preview-card-badge${row.errors.length > 0 ? " is-error" : ""}" data-preview-badge-row="${rowIndex}">
            ${row.errors.length > 0 ? "Needs fixes" : "Valid"}
          </span>
        </div>
        <div class="preview-card-grid">
          ${cardFields}
        </div>
        <p
          class="preview-status-text${row.errors.length > 0 ? " is-error" : ""}"
          data-preview-status-row="${rowIndex}"
          title="${escapeHtml(row.sourceLine || "")}"
        >
          ${escapeHtml(statusText)}
        </p>
      </article>
    `;
  }).join("");

  elements.previewTableContainer.innerHTML = `
    <div class="preview-table-wrap">
      <table class="preview-table">
        <colgroup>
          ${colMarkup}
          <col class="preview-col-status">
        </colgroup>
        <thead>
          <tr>
            ${headerMarkup}
            <th scope="col" class="preview-col-status">Status</th>
          </tr>
        </thead>
        <tbody>${tableBodyMarkup}</tbody>
      </table>
    </div>
    <div class="preview-card-list">
      ${cardMarkup}
    </div>
  `;
  updatePreviewActionState();
}

function syncPreviewInputs(validation) {
  validation.rows.forEach((row, rowIndex) => {
    const rowHasErrors = row.errors.length > 0;
    const statusText = getPreviewRowStatusText(row);
    const statusTitle = row.sourceLine || "";
    const titleText = row.date || "Missing date";
    const badgeText = rowHasErrors ? "Needs fixes" : "Valid";

    elements.previewTableContainer
      .querySelectorAll(`[data-preview-row="${rowIndex}"]`)
      .forEach((element) => {
        if (element.tagName === "TR") {
          element.classList.toggle("preview-row-error", rowHasErrors);
          return;
        }

        element.classList.toggle("is-error", rowHasErrors);
      });

    elements.previewTableContainer
      .querySelectorAll(`[data-preview-status-row="${rowIndex}"]`)
      .forEach((element) => {
        element.textContent = statusText;
        element.setAttribute("title", statusTitle);
        element.classList.toggle("is-error", rowHasErrors);
      });

    elements.previewTableContainer
      .querySelectorAll(`[data-preview-badge-row="${rowIndex}"]`)
      .forEach((element) => {
        element.textContent = badgeText;
        element.classList.toggle("is-error", rowHasErrors);
      });

    elements.previewTableContainer
      .querySelectorAll(`[data-preview-date-title-row="${rowIndex}"]`)
      .forEach((element) => {
        element.textContent = titleText;
      });

    PREVIEW_FIELDS.forEach((field) => {
      const fieldMessages = getPreviewFieldMessages(row, field.key);
      const invalid = fieldMessages.length > 0;
      const title = fieldMessages.join(" ");

      elements.previewTableContainer
        .querySelectorAll(`input[data-row-index="${rowIndex}"][data-field="${field.key}"]`)
        .forEach((input) => {
          input.classList.toggle("is-invalid", invalid);
          input.setAttribute("aria-invalid", invalid ? "true" : "false");

          if (title) {
            input.setAttribute("title", title);
          } else {
            input.removeAttribute("title");
          }

          if (document.activeElement !== input && input.value !== (row[field.key] ?? "")) {
            input.value = row[field.key] ?? "";
          }
        });
    });
  });
}

function applyPreviewValidation(validation, options = {}) {
  state.previewRows = validation.rows;
  elements.saveImportedPrayerTimes.disabled = !validation.valid;
  renderPreviewSummary(validation);
  renderPreviewValidationState(validation);

  const shouldRenderTable = options.renderTable === true
    || validation.rows.length === 0
    || !elements.previewTableContainer.querySelector("[data-row-index]");

  if (shouldRenderTable) {
    renderPreviewTable();
    return;
  }

  syncPreviewInputs(validation);
}

function refreshPreviewValidation(options = {}) {
  const validation = validateImportedPrayerRows(state.previewRows, {
    preserveRawValues: options.normalizeValues !== true,
  });
  applyPreviewValidation(validation, {
    renderTable: options.renderTable === true,
  });
}

function parseImportText() {
  const rawText = elements.importTextInput.value.trim();
  if (!rawText) {
    state.previewRows = [];
    renderSkippedLines([]);
    setStatus(elements.parseStatus, "Paste timetable text or review OCR text before parsing.", "error");
    setStatus(elements.importSaveStatus, "Imported prayer times are not saved yet.");
    refreshPreviewValidation({ renderTable: true });
    return;
  }

  const parseResult = parseTimetableText(rawText, {
    month: Number(elements.importMonth.value),
    year: Number(elements.importYear.value),
  });

  state.previewRows = parseResult.rows;
  renderSkippedLines(parseResult.skippedLines);
  applyPreviewValidation(parseResult, { renderTable: true });
  setStatus(
    elements.importSaveStatus,
    parseResult.rows.length > 0
      ? "Preview updated. Review and correct every row before saving."
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

function clearPreviewState(options = {}) {
  state.previewRows = [];
  refreshPreviewValidation({ renderTable: true });

  if (!options.preserveSkippedLines) {
    renderSkippedLines([]);
  }

  if (!options.preserveStatus) {
    setStatus(elements.importSaveStatus, "Preview cleared. Re-parse the text when you are ready.", "warning");
    setStatus(elements.parseStatus, "Preview cleared. Parse the timetable again to rebuild the review step.", "warning");
  }
}

function autoFixImportText() {
  const rawText = elements.importTextInput.value.trim();
  if (!rawText) {
    setStatus(elements.parseStatus, "Paste timetable text or run OCR before using auto-fix.", "error");
    return;
  }

  const cleanedText = cleanupTimetableText(rawText);
  if (!cleanedText) {
    elements.importTextInput.value = "";
    clearPreviewState({ preserveStatus: true });
    setStatus(elements.parseStatus, "Auto-fix removed the unreadable lines. Paste or OCR the timetable again.", "warning");
    setStatus(elements.importSaveStatus, "Imported prayer times are not saved yet.");
    return;
  }

  elements.importTextInput.value = cleanedText;
  setStatus(elements.parseStatus, "Common OCR issues were cleaned up. Review the text, then re-parse it.", "success");
  setStatus(elements.generalStatus, "OCR text cleaned up. Re-parse the timetable to refresh the preview.", "warning");
  updatePreviewActionState();
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

function buildPrayerStorageSnapshot(activePrayerEntries) {
  const archivedEntries = getArchivedPrayerData();
  return sortByDate([
    ...archivedEntries,
    ...activePrayerEntries.map((entry) => ({ ...entry, archived: false })),
  ]);
}

function savePrayerSnapshotLocally(allPrayerEntries) {
  const orderedEntries = sortByDate(allPrayerEntries);
  const localSaved = savePrayerTimesToStorage(orderedEntries);

  if (localSaved) {
    updateManualEditorFromSavedPrayerData(orderedEntries.filter((entry) => !entry.archived));
    renderArchivedData();
    refreshStatusPanel();
  }

  return localSaved;
}

async function persistPrayerDataset(prayerEntries, successMessage) {
  const localSaved = savePrayerSnapshotLocally(buildPrayerStorageSnapshot(prayerEntries));
  const remoteResult = await syncPrayerTimesWithRemote(prayerEntries);

  if (remoteResult.ok && localSaved) {
    return {
      ok: true,
      remoteSaved: true,
      localSaved: true,
      tone: "success",
      detail: successMessage,
      general: APP_CONFIG.syncMessages.connected,
    };
  }

  if (remoteResult.ok) {
    return {
      ok: true,
      remoteSaved: true,
      localSaved: false,
      tone: "warning",
      detail: `${successMessage} Supabase was updated, but this browser could not update its local cache.`,
      general: APP_CONFIG.syncMessages.connected,
    };
  }

  if (localSaved) {
    return {
      ok: true,
      remoteSaved: false,
      localSaved: true,
      tone: "warning",
      detail: `${successMessage} Saved in this browser only.`,
      general: APP_CONFIG.syncMessages.localOnly,
      remoteError: getRemoteFailureMessage(remoteResult),
    };
  }

  return {
    ok: false,
    remoteSaved: false,
    localSaved: false,
    tone: "error",
    detail: "Could not save prayer times locally or remotely.",
    general: getRemoteFailureMessage(remoteResult, "Supabase unavailable. Prayer times were not saved."),
  };
}

async function saveImportedPrayerRows() {
  const validation = validateImportedPrayerRows(state.previewRows);
  applyPreviewValidation(validation, { renderTable: true });

  if (!validation.valid) {
    setStatus(elements.importSaveStatus, "Highlighted preview rows still need fixes before saving.", "error");
    setStatus(elements.generalStatus, "Fix the highlighted preview rows before saving the corrected timetable.", "error");
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

  if (persistence.remoteSaved) {
    setStatus(
      elements.importSaveStatus,
      "Saved to Supabase. Mosque screens will update automatically.",
      persistence.tone,
    );
    setStatus(
      elements.generalStatus,
      `Saved ${validation.rows.length} corrected timetable rows to the shared dataset.`,
      persistence.tone,
    );
  } else if (persistence.localSaved) {
    setStatus(
      elements.importSaveStatus,
      "Saved locally only. This will not update mosque screens until Supabase is connected.",
      "warning",
    );
    setStatus(elements.generalStatus, persistence.general, "warning");
  } else {
    setStatus(elements.importSaveStatus, persistence.detail, "error");
    setStatus(elements.generalStatus, persistence.general, "error");
  }

  setStatus(
    elements.prayerTimesStatus,
    persistence.localSaved
      ? "Manual JSON editor updated with the saved merged prayer-time dataset."
      : "Manual JSON editor could not be updated because the browser copy was not saved.",
    persistence.localSaved ? persistence.tone : (persistence.remoteSaved ? "warning" : "error"),
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

  setStatus(elements.imageImportStatus, "Loading OCR engine...", "warning");

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
    updatePreviewActionState();

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

function normalizePreviewCellValue(field, value, eventType) {
  const rawValue = String(value ?? "");
  if (field === "date") {
    return rawValue.trim();
  }

  if (eventType === "change") {
    const normalized = normalizeLooseTime(rawValue);
    return normalized || rawValue.trim();
  }

  return rawValue;
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

  const nextValue = normalizePreviewCellValue(field, target.value, event.type);
  if (target.value !== nextValue) {
    target.value = nextValue;
  }

  state.previewRows[rowIndex] = {
    ...state.previewRows[rowIndex],
    [field]: nextValue,
  };
  refreshPreviewValidation();
  setStatus(elements.importSaveStatus, "Preview changed. Save the corrected timetable after reviewing the updated rows.", "warning");
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
    ? `${event.locationArabic || "--"} / ${event.locationDanish || "--"}`
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
        <button type="button" class="button-warning" data-action="archive" data-event-id="${escapeHtml(event.id)}">Archive</button>
      </div>
    </article>
  `;
}

function groupArchivedPrayerTimesByMonth(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    const monthKey = String(row.date ?? "").slice(0, 7);
    if (!monthKey) {
      return;
    }

    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }

    grouped.get(monthKey).push(row);
  });

  return [...grouped.entries()].sort((left, right) => left[0].localeCompare(right[0]));
}

function renderPrayerSummary(row) {
  const summaryParts = [
    `Fajr ${row.fajr || "—"}`,
    `Sunrise ${row.sunrise || "—"}`,
    `Dhuhr ${row.dhuhr || "—"}`,
    `Maghrib ${row.maghrib || "—"}`,
  ];

  if (row.sunset) {
    summaryParts.splice(3, 0, `Sunset ${row.sunset}`);
  }

  if (row.midnight) {
    summaryParts.push(`Midnight ${row.midnight}`);
  }

  if (row.asr) {
    summaryParts.push(`Asr ${row.asr}`);
  }

  if (row.isha) {
    summaryParts.push(`Isha ${row.isha}`);
  }

  return summaryParts.join(" • ");
}

function renderArchivedPrayerTimes() {
  const archivedPrayerTimes = getArchivedPrayerData();
  setText(elements.archivedPrayerCount, `${archivedPrayerTimes.length} rows`);

  if (archivedPrayerTimes.length === 0) {
    elements.archivedPrayerTimesList.innerHTML = `
      <div class="saved-events-empty">
        No archived prayer times are available.
      </div>
    `;
    return;
  }

  elements.archivedPrayerTimesList.innerHTML = groupArchivedPrayerTimesByMonth(archivedPrayerTimes)
    .map(([monthKey, rows]) => `
      <section class="archived-group">
        <div class="archived-group-header">
          <div>
            <h4>${escapeHtml(monthKey)}</h4>
            <p>${rows.length} archived prayer-time rows</p>
          </div>
          <div class="saved-event-actions archived-actions">
            <button type="button" data-archived-action="restore-prayer-month" data-month="${escapeHtml(monthKey)}">Restore month</button>
            <button type="button" class="button-danger" data-archived-action="delete-prayer-month" data-month="${escapeHtml(monthKey)}">Delete month</button>
          </div>
        </div>
        <div class="archived-prayer-rows">
          ${rows.map((row) => `
            <article class="archived-prayer-row">
              <div class="archived-prayer-copy">
                <strong>${escapeHtml(row.date)}</strong>
                <p>${escapeHtml(renderPrayerSummary(row))}</p>
              </div>
              <div class="saved-event-actions archived-actions">
                <button type="button" data-archived-action="restore-prayer-date" data-date="${escapeHtml(row.date)}">Restore</button>
                <button type="button" class="button-danger" data-archived-action="delete-prayer-date" data-date="${escapeHtml(row.date)}">Delete</button>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `)
    .join("");
}

function renderArchivedEventCard(event) {
  const themeMeta = getEventThemeMeta(event.theme);
  return `
    <article class="saved-event-card archived-event-card" data-event-id="${escapeHtml(event.id)}">
      <div class="saved-event-thumb" data-theme="${escapeHtml(themeMeta.key)}">
        ${event.imageDataUrl
          ? `<img src="${escapeHtml(event.imageDataUrl)}" alt="${escapeHtml(event.titleDanish || event.titleArabic || "Event image")}">`
          : `
            <div class="saved-event-thumb-placeholder">
              <span class="saved-event-thumb-symbol">${escapeHtml(themeMeta.symbol)}</span>
              <span class="arabic">${escapeHtml(themeMeta.placeholderArabic)}</span>
              <span class="latin">${escapeHtml(themeMeta.placeholderDanish)}</span>
            </div>
          `}
      </div>
      <div class="saved-event-copy">
        <h4 class="saved-event-title-ar arabic">${escapeHtml(event.titleArabic)}</h4>
        <p class="saved-event-title-da latin">${escapeHtml(event.titleDanish)}</p>
        <div class="saved-event-meta">
          <span>${escapeHtml(event.date)}</span>
          <span>${escapeHtml(event.time)}</span>
          <span>${escapeHtml(themeMeta.label)}</span>
        </div>
      </div>
      <div class="saved-event-actions archived-actions">
        <button type="button" data-archived-action="restore-event" data-event-id="${escapeHtml(event.id)}">Restore event</button>
        <button type="button" class="button-danger" data-archived-action="delete-event" data-event-id="${escapeHtml(event.id)}">Delete forever</button>
      </div>
    </article>
  `;
}

function renderArchivedEvents() {
  const archivedEvents = getArchivedEventData();
  setText(elements.archivedEventCount, `${archivedEvents.length} events`);

  if (archivedEvents.length === 0) {
    elements.archivedEventsList.innerHTML = `
      <div class="saved-events-empty">
        No archived events are available.
      </div>
    `;
    return;
  }

  elements.archivedEventsList.innerHTML = archivedEvents
    .map((event) => renderArchivedEventCard(event))
    .join("");
}

function renderArchivedData() {
  renderArchivedPrayerTimes();
  renderArchivedEvents();
  updateArchivedToggleLabels();

  if (!state.supabaseConnected && !state.supabaseChecked) {
    setStatus(elements.archivedStatus, "Checking whether archived Supabase data is available...", "warning");
    return;
  }

  if (!state.supabaseConnected) {
    setStatus(
      elements.archivedStatus,
      "Archived data can be managed from Supabase when the deployed admin page is connected. Local archived fallback is shown if available.",
      "warning",
    );
  }
}

function renderSavedEvents() {
  const collection = getCurrentEventCollection();
  elements.eventDataSource.textContent = collection.source === "supabase"
    ? "Supabase"
    : collection.source === "localStorage"
      ? "localStorage"
      : "Sample data";

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
    syncEventEditor(result.items.filter((item) => !item.archived));
    renderSavedEvents();
    refreshStatusPanel();
    setStatus(
      elements.eventsStatus,
      `Event JSON editor updated with ${result.items.filter((item) => !item.archived).length} saved event entries.`,
      "success",
    );
  }

  if (remoteResult.ok && result.ok) {
    setStatus(
      elements.eventsStatus,
      `Event JSON editor updated with ${result.items.filter((item) => !item.archived).length} saved event entries.`,
      "success",
    );
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

function getPrayerArchiveMatcher(payload = {}) {
  const dateSet = new Set();
  if (payload.date) {
    dateSet.add(String(payload.date).trim());
  }
  if (Array.isArray(payload.dates)) {
    payload.dates.forEach((dateKey) => {
      dateSet.add(String(dateKey).trim());
    });
  }

  const monthKey = String(payload.month ?? "").trim();
  return (entry) => {
    if (dateSet.size > 0) {
      return dateSet.has(entry.date);
    }

    if (monthKey) {
      return entry.date.startsWith(`${monthKey}-`);
    }

    return false;
  };
}

function setPrayerArchivedLocally(payload, archived) {
  const matcher = getPrayerArchiveMatcher(payload);
  const items = getStoredPrayerData({ includeArchived: true }).map((entry) => (
    matcher(entry)
      ? { ...entry, archived }
      : entry
  ));

  return {
    ok: savePrayerSnapshotLocally(items),
    items,
  };
}

function permanentlyDeletePrayerEntriesLocally(payload) {
  const matcher = getPrayerArchiveMatcher(payload);
  const items = getStoredPrayerData({ includeArchived: true }).filter((entry) => !matcher(entry));
  return {
    ok: savePrayerSnapshotLocally(items),
    items,
  };
}

async function handleArchivedPrayerAction(action, payload, successMessage) {
  const localResult = action === "restore"
    ? setPrayerArchivedLocally(payload, false)
    : permanentlyDeletePrayerEntriesLocally(payload);

  if (state.supabaseConnected) {
    const remoteResult = action === "restore"
      ? await restorePrayerTimesRemotely(payload)
      : await permanentlyDeletePrayerTimesRemotely(payload);

    if (await handleRemoteAccessFailure(remoteResult)) {
      return;
    }

    if (remoteResult.ok) {
      await refreshRemoteAdminData({ hydrateEditors: true });
      setStatus(elements.archivedStatus, successMessage, "success");
      setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
      return;
    }

    setStatus(
      elements.archivedStatus,
      `${successMessage} failed to sync. ${getRemoteFailureMessage(remoteResult, "Supabase unavailable.")}`,
      localResult.ok ? "warning" : "error",
    );
    setStatus(elements.generalStatus, getRemoteFailureMessage(remoteResult, "Archived prayer times could not be updated."), localResult.ok ? "warning" : "error");
    return;
  }

  if (localResult.ok) {
    setStatus(elements.archivedStatus, `${successMessage} Saved in this browser only.`, "warning");
    setStatus(elements.generalStatus, APP_CONFIG.syncMessages.localOnly, "warning");
    return;
  }

  setStatus(elements.archivedStatus, "Archived prayer times could not be updated.", "error");
  setStatus(elements.generalStatus, "Archived prayer times could not be updated.", "error");
}

async function handleArchivedEventAction(action, eventId) {
  const baseEvents = getCurrentEventCollection({ includeArchived: true }).items;
  const localResult = action === "restore"
    ? setEventArchived(eventId, false, baseEvents)
    : deleteEvent(eventId, baseEvents);

  if (state.supabaseConnected) {
    const remoteResult = action === "restore"
      ? await restoreEventRemotely(eventId)
      : await permanentlyDeleteEventRemotely(eventId);

    if (await handleRemoteAccessFailure(remoteResult)) {
      return;
    }

    if (remoteResult.ok) {
      await refreshRemoteAdminData({ hydrateEditors: true });
      setStatus(
        elements.archivedStatus,
        action === "restore" ? "Archived event restored." : "Archived event permanently deleted.",
        "success",
      );
      setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
      return;
    }

    setStatus(
      elements.archivedStatus,
      getRemoteFailureMessage(remoteResult, "Archived event could not be updated in Supabase."),
      localResult.ok ? "warning" : "error",
    );
    setStatus(elements.generalStatus, getRemoteFailureMessage(remoteResult, "Archived event could not be updated."), localResult.ok ? "warning" : "error");
    return;
  }

  if (localResult.ok) {
    syncEventEditor(localResult.items.filter((item) => !item.archived));
    renderSavedEvents();
    renderArchivedData();
    refreshStatusPanel();
    setStatus(
      elements.archivedStatus,
      action === "restore"
        ? "Archived event restored in this browser only."
        : "Archived event permanently deleted in this browser only.",
      "warning",
    );
    setStatus(elements.generalStatus, APP_CONFIG.syncMessages.localOnly, "warning");
    return;
  }

  setStatus(elements.archivedStatus, "Archived event could not be updated.", "error");
  setStatus(elements.generalStatus, "Archived event could not be updated.", "error");
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

  if (action === "archive") {
    if (!window.confirm("Archive this event? You can restore it later from the archived data section.")) {
      return;
    }

    const baseEvents = getCurrentEventCollection({ includeArchived: true }).items;
    const result = setEventArchived(eventId, true, baseEvents);
    if (await persistEventResult(result, "Event archived.", () => syncEventArchiveWithRemote(eventId))) {
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

async function handleArchivedPrayerListAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.archivedAction;
  const date = target.dataset.date;
  const month = target.dataset.month;
  if (!action || (!date && !month)) {
    return;
  }

  if (action === "restore-prayer-date") {
    await handleArchivedPrayerAction("restore", { date }, `Prayer times for ${date} restored.`);
    return;
  }

  if (action === "restore-prayer-month") {
    await handleArchivedPrayerAction("restore", { month }, `Prayer times for ${month} restored.`);
    return;
  }

  if (action === "delete-prayer-date") {
    if (!window.confirm(`Permanently delete archived prayer times for ${date}? This cannot be undone.`)) {
      return;
    }
    await handleArchivedPrayerAction("delete", { date }, `Archived prayer times for ${date} permanently deleted.`);
    return;
  }

  if (action === "delete-prayer-month") {
    if (!window.confirm(`Permanently delete all archived prayer times for ${month}? This cannot be undone.`)) {
      return;
    }
    await handleArchivedPrayerAction("delete", { month }, `Archived prayer times for ${month} permanently deleted.`);
  }
}

async function handleArchivedEventListAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.archivedAction;
  const eventId = target.dataset.eventId;
  if (!action || !eventId) {
    return;
  }

  if (action === "restore-event") {
    await handleArchivedEventAction("restore", eventId);
    return;
  }

  if (action === "delete-event") {
    if (!window.confirm("Permanently delete this archived event? This cannot be undone.")) {
      return;
    }
    await handleArchivedEventAction("delete", eventId);
  }
}

async function handleAdminLoginSubmit(event) {
  event.preventDefault();

  const email = String(elements.loginEmail.value ?? "").trim();
  const password = String(elements.loginPassword.value ?? "");

  if (!email || !password) {
    setStatus(elements.loginStatus, "Please enter both email and password.", "error");
    return;
  }

  showAuthLoading("Signing in to Supabase...");

  try {
    const client = await ensureAuthClient();
    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      showLoginScreen("Invalid login. Please check the email and password.", "error");
      return;
    }

    elements.loginPassword.value = "";
    await resolveAdminAccess();
  } catch (error) {
    showLoginScreen(error.message || "Supabase unavailable.", "error");
  }
}

async function handleAdminUserFormSubmit(event) {
  event.preventDefault();

  const payload = {
    email: String(elements.adminUserEmail.value ?? "").trim(),
    password: String(elements.adminUserPassword.value ?? ""),
    role: String(elements.adminUserRole.value ?? "admin").trim(),
  };

  if (!payload.email || !payload.password) {
    setStatus(elements.adminUsersStatus, "Enter both email and password for the new admin account.", "error");
    return;
  }

  setStatus(elements.adminUsersStatus, "Creating admin account...", "warning");
  const result = await createAdminUserRemotely(payload);

  if (!result.ok) {
    setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not create the admin account."), "error");
    if (result.status === 401 || result.status === 403) {
      await resolveAdminAccess();
    }
    return;
  }

  elements.adminUserForm.reset();
  elements.adminUserRole.value = "admin";
  setStatus(elements.adminUsersStatus, result.data?.message || "Admin account created.", "success");
  await refreshAdminUsers();
}

async function handleAdminUsersListAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.adminAction;
  const userId = target.dataset.userId;
  if (!action || !userId) {
    return;
  }

  if (action === "save-role") {
    const role = getSelectedRoleForUser(userId);
    setStatus(elements.adminUsersStatus, "Saving admin role...", "warning");
    const result = await updateAdminUserRoleRemotely({ id: userId, role });
    if (!result.ok) {
      setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not update the admin role."), "error");
      if (result.status === 401 || result.status === 403) {
        await resolveAdminAccess();
      }
      return;
    }

    setStatus(elements.adminUsersStatus, "Admin role updated.", "success");
    await resolveAdminAccess();
    return;
  }

  if (action === "disable") {
    if (!window.confirm("Disable this admin account? They will no longer be able to use /admin.")) {
      return;
    }

    setStatus(elements.adminUsersStatus, "Disabling admin account...", "warning");
    const result = await disableAdminUserRemotely(userId);
    if (!result.ok) {
      setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not disable the admin account."), "error");
      if (result.status === 401 || result.status === 403) {
        await resolveAdminAccess();
      }
      return;
    }

    setStatus(elements.adminUsersStatus, "Admin account disabled.", "success");
    await resolveAdminAccess();
    return;
  }

  if (action === "delete") {
    if (!window.confirm("Permanently delete this disabled admin account? This cannot be undone.")) {
      return;
    }

    setStatus(elements.adminUsersStatus, "Deleting admin account...", "warning");
    const result = await deleteAdminUserRemotely(userId, { permanent: true });
    if (!result.ok) {
      setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not delete the admin account."), "error");
      if (result.status === 401 || result.status === 403) {
        await resolveAdminAccess();
      }
      return;
    }

    setStatus(elements.adminUsersStatus, result.data?.message || "Admin account deleted.", "success");
    await resolveAdminAccess();
  }
}

function bindEvents() {
  elements.loginForm.addEventListener("submit", (event) => {
    void handleAdminLoginSubmit(event);
  });
  elements.logoutButton.addEventListener("click", () => {
    void signOutAdmin();
  });
  elements.accessDeniedLogout.addEventListener("click", () => {
    void signOutAdmin("Signed out after access denial.", "warning");
  });
  elements.adminUserForm.addEventListener("submit", (event) => {
    void handleAdminUserFormSubmit(event);
  });
  elements.refreshAdminUsers.addEventListener("click", () => {
    void refreshAdminUsers();
  });
  elements.adminUsersList.addEventListener("click", (event) => {
    void handleAdminUsersListAction(event);
  });

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

    const localSaved = saveEvents(buildEventStorageSnapshot(normalized));
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

  elements.imageInput.addEventListener("change", handleImageSelection);
  elements.runOcrButton.addEventListener("click", () => {
    runOcrForCurrentImage();
  });
  elements.importTextInput.addEventListener("input", () => {
    updatePreviewActionState();
    if (state.previewRows.length > 0) {
      setStatus(elements.parseStatus, "Timetable text changed. Click Parse timetable or Re-parse text to refresh the preview.", "warning");
    }
  });
  elements.useSampleImportText.addEventListener("click", () => {
    populateImportSample();
    setStatus(elements.generalStatus, "Sample timetable text loaded. Review the preview before saving.", "warning");
  });
  elements.parseTimetable.addEventListener("click", () => {
    parseImportText();
  });
  elements.reparsePreview.addEventListener("click", () => {
    parseImportText();
  });
  elements.autoFixImportText.addEventListener("click", () => {
    autoFixImportText();
  });
  elements.clearPreview.addEventListener("click", () => {
    clearPreviewState({ preserveSkippedLines: true });
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
  elements.toggleArchivedPrayerTimes.addEventListener("click", () => {
    elements.archivedPrayerTimesSection.hidden = !elements.archivedPrayerTimesSection.hidden;
    updateArchivedToggleLabels();
  });
  elements.toggleArchivedEvents.addEventListener("click", () => {
    elements.archivedEventsSection.hidden = !elements.archivedEventsSection.hidden;
    updateArchivedToggleLabels();
  });
  elements.archivedPrayerTimesList.addEventListener("click", (event) => {
    void handleArchivedPrayerListAction(event);
  });
  elements.archivedEventsList.addEventListener("click", (event) => {
    void handleArchivedEventListAction(event);
  });

  elements.clearPrayerTimes.addEventListener("click", () => {
    if (!clearStoredPrayerTimes()) {
      setStatus(elements.dangerStatus, "Could not clear saved prayer times in this browser.", "error");
      return;
    }

    elements.prayerTimesInput.value = prettyJson(
      state.supabaseConnected && state.remoteAdminDataLoaded
        ? state.remotePrayerTimes
        : SAMPLE_PRAYER_TIMES,
    );
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
    renderArchivedData();
    refreshStatusPanel();
  });

  elements.clearEvents.addEventListener("click", () => {
    if (!clearStoredEvents()) {
      setStatus(elements.dangerStatus, "Could not clear saved events in this browser.", "error");
      return;
    }

    syncEventEditor(
      state.supabaseConnected && state.remoteAdminDataLoaded
        ? state.remoteEvents
        : SAMPLE_EVENTS,
    );
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
    renderArchivedData();
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
    renderArchivedData();
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
  elements.archivedPrayerTimesSection.hidden = true;
  elements.archivedEventsSection.hidden = true;
  renderPreviewTable();
  renderSavedEvents();
  renderArchivedData();
  renderAdminUsers();
  resetEventForm({ preserveStatus: true });
  bindEvents();
  state.dashboardInitialized = true;
  syncRemoteAuthProvider();

  try {
    const client = await ensureAuthClient();
    client.auth.onAuthStateChange((_event, session) => {
      state.authSession = session ?? null;
      syncRemoteAuthProvider();

      if (!session) {
        state.adminProfile = null;
        state.adminUsers = [];
        state.supabaseConnected = false;
        state.supabaseChecked = false;
        state.remoteAdminDataLoaded = false;
        renderAdminSummaryReset();
        const logoutMessage = state.pendingLogoutMessage || "Please log in to continue.";
        const logoutTone = state.pendingLogoutMessage ? state.pendingLogoutTone : "warning";
        state.pendingLogoutMessage = "";
        state.pendingLogoutTone = "success";
        showLoginScreen(logoutMessage, logoutTone);
        return;
      }

      if (state.authResolved) {
        void resolveAdminAccess();
      }
    });
  } catch (error) {
    showLoginScreen(error.message || "Supabase unavailable.", "error");
    return;
  }

  await resolveAdminAccess();
}

void initAdmin();






